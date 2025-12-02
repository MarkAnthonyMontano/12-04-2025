// ----------------- GLOBAL STORES -----------------
let otpStore = {};
// Structure: { email: { otp, expiresAt, cooldownUntil } }

let loginAttempts = {};
// Structure: { emailOrStudentNumber: { count, lockUntil } }

// ----------------- OTP GENERATOR -----------------
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ----------------- REQUEST OTP -----------------
router.post("/request-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // ❌ Prevent already registered emails
  const [existingUser] = await db.query(
    "SELECT * FROM user_accounts WHERE email = ?",
    [email.trim().toLowerCase()]
  );

  if (existingUser.length > 0) {
    return res.status(400).json({ message: "This email is already registered and cannot be used again." });
  }

  const now = Date.now();
  const existing = otpStore[email];

  if (existing && existing.cooldownUntil > now) {
    const secondsLeft = Math.ceil((existing.cooldownUntil - now) / 1000);
    return res.status(429).json({ message: `OTP already sent. Please wait ${secondsLeft}s.` });
  }

  const otp = generateOTP();
  otpStore[email] = {
    otp,
    expiresAt: now + 5 * 60 * 1000,
    cooldownUntil: now + 60 * 1000,
  };

  try {
    const [settings] = await db.query("SELECT short_term FROM company_settings LIMIT 1");
    const shortTerm = settings?.[0]?.short_term || "School";

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${shortTerm} OTP Verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${shortTerm} OTP Code`,
      text: `Your ${shortTerm} OTP is: ${otp}. It is valid for 5 minutes.`,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.json({ message: `${shortTerm} OTP sent to your email` });

  } catch (err) {
    console.error("⚠️ OTP email error:", err);
    delete otpStore[email];
    res.status(500).json({ message: "Failed to send OTP" });
  }
});



// ----------------- VERIFY OTP -----------------
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP are required" });

  const now = Date.now();
  const stored = otpStore[email];
  const record = loginAttempts[email] || { count: 0, lockUntil: null };

  if (record.lockUntil && record.lockUntil > now) {
    const secondsLeft = Math.ceil((record.lockUntil - now) / 1000);
    return res.status(429).json({
      message: `Too many failed attempts. Try again in ${secondsLeft}s.`,
    });
  }

  if (!stored) {
    return res.status(400).json({ message: "No OTP request found for this email" });
  }

  if (stored.expiresAt < now) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP has expired. Please request a new one." });
  }

  if (stored.otp !== otp.trim()) {
    record.count++;
    if (record.count >= 3) {
      record.lockUntil = now + 3 * 60 * 1000;
      loginAttempts[email] = record;
      return res.status(429).json({
        message: "Too many failed OTP attempts. Locked for 3 minutes.",
      });
    }
    loginAttempts[email] = record;
    return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }

  delete otpStore[email];
  delete loginAttempts[email];

  res.json({ message: "OTP verified successfully" });
});

// ----------------- VERIFY PASSWORD -----------------
router.post("/api/verify-password", async (req, res) => {
  const { person_id, password } = req.body;

  if (!person_id || !password) {
    return res.status(400).json({ success: false, message: "Person ID and password required" });
  }

  try {
    const [rows] = await db3.query(
      "SELECT * FROM user_accounts WHERE person_id = ?",
      [person_id]
    );

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    res.json({ success: true });

  } catch (err) {
    console.error("verify-password error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during password verification"
    });
  }
});

router.post("/login", async (req, res) => {
  const { email: loginCredentials, password } = req.body;

  if (!loginCredentials || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const now = Date.now();
  const record = loginAttempts[loginCredentials] || { count: 0, lockUntil: null };

  if (record.lockUntil && record.lockUntil > now) {
    const sec = Math.ceil((record.lockUntil - now) / 1000);
    return res.json({ success: false, message: `Too many failed attempts. Try again in ${sec}s.` });
  }

  try {
    const query = `
      (
        SELECT 
          ua.id AS account_id,
          ua.person_id,
          ua.email,
          ua.password,
          ua.employee_id,
          ua.role,
          ua.require_otp,
          NULL AS profile_image,
          NULL AS fname,
          NULL AS mname,
          NULL AS lname,
          ua.status AS status,
          'user' AS source,
          ua.dprtmnt_id,
          dt.dprtmnt_name
        FROM user_accounts AS ua
        LEFT JOIN dprtmnt_table AS dt ON ua.dprtmnt_id = dt.dprtmnt_id
        LEFT JOIN student_numbering_table AS snt ON snt.person_id = ua.person_id
        WHERE (ua.email = ? OR snt.student_number = ?)
      )
      UNION ALL
      (
        SELECT 
          ua.prof_id AS account_id,
          ua.person_id,
          ua.email,
          ua.password,
          ua.employee_id,
          ua.role,
          ua.require_otp,
          ua.profile_image,
          ua.fname,
          ua.mname,
          ua.lname,
          ua.status,
          'prof' AS source,
          NULL AS dprtmnt_id,
          NULL AS dprtmnt_name
        FROM prof_table AS ua
        WHERE ua.email = ?
      );
    `;

    const [results] = await db3.query(query, [
      loginCredentials,
      loginCredentials,
      loginCredentials,
    ]);

    if (results.length === 0) {
      record.count++;
      if (record.count >= 3) {
        record.lockUntil = now + 3 * 60 * 1000;
        loginAttempts[loginCredentials] = record;
        return res.json({ success: false, message: "Too many failed attempts. Locked for 3 minutes." });
      }
      loginAttempts[loginCredentials] = record;
      return res.json({ success: false, message: "Invalid email or student number" });
    }

    const user = results[0];

    // ======================================
    // 🔥 FIX: normalize require_otp properly
    // ======================================
    user.require_otp = Number(user.require_otp) === 1;

    // password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      record.count++;
      let remaining = 3 - record.count;

      if (record.count >= 3) {
        record.lockUntil = now + 3 * 60 * 1000;
        return res.json({ success: false, message: "Too many failed attempts. Locked for 3 minutes." });
      }

      loginAttempts[loginCredentials] = record;
      return res.json({
        success: false,
        message: `Invalid Password or Email, You have ${remaining} attempt(s) remaining.`,
        remaining,
      });
    }

    // status check
    if (user.status === 0) {
      return res.json({ success: false, message: "The user didn’t exist or account is inactive" });
    }

    const [rows] = await db3.query(
      "SELECT * FROM page_access WHERE user_id = ?"
      , [user.employee_id])


    const accessList = rows.map(r => Number(r.page_id));

    // JWT
    const token = webtoken.sign(
      {
        person_id: user.person_id,
        employee_id: user.employee_id,
        email: user.email,
        role: user.role,
        department: user.dprtmnt_id,
        accessList,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // ======================================
    // 🔥 FINAL FIX: correct OTP condition
    // ======================================
    if (user.require_otp === true) {
      const otp = generateOTP();

      otpStore[user.email] = {
        otp,
        expiresAt: now + 5 * 60 * 1000,
        cooldownUntil: now + 5 * 60 * 1000,
      };

      try {
        const [companyResult] = await db.query("SELECT short_term FROM company_settings WHERE id = 1");
        const shortTerm = companyResult?.[0]?.short_term || "School";

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: `"${shortTerm} - OTP Verification" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: `${shortTerm} OTP Code`,
          text: `Your OTP is: ${otp} (Valid for 5 minutes)`,
        });
      } catch (err) {
        console.error("OTP Email Error:", err.message);
      }

      const [rows] = await db3.query(
        "SELECT * FROM page_access WHERE user_id = ?"
        , [user.employee_id])

      const accessList = rows.map(r => Number(r.page_id));

      return res.json({
        success: true,
        requireOtp: true,
        message: "OTP sent to your email",
        token,
        email: user.email,
        role: user.role,
        person_id: user.person_id,
        employee_id: user.employee_id,
        department: user.dprtmnt_id,
        accessList,
      });
    }

    // NO OTP REQUIRED
    return res.json({
      success: true,
      requireOtp: false,
      message: "Login success. OTP not required.",
      token,
      email: user.email,
      role: user.role,
      person_id: user.person_id,
      employee_id: user.employee_id,
      department: user.dprtmnt_id,
      accessList,
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
});

