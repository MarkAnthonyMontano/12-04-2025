import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Card,
  TableBody,
  Paper,
  TableContainer,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { FcPrint } from "react-icons/fc";
import EaristLogo from "../assets/EaristLogo.png";
import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PeopleIcon from "@mui/icons-material/People";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import SearchIcon from "@mui/icons-material/Search";
import KeyIcon from "@mui/icons-material/Key";
import API_BASE_URL from "../apiConfig";
import CampaignIcon from '@mui/icons-material/Campaign';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const ProctorApplicantList = () => {
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

  const words = companyName.trim().split(" ");
  const middle = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, middle).join(" ");
  const secondLine = words.slice(middle).join(" ");


  const location = useLocation();

  const tabs = [


    { label: "Room Registration", to: "/room_registration", icon: <KeyIcon fontSize="large" /> },
    { label: "Entrance Exam Room Assignment", to: "/assign_entrance_exam", icon: <MeetingRoomIcon fontSize="large" /> },
    { label: "Entrance Exam Schedule Management", to: "/assign_schedule_applicant", icon: <ScheduleIcon fontSize="large" /> },
    { label: "Proctor's Applicant List", to: "/proctor_applicant_list", icon: <PeopleIcon fontSize="large" /> },
    { label: "Announcement", to: "/announcement_for_admission", icon: <CampaignIcon fontSize="large" /> },




  ];

  // Also put it at the very top
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);


  const pageId = 33;

  const removeExamApplicant = async (applicant_number) => {
    if (!window.confirm("Remove applicant from exam schedule?")) return;

    try {
      await axios.put(`${API_BASE_URL}/api/exam/remove_applicant`, {
        applicant_id: applicant_number
      });

      handleSearch(); // refresh table after removal
    } catch (error) {
      console.error("Error removing applicant:", error);
    }
  };

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
  const [activeStep, setActiveStep] = useState(3);
  const [clickedSteps, setClickedSteps] = useState(Array(tabs.length).fill(false));


  const handleStepClick = (index, to) => {
    setActiveStep(index);
    navigate(to); // this will actually change the page
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [proctor, setProctor] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [person, setPerson] = useState({
    campus: "",
    last_name: "",
    first_name: "",
    middle_name: "",
    program: "",
    extension: "",


  });

  const handleSearchByProctor = async (proctorName, scheduleID) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/proctor-applicants`,
        {
          params: { query: proctorName, schedule_id: scheduleID }
        }
      );

      setProctor(data[0]?.schedule || null);
      setApplicants(data[0]?.applicants || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/proctor-applicants`,
        { params: { query: searchQuery } }
      );
      setProctor(data[0]?.schedule || null); // first schedule if multiple
      setApplicants(data[0]?.applicants || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const proctorParam = params.get("proctor");
    const scheduleParam = params.get("schedule");

    if (proctorParam) {
      setSearchQuery(proctorParam);
      handleSearchByProctor(proctorParam, scheduleParam);
    }
  }, [location.search]);

  const [curriculumOptions, setCurriculumOptions] = useState([]);

  useEffect(() => {
    const fetchCurriculums = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/applied_program`);
        console.log("✅ curriculumOptions:", response.data); // <--- add this
        setCurriculumOptions(response.data);
      } catch (error) {
        console.error("Error fetching curriculum options:", error);
      }
    };

    fetchCurriculums();
  }, []);

  const printDiv = () => {
    const newWin = window.open("", "Print-Window");
    newWin.document.open();

    const logoSrc = fetchedLogo || EaristLogo;
    const name = companyName?.trim() || "No Company Name Available";

    const words = name.split(" ");
    const middleIndex = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, middleIndex).join(" ");
    const secondLine = words.slice(middleIndex).join(" ");

    const address = settings?.campus_address || settings?.address || "No address set in Settings";
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const borderColor = "black"; // table border color
    const headerColor = settings?.header_color || "#1976d2"; // dynamic header color

    const htmlContent = `
<html>
  <head>
    <title>Proctor Applicant List</title>
    <style>
      @page { size: A4 landscape; margin: 5mm; }
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      .print-container { display: flex; flex-direction: column; align-items: center; text-align: center; }
      .print-header img { position: absolute; left: 0; margin-left: 10px; width: 90px; height: 90px; border-radius: 50%; object-fit: cover; }
      .print-header div { font-size: 12px; }
      b.header-title { font-size: 18px !important; }
      table { border-collapse: collapse; width: 100%; margin-top: 10px; }
      th, td { border: 1px solid ${borderColor}; padding: 3px 4px; font-size: 10px; line-height: 1.1; }
      th { text-align: center; background-color: ${headerColor}; color: white; }
      th:nth-child(1) { width: 3%; }
      th:nth-child(2) { width: 10%; }
      th:nth-child(3) { width: 25%; }
      th:nth-child(4) { width: 25%; }
      th:nth-child(5) { width: 10%; }
    </style>
  </head>
  <body onload="window.print(); setTimeout(() => window.close(), 100);">
    <div class="print-container">
      <div class="print-header">
        <img src="${logoSrc}" alt="School Logo" />
        <div>
          <div>Republic of the Philippines</div>
          <b style="letter-spacing:1px; font-size:22px; font-family:'Times New Roman', serif;">${firstLine}</b>
          ${secondLine ? `<div style="letter-spacing:1px; font-size:22px; font-family:'Times New Roman', serif;"><b>${secondLine}</b></div>` : ""}
          <div style="font-size:12px;">${address}</div>
          <div style="margin-top:25px;"><b style="font-size:22px; letter-spacing:1px;">Proctor Applicant List</b></div>
        </div>
      </div>

      <div style="margin-top:20px; width:100%; display:flex; flex-direction:column; gap:8px;">
        <div style="display:flex; justify-content:space-between; width:100%;">
          <span><b>Proctor:</b> ${proctor?.proctor || "N/A"}</span>
          <span><b>Building:</b> ${proctor?.building_description || "N/A"}</span>
        </div>
        <div style="display:flex; justify-content:space-between; width:100%;">
          <span><b>Room:</b> ${proctor?.room_description || "N/A"}</span>
          <span><b>Schedule:</b>
            ${formatDateLong(proctor?.day_description) || ""} |
            ${proctor?.start_time ? new Date("1970-01-01T" + proctor.start_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : ""} -
            ${proctor?.end_time ? new Date("1970-01-01T" + proctor.end_time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }) : ""}
          </span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Applicant #</th>
            <th>Applicant Name</th>
            <th>Program</th>
            <th>Signature</th>
          </tr>
        </thead>
        <tbody>
          ${applicants.map((a, index) => {
      const programItem = curriculumOptions.find(item => item.curriculum_id?.toString() === a.program?.toString());
      const program = programItem ? `(${programItem.program_code}) - ${programItem.program_description} ${programItem.major || ""}` : "N/A";
      return `
            <tr>
              <td>${index + 1}</td>
              <td>${a.applicant_number}</td>
              <td>${a.last_name}, ${a.first_name} ${a.middle_name || ""}</td>
              <td>${program}</td>
              <td></td>
            </tr>`;
    }).join("")}
          <tr>
            <td colspan="5" style="text-align:right; font-weight:bold;">Total Applicants: ${applicants.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
`;

    newWin.document.write(htmlContent);
    newWin.document.close();
  };


  // 🔎 Auto-search whenever searchQuery changes (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() !== "") {
        handleSearch();
      } else {
        setApplicants([]); // clear results if empty search
        setProctor(null);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const formatDateLong = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // fallback if invalid date

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };




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
    <Box sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto', pr: 1, }}>
      {/* Header with Search aligned right */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
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
          PROCTOR APPLICANT LIST
        </Typography>

        <TextField
          variant="outlined"
          placeholder="Search Proctor Name / Email"
          size="small"

          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // reset page when searching
            handleSearch(); // 🔍 auto-search as you type
          }}
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap", // ❌ prevent wrapping
          width: "100%",
          mt: 1,
          gap: 2,
        }}
      >
        {tabs.map((tab, index) => (
          <Card
            key={index}
            onClick={() => handleStepClick(index, tab.to)}
            sx={{
              flex: `1 1 ${100 / tabs.length}%`, // evenly divide row
              height: 135,
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
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ fontSize: 40, mb: 1 }}>{tab.icon}</Box>
              <Typography sx={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}>
                {tab.label}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <br />
      {proctor && (
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",

            mb: 2,
            fontSize: "16px",
          }}
        >
          <span><b>Proctor:</b> {proctor.proctor || "N/A"} |{" "}</span>
          <span><b>Building:</b> {proctor.building_description || "N/A"} |{" "}</span>
          <span><b>Room:</b> {proctor.room_description || "N/A"} |{" "}</span>
          <span><b>Schedule:</b> {formatDateLong(proctor?.day_description)} |{" "}</span>

          <span><b>Time: </b>
            {proctor.start_time
              ? new Date(`1970-01-01T${proctor.start_time}`).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              : ""}{" "}
            -{" "}
            {proctor.end_time
              ? new Date(`1970-01-01T${proctor.end_time}`).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
              : ""}
          </span>
        </Box>
      )}


      {applicants.length > 0 && (
        <Button
          onClick={printDiv}
          variant="outlined"
          sx={{
            padding: "5px 20px",
            border: "2px solid black",
            backgroundColor: "#f0f0f0",
            color: "black",
            borderRadius: "5px",
            fontSize: "14px",
            fontWeight: "bold",
            height: "40px",
            display: "flex",
            alignItems: "center",
            gap: 1, // 8px gap between icon and text
            userSelect: "none",
            transition: "background-color 0.3s, transform 0.2s",
            "&:hover": {
              backgroundColor: "#d3d3d3",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
          startIcon={<FcPrint size={20} />}
        >
          Print Applicant List
        </Button>

      )}
      <br />

      {/* TableContainer */}
      {applicants.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", textAlign: "center", border: `2px solid ${borderColor}` }}>#</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center", border: `2px solid ${borderColor}` }}>Applicant</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center", border: `2px solid ${borderColor}` }}>Name</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center", border: `2px solid ${borderColor}` }}>Program</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center", border: `2px solid ${borderColor}` }}>Building</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center", border: `2px solid ${borderColor}` }}>Room</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center", border: `2px solid ${borderColor}` }}>Action</TableCell>

              </TableRow>
            </TableHead>

            <TableBody>
              {applicants.map((a, idx) => (
                <TableRow key={idx}>
                  <TableCell align="center" sx={{ border: `2px solid ${borderColor}` }}>{idx + 1}</TableCell>
                  <TableCell align="left" sx={{ border: `2px solid ${borderColor}` }}>{a.applicant_number}</TableCell>
                  <TableCell align="left" sx={{ border: `2px solid ${borderColor}` }}>
                    {`${a.last_name}, ${a.first_name} ${a.middle_name || ""}`}
                  </TableCell>
                  <TableCell align="left" sx={{ border: `2px solid ${borderColor}` }}>
                    {(() => {
                      const item = curriculumOptions.find(
                        (x) => x.curriculum_id?.toString() === a.program?.toString()
                      );

                      return item
                        ? `(${item.program_code}) - ${item.program_description} ${item.major || ""}`
                        : "N/A";
                    })()}
                  </TableCell>

                  <TableCell align="left" sx={{ border: `2px solid ${borderColor}` }}>
                    {a.building_description || proctor?.building_description || "N/A"} {/* ✅ NEW */}
                  </TableCell>
                  <TableCell align="left" sx={{ border: `2px solid ${borderColor}` }}>
                    {a.room_description || proctor?.room_description || "N/A"} {/* ✅ NEW */}
                  </TableCell>
                  <TableCell align="center" sx={{ border: `2px solid ${borderColor}` }}>
                    <IconButton
                      color="error"
                      onClick={() => removeExamApplicant(a.applicant_number)}
                      sx={{
                        backgroundColor: "#ffebee",
                        border: "2px solid red",
                        "&:hover": { backgroundColor: "#ffcdd2" },
                        borderRadius: "8px",
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>

          </Table>
        </TableContainer>

      )}
    </Box>
  );
};

export default ProctorApplicantList;