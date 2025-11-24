import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Button, Grid, MenuItem, TextField, Typography, Paper, Card } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
import MenuBookIcon from '@mui/icons-material/MenuBook'; 



const AssignInterviewExam = () => {
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

    const tabs = [
        { label: "Admission Process For College", to: "/applicant_list", icon: <SchoolIcon fontSize="large" /> },
    { label: "Applicant Form", to: "/registrar_dashboard1", icon: <AssignmentIcon fontSize="large" /> },
    { label: "Student Requirements", to: "/registrar_requirements", icon: <AssignmentTurnedInIcon fontSize="large" /> },
    { label: "Qualifying / Interview Room Assignment", to: "/assign_qualifying_interview_exam", icon: <MeetingRoomIcon fontSize="large" /> },
    { label: "Qualifying / Interview Schedule Management", to: "/assign_schedule_applicants_qualifying_interview", icon: <ScheduleIcon fontSize="large" /> },
    { label: "Qualifying / Interviewer Applicant's List", to: "/qualifying_interviewer_applicant_list", icon: <PeopleIcon fontSize="large" /> },
    { label: "Qualifying / Interview Exam Score", to: "/qualifying_interview_exam_scores", icon: <PersonSearchIcon fontSize="large" /> },
    { label: "Student Numbering", to: "/student_numbering_per_college", icon: <DashboardIcon fontSize="large" /> },
     { label: "Course Tagging", to: "/course_tagging", icon: <MenuBookIcon fontSize="large" /> },

    ];


    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(3);
    const [clickedSteps, setClickedSteps] = useState(Array(tabs.length).fill(false));


    const handleStepClick = (index, to) => {
        setActiveStep(index);
        navigate(to); // this will actually change the page
    };

    const [day, setDay] = useState("");
    const [roomId, setRoomId] = useState("");            // store selected room_id
    const [rooms, setRooms] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [message, setMessage] = useState("");
    const [roomQuota, setRoomQuota] = useState("");
    const [interviewer, setInterviewer] = useState("");
    const [roomNo, setRoomNo] = useState("");
    const [roomName, setRoomName] = useState("");
    const [buildingName, setBuildingName] = useState("");




    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/room_list`);
                // expect res.data = [{ room_id: 1, room_description: "Room A" }, ...]
                setRooms(res.data);
            } catch (err) {
                console.error("Error fetching rooms:", err);
                setMessage("Could not load rooms. Check backend /room_list.");
            }
        };
        fetchRooms();
    }, []);

    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/interview_schedules_with_count`);

                setSchedules(res.data);
            } catch (err) {
                console.error("Error fetching schedules:", err);
            }
        };
        fetchSchedules();
    }, []);

    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);


    const pageId = 10;

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


    const handleSaveSchedule = async (e) => {
        e.preventDefault();
        setMessage("");

        // NO VALIDATION — DIRECT TEXT
        const sel = {
            building_description: buildingName,
            room_description: roomId
        };

        try {
            await axios.post(`${API_BASE_URL}/insert_interview_schedule`, {
                day_description: day,
                building_description: sel.building_description,
                room_description: sel.room_description,
                start_time: startTime,
                end_time: endTime,
                interviewer,
                room_quota: roomQuota || 40,
            });

            setMessage("Interview schedule saved successfully ✅");
            setDay("");
            setRoomId("");
            setStartTime("");
            setEndTime("");
            setInterviewer("");
            setRoomQuota("");

            const res = await axios.get(`${API_BASE_URL}/interview_schedules_with_count`);
            setSchedules(res.data);

        } catch (err) {
            console.error("Error saving schedule:", err);
            if (err.response && err.response.data && err.response.data.error) {
                setMessage(err.response.data.error);
            } else {
                setMessage("Failed to save schedule ❌");
            }
        }
    };





    // Put this at the very bottom before the return 
    if (loading || hasAccess === null) {
        return <LoadingOverlay open={loading} message="Check Access" />;
    }

    if (!hasAccess) {
        return (
            <Unauthorized />
        );
    }


    return (
        <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>

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
                        fontWeight: 'bold',
                        color: titleColor,
                        fontSize: '36px',
                    }}
                >
                    QUALIFYING / INTERVIEW ROOM ASSIGNMENT
                </Typography>


            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />


            <div style={{ height: "20px" }}></div>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "nowrap", // ❌ prevent wrapping
                    width: "100%",
                    mt: 3,
                    gap: 2,
                }}
            >
                {tabs.map((tab, index) => (
                    <Card
                        key={index}
                        onClick={() => handleStepClick(index, tab.to)}
                        sx={{
                            flex: `1 1 ${100 / tabs.length}%`, // evenly divide row
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
                                backgroundColor: activeStep === index ? "#000" : "#f5d98f",
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

            <div style={{ height: "20px" }}></div>



            <Box
                display="flex"
                justifyContent="center"
                alignItems="flex-start"
                width="100%"
                mt={3}
            >
                <Paper
                    elevation={6}
                    sx={{
                        p: 4,
                        maxWidth: 500,
                        width: "100%",
                        borderRadius: 3,
                        bgcolor: "background.paper",
                        border: `2px solid ${borderColor}`, // keep the maroon border
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        mb={2}
                        textAlign="center"
                        sx={{ color: subtitleColor }}
                    >
                        ADD SCHEDULE
                    </Typography>

                    <form onSubmit={handleSaveSchedule}>
                        <Grid container spacing={1}>
                            {/* Exam Date */}
                            <Grid item xs={12}>
                                <Typography fontWeight={500} mb={0.5}>
                                    Exam Date
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type="date"
                                    name="examDate"
                                    required
                                    value={day || ""}
                                    onChange={(e) => setDay(e.target.value)}
                                />
                            </Grid>

                            {/* Building */}
                            <Grid item xs={12}>
                                <Typography fontWeight={500} mb={0.5}>
                                    Building
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    value={buildingName}
                                    onChange={(e) => setBuildingName(e.target.value)}
                                    placeholder="Enter Building Name"
                                    required
                                />
                            </Grid>

                            {/* Room */}
                            <Grid item xs={12}>
                                <Typography fontWeight={500} mb={0.5}>
                                    Room
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    placeholder="Enter Room Name / Room Number"
                                    required
                                />
                            </Grid>

                            {/* Start Time */}
                            <Grid item xs={12}>
                                <Typography fontWeight={500} mb={0.5}>
                                    Start Time
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    inputProps={{ step: 300 }}
                                    required
                                />
                            </Grid>

                            {/* End Time */}
                            <Grid item xs={12}>
                                <Typography fontWeight={500} mb={0.5}>
                                    End Time
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    inputProps={{ step: 300 }}
                                    required
                                />
                            </Grid>

                            {/* Interviewer */}
                            <Grid item xs={12}>
                                <Typography fontWeight={500} mb={0.5}>
                                    Interviewer
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    value={interviewer}
                                    onChange={(e) => setInterviewer(e.target.value)}
                                    required
                                    placeholder="Enter Interviewer Name"
                                />
                            </Grid>

                            {/* Room Quota */}
                            <Grid item xs={12}>
                                <Typography fontWeight={500} mb={0.5}>
                                    Room Quota
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="medium"
                                    type="number"
                                    value={roomQuota}
                                    onChange={(e) => setRoomQuota(e.target.value)}
                                    required
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#1967d2",
                                        "&:hover": { bgcolor: "#000000" },
                                        px: 6,
                                        py: 1.5,
                                        mt: 2,
                                        borderRadius: 2,
                                    }}
                                >
                                    Save Schedule
                                </Button>
                            </Grid>

                            {/* Message */}
                            {message && (
                                <Grid item xs={12}>
                                    <Typography textAlign="center" color="maroon">
                                        {message}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </form>

                </Paper>
            </Box>
        </Box>
    );
};

export default AssignInterviewExam;
