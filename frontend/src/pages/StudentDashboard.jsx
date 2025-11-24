import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";

import '../styles/TempStyles.css';
import axios from 'axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Avatar,
  Tooltip
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import CertificateOfRegistration from "../student/CertificateOfRegistration";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import API_BASE_URL from "../apiConfig";

const StudentDashboard = ({ profileImage, setProfileImage }) => {
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

  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);
  const [personData, setPerson] = useState({
    student_number: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    profile_image: '',
    student_status: '',
  });
  const [studentDetails, setStudent] = useState({
    program_description: '',
    section_description: '',
    program_code: '',
    year_level: '',
  });
  const [sy, setActiveSY] = useState({
    current_year: '',
    next_year: '',
    semester_description: ''
  });
  const [courseCount, setCourseCount] = useState({
    initial_course: 0,
    passed_course: 0,
    failed_course: 0,
    inc_course: 0,
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole !== "student") {
        window.location.href = "/faculty_dashboard";
      } else {
        fetchPersonData(storedID);
        fetchStudentDetails(storedID);
        fetchTotalCourse(storedID);
        console.log("you are an student");
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchPersonData = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/student/${id}`);
      setPerson(res.data);
    } catch (error) {
      console.error(error)
    }
  };

  const fetchTotalCourse = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/course_count/${id}`);
      console.log("course count:", res.data);
      setCourseCount(res.data || { initial_course: 0 });
    } catch (error) {
      console.error(error)
    }
  };

  const fetchStudentDetails = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/student_details/${id}`);
      setStudent(res.data);
    } catch (error) {
      console.error(error)
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/active_school_year`)
      .then((res) => setActiveSY(res.data[0] || {}))
      .catch((err) => console.error(err));
  }, []);

  // Course status value
  const passed = courseCount?.passed_course || 0;
  const failed = courseCount?.failed_course || 0;
  const incomplete = courseCount?.inc_course || 0;
  const total = courseCount?.initial_course || 0;

  // percentages (normalize values to 0–100)
  const passedPercent = total > 0 ? (passed / total) * 100 : 0;
  const failedPercent = total > 0 ? (failed / total) * 100 : 0;
  const incompletePercent = total > 0 ? (incomplete / total) * 100 : 0;

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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
              margin-top: 5px !important;
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

  const [openImage, setOpenImage] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const role = localStorage.getItem("role"); // ✅ get the current user role

        const res = await axios.get(
          `${API_BASE_URL}/api/announcements?role=${role}`
        );

        setAnnouncements(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const person_id = localStorage.getItem("person_id");
      const role = localStorage.getItem("role");

      // ✅ Get user_account_id
      const res = await axios.get(
        `${API_BASE_URL}/api/get_user_account_id/${person_id}`
      );

      const user_account_id = res.data.user_account_id;

      const formData = new FormData();

      formData.append("profile_picture", file);

      // ✅ Upload image using same backend API
      await axios.post(
        `${API_BASE_URL}/update_student/${user_account_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Refresh profile info to display the new image
      const updated = await axios.get(
        `${API_BASE_URL}/api/person_data/${person_id}/${role}`
      );

      setPerson(updated.data.profile_image);
      const baseUrl = `${API_BASE_URL}/uploads/${updated.data.profile_image}`;
      setProfileImage(`${baseUrl}?t=${Date.now()}`);
    } catch (error) {
      console.error("❌ Upload failed:", error);
    }
  }


  return (
    <Box sx={{ p: 4, marginLeft: "-2rem", paddingRight: 8, height: "calc(100vh - 150px)", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ display: "none" }}>
        <CertificateOfRegistration ref={divToPrintRef} student_number={String(personData.student_number || '')} />
      </div>

      <Grid container spacing={3}>
        {/* Student Information */}
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: 1, boxShadow: 3, p: 1, border: `2px solid ${borderColor}`, height: "260px", transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 6,

            },
            marginLeft: "10px"
          }}>
            <CardContent>
              {/* Header Row */}
              <Stack
                direction="row"
                alignItems="center"

                justifyContent="space-between" // Pushes date to right
                mb={2}
              >
                {/* Left side: Avatar + Name */}
                <Stack direction="row" alignItems="center" spacing={2}>
                  {!personData?.profile_image ? (
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
                        src={profileImage || `${API_BASE_URL}/uploads/${personData?.profile_image}`}
                        alt={personData?.fname}
                        sx={{
                          width: 90,
                          height: 90,
                          border: `2px solid ${borderColor}`,
                          cursor: "pointer",
                          mt: -1.5,
                        }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        {personData?.fname?.[0]}
                      </Avatar>

                      {hovered && (
                        <label
                          onClick={() => fileInputRef.current.click()}
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            right: "0px",
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
                    <Typography variant="h4" fontWeight="bold" sx={{ color: titleColor, }}>
                      Welcome back! {personData.last_name}, {personData.first_name} {personData.middle_name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Student No. : {personData.student_number}
                    </Typography>
                  </Box>
                </Stack>

                {/* Right side: Date */}
                <Typography
                  variant="body3"
                  color="#000000"
                  sx={{ fontWeight: 500, marginTop: "-10px" }}
                >
                  Date: {formattedDate}
                </Typography>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Student Details */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Program
                  </Typography>
                  <Typography fontWeight={500}>
                    {studentDetails.program_description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    School Year
                  </Typography>
                  <Typography fontWeight={500}>
                    {sy.current_year}-{sy.next_year}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Typography fontWeight={500}>{personData.student_status}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Year Level
                  </Typography>
                  <Typography fontWeight={500}>{studentDetails.year_level}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Semester
                  </Typography>
                  <Typography fontWeight={500}>{sy.semester_description}</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Section
                  </Typography>
                  <Typography fontWeight={500}>
                    {studentDetails.program_code}-{studentDetails.section_description}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>



        <Grid
          container
          spacing={2}
          sx={{
            width: "100%",
            margin: 0,
            marginLeft: "17px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "nowrap",
          }}
        >
          {/* Calendar */}
          <Grid item sx={{ flex: "1 1 33%" }}>
            <Card
              sx={{
                border: `2px solid ${borderColor}`,
                boxShadow: 3,
                p: 2,
                height: "400px", // ✅ fixed height
                display: "flex",
                borderRadius: "10px",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "scale(1.03)" },
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <CardContent sx={{ p: 0, width: "100%" }}>
                {/* Header with month + year + arrows */}
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    backgroundColor: settings?.header_color || "#1976d2",
                    color: "white",
                    border: `2px solid ${borderColor}`,
                    borderBottom: "none",
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
                    borderBottom: `2px solid ${borderColor}`,
                    borderTop: `2px solid ${borderColor}`,
                    borderRadius: "0 0 8px 8px",
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

                      const isToday = day === today && month === thisMonth && year === thisYear;
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


          {/* Donut Chart */}
          <Grid item sx={{ flex: "1 1 33%", }}>
            <Card
              sx={{
                border: `2px solid ${borderColor}`,
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.2s ease",
                boxShadow: 3,
                "&:hover": { transform: "scale(1.03)" },
                p: 2,
                height: "400px",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  Course Status
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",

                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <svg width="200" height="200" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#eee" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="green"
                      strokeWidth="3"
                      strokeDasharray={`${passedPercent} ${100 - passedPercent}`}
                      strokeDashoffset="25"
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="red"
                      strokeWidth="3"
                      strokeDasharray={`${failedPercent} ${100 - failedPercent}`}
                      strokeDashoffset={25 - passedPercent}
                    />
                    <circle
                      cx="18"
                      cy="18"
                      r="15.9155"
                      fill="none"
                      stroke="orange"
                      strokeWidth="3"
                      strokeDasharray={`${incompletePercent} ${100 - incompletePercent}`}
                      strokeDashoffset={25 - passedPercent - failedPercent}
                    />
                    <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="4">
                      {courseCount.initial_course} Courses
                    </text>
                  </svg>
                </Box>

                <Stack direction="row" spacing={3} justifyContent="center">
                  <Typography sx={{ fontSize: "14px" }} color="success.main">
                    Passed: {passed}
                  </Typography>
                  <Typography sx={{ fontSize: "14px" }} color="error.main">
                    Failed: {failed}
                  </Typography>
                  <Typography sx={{ fontSize: "14px" }} color="warning.main">
                    Incomplete: {incomplete}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={3} justifyContent="center">
                  <Typography sx={{ fontSize: "14px", width: "125px" }}>
                    Completed: 0
                  </Typography>
                  <Typography sx={{ fontSize: "14px", width: "150px" }}>
                    Ongoing: 11
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Announcements */}
          <Grid item sx={{ flex: "1 1 33%" }}>
            <Card
              sx={{
                borderRadius: 3,
                marginLeft: "10px",
                boxShadow: 3,
                p: 2,
                height: "400px",
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
              <CardContent sx={{ width: "100%" }}>
                <Typography sx={{ textAlign: "center" }} variant="h6" gutterBottom>
                  Announcements
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {announcements.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    No active announcements.
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: 260, overflowY: "auto" }}>
                    {announcements.map((a) => (
                      <Box
                        key={a.id}
                        sx={{
                          mb: 2,
                          p: 1,
                          width: "100%",
                          borderRadius: 2,
                          border: `2px solid ${borderColor}`,
                          backgroundColor: "#fff8f6",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ color: "maroon", fontWeight: "bold" }}>
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
                                maxHeight: "120px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                marginBottom: "6px",
                                cursor: "pointer",
                              }}
                              onClick={() => setOpenImage(`${API_BASE_URL}/uploads/${a.file_path}`)}
                            />

                            <Dialog
                              open={Boolean(openImage)}
                              onClose={() => setOpenImage(null)}
                              fullScreen
                              PaperProps={{
                                style: {
                                  backgroundColor: "transparent",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "relative",
                                  boxShadow: "none",
                                  cursor: "pointer",
                                },
                              }}
                            >
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
                                  zIndex: 2,
                                  "&:hover": { backgroundColor: "#f5f5f5" },
                                }}

                              >
                                <KeyboardBackspaceIcon sx={{ fontSize: 50, color: "black" }} />
                              </IconButton>

                              <Box
                                onClick={(e) => e.stopPropagation()}
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
        </Grid>
      </Grid>

      <Grid container spacing={5} sx={{ mt: "-20px" }}>
        {/* Certificate of Registration */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              display: "flex",
              marginLeft: "10px",
              flexDirection: "column",
              border: `2px solid ${borderColor}`,
              backgroundColor: "#fffaf5",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 170,
              width: "100%",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <SchoolIcon sx={{ color: subtitleColor, }} fontSize="large" />
              <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
                Certificate of Registration
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{ backgroundColor: settings?.header_color || "#1976d2", }}
                onClick={printDiv}
              >
                Download (Student's Copy)
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Fees */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              border: `2px solid ${borderColor}`,
              backgroundColor: "#fffaf5",
              minHeight: 170,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
              width: "100%",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fees
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>


    </Box >
  );
};

export default StudentDashboard;