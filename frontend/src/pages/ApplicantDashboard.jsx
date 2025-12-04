import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import "../styles/TempStyles.css";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import EventIcon from "@mui/icons-material/Event";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckIcon from "@mui/icons-material/Check";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Dialog } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import API_BASE_URL from "../apiConfig";
import { useParams } from "react-router-dom";
const ApplicantDashboard = (props) => {


  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [stepperColor, setStepperColor] = useState("#000000");   // ✅ NEW

  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (!settings) return;

    // 🎨 Colors
    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    if (settings.stepper_color) setStepperColor(settings.stepper_color);   // ✅ NEW

    // 🏫 Logo
    if (settings.logo_url) {
      setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
    } else {
      setFetchedLogo(EaristLogo);
    }

    // 🏷️ School Information
    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);

  }, [settings]);




  const { profileImage, setProfileImage } = props;
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);
  const [openImage, setOpenImage] = useState(null);
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [applicantID, setApplicantID] = useState("");
  const [person, setPerson] = useState({
    profile_img: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    extension: "",
    profile_img: "",
  });
  const [proctor, setProctor] = useState(null);
  const [applicantNumber, setApplicantNumber] = useState(null);

  const { person_id: paramId } = useParams();
  const person_id = paramId || localStorage.getItem("person_id");

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole === "applicant") {
        fetchPersonData(storedID);
        fetchApplicantNumber(storedID);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const [medicalUploads, setMedicalUploads] = useState([]);

  useEffect(() => {
    if (person_id) {
      fetchDocumentsStatus();
    }
  }, [person_id]);


  const fetchMedicalUploads = async (personId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/uploads`, {
        headers: { "x-person-id": personId },
      });

      // ✅ Only get vaccine/medical related uploads
      const medicalDocs = res.data.filter(u =>
        u.original_name?.toLowerCase().includes("vaccine") ||
        u.description?.toLowerCase().includes("vaccine") ||
        u.requirements_id === 5 // if 5 = VaccineCard in your DB
      );

      setMedicalUploads(medicalDocs);
    } catch (err) {
      console.error("❌ Failed to fetch medical uploads:", err);
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("person_id");
    if (id) {
      checkRequirements(id);
      fetchMedicalUploads(id); // 👈 fetch medical documents
    }
  }, []);

  // add these alongside your other useState declarations
  const [qualifyingExamScore, setQualifyingExamScore] = useState(null);
  const [qualifyingInterviewScore, setQualifyingInterviewScore] = useState(null);
  const [examScore, setExamScore] = useState(null);


  const fetchProctorSchedule = async (applicantNumber) => {
    if (!applicantNumber) return console.warn("fetchProctorSchedule missing applicantNumber");
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/applicant-schedule/${applicantNumber}`);
      console.info("applicant-schedule response for", applicantNumber, data);
      setProctor(data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
      setProctor(null);
    }
  };


  const [requirementsCompleted, setRequirementsCompleted] = useState(
    localStorage.getItem("requirementsCompleted") === "1"
  );

  useEffect(() => {
    const checkRequirements = () => {
      setRequirementsCompleted(localStorage.getItem("requirementsCompleted") === "1");
    };

    // Run on mount
    checkRequirements();

    // Optional: Listen for storage changes across tabs/components
    window.addEventListener("storage", checkRequirements);

    return () => window.removeEventListener("storage", checkRequirements);
  }, []);

  const [allRequirementsCompleted, setAllRequirementsCompleted] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("person_id");
    if (id) {
      checkRequirements(id);
    }
  }, []);

  const checkRequirements = async (personId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/uploads`, {
        headers: { "x-person-id": personId },
      });

      const uploadsData = res.data;
      const rebuiltSelectedFiles = {};

      uploadsData.forEach((upload) => {
        const desc = upload.description.toLowerCase();
        if (desc.includes("form 138")) rebuiltSelectedFiles["Form138"] = true;
        if (desc.includes("good moral")) rebuiltSelectedFiles["GoodMoralCharacter"] = true;
        if (desc.includes("birth certificate")) rebuiltSelectedFiles["BirthCertificate"] = true;
        if (desc.includes("graduating class")) rebuiltSelectedFiles["CertificateOfGraduatingClass"] = true;
        if (desc.includes("vaccine card")) rebuiltSelectedFiles["VaccineCard"] = true;
      });

      const allRequired = ["Form138", "GoodMoralCharacter", "BirthCertificate", "CertificateOfGraduatingClass", "VaccineCard"]
        .every((key) => rebuiltSelectedFiles[key]);

      setAllRequirementsCompleted(allRequired);
      localStorage.setItem("requirementsCompleted", allRequired ? "1" : "0");
    } catch (err) {
      console.error("Failed to check requirements:", err);
    }
  };




  const fetchApplicantNumber = async (personID) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/applicant_number/${personID}`
      );
      if (res.data && res.data.applicant_number) {
        setApplicantID(res.data.applicant_number);
        fetchEntranceExamScores(res.data.applicant_number);
        fetchProctorSchedule(res.data.applicant_number);
        fetchInterviewSchedule(res.data.applicant_number);
        fetchCollegeApproval(res.data.applicant_number);
      }
    } catch (error) {
      console.error("Failed to fetch applicant number:", error);
    }
  };

  const fetchPersonData = async (id) => {
    if (!id) return console.warn("fetchPersonData called with empty id");

    try {
      console.info("fetchPersonData -> requesting person_with_applicant for id:", id);
      const res = await axios.get(`${API_BASE_URL}/api/person_with_applicant/${id}`);
      console.info("person_with_applicant response:", res.data);
      setPerson(res.data || {});

      const applicantNumber = res.data?.applicant_number ?? res.data?.applicantNumber ?? null;
      if (applicantNumber) {
        setApplicantID(applicantNumber);
        try {
          const sched = await axios.get(`${API_BASE_URL}/api/applicant-schedule/${applicantNumber}`);
          console.info("applicant-schedule:", sched.data);
          setProctor(sched.data);
        } catch (e) {
          console.warn("applicant-schedule fetch failed:", e?.response?.data || e.message);
          setProctor(null);
        }
      } else {
        console.warn("No applicant_number in person_with_applicant response for id", id);
      }

      // map many possible field names
      let qExam = res.data?.qualifying_exam_score ?? res.data?.qualifying_result ?? res.data?.exam_score ?? null;
      let qInterview = res.data?.qualifying_interview_score ?? res.data?.interview_result ?? null;
      let ex = res.data?.exam_score ?? res.data?.exam_result ?? null;


      // fallback: fetch person_status_by_applicant if scores not present
      if ((qExam === null && qInterview === null && ex === null) && applicantNumber) {
        try {
          const st = await axios.get(`${API_BASE_URL}/api/person_status_by_applicant/${applicantNumber}`);
          console.info("person_status_by_applicant response:", st.data);
          qExam = qExam ?? st.data?.qualifying_result ?? null;
          qInterview = qInterview ?? st.data?.interview_result ?? null;
          ex = ex ?? st.data?.exam_result ?? null;
        } catch (err) {
          console.warn("Fallback status endpoint failed:", err?.response?.data || err.message);
        }
      }

      setQualifyingExamScore(qExam !== undefined ? qExam : null);
      setQualifyingInterviewScore(qInterview !== undefined ? qInterview : null);
      setExamScore(ex !== undefined ? ex : null);




      console.info("final mapped scores:", { qExam, qInterview, ex });

    } catch (err) {
      console.error("fetchPersonData failed:", err?.response?.data || err.message);
    }
  };



  // Format start and end time
  const formatTime = (time) =>
    time
      ? new Date(`1970-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      : "";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  /* ---------------- Step 2: Entrance Exam ---------------- */
  const [examScores, setExamScores] = useState({
    english: null,
    science: null,
    filipino: null,
    math: null,
    abstract: null,
    final: null,
    status: null
  });

  const fetchEntranceExamScores = async (applicantNumber) => {
    if (!applicantNumber) return;

    try {
      const res = await axios.get(`${API_BASE_URL}/api/applicants-with-number`);
      const applicant = res.data.find(a => a.applicant_number === applicantNumber);

      if (applicant) {
        const english = Number(applicant.english) || 0;
        const science = Number(applicant.science) || 0;
        const filipino = Number(applicant.filipino) || 0;
        const math = Number(applicant.math) || 0;
        const abstract = Number(applicant.abstract) || 0;

        const finalRating = applicant.final_rating
          ? Number(applicant.final_rating)
          : (english + science + filipino + math + abstract) / 5;

        const status = applicant.exam_status || null;

        setExamScores({
          english,
          science,
          filipino,
          math,
          abstract,
          final: finalRating.toFixed(2),
          status
        });
      } else {
        setExamScores({
          english: null,
          science: null,
          filipino: null,
          math: null,
          abstract: null,
          final: null,
          status: null
        });
      }
    } catch (err) {
      console.error("❌ Failed to fetch entrance exam scores:", err);
    }
  };


  const hasScores = examScores.english !== null &&
    examScores.science !== null &&
    examScores.filipino !== null &&
    examScores.math !== null &&
    examScores.abstract !== null &&
    (
      examScores.english > 0 ||
      examScores.science > 0 ||
      examScores.filipino > 0 ||
      examScores.math > 0 ||
      examScores.abstract > 0
    );

  const hasSchedule = proctor?.email_sent === 1;

  const [interviewSchedule, setInterviewSchedule] = useState(null);
  const [hasInterviewScores, setHasInterviewScores] = useState(false);

  const fetchInterviewSchedule = async (applicantNumber) => {
    if (!applicantNumber) return;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/applicant-interview-schedule/${applicantNumber}`
      );
      console.info("Interview schedule + scores:", res.data);

      setInterviewSchedule(res.data);

      // ✅ set scores directly from API
      const qExam = res.data.qualifying_result ?? null;
      const qInterview = res.data.interview_result ?? null;
      const ex = res.data.exam_result ?? null;

      setQualifyingExamScore(qExam);
      setQualifyingInterviewScore(qInterview);
      setExamScore(ex);

      setHasInterviewScores(qExam !== null || qInterview !== null || ex !== null);
    } catch (err) {
      console.error("❌ Failed to fetch interview schedule:", err);
      setInterviewSchedule(null);
    }
  };

  useEffect(() => {
    if (applicantNumber) {
      fetchEntranceExamScores(applicantNumber);
    }
  }, [applicantNumber]);


  const [collegeApproval, setCollegeApproval] = useState(null);

  const fetchCollegeApproval = async (applicantNumber) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/interview_applicants/${applicantNumber}`
      );
      setCollegeApproval(res.data?.status || "");
    } catch (err) {
      console.error("❌ Failed to fetch college approval:", err);
    }
  };

  const [date, setDate] = useState(new Date());

  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  const year = date.getFullYear();
  const month = date.getMonth();

  const now = new Date();
  const manilaDate = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Manila" })
  );
  const today = manilaDate.getDate();
  const thisMonth = manilaDate.getMonth();
  const thisYear = manilaDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const weeks = [];
  let currentDay = 1 - firstDay;

  while (currentDay <= totalDays) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay > 0 && currentDay <= totalDays) {
        week.push(currentDay);
      } else {
        week.push(null);
      }
      currentDay++;
    }
    weeks.push(week);
  }

  const handlePrevMonth = () => setDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setDate(new Date(year, month + 1, 1));

  const [docsCompleted, setDocsCompleted] = useState(false);

  const fetchDocumentsStatus = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/applicant_uploaded_requirements/${person_id}`
      );

      const rows = res.data;

      if (!rows || rows.length === 0) {
        setDocsCompleted(false);
        return;
      }

      // Only check rows that actually have file_path (meaning uploaded)
      const uploaded = rows.filter((doc) => doc.file_path !== null);

      // Total required = how many requirement IDs exist in DB for this person
      const totalRequired = rows.length;

      // How many are submitted
      const submittedCount = uploaded.filter(
        (doc) => Number(doc.submitted_documents) === 1
      ).length;

      // Completed if uploaded == required
      const allSubmitted = submittedCount === totalRequired;

      setDocsCompleted(allSubmitted);

      // Auto-tag Document Verified
      if (allSubmitted) {
        setPerson((prev) => ({
          ...prev,
          document_status: "Documents Verified & ECAT",
        }));
      }

    } catch (err) {
      console.error("❌ Failed fetching document status:", err);
    }
  };


  const stepIcons = {
    0: <DescriptionIcon />,
    1: <EventIcon />,
    2: <AssignmentTurnedInIcon />,
    3: <CheckCircleIcon />,
    4: <LocalHospitalIcon />,
    5: <PersonIcon />,
  };

