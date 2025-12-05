import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, TextField, Typography, Card, Table, TableHead, TableCell, TableRow, TableContainer, Paper } from "@mui/material";
import '../styles/Print.css'
import CertificateOfRegistration from './CertificateOfRegistrationForRegistrar';
import SearchIcon from "@mui/icons-material/Search";
import { FcPrint } from "react-icons/fc";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PeopleIcon from "@mui/icons-material/People";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScoreIcon from '@mui/icons-material/Score';
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";

const SearchCertificateOfRegistration = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff");   // ✅ NEW
  const [stepperColor, setStepperColor] = useState("#000000");       // ✅ NEW

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
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);   // ✅ NEW
    if (settings.stepper_color) setStepperColor(settings.stepper_color);           // ✅ NEW

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




  // Also put it at the very top
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");

  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);


  const pageId = 109;

  const [employeeID, setEmployeeID] = useState("");

  useEffect(() => {

    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");
    const storedEmployeeID = localStorage.getItem("employee_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);
      setEmployeeID(storedEmployeeID);

      if (storedRole === "registrar") {
        checkAccess(storedEmployeeID);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const checkAccess = async (employeeID) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/page_access/${employeeID}/${pageId}`);
      if (response.data && response.data.page_privilege === 1) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setHasAccess(false);
      if (error.response && error.response.data.message) {
        console.log(error.response.data.message);
      } else {
        console.log("An unexpected error occurred.");
      }
      setLoading(false);
    }
  };



  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(6);
  const [clickedSteps, setClickedSteps] = useState([]);

  const tabs1 = [
      { label: "Admission Process For College", to: "/applicant_list", icon: <SchoolIcon fontSize="large" /> },
      { label: "Applicant Form", to: "/registrar_dashboard1", icon: <AssignmentIcon fontSize="large" /> },
      { label: "Student Requirements", to: "/registrar_requirements", icon: <AssignmentTurnedInIcon fontSize="large" /> },
      { label: "Qualifying / Interview Exam Score", to: "/qualifying_interview_exam_scores", icon: <ScoreIcon fontSize="large" /> },
      { label: "Student Numbering", to: "/student_numbering_per_college", icon: <DashboardIcon fontSize="large" /> },
      { label: "Course Tagging", to: "/course_tagging", icon: <MenuBookIcon fontSize="large" /> },
      { label: "Certificate of Registration", to: "/search_cor_for_college", icon: <SearchIcon fontSize="large" /> },
  
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentData, setStudentData] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 9) {
      setSelectedStudent(null);
      setStudentData([]);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/program_evaluation/${searchQuery}`);
        const data = await res.json();


        if (data) {
          setSelectedStudent(data);
          setStudentData(data);

          if (searchQuery) {
            localStorage.setItem("admin_edit_person_id", searchQuery);
          }

          const detailsRes = await fetch(`${API_BASE_URL}/api/program_evaluation/details/${searchQuery}`);
          const detailsData = await detailsRes.json();
          if (Array.isArray(detailsData) && detailsData.length > 0) {
            setStudentDetails(detailsData);
          } else {
            setStudentDetails([]);
            setSnackbarMessage("No enrolled subjects found for this student.");
            setOpenSnackbar(true);
          }
        } else {
          setSelectedStudent(null);
          setStudentData([]);
          setStudentDetails([]);
          setSnackbarMessage("No student data found.");
          setOpenSnackbar(true);
        }
      } catch (err) {
        console.error("Error fetching student", err);
        setSnackbarMessage("Server error. Please try again.");
        localStorage.removeItem("admin_edit_person_id");
        setOpenSnackbar(true);
      }
    };

    fetchStudent();
  }, [searchQuery]);


  const handleStepClick = (index, to) => {
    setActiveStep(index);

    const pid = localStorage.getItem("admin_edit_person_id");
    console.log(pid);
    if (pid && pid !== "undefined" && pid !== "null" && pid.length >= 9) {
      navigate(`${to}?student_number=${pid}`);
    } else {
      navigate(to);
    }
  };

  useEffect(() => {
    const storedId = localStorage.getItem("admin_edit_person_id");

    if (storedId && storedId !== "undefined" && storedId !== "null" && storedId.length >= 9) {
      setSearchQuery(storedId);
    }
  }, []);



  const [studentNumber, setStudentNumber] = useState(() => {
    return localStorage.getItem("studentNumberForCOR") || localStorage.getItem("admin_edit_person_id") || "";
  });
  const [debouncedStudentNumber, setDebouncedStudentNumber] = useState("");


  const divToPrintRef = useRef();

  const printDiv = () => {
    const divToPrint = divToPrintRef.current;
    if (divToPrint) {
      const newWin = window.open('', 'Print-Window');
      newWin.document.open();
      newWin.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }

            html, body {
              margin: 0;
              padding: 0;
              width: 210mm;
              height: 297mm;
            
              font-family: Arial, sans-serif;
              overflow: hidden;
            }

            .print-container {
              width: 110%;
              height: 100%;

              box-sizing: border-box;
   
              transform: scale(0.90);
              transform-origin: top left;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            button {
              display: none;
            }

            .student-table {
              margin-top: -15px !important;
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 100);">
          <div class="print-container">
            ${divToPrint.innerHTML}
          </div>
        </body>
      </html>
    `);
      newWin.document.close();
    } else {
      console.error("divToPrintRef is not set.");
    }
  };

  useEffect(() => {
    if (studentNumber.trim().length >= 9) { // adjust min length if needed
      const delayDebounce = setTimeout(() => {
        setDebouncedStudentNumber(studentNumber);
      }, 500); // half-second debounce

      return () => clearTimeout(delayDebounce);
    }
  }, [studentNumber]);

  useEffect(() => {
    if (studentNumber) {
      localStorage.removeItem("studentNumberForCOR");
    }
  }, [studentNumber]);

  // Put this at the very bottom before the return 
  if (loading || hasAccess === null) {
   return <LoadingOverlay open={loading} message="Loading..." />;
  }

  if (!hasAccess) {
    return (
      <Unauthorized />
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', overflowY: 'auto', position: "relative", paddingRight: 1, backgroundColor: 'transparent' }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",

          mb: 2,

        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: titleColor,
            fontSize: "36px",
          }}
        >
          SEARCH CERTIFICATE OF REGISTRATION
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Enter Student Number"
          size="small"
          value={studentNumber}

          onChange={(e) => setStudentNumber(e.target.value)}
          sx={{
            width: 450,
            backgroundColor: "#fff",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
            },
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          }}
        />
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />
      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table>
          <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2", border: `2px solid ${borderColor}`, }}>
            <TableRow>
              {/* Left cell: Student Number */}
              <TableCell sx={{ color: 'white', fontSize: '20px', fontFamily: 'Arial Black', border: 'none' }}>
                Student Number:&nbsp;
                <span style={{ fontFamily: "Arial", fontWeight: "normal", textDecoration: "underline" }}>
                  {studentData.student_number || "N/A"}

                </span>
              </TableCell>

              {/* Right cell: Student Name */}
              <TableCell
                align="right"
                sx={{ color: 'white', fontSize: '20px', fontFamily: 'Arial Black', border: 'none' }}
              >
                Student Name:&nbsp;
                <span style={{ fontFamily: "Arial", fontWeight: "normal", textDecoration: "underline" }}>
                  {studentData && studentData.last_name
                    ? `${studentData.last_name.toUpperCase()}, ${studentData.first_name.toUpperCase()} ${studentData.middle_name.toUpperCase()}`
                    : "N/A"}
                </span>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <br />


      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mt: 2,
        }}
      >
        {tabs1.map((tab, index) => (
          <React.Fragment key={index}>
            {/* Step Card */}
            <Card
              onClick={() => handleStepClick(index, tab.to)}
              sx={{
                flex: 1,
                maxWidth: `${100 / tabs1.length}%`, // evenly fit 100%
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                borderRadius: 2,
                border: `2px solid ${borderColor}`,
                backgroundColor: activeStep === index ? settings?.header_color || "#1976d2" : "#E8C999",
                color: activeStep === index ? "#fff" : "#000",
                boxShadow:
                  activeStep === index
                    ? "0px 4px 10px rgba(0,0,0,0.3)"
                    : "0px 2px 6px rgba(0,0,0,0.15)",
                transition: "0.3s ease",
                "&:hover": {
                  backgroundColor: activeStep === index ? "#000000" : "#f5d98f",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box sx={{ fontSize: 32, mb: 0.5 }}>{tab.icon}</Box>
                <Typography
                  sx={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}
                >
                  {tab.label}
                </Typography>
              </Box>
            </Card>

            {/* Spacer instead of line */}
            {index < tabs1.length - 1 && (
              <Box
                sx={{
                  flex: 0.1,
                  mx: 1, // margin to keep spacing
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>


      <br />

      <button
        onClick={printDiv}
        style={{
          marginBottom: "1rem",
          padding: "10px 20px",
          border: "2px solid black",
          backgroundColor: "#f0f0f0",
          color: "black",
          borderRadius: "5px",
          marginTop: "20px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          transition: "background-color 0.3s, transform 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#d3d3d3")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
        onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FcPrint size={20} />
          Print Certificate of Grades
        </span>
      </button>

      <CertificateOfRegistration ref={divToPrintRef} student_number={debouncedStudentNumber} />
    </Box>
  );
};

export default SearchCertificateOfRegistration;
