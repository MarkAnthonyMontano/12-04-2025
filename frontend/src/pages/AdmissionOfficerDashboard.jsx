import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Button,
  FormControl,
  IconButton,
  Select,
  InputLabel,
  Avatar,
  Stack,
  Divider,
  Paper,
  Tooltip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import API_BASE_URL from "../apiConfig";
import EaristLogo from "../assets/EaristLogo.png";
const AdmissionOfficerDashboard = ({ profileImage, setProfileImage }) => {

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


  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [professorCount, setProfessorCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [studentCount, setStudentCount] = useState(0);
  const [yearLevelCounts, setYearLevelCounts] = useState([]);
  const [years, setYears] = useState("2025");
  const [months, setMonths] = useState("January");


  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW access map
  const [userAccessList, setUserAccessList] = useState({});

  const pageId = 108; // SYSTEM MANAGEMENT



  // Load user & access
  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("person_id");
    const empID = localStorage.getItem("employee_id");

    if (email && role && id && empID) {
      setUserRole(role);
      setUserID(id);
      setEmployeeID(empID);

      if (role === "registrar") {
        checkAccess(empID);
        fetchUserAccessList(empID);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const checkAccess = async (employeeID) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/page_access/${employeeID}/${pageId}`
      );
      setHasAccess(response.data?.page_privilege === 1);
    } catch (error) {
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAME access list logic as Admission
  const fetchUserAccessList = async (employeeID) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/page_access/${employeeID}`
      );

      const accessMap = data.reduce((acc, item) => {
        acc[item.page_id] = item.page_privilege === 1;
        return acc;
      }, {});

      setUserAccessList(accessMap);
    } catch (err) {
      console.error("Access list failed:", err);
    }
  };



  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole !== "registrar") {
        window.location.href = "/applicant_dashboard";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/enrolled-count`)
      .then(res => setEnrolledCount(res.data.total))
      .catch(err => console.error("Failed to fetch enrolled count", err));

    axios.get(`${API_BASE_URL}/api/professors`)
      .then(res => setProfessorCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(err => console.error("Failed to fetch professor count", err));

    axios.get(`${API_BASE_URL}/api/accepted-students-count`)
      .then(res => setAcceptedCount(res.data.total))
      .catch(err => console.error("Failed to fetch accepted count", err));

    axios.get(`${API_BASE_URL}/api/departments`)
      .then(res => setDepartments(res.data))
      .catch(err => console.error("Failed to fetch departments", err));
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      axios.get(`${API_BASE_URL}/statistics/student_count/department/${selectedDepartment}`)
        .then(res => setStudentCount(res.data.count))
        .catch(err => console.error("Failed to fetch student count", err));

      axios.get(`${API_BASE_URL}/statistics/student_count/department/${selectedDepartment}/by_year_level`)
        .then(res => setYearLevelCounts(res.data))
        .catch(err => console.error("Failed to fetch year level counts", err));
    }
  }, [selectedDepartment]);

  const [registrarCount, setRegistrarCount] = useState(0);

  useEffect(() => {
    const fetchRegistrarCount = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/registrar_count`);
        setRegistrarCount(res.data.count || 0);
      } catch (error) {
        console.error("Error fetching registrar count:", error);
      }
    };
    fetchRegistrarCount();
  }, []);

  const stats = [
    {
      label: "Total Applicants",
      value: enrolledCount,
      icon: <GroupIcon fontSize="large" />,
      color: "#F6D167", // soft yellow
    },
    {
      label: "Enrolled Students",
      value: acceptedCount,
      icon: <SchoolIcon fontSize="large" />,
      color: "#84B082", // green
    },
    {
      label: "Professors",
      value: professorCount,
      icon: <PersonIcon fontSize="large" />,
      color: "#A3C4F3", // blue
    },
    {
      label: "Total Registrar",
      value: registrarCount,
      icon: <AdminPanelSettingsIcon fontSize="large" />, // new icon
      color: "#FFD8A9", // light orange
    },
  ];

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


  const [monthlyApplicants, setMonthlyApplicants] = useState([]);


  // After fetching monthlyApplicants from API
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/applicants-per-month`)
      .then((res) => {
        const currentYear = new Date().getFullYear();

        // Build an array for all 12 months of the current year
        const months = Array.from({ length: 12 }, (_, i) => {
          const month = String(i + 1).padStart(2, "0"); // 01 → 12
          return `${currentYear}-${month}`;
        });

        // Merge API data with all months
        const filledData = months.map((m) => {
          const found = res.data.find((item) => item.month === m);
          return found ? found : { month: m, total: 0 };
        });

        setMonthlyApplicants(filledData);
      })
      .catch((err) =>
        console.error("Failed to fetch applicants per month", err)
      );
  }, []);


  const [personData, setPersonData] = useState(null);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const person_id = localStorage.getItem("person_id");
    const role = localStorage.getItem("role");

    if (person_id && role) {
      axios
        .get(`${API_BASE_URL}/api/person_data/${person_id}/${role}`)
        .then((res) => setPersonData(res.data))
        .catch((err) => console.error("Failed to fetch person data:", err));
    }
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // ✅ Get the logged-in role (registrar, admin, etc.)
      const role = localStorage.getItem("role");

      // ✅ Get the registrar’s user_account_id using person_id
      const accountRes = await axios.get(
        `${API_BASE_URL}/api/get_user_account_id/${personData.person_id}`
      );
      const user_account_id = accountRes.data.user_account_id;

      const formData = new FormData();
      formData.append("profile_picture", file);

      // ✅ Use your backend route
      await axios.post(
        `${API_BASE_URL}/update_registrar/${user_account_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Refresh the data (using correct role)
      const refreshed = await axios.get(
        `${API_BASE_URL}/api/person_data/${personData.person_id}/${role}`
      );
      setPersonData(refreshed.data);

      const baseUrl = `${API_BASE_URL}/uploads/${refreshed.data.profile_image}`;
      setProfileImage(`${baseUrl}?t=${Date.now()}`);

      console.log("✅ Profile updated successfully!");
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };



  if (loading || hasAccess === null)
    return <LoadingOverlay open={loading} message="Checking Access..." />;

  if (!hasAccess) return <Unauthorized />;


