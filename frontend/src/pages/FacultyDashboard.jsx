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
  Divider,
  Avatar,
  IconButton,
  Button,
  Tooltip,
} from "@mui/material";
import { Dialog } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import API_BASE_URL from "../apiConfig";
const FacultyDashboard = ({ profileImage, setProfileImage }) => {

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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [personData, setPerson] = useState({
    prof_id: "",
    person_id: "",
    lname: "",
    fname: "",
    mname: "",
    profile_image: "",
  });
  const [openImage, setOpenImage] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole !== "faculty") {
        window.location.href = "/dashboard";
      } else {
        fetchPersonData(storedID);
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchPersonData = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_prof_data/${id}`)
      const first = res.data[0];
      const profInfo = {
        prof_id: first.prof_id,
        person_id: first.person_id,
        fname: first.fname,
        mname: first.mname,
        lname: first.lname,
        profile_image: first.profile_image,
      };
      setPerson(profInfo);
    } catch (err) {
      setMessage("Error Fetching Professor Personal Data");
    }
  }

  useEffect(() => {
    if (personData.prof_id) {
      fetchSchedule(personData.prof_id);
    }
  }, [personData.prof_id]);

  const fetchSchedule = async (prof_id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/my_schedule/${prof_id}`);
      setSchedule(res.data);
    } catch (err) {
      console.error("Failed to fetch schedule:", err);
    }
  };

  const [announcements, setAnnouncements] = useState([]);
  const [hovered, setHovered] = useState(false);
  const fileInputRef = useRef(null);

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

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements]);

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


  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const todayDay = new Date().toLocaleString("en-US", {
    weekday: "short",
    timeZone: "Asia/Manila",
  });

  console.log(todayDay);
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const person_id = localStorage.getItem("person_id");
      const role = localStorage.getItem("role");

      // ✅ Get user_account_id
      const res = await axios.get(
        `${API_BASE_URL}/api/get_prof_account_id/${person_id}`
      );

      const user_account_id = res.data.user_account_id;

      const formData = new FormData();

      formData.append("profile_picture", file);

      // ✅ Upload image using same backend API
      await axios.post(
        `${API_BASE_URL}/update_faculty/${user_account_id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // ✅ Refresh profile info to display the new image
      const updated = await axios.get(
        `${API_BASE_URL}/api/person_data/${person_id}/${role}`
      );

      setPerson(updated.data);
      const baseUrl = `${API_BASE_URL}/uploads/${updated.data.profile_image}`;
      setProfileImage(`${baseUrl}?t=${Date.now()}`);
    } catch (error) {
      console.error("❌ Upload failed:", error);
    }
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
              borderRadius: 1,
              boxShadow: 3,
              p: 1.5,              // reduced padding
              border: `2px solid ${borderColor}`,
              minHeight: 100,       // smaller min height
              height: "auto",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.01)",
                boxShadow: 6,
              },
              mx: 1,
            }}
          >
            <CardContent>
              <Grid container alignItems="center" spacing={2}>
                {/* LEFT SECTION — Avatar + Name Info */}
                <Grid item xs={12} sm={8} md={9}>
                  <Box display="flex" alignItems="center" flexWrap="wrap">
                    {/* Avatar */}
                    <Box
                      position="relative"
                      display="inline-block"
                      mr={2}
                      onMouseEnter={() => setHovered(true)}
                      onMouseLeave={() => setHovered(false)}
                    >
                      <Avatar
                        src={
                          profileImage ||
                          `${API_BASE_URL}/uploads/${personData?.profile_image}`
                        }
                        alt={personData?.fname}
                        sx={{
                          width: { xs: 70, sm: 80, md: 90 },  // smaller
                          height: { xs: 70, sm: 80, md: 90 },
                          border: `2px solid ${borderColor}`,
                          cursor: "pointer",
                        }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        {personData?.fname?.[0]}
                      </Avatar>

                      {/* Add Icon Overlay */}
                      {hovered && (
                        <label
                          onClick={() => fileInputRef.current.click()}
                          style={{
                            position: "absolute",
                            bottom: "-5px",
                            right: "0px",
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
                            }}
                          />
                        </label>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                    </Box>

                    {/* Welcome Text */}
                    <Box sx={{ color: titleColor }}>
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                          fontSize: { xs: "24px", sm: "26px", md: "32px" },  // smaller
                        }}
                      >
                        Welcome back!{" "}
                        {personData
                          ? `${personData.lname}, ${personData.fname} ${personData.mname || ""}`
                          : ""}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: "16px", sm: "18px", md: "20px" }, // smaller
                          color: "black",
                        }}
                      >
                        <b>Employee ID:</b> {personData?.person_id || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* RIGHT SECTION — Date */}
                <Grid item xs={12} sm={4} md={3} textAlign={{ xs: "left", sm: "right" }}>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: { xs: "16px", sm: "18px", md: "20px" } }} // smaller
                  >
                    {formattedDate}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>



      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "1rem",
          justifyContent: "center",
        }}
      >
        {/* Announcements */}
        <Box
          sx={{
            flex: "0 0 100%",           // large width
            maxWidth: { xs: "100%", sm: "450px", md: "732px" }, // responsive scaling
            height: "472px",
          }}
        >
          <Card
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: 3,
              boxShadow: 3,
              p: 2,
              overflowY: "auto",
              border: `2px solid ${borderColor}`,
              transition: "transform 0.3s ease, boxShadow 0.3s ease",
              "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
            }}
          >
            <CardContent sx={{ width: "100%", height: "100%" }}>
              {/* ✅ Header same as top version */}
              <Typography sx={{ textAlign: "center", marginTop: "-1rem" }} variant="h6" gutterBottom>
                Announcements
              </Typography>

              <Divider sx={{ mb: 2 }} />

              {/* ✅ No announcements */}
              {announcements.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  No active announcements.
                </Typography>
              ) : (
                <Box sx={{ position: "relative", maxHeight: "420px", height: "100%", overflow: "hidden" }}>
                  {/* Display current announcement */}
                  {announcements.length > 0 && (
                    <Box
                      key={announcements[currentIndex].id}
                      sx={{
                        mb: 2,
                        p: 1,
                        transition: "opacity 0.6s ease",
                        opacity: 1,
                        border: `2px solid ${borderColor}`,
                        backgroundColor: "#fff8f6",
                        borderRadius: 2,
                        position: "absolute",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "maroon", fontWeight: "bold" }}
                      >
                        {announcements[currentIndex].title}
                      </Typography>

                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {announcements[currentIndex].content}
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      {announcements[currentIndex].file_path && (
                        <>
                          <img
                            src={`${API_BASE_URL}/uploads/${announcements[currentIndex].file_path}`}
                            alt={announcements[currentIndex].title}
                            style={{
                              width: "100%",
                              height: "100%",
                              maxHeight: "16.4rem",
                              objectFit: "cover",
                              borderRadius: "6px",
                              marginBottom: "6px",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setOpenImage(
                                `${API_BASE_URL}/uploads/${announcements[currentIndex].file_path}`
                              )
                            }
                          />
                        </>
                      )}

                      <Typography variant="caption" style={{ display: "flex" }} color="text.secondary">
                        Posted: {""}
                        {new Date(
                          announcements[currentIndex].created_at
                        ).toLocaleDateString("en-US")}
                        <div style={{ width: "20px" }}></div>
                        Expires:{" "}
                        {new Date(
                          announcements[currentIndex].expires_at
                        ).toLocaleDateString("en-US")}
                      </Typography>
                    </Box>
                  )}

                  {/* Navigation Buttons */}
                  {announcements.length > 1 && (
                    <>
                      <IconButton
                        onClick={() =>
                          setCurrentIndex(
                            (prev) => (prev - 1 + announcements.length) % announcements.length
                          )
                        }
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: 10,
                          transform: "translateY(-50%)",
                          backgroundColor: "rgba(255,255,255,0.8)",
                          "&:hover": { backgroundColor: "#fff" },
                        }}
                      >
                        <KeyboardBackspaceIcon sx={{ color: "maroon", fontSize: 24 }} />
                      </IconButton>

                      <IconButton
                        onClick={() =>
                          setCurrentIndex((prev) => (prev + 1) % announcements.length)
                        }
                        sx={{
                          position: "absolute",
                          top: "50%",
                          right: 10,
                          transform: "translateY(-50%) rotate(180deg)",
                          backgroundColor: "rgba(255,255,255,0.8)",
                          "&:hover": { backgroundColor: "#fff" },
                        }}
                      >
                        <KeyboardBackspaceIcon sx={{ color: "maroon", fontSize: 24 }} />
                      </IconButton>
                    </>
                  )}
                </Box>
              )}

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
                {/* 🔙 Back Button on Top-Left */}
                <IconButton
                  onClick={() => setOpenImage(null)}
                  sx={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    backgroundColor: "white",
                    width: 50,
                    height: 50,
                    padding: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2, // above clickable backdrop
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <KeyboardBackspaceIcon sx={{ fontSize: 30, color: "black" }} />
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
            </CardContent>
          </Card>
        </Box>

        {/* Calendar + Workload stacked */}
        <Box
          sx={{
            flex: "0 0 300px",
            maxWidth: { xs: "100%", sm: "250px", md: "300px" },
            height: "472px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* Calendar Card */}
          <Card
            sx={{
              width: "100%",
              height: "360px",
              border: `2px solid ${borderColor}`,
              boxShadow: 3,
              borderRadius: "10px",
              p: 2,
              overflowY: "hidden",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.02)" },
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
                  padding: "6px 4px",
                }}
              >
                <Grid item>
                  <IconButton size="small" onClick={handlePrevMonth} sx={{ color: "white", fontSize: "12px" }}>
                    <ArrowBackIos fontSize="12px" />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", fontSize: "12px" }}>
                    {date.toLocaleString("default", { month: "long" })} {year}
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton size="small" onClick={handleNextMonth} sx={{ color: "white", fontSize: "12px" }}>
                    <ArrowForwardIos fontSize="12px" />
                  </IconButton>
                </Grid>
              </Grid>

              {/* ✅ Calendar Table */}
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
                      fontSize: "12px",
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
                            height: 27,
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
                          height: 27,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
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

          {/* Workload Card */}
          <Card
            sx={{
              width: "100%",
              height: "252px",
              border: `2px solid ${borderColor}`,
              boxShadow: 3,
              borderRadius: "10px",
              p: 2,
              overflowY: "auto",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <CardContent sx={{ p: 0, width: "100%", height: "100%" }}>
              <Box
                sx={{
                  textAlign: "center",
                  backgroundColor: settings?.header_color || "#1976d2",
                  color: "white",
                  borderRadius: "6px 6px 0 0",
                  padding: "4px 8px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Workload
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: "0px 2px 2px 2px",
                  borderColor: "black",
                  borderStyle: "solid",
                  borderRadius: "2px",
                  height: "130px",
                }}
              >
                <Link to={"/faculty_workload"}>
                  <Button
                    style={{
                      backgroundColor: mainButtonColor,
                      color: "white",
                      padding: "15px 20px",
                    }}
                  >
                    Open My Workload
                  </Button>
                </Link>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* My Schedule */}
        <Box
          sx={{
            flex: "0 0 300px",
            maxWidth: { xs: "100%", sm: "250px", md: "300px" },
            height: "472px",
          }}
        >
          <Card
            sx={{
              width: "100%",
              height: "100%",
              border: `2px solid ${borderColor}`,
              boxShadow: 3,
              borderRadius: "10px",
              p: 2,
              overflowY: "auto",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.02)" },
            }}
          >
            <CardContent sx={{ p: 0, width: "100%", height: "100%" }}>
              <Box
                sx={{
                  textAlign: "center",
                  backgroundColor: settings?.header_color || "#1976d2",
                  color: "white",
                  borderRadius: "6px 6px 0 0",
                  padding: "4px 8px",
                  fontWeight: "bold",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                My Schedule
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  borderWidth: "0px 2px 2px 2px",
                  borderColor: "black",
                  borderStyle: "solid",
                  borderRadius: "2px",
                  height: "412px",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                {schedule.filter(item => item.description === todayDay.toUpperCase()).length === 0 ? (
                  <Typography sx={{ fontSize: "13px", textAlign: "center", marginTop: "20px", color: "#666" }}>
                    No schedule for today.
                  </Typography>
                ) : (
                  schedule
                    .filter(item => item.description === todayDay.toUpperCase())
                    .map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          background: "white",
                          mb: 1.5,
                          p: 1.5,
                          borderRadius: "8px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                          border: "1px solid #e0e0e0",
                          transition: "0.25s ease-in-out",
                          cursor: "pointer",
                          "&:hover": {
                            boxShadow: "0 3px 8px rgba(0,0,0,0.18)",
                            transform: "scale(1.02)",
                            borderColor: settings?.main_button_color || "#1976d2",
                            backgroundColor: "#f0f8ff",
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>
                          {item.course_code} - {item.program_code} - {item.section}
                        </Typography>

                        <Typography sx={{ fontSize: "12px", color: "#444" }}>
                          {item.school_time_start} — {item.school_time_end}
                        </Typography>

                        <Typography sx={{ fontSize: "11px", color: "#777", textTransform: "uppercase" }}>
                          {item.room_description}
                        </Typography>
                      </Box>
                    ))
                )}
              </Box>

            </CardContent>
          </Card>
        </Box>
      </Box>

    </Box>
  );
};

export default FacultyDashboard;
