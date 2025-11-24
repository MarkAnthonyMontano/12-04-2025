import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    LinearProgress,
    Chip,
    TableContainer,
    FormControl,
    Paper,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import API_BASE_URL from "../apiConfig";
import { useNavigate } from "react-router-dom";

const ScheduleHoverTile = () => {
    const navigate = useNavigate();
    const settings = useContext(SettingsContext);

    const [titleColor, setTitleColor] = useState("#000000");
    const [borderColor, setBorderColor] = useState("#000000");

    const [schedules, setSchedules] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSchedules, setFilteredSchedules] = useState([]);

    const [schoolYears, setSchoolYears] = useState([]);
    const [schoolSemester, setSchoolSemester] = useState([]);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
    const [selectedSchoolSemester, setSelectedSchoolSemester] = useState("");

    const [person, setPerson] = useState({
        fromDate: "",
        toDate: "",
        fromTime: "",
        toTime: "",
    });


    useEffect(() => {
        if (!settings) return;
        if (settings.title_color) setTitleColor(settings.title_color);
        if (settings.border_color) setBorderColor(settings.border_color);
    }, [settings]);

    // Fetch school years, semesters, and active selection in order
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const yearsRes = await axios.get(`${API_BASE_URL}/get_school_year/`);
                setSchoolYears(yearsRes.data);

                const semRes = await axios.get(`${API_BASE_URL}/get_school_semester/`);
                setSchoolSemester(semRes.data);

                const activeRes = await axios.get(`${API_BASE_URL}/active_school_year`);
                if (activeRes.data.length > 0) {
                    setSelectedSchoolYear(activeRes.data[0].year_id);
                    setSelectedSchoolSemester(activeRes.data[0].semester_id);
                } else {
                    // fallback to first available year/semester
                    setSelectedSchoolYear(yearsRes.data[0]?.year_id || "");
                    setSelectedSchoolSemester(semRes.data[0]?.semester_id || "");
                }
            } catch (err) {
                console.error("Error fetching school data:", err);
            }
        };
        fetchInitialData();
    }, []);

    const [buildingList, setBuildingList] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState("");

    // Fetch schedules once school year & semester are set
    useEffect(() => {
        const fetchSchedules = async () => {
            if (!selectedSchoolYear || !selectedSchoolSemester) return;
            try {
                const res = await axios.get(
                    `${API_BASE_URL}/exam_schedules_with_count/${selectedSchoolYear}/${selectedSchoolSemester}`
                );
                setSchedules(res.data);
                setFilteredSchedules(res.data);

                const uniqueBuildings = [...new Set(res.data.map(s => s.building_description))];
                setBuildingList(uniqueBuildings);
            } catch (err) {
                console.error("Error fetching schedule tiles:", err);
            }
        };
        fetchSchedules();
    }, [selectedSchoolYear, selectedSchoolSemester]);

   useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();

    const filtered = schedules.filter((s) => {
        const proctor = s.proctor || "";
        const building = s.building_description || "";

        const matchesSearch =
            proctor.toLowerCase().includes(lowerQuery) ||
            building.toLowerCase().includes(lowerQuery) ||
            (s.room_description || "").toLowerCase().includes(lowerQuery);

        const matchesBuilding = selectedBuilding === "" || building === selectedBuilding;

        const scheduleDate = new Date(s.day_description);
        const fromDate = person.fromDate ? new Date(person.fromDate) : null;
        const toDate = person.toDate ? new Date(person.toDate) : null;

        const matchesDate =
            (!fromDate || scheduleDate >= fromDate) &&
            (!toDate || scheduleDate <= toDate);

        // Convert times to comparable HH:mm
        const scheduleStart = s.start_time ? s.start_time.slice(0,5) : null;
        const scheduleEnd = s.end_time ? s.end_time.slice(0,5) : null;
        const fromTime = person.fromTime ? person.fromTime : null;
        const toTime = person.toTime ? person.toTime : null;

        const matchesTime =
            (!fromTime || scheduleStart >= fromTime) &&
            (!toTime || scheduleEnd <= toTime);

        return matchesSearch && matchesBuilding && matchesDate && matchesTime;
    });

    setFilteredSchedules(filtered);
}, [searchQuery, selectedBuilding, person, schedules]);




    const handleSchoolYearChange = (e) => setSelectedSchoolYear(e.target.value);
    const handleSchoolSemesterChange = (e) => setSelectedSchoolSemester(e.target.value);

    const formatTime12 = (timeString) => {
        if (!timeString) return "";
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const getOccupancyColor = (current, quota) => {
        const ratio = current / quota;
        if (ratio === 1) return "#d32f2f";
        if (ratio >= 0.7) return "#f57c00";
        return "#388e3c";
    };
    return (
        <Box
            sx={{
                height: "calc(100vh - 150px)",
                overflowY: "auto",
                paddingRight: 1,

            }}
        >
            {/* Title + Search Row */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mb: 2,
                }}
            >
                {/* LEFT – Title */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: titleColor,
                        fontSize: "36px",
                    }}
                >
                    ADMISSION ROOM MANAGEMENT
                </Typography>

                {/* RIGHT – Search Field */}
                <Box sx={{ display: "flex", alignItems: "center", mt: { xs: 2, md: 0 } }}>
                    <TextField
                        size="small"
                        placeholder="Search Proctor / Building / Room"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
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
            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />
            <br />
            <TableContainer component={Paper} sx={{ width: '100%', border: `2px solid ${borderColor}`, }}>
                <Table>
                    <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2" }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', textAlign: "Center" }}>Application Date</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>

            <TableContainer
                component={Paper}
                sx={{
                    maxWidth: "100%",
                    border: `2px solid ${borderColor}`,
                    p: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 4,
                    }}
                >
                    {/* LEFT SIDE: School Year, Semester, Building, Room, From Time, To Time */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {/* School Year */}
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography fontSize={13} sx={{ mb: 1 }}>School Year</Typography>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <Select
                                    value={selectedSchoolYear}
                                    onChange={handleSchoolYearChange}
                                >
                                    {schoolYears.map((sy) => (
                                        <MenuItem value={sy.year_id} key={sy.year_id}>
                                            {sy.current_year} - {sy.next_year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Semester */}
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography fontSize={13} sx={{ mb: 1 }}>Semester</Typography>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <Select
                                    value={selectedSchoolSemester}
                                    onChange={handleSchoolSemesterChange}
                                >
                                    {schoolSemester.map((sem) => (
                                        <MenuItem value={sem.semester_id} key={sem.semester_id}>
                                            {sem.semester_description}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Building */}
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography fontSize={13} sx={{ mb: 1 }}>Building</Typography>
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                                <Select
                                    value={selectedBuilding}
                                    onChange={(e) => setSelectedBuilding(e.target.value)}
                                >
                                    <MenuItem value="">All Buildings</MenuItem>
                                    {buildingList.map((bldg, i) => (
                                        <MenuItem key={i} value={bldg}>{bldg}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Room */}
                  

                        {/* From Time */}
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography fontSize={13} sx={{ mb: 1 }}>From Time</Typography>
                            <TextField
                                type="time"
                                size="small"
                                value={person.fromTime}
                                onChange={(e) => setPerson(prev => ({ ...prev, fromTime: e.target.value }))}
                                sx={{ minWidth: 120 }}
                            />
                        </Box>

                        {/* To Time */}
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography fontSize={13} sx={{ mb: 1 }}>To Time</Typography>
                            <TextField
                                type="time"
                                size="small"
                                value={person.toTime}
                                onChange={(e) => setPerson(prev => ({ ...prev, toTime: e.target.value }))}
                                sx={{ minWidth: 120 }}
                            />
                        </Box>
                    </Box>

                    {/* RIGHT SIDE: From Date & To Date */}
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {/* From Date */}
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography fontSize={13} sx={{ mb: 1 }}>From Date</Typography>
                            <TextField
                                type="date"
                                size="small"
                                value={person.fromDate}
                                onChange={(e) => setPerson(prev => ({ ...prev, fromDate: e.target.value }))}
                                sx={{ minWidth: 150 }}
                            />
                        </Box>

                        {/* To Date */}
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography fontSize={13} sx={{ mb: 1 }}>To Date</Typography>
                            <TextField
                                type="date"
                                size="small"
                                value={person.toDate}
                                onChange={(e) => setPerson(prev => ({ ...prev, toDate: e.target.value }))}
                                sx={{ minWidth: 150 }}
                            />
                        </Box>
                    </Box>
                </Box>
            </TableContainer>


            <br />
            <br />

            <Grid container spacing={3}>
                {filteredSchedules.map((schedule) => (
                    <Grid item xs={12} sm={6} md={2.4} lg={2.4} key={schedule.schedule_id}>
                        <Card
                            onClick={() =>
                                navigate(
                                    `${API_BASE_URL}/proctor_applicant_list?proctor=${encodeURIComponent(
                                        schedule.proctor
                                    )}&schedule=${schedule.schedule_id}`
                                )
                            }
                            sx={{
                                cursor: "pointer",
                                borderRadius: "16px",
                                overflow: "hidden",
                                boxShadow: 4,
                                border: `2px solid ${borderColor}`,
                                transition: "0.3s ease",
                                "&:hover": {
                                    transform: "translateY(-4px) scale(1.03)",
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: settings?.header_color || "#1976d2",
                                    color: "#fff",
                                    p: 1.5,
                                }}
                            >
                                <Typography fontWeight="bold" fontSize="16px" sx={{ textAlign: "center" }}>
                                    Schedule #{schedule.schedule_id}
                                </Typography>
                            </Box>

                            <CardContent>
                                <Typography fontSize="14px" mb={0.5}>
                                    <strong>Proctor:</strong> {schedule.proctor}
                                </Typography>
                                <Typography fontSize="14px" mb={0.5}>
                                    <strong>Building:</strong> {schedule.building_description}
                                </Typography>
                                <Typography fontSize="14px" mb={0.5}>
                                    <strong>Room:</strong> {schedule.room_description}
                                </Typography>
                                <Typography fontSize="14px" mb={0.5}>
                                    <strong>Date:</strong>{" "}
                                    {new Date(schedule.day_description).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </Typography>
                                <Typography fontSize="14px" mb={1}>
                                    <strong>Time:</strong> {formatTime12(schedule.start_time)} -{" "}
                                    {formatTime12(schedule.end_time)}
                                </Typography>

                                <Typography fontSize="14px" mb={0.5} fontWeight="bold">
                                    <strong>Applicants:</strong>{" "}
                                    {schedule.current_occupancy}/{schedule.room_quota}
                                </Typography>

                                <LinearProgress
                                    variant="determinate"
                                    value={(schedule.current_occupancy / schedule.room_quota) * 100}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: "#eee",
                                        "& .MuiLinearProgress-bar": {
                                            backgroundColor: getOccupancyColor(
                                                schedule.current_occupancy,
                                                schedule.room_quota
                                            ),
                                        },
                                    }}
                                />

                                <Box sx={{ mt: 1 }}>
                                    {schedule.current_occupancy >= schedule.room_quota ? (
                                        <Chip label="Full" color="error" size="small" />
                                    ) : schedule.current_occupancy / schedule.room_quota >= 0.7 ? (
                                        <Chip label="Almost Full" color="warning" size="small" />
                                    ) : (
                                        <Chip label="Available" color="success" size="small" />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ScheduleHoverTile;