const getCurrentStep = () => {
  const applicantNumber = person?.applicant_number;

  // STEP 6 — Applicant Status (Accepted or Has Applicant Number)
  if (applicantNumber && applicantNumber !== "") {
    return 5;
  }

  // STEP 5 — Medical Submitted
  if (medicalUploads.length > 0) {
    return 4;
  }

  // STEP 4 — College Approval
  if (collegeApproval === "Accepted" || collegeApproval === "Rejected") {
    return 3;
  }

  // STEP 3 — Interview + Scores
  if (
    interviewSchedule &&
    interviewSchedule.day_description &&
    interviewSchedule.start_time &&
    interviewSchedule.end_time &&
    hasInterviewScores &&
    typeof qualifyingInterviewScore === "number"
  ) {
    return 2;
  }

  // STEP 2 — Exam Schedule + Scores
  if (
    hasSchedule &&
    hasSchedule.day_description &&
    hasSchedule.start_time &&
    hasSchedule.end_time &&
    hasScores &&
    examScores?.status
  ) {
    return 1;
  }

  // STEP 1 — Documents Verified
  if (docsCompleted || person?.document_status === "Documents Verified & ECAT") {
    return 0;
  }

  return 0;
};

  const activeStep = getCurrentStep();

  const interview = person?.interview || null;
  const medical = person?.medical || {};


  const { active, completed, icon } = props; // <-- props are defined here
  const IconComponent = stepIcons[icon - 1]; // MUI passes `icon` as 1-based index


  const steps = [
    "Documents Submitted",
    "Admission Entrance Exam",
    "Interview /  Qualifying Exam Schedule",
    "College Approval",
    "Medical And Dental Service",
    "Applicant Status",
  ];

  const [holidays, setHolidays] = useState({});

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await axios.get(
          `https://date.nager.at/api/v3/PublicHolidays/${year}/PH`
        );
        const lookup = {};
        res.data.forEach((h) => {
          lookup[h.date] = h;
        });
        setHolidays(lookup);
      } catch (err) {
        console.error("❌ Failed to fetch PH holidays:", err);
        setHolidays({});
      }
    };
    fetchHolidays();
  }, [year]);

  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const role = localStorage.getItem("role"); // ✅ get the current user role
        const res = await axios.get(
          `${API_BASE_URL}/api/announcements?role=${role}`
        );

        // Sort latest first
        const sorted = res.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setAnnouncements(sorted);
      } catch (err) {
        console.error("❌ Failed to fetch announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);


  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // In case it's not a valid date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const person_id = localStorage.getItem("person_id");
      const role = localStorage.getItem("role");

      // ✅ Get user_account_id
      const res = await axios.get(
        `${API_BASE_URL}/api/get_applicant_account_id/${person_id}`
      );

      const user_account_id = res.data.user_account_id;

      const formData = new FormData();

      formData.append("profile_picture", file);

      // ✅ Upload image using same backend API
      await axios.post(
        `${API_BASE_URL}/update_applicant/${user_account_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Refresh profile info to display the new image
      const updated = await axios.get(
        `${API_BASE_URL}/api/person_data/${person_id}/${role}`
      );

      setPerson(updated.data);
      fetchPersonData(person_id, role);

      const baseUrl = `${API_BASE_URL}/uploads/${updated.data.profile_image}`;
      setProfileImage(`${baseUrl}?t=${Date.now()}`);

      console.log("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  const [hasStudentNumber, setHasStudentNumber] = useState(false);
  const [studentNumber, setStudentNumber] = useState(null);

  const checkStudentNumber = async (personId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/student_status/${personId}`);
      if (res.data.hasStudentNumber) {
        setHasStudentNumber(true);
        setStudentNumber(res.data.student_number);
      } else {
        setHasStudentNumber(false);
      }
    } catch (err) {
      console.error("❌ Failed to check student number:", err);
    }
  };

  useEffect(() => {
    const storedID = localStorage.getItem("person_id");
    if (storedID) {
      fetchPersonData(storedID);
      fetchApplicantNumber(storedID);
      checkStudentNumber(storedID); // 👈 ADD THIS LINE
    }
  }, []);





  return (
    <Box
      sx={{
        p: 4,
        marginLeft: "-2rem",
        paddingRight: 8,
        height: "calc(100vh - 150px)",
        overflowY: "auto",
      }}
    >

      <Grid container spacing={3}>
        {/* Applicant Information */}
        <Grid item xs={12}>
          <Card
            sx={{
              border: `2px solid ${borderColor}`,
              boxShadow: 3,
              height: "135px",
              width: "1485px",
              backgroundColor: "#fff9ec",
              marginLeft: "10px",
              p: 2,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              {/* Wrap in row: left (avatar+info) | right (date) */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                {/* Left side */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  {!person?.profile_img ? (
                    <PersonIcon sx={{ color: "maroon" }} fontSize="large" />
                  ) : (
                    <Box
                      position="relative"
                      display="inline-block"
                      mr={2}
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                    >
                      <Avatar
                        src={profileImage || `${API_BASE_URL}/uploads/${person?.profile_img}`}
                        alt={person?.fname}
                        sx={{
                          width: 90,
                          height: 90,
                          border: `2px solid ${borderColor}`,
                          cursor: "pointer",
                          mt: -1.5,
                        }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        {person?.fname?.[0]}
                      </Avatar>

                      {/* Hover upload button */}
                      {hovered && (
                        <label
                          onClick={() => fileInputRef.current.click()}
                          style={{
                            position: "absolute",
                            bottom: "-5px",
                            right: 0,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            backgroundColor: "#ffffff",
                            border: `2px solid ${borderColor}`,
                            width: "32px",
                            height: "32px",
                          }}
                        >
                          <AddCircleIcon
                            sx={{
                              color: settings?.header_color || "#1976d2",
                              fontSize: 28,
                              borderRadius: "50%",
                            }}
                          />
                        </label>
                      )}


                      {/* Hidden file input */}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </Box>
                  )}

                  <Box>
                    <Typography variant="h4" fontWeight="bold" style={{ color: titleColor }}>
                      Welcome,&nbsp;
                      {person.last_name}, {person.first_name}{" "}
                      {person.middle_name} {person.extension}
                    </Typography>
                    <Typography variant="body1" color="black" fontSize={20}>
                      <b>Applicant ID:</b> {applicantID || "N/A"}
                    </Typography>
                  </Box>
                </Stack>

                {/* Right side (date) */}
                <Typography
                  variant="body3"
                  color="#000000"
                  sx={{ fontWeight: 500, marginTop: "-10px" }}
                >
                  Date: {formattedDate}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>


        <Grid container spacing={2} justifyContent="left" mt={2}>
          {/* Group for Application + Upload + Notice */}
          <Grid item>
            <Grid container direction="column" spacing={2}>
              {/* Row 1 - Application + Upload */}
              <Grid item>
                <Grid container spacing={2}>
                  {/* Common size for both cards */}
                  {["Application Form", "Upload Requirements"].map((title, idx) => (
                    <Grid item key={idx}>
                      <Card
                        sx={{
                          borderRadius: 3,
                          boxShadow: 3,
                          p: 2,
                          transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                          width: 245, // same width
                          height: 300, // same height
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          border: `2px solid ${borderColor}`,
                          marginLeft: idx === 0 ? "35px" : 0, // only first card has left margin
                        }}
                      >
                        <CardContent sx={{ textAlign: "center" }}>
                          <Typography variant="h6" gutterBottom>
                            {title}
                          </Typography>

                          {title === "Application Form" && (
                            <button
                              style={{
                                padding: "10px 20px",
                                backgroundColor: mainButtonColor,
                                border: `2px solid ${borderColor}`,
                                color: "white",
                                fontSize: "15px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                marginTop: "10px",
                              }}
                              onClick={() => {
                                if (!localStorage.getItem("dashboardKeys")) {
                                  const generateKey = () =>
                                    Math.random().toString(36).substring(2, 10);

                                  const dashboardKeys = {
                                    step1: generateKey(),
                                    step2: generateKey(),
                                    step3: generateKey(),
                                    step4: generateKey(),
                                    step5: generateKey(),
                                  };

                                  localStorage.setItem(
                                    "dashboardKeys",
                                    JSON.stringify(dashboardKeys)
                                  );
                                }
                                const keys = JSON.parse(localStorage.getItem("dashboardKeys"));
                                window.location.href = `/dashboard/${keys.step1}`;
                              }}
                            >
                              Start Application
                            </button>
                          )}

                          {title === "Upload Requirements" && (
                            <button
                              style={{
                                padding: "10px 20px",
                                backgroundColor: mainButtonColor,
                                border: `2px solid ${borderColor}`,
                                color: "white",
                                fontSize: "15px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                marginTop: "10px",
                              }}
                              onClick={() => {
                                window.location.href = "/requirements_uploader";
                              }}
                            >
                              Upload Now
                            </button>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>



              {/* Row 2 - Notice directly below */}
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    marginLeft: "35px",
                    transition: "transform 0.2s ease",
                    boxShadow: 3,
                    "&:hover": { transform: "scale(1.03)" },
                    height: "90px",
                    borderRadius: "10px",
                    backgroundColor: "#fffaf5",
                    border: `2px solid ${borderColor}`,
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                    width: "510px", // same width as the two cards together
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#6D2323",
                      borderRadius: "8px",

                      width: 50,
                      height: 50,
                      flexShrink: 0,
                    }}
                  >
                    <WarningAmberIcon sx={{ color: "white", fontSize: 35 }} />
                  </Box>

                  {/* Text */}
                  <Typography sx={{ fontSize: "15px", fontFamily: "Arial" }}>
                    <strong style={{ color: "maroon" }}>Notice:</strong>&nbsp;
                    <Typography component="span" sx={{ color: "maroon", fontWeight: "bold", }}>
                      {allRequirementsCompleted
                        ? "Your application is registered."
                        : "Please complete all required documents to register your application."}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Third Card (Announcement) */}
          <Grid item xs="auto">
            <Card
              sx={{
                borderRadius: 3,
                marginLeft: "10px",
                boxShadow: 3,
                p: 2,
                width: "490px",
                height: "405px",
                display: "flex",
                border: `2px solid ${borderColor}`,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Typography sx={{ textAlign: "center" }} variant="h6" gutterBottom>
                  Announcements
                </Typography>
                <Divider sx={{ mb: 2, }} />

                {announcements.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No active announcements.
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 270, overflowY: "auto" }}>
                    {announcements.map((a) => (
                      <Box
                        key={a.id}
                        sx={{
                          mb: 2,
                          p: 1,
                          width: 430,


                          borderRadius: 2,
                          border: `2px solid ${borderColor}`,
                          backgroundColor: "#fff8f6",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ color: mainButtonColor, fontWeight: "bold" }}
                        >
                          {a.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {a.content}
                        </Typography>

                        {a.file_path && (
                          <>
                            <img
                              src={`${API_BASE_URL}/uploads/${a.file_path}`}
                              alt={a.title}
                              style={{
                                width: "100%",
                                maxHeight: "171px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                marginBottom: "6px",
                                cursor: "pointer"
                              }}
                              onClick={() => setOpenImage(`${API_BASE_URL}/uploads/${a.file_path}`)}
                            />

                            <Dialog
                              open={Boolean(openImage)}
                              onClose={() => setOpenImage(null)}
                              fullScreen
                              PaperProps={{
                                style: {
                                  backgroundColor: "transparent", // fully transparent background
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "relative",
                                  boxShadow: "none",
                                  cursor: "pointer", // indicate clickable outside
                                },
                              }}
                            >
                              {/* Clicking outside image closes dialog */}
                              <Box
                                onClick={() => setOpenImage(null)}
                                sx={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  zIndex: 1,
                                }}
                              />

                              {/* 🔙 Back Button on Top-Left */}
                              <IconButton
                                onClick={() => setOpenImage(null)}
                                sx={{
                                  position: "absolute",
                                  top: 20,
                                  left: 20,
                                  backgroundColor: "white",
                                  width: 70,
                                  height: 70,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  zIndex: 2, // above clickable backdrop
                                  "&:hover": { backgroundColor: "#f5f5f5" },
                                }}
                              >
                                <KeyboardBackspaceIcon sx={{ fontSize: 50, color: "black" }} />
                              </IconButton>

                              {/* Fullscreen Image */}
                              <Box
                                onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image
                                sx={{
                                  position: "relative",
                                  zIndex: 2,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  maxWidth: "100%",
                                  maxHeight: "100%",
                                }}
                              >
                                <img
                                  src={openImage}
                                  alt="Preview"
                                  style={{
                                    maxWidth: "100%",
                                    maxHeight: "90%",
                                    objectFit: "contain",
                                  }}
                                />
                              </Box>
                            </Dialog>


                          </>
                        )}


                        <Typography variant="caption" color="text.secondary">
                          Expires: {new Date(a.expires_at).toLocaleDateString("en-US")}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>

          </Grid>

          <Grid item xs="auto">
            <Card
              sx={{
                marginLeft: "10px",
                boxShadow: 3,
                p: 2,
                border: `2px solid ${borderColor}`,
                borderRadius: "10px",
                width: "425px",
                height: "406px",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <CardContent sx={{ p: 0, width: "100%" }}>
                {/* Header */}
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    backgroundColor: settings?.header_color || "#1976d2",
                    color: "white",
                    border: `2px solid ${borderColor}`,
                    borderBottom: "none", // prevent double border with body
                    borderRadius: "8px 8px 0 0",
                    padding: "10px 8px",
                  }}
                >
                  <Grid item>
                    <IconButton size="small" onClick={handlePrevMonth} sx={{ color: "white" }}>
                      <ArrowBackIos fontSize="small" />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      {date.toLocaleString("default", { month: "long" })} {year}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <IconButton size="small" onClick={handleNextMonth} sx={{ color: "white" }}>
                      <ArrowForwardIos fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>

                {/* Calendar Table */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    borderLeft: `2px solid ${borderColor}`,
                    borderRight: `2px solid ${borderColor}`,
                    borderBottom: `2px solid ${borderColor}`, // ✅ add bottom border here
                    borderTop: `2px solid ${borderColor}`,
                    borderRadius: "10px",
                    borderRadius: "0 0 8px 8px", // ✅ match with header rounding
                    overflow: "hidden",
                  }}
                >
                  {/* Days of the week */}
                  {days.map((day, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        backgroundColor: "#f3f3f3",
                        textAlign: "center",
                        py: 1,
                        fontWeight: "bold",
                        borderBottom: `1px solid ${borderColor}`,
                      }}
                    >
                      {day}
                    </Box>
                  ))}

                  {/* Dates */}
                  {weeks.map((week, i) =>
                    week.map((day, j) => {
                      if (!day) {
                        return (
                          <Box
                            key={`${i}-${j}`}
                            sx={{
                              height: 45,
                              backgroundColor: "#fff",

                            }}
                          />
                        );
                      }

                      const isToday =
                        day === today && month === thisMonth && year === thisYear;
                      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                        day
                      ).padStart(2, "0")}`;
                      const isHoliday = holidays[dateKey];

                      const dayCell = (
                        <Box
                          sx={{
                            height: 45,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "50%",
                            backgroundColor: isToday
                              ? settings?.header_color || "#1976d2"
                              : isHoliday
                                ? "#E8C999"
                                : "#fff",
                            color: isToday ? "white" : "black",
                            fontWeight: isHoliday ? "bold" : "500",
                            cursor: isHoliday ? "pointer" : "default",
                            "&:hover": {
                              backgroundColor: isHoliday ? "#F5DFA6" : "#000",
                              color: isHoliday ? "black" : "white",
                            },
                          }}
                        >
                          {day}
                        </Box>
                      );

                      return isHoliday ? (
                        <Tooltip
                          key={`${i}-${j}`}
                          title={
                            <>
                              <Typography fontWeight="bold">{isHoliday.localName}</Typography>
                              <Typography variant="caption">{isHoliday.date}</Typography>
                            </>
                          }
                          arrow
                          placement="top"
                        >
                          {dayCell}
                        </Tooltip>
                      ) : (
                        <React.Fragment key={`${i}-${j}`}>{dayCell}</React.Fragment>
                      );
                    })
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

        </Grid>



        <Box sx={{ width: "100%", mt: 2 }}>
          {/* Title */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,

            }}
          >
            <Typography sx={{ fontSize: "32px", fontWeight: "bold", color: subtitleColor }}>
              APPLICATION STATUS
            </Typography>
          </Box>

          <Stepper
            alternativeLabel
            activeStep={activeStep}
            sx={{
              "& .MuiStepConnector-root": {
                top: "30px", // 👈 moves line down, middle of circles
                left: "calc(-50% + 30px)",
                right: "calc(50% + 30px)",
              },
              "& .MuiStepConnector-line": {
                backgroundColor: mainButtonColor,
                borderTopWidth: 3,
                borderRadius: 8,

              },
            }}
          >
            {steps.map((label, index) => (
              <Step key={index} completed={index < activeStep}>

                <StepLabel
                  StepIconComponent={(stepProps) => {
                    const icons = [
                      <DescriptionIcon />,
                      <EventIcon />,
                      <AssignmentTurnedInIcon />,
                      <CheckCircleIcon />,
                      <LocalHospitalIcon />,
                      <PersonIcon />,
                    ];

                    const isActive = stepProps.active;
                    const isCompleted = stepProps.completed;

                    return (
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "50%",
                          backgroundColor: isActive || isCompleted ? mainButtonColor : "#E8C999",
                          border: `2px solid ${borderColor}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                        }}
                      >
                        {React.cloneElement(icons[index], {
                          sx: { color: isActive || isCompleted ? "white" : mainButtonColor, fontSize: 30 },
                        })}
                      </Box>

                    );
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#6D2323",
                      textAlign: "center",
                    }}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>


          {/* Containers below each step */}
          <Grid container justifyContent="space-between" sx={{ mt: 3 }}>
            {steps.map((label, index) => (
              <Grid
                item
                xs={2} // each step gets equal space (12/6 = 2)
                key={index}

                sx={{ display: "flex", justifyContent: "center", }}
              >
                <Box
                  sx={{
                    height: 360,
                    width: "100%",        // let it stretch with grid
                    maxWidth: 205,        // same size as before
                    border: `2px solid ${borderColor}`,
                    borderRadius: 2,
                    p: 2,
                    overflowY: "auto",
                    fontSize: "13px",
                        backgroundColor: "#fff9ec",
                    transition: "transform 0.2s ease",
                    boxShadow: 3,
                    "&:hover": { transform: "scale(1.03)" },
                    color: "maroon",
                    fontWeight: "bold",
                    lineHeight: 1.6,
                  }}
                >
                  {/* Step 1: Document Submitted */}
                  {index === 0 && (
                    <>
                      {person?.document_status === "Documents Verified & ECAT" ? (
                        <div>
                          ✅ Your submitted documents have been successfully verified.
                          <br />
                          <Divider
                            sx={{
                              backgroundColor: "gray",
                              height: "0.5px",
                              my: 2,
                              borderRadius: 1,
                            }}
                          />

                          <strong>Next Step:</strong>
                          <br />
                          Go to <strong>Applicant Form</strong> → <strong>Examination Permit</strong>
                          <br />
                          and <strong>print your permit</strong>.
                        </div>
                      ) : (
                        "⏳ Status: Pending"
                      )}
                    </>
                  )}



                  {index === 1 && (
                    <>
                      {/* Pending Status */}
                      {!hasSchedule && !hasScores && (
                        <span>⏳ Status: Pending</span>
                      )}

                      {/* Scheduled Exam Info */}
                      {hasSchedule && (
                        <>
                          📅 Date: {formatDate(proctor?.day_description)} <br />
                          🏢 Building: {proctor?.building_description || "TBA"} <br />
                          🚪 Room: {proctor?.room_description || "TBA"} <br />
                          ⏰ Time: {formatTime(proctor?.start_time)} – {formatTime(proctor?.end_time)}
                        </>
                      )}

                      <br />
                      <Divider sx={{ backgroundColor: "gray", height: "0.5px", my: 2, borderRadius: 1 }} />

                      {/* Exam Status */}
                      {hasScores && (
                        <>
                          🎯 <b>Entrance Examination Status:
                            {examScores.status === "PASSED" ? (
                              <span style={{ color: "green" }}> PASSED </span>
                            ) : examScores.status === "FAILED" ? (
                              <span style={{ color: "red" }}> FAILED </span>
                            ) : (
                              <span> Pending </span>
                            )}
                          </b>
                        </>
                      )}
                    </>
                  )}
                  {/* Step 3: Interview */}
                  {index === 2 && (
                    <>
                      {!interviewSchedule && !hasInterviewScores && "⏳ Status: Pending"}

                      {interviewSchedule && (
                        <>

                          📅 Date: {formatDate(interviewSchedule?.day_description)} <br />
                          🏫 Building: {interviewSchedule.building_description || "TBA"} <br />
                          🏷️ Room: {interviewSchedule.room_description || "TBA"} <br />
                          ⏰ Time: {formatTime(interviewSchedule.start_time)} – {formatTime(interviewSchedule.end_time)}
                        </>
                      )}
                      <br />
                      <Divider
                        sx={{
                          backgroundColor: "gray",
                          height: "0.5px",
                          my: 2,
                          borderRadius: 1,
                        }}
                      />

                      {hasInterviewScores && (
                        <>
                          🗣 Interview Score: {qualifyingInterviewScore ?? "N/A"} <br />
                          📝 Qualifying Exam Score: {qualifyingExamScore ?? "N/A"} <br />
                          📊 Exam Result: {examScore ?? "N/A"} <br />
                          📈 Total Average: {(
                            (Number(qualifyingExamScore ?? 0) +
                              Number(qualifyingInterviewScore ?? 0) +
                              Number(examScore ?? 0)) / 3
                          ).toFixed(2)}
                        </>
                      )}
                    </>
                  )}



                  {/* Step 4: College Approval */}
                  {index === 3 && (
                    <>
                      {collegeApproval === "Accepted"
                        ? "✅ Approved by College"
                        : collegeApproval === "Rejected"
                          ? "❌ Rejected by College"
                          : "⏳ Waiting for College Approval"}
                    </>
                  )}


                  {/* Step 5: Medical Submitted */}
                  {index === 4 && (
                    <>
                      {docsCompleted ? (
                        "⬇️ Your documents have been verified. Please proceed to your respective college to finalize your schedule and subjects."
                      ) : (
                        "⏳ Apply For Medical Processing"
                      )}
                    </>
                  )}




                  {/* Step 6: Applicant Status */}
                  {index === 5 && (
                    <>
                      {person?.final_status === "Rejected" ? (
                        "❌ Unfortunately, you were not accepted."
                      ) : hasStudentNumber ? (
                        <>
                          🎉 <strong>Congratulations!</strong> You are now accepted at <strong>EARIST</strong>.
                          Please follow the steps below:

                          <div style={{ marginTop: "6px", lineHeight: "1.6" }}>
                            1. Proceed to your <strong>College</strong> to tag your subjects. <br />
                            2. Get your <strong>Class Schedule</strong> from your department. <br />

                            {studentNumber && (
                              <span style={{ display: "block", fontWeight: "bold", marginTop: "5px" }}>
                                Your Student Number: {studentNumber}
                              </span>
                            )}
                          </div>
                        </>
                      ) : person?.final_status === "Accepted" ? (
                        "✅ You have been accepted. Please wait while your student number is being processed."
                      ) : (
                        "⏳ Application in Progress"
                      )}
                    </>
                  )}

                </Box>
              </Grid>
            ))}
          </Grid>

        </Box>





      </Grid>
    </Box>
  );
};

export default ApplicantDashboard;