router.get("/get-otp-setting/:person_id", async (req, res) => {
  const { person_id } = req.params;

  try {
    const [rows] = await db3.query(
      "SELECT require_otp FROM user_accounts WHERE person_id = ?",
      [person_id]
    );

    if (rows.length === 0) {
      return res.json({ require_otp: 0 });
    }

    res.json({ require_otp: rows[0].require_otp });
  } catch (err) {
    console.error("OTP fetch error:", err);
    res.status(500).json({ message: "Server error loading OTP setting" });
  }
});


router.get("/get-otp-setting/:type/:person_id", async (req, res) => {
  const { type, person_id } = req.params;

  if (!person_id || !type) return res.status(400).json({ message: "Missing parameters" });

  let table;
  if (type === "user") table = "user_accounts";
  else if (type === "prof") table = "prof_table";
  else return res.status(400).json({ message: "Invalid type" });

  try {
    const [rows] = await db3.query(
      `SELECT require_otp FROM ${table} WHERE person_id = ? LIMIT 1`,
      [person_id]
    );

    if (rows.length === 0) return res.json({ require_otp: 0 });

    res.json({ require_otp: Number(rows[0].require_otp) === 1 ? 1 : 0 });
  } catch (err) {
    console.error("OTP fetch error:", err);
    res.status(500).json({ message: "Server error loading OTP setting" });
  }
});