const EARIST_COLORS = {
  maroon: "#800000",
  cream: "#FFF4D6",
  lightCream: "#FAF3E0",
  gold: "#D4A017",
  cardBg: "#FFFFFF",
  softGray: "#f5f7fa"
};

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
        <Grid item xs={12}>
          <Card
            sx={{
              border: `2px solid ${borderColor}`,
              boxShadow: 3,
              height: "140px",
              marginLeft: "10px",
              backgroundColor: "#fff9ec",
              p: 2,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ borderRadius: "14px" }}>

                {/* 👤 Left Section - Avatar + Welcome */}
                <Box display="flex" alignItems="center">

                  {/* Avatar */}
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
                          bottom: "-5px",
                          right: 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          backgroundColor: "#ffffff",
                          border: `2px solid ${borderColor}`,
                          width: "36px",
                          height: "36px",
                        }}
                      >
                        <AddCircleIcon
                          sx={{
                            color: settings?.header_color || "#1976d2",
                            fontSize: 32,
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

                  {/* Welcome text and Employee info */}
                  <Box sx={{ color: titleColor, }}>
                    <Typography variant="h4" fontWeight="bold" mt={-1}>
                      Welcome back!  {personData
                        ? `${personData.lname}, ${personData.fname} ${personData.mname || ""}`
                        : ""}
                    </Typography>

                    <Typography variant="body1" color="black" fontSize={20}>
                      <b>Employee ID:</b> {personData?.employee_id || "N/A"}
                    </Typography>
                  </Box>
                </Box>

                {/* 📅 Right Section - Date */}
                <Box textAlign="right" sx={{ color: "black" }}>
                  <Typography variant="body1" fontSize="20px">
                    {formattedDate}
                  </Typography>
                </Box>

              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box style={{ display: "flex" }}>
        <Box>
          <Card
            sx={{
              width: 400,
              height: 280,
              marginTop: 2.5,
              marginLeft: 1.1,
        border: `2px solid ${borderColor}`,
              borderRadius: 3,
              p: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ textAlign: "center", color: subtitleColor, marginBottom: "1rem" }}
            >
              ECAT Monitoring Panel
            </Typography>

            <Grid container spacing={1} sx={{ px: 1 }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    background: "#f5f7fa",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600}>Registered Applicants:</Typography>
                  <Typography>240</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    background: "#f5f7fa",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600}>Scheduled Applicants:</Typography>
                  <Typography>120</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    background: "#f5f7fa",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600}>Pending Schedule:</Typography>
                  <Typography>120</Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1,
                    background: "#f5f7fa",
                    borderRadius: 2,
                  }}
                >
                  <Typography fontWeight={600}>Completed Exam:</Typography>
                  <Typography>13</Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
          <Card
            sx={{
              width: 400,
              height: 300,
              marginTop: 2.5,
              marginLeft: 1.1,
         border: `2px solid ${borderColor}`,
              borderRadius: 3,
              p: 2,
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              background: "#ffffff",
            }}
          >
            {/* Title */}
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ textAlign: "center", color: subtitleColor, mb: 3 }}
            >
              Admission Create
            </Typography>

            {/* Buttons Container */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                px: 4,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                fullWidth
                sx={{ textTransform: "none", py: 1.5, fontSize: "18px", background: mainButtonColor }}
              >
                Announcement
              </Button>

              <Button
                variant="contained"
                fullWidth
                sx={{ textTransform: "none", py: 1.5, fontSize: "18px", background: mainButtonColor }}
              >
                Room Registration
              </Button>
            </Box>
          </Card>
        </Box>

        <Card
          sx={{
            width: 600,
            height: 600,
            marginTop: 2.5,
            marginLeft: 2.1,
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            background: "#ffffff",
 border: `2px solid ${borderColor}`,
          }}
        >
          {/* Header Row: Title + Filters */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color={subtitleColor}>
              Applicant Overview
            </Typography>

            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Year Dropdown */}
              <FormControl size="small" sx={{ width: 130 }}>
                <InputLabel>Select Year</InputLabel>
                <Select
                  label="Select Year"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                >
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                  <MenuItem value="2026">2026</MenuItem>
                </Select>
              </FormControl>

              {/* Month Dropdown */}
              <FormControl size="small" sx={{ width: 130 }}>
                <InputLabel>Select Month</InputLabel>
                <Select
                  label="Select Month"
                  value={months}
                  onChange={(e) => setMonths(e.target.value)}
                >
                  <MenuItem value="January">January</MenuItem>
                  <MenuItem value="February">February</MenuItem>
                  <MenuItem value="March">March</MenuItem>
                  <MenuItem value="April">April</MenuItem>
                  <MenuItem value="May">May</MenuItem>
                  <MenuItem value="June">June</MenuItem>
                  <MenuItem value="July">July</MenuItem>
                  <MenuItem value="August">August</MenuItem>
                  <MenuItem value="September">September</MenuItem>
                  <MenuItem value="October">October</MenuItem>
                  <MenuItem value="November">November</MenuItem>
                  <MenuItem value="December">December</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Stats Boxes */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={4}>
              <Box
                sx={{
                  p: 2,
                  background: "#f5f7fa",
                  borderRadius: 2,
                  textAlign: "center",
                  height: 90,
                }}
              >
                <Typography variant="h5" fontWeight="bold">521</Typography>
                <Typography fontSize={14}>Total Applicants</Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  p: 2,
                  background: "#f5f7fa",
                  borderRadius: 2,
                  textAlign: "center",
                  height: 90,
                }}
              >
                <Typography variant="h5" fontWeight="bold">73</Typography>
                <Typography fontSize={14}>This Week</Typography>
              </Box>
            </Grid>

            <Grid item xs={4}>
              <Box
                sx={{
                  p: 2,
                  background: "#f5f7fa",
                  borderRadius: 2,
                  textAlign: "center",
                  height: 90,
                }}
              >
                <Typography variant="h5" fontWeight="bold">234</Typography>
                <Typography fontSize={14}>This Month</Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Bar Graph Label */}
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ mb: 1 }}
          >
            Applicants By Status:
          </Typography>

          {/* Bar Graph Placeholder */}
          <Box
            sx={{
              flexGrow: 1,
              background: "#f1f3f4",
              borderRadius: 3,
              border: "1px dashed #bfc4cc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 14,
              color: "#6c6c6c",
            }}
          >
            BAR GRAPH HERE
          </Box>
        </Card>

        <Grid item xs={12} md={4}>
          <Card
            sx={{
              border: `2px solid ${borderColor}`,
              marginLeft: 2.2,
              boxShadow: 3,
              p: 2,
              width: 480,
              height: 400,
              marginTop: 2.5,
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
                    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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

          <Card
            sx={{
              width: 480,
              height: 180,
              marginTop: 2.5,
              marginLeft: 2.1,
              p: 2,
              borderRadius: 3,
              boxShadow: 3,
              background: "#ffffff",
              display: "flex",
     border: `2px solid ${borderColor}`,
              flexDirection: "column",
            }}
          >
            {/* Header: Title + Department Dropdown */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" color={subtitleColor}>
                Total Applicant Per Department
              </Typography>

              <FormControl size="small" sx={{ width: 160 }}>
                <InputLabel>Select Department</InputLabel>
                <Select
                  label="Select Department"
                  value={departments}
                  onChange={(e) => setDepartments(e.target.value)}
                >
                  <MenuItem value="CAS">CAS</MenuItem>
                  <MenuItem value="CEIS">CEIS</MenuItem>
                  <MenuItem value="CBA">CBA</MenuItem>
                  <MenuItem value="COED">COED</MenuItem>
                  <MenuItem value="CIT">CIT</MenuItem>
                  <MenuItem value="Architecture">Architecture</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Stats Boxes */}
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    background: "#f5f7fa",
                    textAlign: "center",
                    height: 90,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">521</Typography>
                  <Typography fontSize={12}>Total Applicants</Typography>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    background: "#f5f7fa",
                    textAlign: "center",
                    height: 90,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">73</Typography>
                  <Typography fontSize={12}>This Week</Typography>
                </Box>
              </Grid>

              <Grid item xs={4}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    background: "#f5f7fa",
                    textAlign: "center",
                    height: 90,
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">234</Typography>
                  <Typography fontSize={12}>This Month</Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdmissionOfficerDashboard;
