import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import EaristLogo from "../assets/EaristLogo.png";
import "../styles/Print.css";
import API_BASE_URL from "../apiConfig";
// ✅ Accept personId as a prop
const ExamPermit = ({ personId }) => {
    const settings = useContext(SettingsContext);
    const [fetchedLogo, setFetchedLogo] = useState(null);
    const [companyName, setCompanyName] = useState("");

    useEffect(() => {
        if (settings) {
            // ✅ load dynamic logo
            if (settings.logo_url) {
                setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
            } else {
                setFetchedLogo(EaristLogo);
            }

            // ✅ load dynamic name + address
            if (settings.company_name) setCompanyName(settings.company_name);
            if (settings.campus_address) setCampusAddress(settings.campus_address);
        }
    }, [settings]);

    const words = companyName.trim().split(" ");
    const middle = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, middle).join(" ");
    const secondLine = words.slice(middle).join(" ");


    const divToPrintRef = useRef(null);
    const [examSchedule, setExamSchedule] = useState(null);
    const [curriculumOptions, setCurriculumOptions] = useState([]);
    const [scheduledBy, setScheduledBy] = useState(""); // ✅ added
    const [printed, setPrinted] = useState(false);
    // ✅ First data fetch
    useEffect(() => {
        const pid = personId || localStorage.getItem("person_id");
        if (!pid) return;

        const fetchData = async () => {
            try {
                // Fetch person
                const res = await axios.get(`${API_BASE_URL}/api/person/${pid}`);
                let personData = res.data;

                // Fetch applicant number separately
                const applicantRes = await axios.get(`${API_BASE_URL}/api/applicant_number/${pid}`);
                if (applicantRes.data?.applicant_number) {
                    personData.applicant_number = applicantRes.data.applicant_number;
                }

                setPerson(personData);

                if (applicantRes.data?.applicant_number) {
                    const applicant_number = applicantRes.data.applicant_number;

                    // ✅ Use new unified verification route
                    const verifyStatusRes = await axios.get(
                        `${API_BASE_URL}/api/verification-status/${applicant_number}`
                    );

                    const { verified, totalRequired, totalVerified, hasSchedule } = verifyStatusRes.data;

                    setIsVerified(verified);

                    if (!verified) {
                        console.warn(
                            `Applicant not verified. Verified ${totalVerified}/${totalRequired} requirements. Schedule: ${hasSchedule ? "Yes" : "No"}`
                        );
                    }

                    // Always load exam schedule (for display)
                    const schedRes = await axios.get(
                        `${API_BASE_URL}/api/exam-schedule/${applicant_number}`
                    );
                    setExamSchedule(schedRes.data);
                }

                // Fetch programs
                const progRes = await axios.get(`${API_BASE_URL}/api/applied_program`);
                setCurriculumOptions(progRes.data);

                // ✅ Fetch registrar (Scheduled By)
                const registrarRes = await axios.get(`${API_BASE_URL}/api/scheduled-by/registrar`);
                if (registrarRes.data?.fullName) {
                    setScheduledBy(registrarRes.data.fullName);
                }

            } catch (err) {
                console.error("Error fetching exam permit data:", err);
            }
        };

        fetchData();
    }, [personId]);

    const [person, setPerson] = useState({
        campus: "",
        profile_img: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        extension: "",
    });

    const [campusAddress, setCampusAddress] = useState("");

    useEffect(() => {
        if (settings && settings.address) {
            setCampusAddress(settings.address);
        }
    }, [settings]);




    // ✅ Secondary fetch for updates
    useEffect(() => {
        const pid = personId || localStorage.getItem("person_id");
        if (!pid) return;

        // fetch person
        axios.get(`${API_BASE_URL}/api/person/${pid}`)
            .then(async (res) => {
                let personData = res.data;

                // fetch applicant_number separately
                const applicantRes = await axios.get(`${API_BASE_URL}/api/applicant_number/${pid}`);
                if (applicantRes.data?.applicant_number) {
                    personData.applicant_number = applicantRes.data.applicant_number;
                }

                setPerson(personData);
            })
            .catch((err) => console.error(err));

        // fetch applicant number then schedule
        axios
            .get(`${API_BASE_URL}/api/applicant_number/${pid}`)
            .then((res) => {
                const applicant_number = res.data?.applicant_number;
                if (applicant_number) {
                    return axios.get(
                        `${API_BASE_URL}/api/exam-schedule/${applicant_number}`
                    );
                }
            })
            .then((res) => setExamSchedule(res?.data))
            .catch((err) => console.error(err));

        // fetch curriculum/programs
        axios
            .get(`${API_BASE_URL}/api/applied_program`)
            .then((res) => setCurriculumOptions(res.data))
            .catch((err) => console.error(err));

        // ✅ Fetch registrar name again for refresh
        axios
            .get(`${API_BASE_URL}/api/scheduled-by/registrar`)
            .then((res) => {
                if (res.data?.fullName) setScheduledBy(res.data.fullName);
            })
            .catch((err) => console.error("Error fetching registrar name:", err));
    }, [personId]);

    const [isVerified, setIsVerified] = useState(false);


    // 🔒 Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 🔒 Block DevTools shortcuts + Ctrl+P silently
    document.addEventListener('keydown', (e) => {
        const isBlockedKey =
            e.key === 'F12' || // DevTools
            e.key === 'F11' || // Fullscreen
            (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) || // Ctrl+Shift+I/J
            (e.ctrlKey && e.key.toLowerCase() === 'u') || // Ctrl+U (View Source)
            (e.ctrlKey && e.key.toLowerCase() === 'p');   // Ctrl+P (Print)

        if (isBlockedKey) {
            e.preventDefault();
            e.stopPropagation();
        }
    });



    if (!person) return <div>Loading Exam Permit...</div>;

    return (
        <div
            ref={divToPrintRef}
            style={{
                width: "8.5in",
                minHeight: "9in",
                backgroundColor: "white",
                padding: "20px",
                margin: "0 auto",
                position: "relative",
                marginTop: "10px",
                boxSizing: "border-box",
            }}
        >
            <style>{`
        @page {
          size: 8.5in 11in;
          margin: 0;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          button { display: none; }
        }
      `}</style>

            {/* ✅ VERIFIED / NOT VERIFIED Watermark */}
            <div
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%",
                    transform: "translate(-50%, -50%) rotate(-30deg)",
                    fontSize: "90px",
                    fontWeight: "900",

                    color: isVerified ? "rgba(0, 128, 0, 0.15)" : "rgba(255, 0, 0, 0.15)",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    userSelect: "none",
                    zIndex: 0,
                    fontFamily: "'Arial Black', sans-serif",
                    letterSpacing: "0.3rem",
                }}
            >
                {isVerified ? "VERIFIED" : "NOT VERIFIED"}
            </div>

            <style>{`
  @media print {
    div[style*="rotate(-30deg)"] {
      color: ${isVerified
                    ? "rgba(0, 128, 0, 0.25)"
                    : "rgba(255, 0, 0, 0.25)"};
    }
    button { display: none; }
  }
`}</style>

            {/* Header */}
            <table width="100%" style={{ borderCollapse: "collapse", marginTop: "-40px", fontFamily: "Arial" }}>
                <tbody>
                    <tr>


                        <td style={{ width: "20%", textAlign: "center" }}>
                            <img
                                src={fetchedLogo}
                                alt="School Logo"
                                style={{
                                    marginLeft: "-10px",
                                    width: "140px",
                                    height: "140px",
                                    marginTop: "10px",
                                    borderRadius: "50%", // ✅ perfectly circular
                                    objectFit: "cover",

                                }}
                            />
                        </td>

                        {/* Center Column - School Information */}
                        <td style={{ width: "60%", textAlign: "center", lineHeight: "1", }}>
                            <div>Republic of the Philippines</div>
                            <div
                                style={{
                                    letterSpacing: "1px",
                                    fontSize: "20px",
                                    fontFamily: "Times new roman",
                                }}
                            >
                                {firstLine}
                            </div>
                            {secondLine && (
                                <div
                                    style={{
                                        letterSpacing: "1px",
                                        fontSize: "20px",
                                        fontFamily: "Times new roman",
                                    }}
                                >
                                    <b>{secondLine}</b>
                                </div>
                            )}
                            {campusAddress && (
                                <div style={{ fontSize: "16px", letterSpacing: "1px", fontFamily: "Arial" }}>
                                    {campusAddress}
                                </div>
                            )}

                            {/* Add spacing here */}
                            <div style={{ marginTop: "30px" }}>
                                <b style={{ fontSize: "24px", letterSpacing: '1px', fontWeight: "bold" }}>
                                    EXAMINATION PERMIT
                                </b>
                            </div>
                        </td>

                        <td
                            colSpan={4}
                            rowSpan={6}
                            style={{
                                textAlign: "center",
                                position: "relative",
                                width: "4.5cm",
                                height: "4.5cm",
                            }}
                        >
                            <div
                                style={{
                                    width: "3.80cm",
                                    height: "3.80cm",
                                    marginRight: "10px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    border: "2px solid black",
                                    overflow: "hidden",
                                    borderRadius: "4px",
                                    marginTop: "10px",
                                }}
                            >
                                {person.profile_img ? (
                                    <img
                                        src={`${API_BASE_URL}/uploads/${person.profile_img}`}
                                        alt="Profile"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",

                                        }}
                                    />
                                ) : (
                                    <span style={{ fontSize: "12px", color: "#888" }}>No Image</span>
                                )}
                            </div>
                        </td>

                    </tr>
                </tbody>
            </table>

            <div style={{ height: "20px" }} />
            <div className="certificate-wrapper">
                {/* ✅ Watermark */}


            </div>

            {/* ✅ Applicant Details Table */}
            <table
                className="student-table"
                style={{
                    borderCollapse: "collapse",
                    fontFamily: "Times New Roman",
                    fontSize: "15px",
                    width: "8in",
                    margin: "0 auto",
                    tableLayout: "fixed",
                }}
            >
                <tbody>
                    {/* Applicant Number */}
                    <tr style={{ fontFamily: "Times New Roman", fontSize: "15px" }}>
                        <td colSpan={40}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-end",
                                    width: "100%",
                                    gap: "10px",
                                }}
                            >
                                <label style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                    Applicant No.:
                                </label>
                                <div
                                    style={{
                                        borderBottom: "1px solid black",
                                        fontFamily: "Arial",
                                        fontWeight: "normal",
                                        fontSize: "15px",
                                        minWidth: "278px",
                                        height: "1.2em",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    {person?.applicant_number}
                                </div>
                            </div>
                        </td>


                    </tr>

                    {/* Name + Permit No. */}
                    <tr>
                        <td colSpan={20}>
                            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                    Name:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        fontFamily: "Arial",
                                        minWidth: "250px",
                                    }}
                                >
                                    {person?.last_name?.toUpperCase()}, {person?.first_name?.toUpperCase()}{" "}
                                    {person?.middle_name?.toUpperCase() || ""}{" "}
                                    {person?.extension?.toUpperCase() || ""}
                                </span>
                            </div>
                        </td>
                        <td colSpan={20}>
                            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                    Permit No.:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        minWidth: "200px",
                                        fontFamily: "Arial",
                                    }}
                                >
                                    {person?.applicant_number}
                                </span>
                            </div>
                        </td>
                    </tr>

                    {/* Course + Major */}
                    <tr>
                        <td colSpan={20}>
                            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                    Course Applied:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        minWidth: "220px",
                                        fontFamily: "Arial",
                                    }}
                                >
                                    {curriculumOptions.find(
                                        (c) =>
                                            c.curriculum_id?.toString() === (person?.program ?? "").toString()
                                    )?.program_description || ""}
                                </span>
                            </div>
                        </td>
                        <td colSpan={20}>
                            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px", }}>
                                    Major:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        minWidth: "200px",
                                        fontFamily: "Arial",

                                    }}
                                >
                                    {curriculumOptions.find(
                                        (c) =>
                                            c.curriculum_id?.toString() === (person?.program ?? "").toString()
                                    )?.major || ""}
                                </span>
                            </div>
                        </td>
                    </tr>

                    {/* Date of Exam + Time */}
                    <tr>
                        <td colSpan={20}>
                            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                    Date of Exam:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        fontFamily: "Arial",
                                    }}
                                >
                                    {examSchedule?.date_of_exam}
                                </span>
                            </div>
                        </td>
                        <td colSpan={20}>
                            <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                    Time:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        fontFamily: "Arial",
                                    }}
                                >
                                    {examSchedule
                                        ? new Date(`1970-01-01T${examSchedule.start_time}`).toLocaleTimeString(
                                            "en-US",
                                            { hour: "numeric", minute: "2-digit", hour12: true }
                                        )
                                        : ""}
                                </span>
                            </div>
                        </td>
                    </tr>

                    {/* Building + Room + QR */}
                    <tr>
                        <td colSpan={20}>
                            <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "-83px" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                    Bldg.:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        fontFamily: "Arial",
                                    }}
                                >
                                    {examSchedule?.building_description || ""}
                                </span>
                            </div>
                        </td>
                        <td colSpan={20}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", marginTop: "-145px" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px", width: "80px" }}>
                                        Room No.:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            fontFamily: "Arial",
                                            width: "150px",
                                        }}
                                    >
                                        {examSchedule?.room_description || ""}
                                    </span>
                                </div>

                                {person?.applicant_number && (
                                    <div
                                        style={{
                                            width: "4.5cm", // same as profile box
                                            height: "4.5cm",

                                            borderRadius: "4px",
                                            background: "#fff",       // ✅ white background
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            position: "relative",
                                            overflow: "hidden",
                                            marginLeft: "10px" // spacing from "Room No."
                                        }}
                                    >
                                        <QRCodeSVG
                                            value={`${API_BASE_URL}/examination_profile/${person.applicant_number}`}
                                            size={150}
                                            level="H"
                                        />

                                        {/* ✅ Applicant Number Overlay in Middle */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                color: "maroon",
                                                background: "white", // white backdrop so text doesn’t blend into QR
                                                padding: "2px 4px",
                                                borderRadius: "2px",
                                            }}
                                        >
                                            {person.applicant_number}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </td>

                    </tr>




                    {/* Date */}
                    <tr>
                        <td colSpan={40}>
                            <div style={{ display: "flex", alignItems: "center", width: "50%", marginTop: "-145px" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                    Date:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        fontFamily: "Arial",
                                    }}
                                >
                                    {examSchedule?.schedule_created_at
                                        ? new Date(examSchedule.schedule_created_at).toLocaleDateString(
                                            "en-US",
                                            { month: "long", day: "numeric", year: "numeric" }
                                        )
                                        : ""}
                                </span>
                            </div>
                        </td>


                    </tr>
                    {/* Scheduled By */}
                    <tr>
                        <td colSpan={40}>
                            <div style={{ display: "flex", alignItems: "center", width: "50%", marginTop: "-125px" }}>
                                <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                    Scheduled by:
                                </label>
                                <span
                                    style={{
                                        flexGrow: 1,
                                        borderBottom: "1px solid black",
                                        fontFamily: "Arial",
                                    }}
                                >
                                    {scheduledBy || "N/A"}
                                </span>
                            </div>
                        </td>

                    </tr>





                </tbody>
            </table>

            <table
                className="student-table"
                style={{

                    borderCollapse: "collapse",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    width: "8in",
                    margin: "0 auto", // Center the table inside the form
                    textAlign: "center",
                    tableLayout: "fixed",
                    border: "1px solid black",
                    marginTop: "10px"
                }}
            >
                <tbody>


                    <tr>
                        <td
                            colSpan={40}
                            style={{
                                color: "black",
                                padding: "12px",
                                lineHeight: "1.6",
                                textAlign: "left",
                                fontSize: "14px",
                                fontFamily: "Arial, Helvetica, sans-serif",
                            }}
                        >
                            <strong>IMPORTANT REMINDERS FOR APPLICANTS:</strong>

                            <ul style={{ marginTop: "8px" }}>
                                <strong>Step 1:</strong> Check your Examination Date, Time, and Room Number indicated on your permit.
<br/>

                                <strong>Step 2:</strong> Bring all required items on the exam day:
                                <ul>
                                    <li>Official Examination Permit with VERIFIED watermark on it</li>
                                    <li>No. 2 Pencil (any brand)</li>
                                    <li>2 Short bond papers</li>
                                </ul>



                                <strong>Step 3:</strong> Wear the proper attire:
                                <ul>
                                    <li>Plain white T-shirt or plain white polo shirt <strong>(no prints, no logos, no designs)</strong></li>
                                    <li>Pants (No shorts, No ripped jeans are not Allowed)</li>
                                    <li>Closed shoes (no crocs, sandals, slippers)</li>
                                </ul>


                                <strong>Step 4:</strong>Keep the two paper sheets attached to your exam permit. You will need them for the document check and enrollment process.
                                <br />
                                <strong>Step 5:</strong>Please Arrive at least 1 hour before your examination time. Late applicants will NOT be allowed to enter once the exam room door closes.

                                <br />
                                <br />
                                <div style={{ textAlign: "center", marginLeft: "-50px" }}><strong>GOODLUCK FUTURE EARISTIANS!</strong></div>
                            </ul>
                        </td>
                    </tr>



                </tbody>
            </table>

            <table
                style={{
                    borderCollapse: "collapse",
                    width: "8in",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <tbody>
                    <tr>


                    </tr>
                </tbody>
            </table>
        </div>


    );
};

export default ExamPermit;