router.post("/update-otp-setting", async (req, res) => {
  const { type, person_id, require_otp } = req.body;

  if (!person_id || !type) return res.status(400).json({ message: "Missing parameters" });

  let table;
  if (type === "user") table = "user_accounts";
  else if (type === "prof") table = "prof_table";
  else return res.status(400).json({ message: "Invalid type" });

  try {
    const [result] = await db3.query(
      `UPDATE ${table} SET require_otp = ? WHERE person_id = ?`,
      [require_otp, person_id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      message: require_otp == 1
        ? "OTP has been enabled for your account."
        : "OTP has been disabled for your account."
    });
  } catch (err) {
    console.error("Failed to update OTP:", err);
    res.status(500).json({ message: "Server error updating OTP setting" });
  }
});

// ----------------- LOGIN (Applicant) -----------------
router.post("/login_applicant", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Fetch user
    const query = `
      SELECT * FROM user_accounts AS ua
      LEFT JOIN person_table AS pt ON pt.person_id = ua.person_id
      WHERE email = ?
    `;
    const [results] = await db.query(query, [email]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password or Email" });
    }

    if (user.status === 0) {
      return res.json({ success: false, message: "The user didn’t exist or is inactive" });
    }

    const person_id = user.person_id;

    // ✅ Check if applicant_number already exists
    const [existing] = await db.query(
      "SELECT applicant_number, qr_code FROM applicant_numbering_table WHERE person_id = ?",
      [person_id]
    );

    let applicantNumber, qrFilename;

    if (existing.length === 0) {
      // ✅ No applicant_number yet → create one
      const [activeYear] = await db3.query(`
        SELECT yt.year_description, st.semester_description, st.semester_code
        FROM active_school_year_table AS sy
        JOIN year_table AS yt ON yt.year_id = sy.year_id
        JOIN semester_table AS st ON st.semester_id = sy.semester_id
        WHERE sy.astatus = 1
        LIMIT 1
      `);

      if (activeYear.length === 0) {
        return res.status(500).json({ message: "No active school year found" });
      }

      const year = String(activeYear[0].year_description).split("-")[0];
      const semCode = activeYear[0].semester_code;

      const [countRes] = await db.query("SELECT COUNT(*) AS count FROM applicant_numbering_table");
      const padded = String(countRes[0].count + 1).padStart(5, "0");
      applicantNumber = `${year}${semCode}${padded}`;

      // Insert applicant_number
      await db.query(
        "INSERT INTO applicant_numbering_table (applicant_number, person_id) VALUES (?, ?)",
        [applicantNumber, person_id]
      );

      // Generate QR code
      const qrData = `http://localhost:5173/examination_profile/${applicantNumber}`;
      qrFilename = `${applicantNumber}_qrcode.png`;
      const qrPath = path.join(__dirname, "uploads", qrFilename);

      await QRCode.toFile(qrPath, qrData, {
        color: { dark: "#000", light: "#FFF" },
        width: 300
      });

      // Save QR in DB
      await db.query(
        "UPDATE applicant_numbering_table SET qr_code = ? WHERE applicant_number = ?",
        [qrFilename, applicantNumber]
      );
    } else {
      // ✅ Already has applicant_number + QR
      applicantNumber = existing[0].applicant_number;
      qrFilename = existing[0].qr_code;
    }

    // ✅ Generate JWT token
    const token = webtoken.sign(
      { person_id: user.person_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      success: true,
      email: user.email,
      role: user.role,
      person_id: user.person_id,
      applicant_number: applicantNumber,
      qr_code: qrFilename
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});


module.exports = router;
  