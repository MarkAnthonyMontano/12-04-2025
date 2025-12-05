import { Box, Typography, TextField, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, Paper, TableContainer, Card, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import EaristLogo from "../assets/EaristLogo.png";
import { Search } from "@mui/icons-material";
import axios from 'axios';
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ClassIcon from "@mui/icons-material/Class";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import GradeIcon from "@mui/icons-material/Grade";
import SchoolIcon from "@mui/icons-material/School";
import { useNavigate } from "react-router-dom";
import { FcPrint } from "react-icons/fc";
import API_BASE_URL from "../apiConfig";

import UploadFileIcon from '@mui/icons-material/UploadFile';

const ReportOfGrade = () => {
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

    const [campusAddress, setCampusAddress] = useState("");

    useEffect(() => {
        if (settings && settings.address) {
            setCampusAddress(settings.address);
        }
    }, [settings]);


    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [studentData, setStudentData] = useState([]);
    const [studentNumber, setStudentNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [studentDetails, setStudentDetails] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [schoolYears, setSchoolYears] = useState([]);
    const [schoolSemester, setSchoolSemester] = useState([]);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
    const [selectedSchoolSemester, setSelectedSchoolSemester] = useState('');
    const [selectedActiveSchoolYear, setSelectedActiveSchoolYear] = useState('');



    const navigate = useNavigate();

    const [activeStep, setActiveStep] = useState(4);
    const [clickedSteps, setClickedSteps] = useState([]);

    const tabs1 = [
        { label: "Student Records", to: "/student_list", icon: <ListAltIcon /> },
        { label: "Applicant Form", to: "/readmission_dashboard1", icon: <PersonAddIcon /> },
        { label: "Submitted Documents", to: "/submitted_documents", icon: <UploadFileIcon /> },
        { label: "Search Certificate of Registration", to: "/search_cor", icon: <ListAltIcon /> },
        { label: "Report of Grades", to: "/report_of_grades", icon: <GradeIcon /> },
        { label: "Transcript of Records", to: "/transcript_of_records", icon: <SchoolIcon /> },
    ];



    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const personIdFromUrl = queryParams.get("person_id");

        if (!personIdFromUrl) return;

        // fetch info of that person
        axios
            .get(`${API_BASE_URL}/api/person_with_applicant/${personIdFromUrl}`)
            .then((res) => {
                if (res.data?.applicant_number) {

                    // AUTO-INSERT applicant_number into search bar
                    setSearchQuery(res.data.applicant_number);

                    // If you have a fetchUploads() or fetchExamScore() — call it
                    if (typeof fetchUploadsByApplicantNumber === "function") {
                        fetchUploadsByApplicantNumber(res.data.applicant_number);
                    }

                    if (typeof fetchApplicants === "function") {
                        fetchApplicants();
                    }
                }
            })
            .catch((err) => console.error("Auto search failed:", err));
    }, [location.search]);

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

    useEffect(() => {
        const storedId = localStorage.getItem("admin_edit_person_id");

        if (storedId && storedId !== "undefined" && storedId !== "null" && storedId.length >= 9) {
            setSearchQuery(storedId);
        }
    }, []);

    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);


    const pageId = 50;

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




    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const storedID = localStorage.getItem("person_id");

        if (storedUser && storedRole && storedID) {
            setUser(storedUser);
            setUserRole(storedRole);
            setUserID(storedID);

            if (storedRole !== "registrar") {
                window.location.href = "/login";
            } else {
                console.log("Hello")
            }
        } else {
            window.location.href = "/login";
        }
    }, []);

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

                    if (data[0]?.student_number) {
                        localStorage.setItem("admin_edit_person_id", data[0].student_number);
                        setSearchQuery(data[0].student_number);
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
                setOpenSnackbar(true);
            }
        };

        fetchStudent();
    }, [searchQuery]);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/get_school_year/`)
            .then((res) => setSchoolYears(res.data))
            .catch((err) => console.error(err));
    }, [])

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/get_school_semester/`)
            .then((res) => setSchoolSemester(res.data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/active_school_year`)
            .then((res) => {
                if (res.data.length > 0) {
                    setSelectedSchoolYear(res.data[0].year_id);
                    setSelectedSchoolSemester(res.data[0].semester_id);
                }
            })
            .catch((err) => console.error(err));

    }, []);

    useEffect(() => {
        if (selectedSchoolYear && selectedSchoolSemester) {
            axios
                .get(`${API_BASE_URL}/get_selecterd_year/${selectedSchoolYear}/${selectedSchoolSemester}`)
                .then((res) => {
                    if (res.data.length > 0) {
                        setSelectedActiveSchoolYear(res.data[0].school_year_id);
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [selectedSchoolYear, selectedSchoolSemester]);

    const handleSchoolYearChange = (event) => {
        setSelectedSchoolYear(event.target.value);
    };

    const handleSchoolSemesterChange = (event) => {
        setSelectedSchoolSemester(event.target.value);
    };

    const filteredStudents = studentDetails
        .filter((s) => {
            const matchesYear =
                selectedSchoolYear === "" || String(s.year_id) === String(selectedSchoolYear);

            const matchesSemester =
                selectedSchoolSemester === "" || String(s.semester_id) === String(selectedSchoolSemester);

            return matchesYear && matchesSemester;
        })

    const getLevelBySection = (section) => {
        if (!section) return null;
        const yearNumber = parseInt(section[0]);
        switch (yearNumber) {
            case 1: return "First Year";
            case 2: return "Second Year";
            case 3: return "Third Year";
            case 4: return "Fourth Year";
            case 5: return "Fifth Year";
            default: return "unknown";
        }
    }

    const getShortTerm = (semester) => {
        if (!semester) return null;
        switch (semester) {
            case "First Semester": return "First";
            case "Second Semester": return "Second";
            case "Summer": return "Summer";
            default: return "unknown";
        }
    }

    const totalUnitPerSubject = (course_unit, lab_unit) => {
        const lec = Number(course_unit) || 0;
        const lab = Number(lab_unit) || 0;
        return lec + lab;
    };



    const divToPrintRef = useRef();

    const printDiv = () => {
        window.print();
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
        <Box className="body" sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto', overflowX: 'hidden', pr: 1, }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    mb: 2,

                    background: "white",
                }}
            >
                {/* Title */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: "maroon",
                        fontSize: "36px",
                    }}
                >
                    REPORT OF GRADES
                </Typography>

                {/* Right Section: Search Field + Print Button */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                        mt: { xs: 2, sm: 0 },
                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Enter Student Number"
                        size="small"
                        value={studentNumber}
                        onChange={(e) => {
                            setStudentNumber(e.target.value);
                            setSearchQuery(e.target.value);
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

                    <button
                        onClick={printDiv}
                        style={{
                            width: "300px",
                            padding: "10px 20px",
                            border: "2px solid black",
                            backgroundColor: "#f0f0f0",
                            color: "black",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                            transition: "background-color 0.3s, transform 0.2s",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        onMouseEnter={(e) => (e.target.style.backgroundColor = "#d3d3d3")}
                        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                        onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                        onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                    >
                        <span
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <FcPrint size={20} />
                            Print ROG
                        </span>
                    </button>

                </Box>
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
                                    backgroundColor: activeStep === index ? "#000" : "#f5d98f",
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
            <style>
                {`
                @media print {
                    @page {
                        margin: 0; 
                        padding-right: 3rem;
                        size:  216mm 165mm;
                    }
                
                    body * {
                        visibility: hidden;
                        
                    }

                    .body{
                        margin-top: -17rem;
                        margin-left: -27rem;
                        overflow: visible !important;  /* show all content */
                        height: auto !important;       /* expand height */
                        max-height: none !important;   /* no max height limit */
                        
                    }
                    .print-container, .print-container * {
                        visibility: visible;
                    }
                    .print-container {
                        scale: 0.9;
                        position: absolute;
                        left:1%;
                        top: -4rem;
                        width: 100%;
                        font-family: "Poppins", sans-serif;
                        margin-top: -4.5rem;
                        padding: 0;
                    }
                    button {
                        display: none !important; /* hide buttons */
                    }
                }
                `}
            </style>
            <TableContainer component={Paper} sx={{ width: '100%', border: `2px solid ${borderColor}`, }}>
                <Table>
                    <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2", }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', textAlign: "left" }}>Student Information:</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
            <TableContainer component={Paper} sx={{ maxWidth: '100%', border: `2px solid ${borderColor}`, p: 2, position: "relative", }}>
                <Box sx={{ display: "flex", alignItems: "center", margin: "1rem 0", padding: "0 1rem", }} gap={20}>
                    <Box style={{ display: "flex", flexDirection: "column" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={13} sx={{ minWidth: "100px" }}>School Year:</Typography>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">School Years</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    style={{ width: "200px" }}
                                    value={selectedSchoolYear}
                                    label="School Years"
                                    onChange={handleSchoolYearChange}
                                >
                                    {schoolYears.length > 0 ? (
                                        schoolYears.map((sy) => (
                                            <MenuItem value={sy.year_id} key={sy.year_id}>
                                                {sy.current_year} - {sy.next_year}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>School Year is not found</MenuItem>
                                    )
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={13} sx={{ minWidth: "100px" }}>Semester: </Typography>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">School Semester</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    style={{ width: "200px", }}
                                    value={selectedSchoolSemester}
                                    label="School Semester"
                                    onChange={handleSchoolSemesterChange}
                                >
                                    {schoolSemester.length > 0 ? (
                                        schoolSemester.map((sem) => (
                                            <MenuItem value={sem.semester_id} key={sem.semester_id}>
                                                {sem.semester_description}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>School Semester is not found</MenuItem>
                                    )
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </TableContainer>
            <Box
                className="print-container"
                style={{
                    paddingRight: "1.5rem",
                    marginTop: "2rem",
                    marginBottom: "10%",
                    paddingBottom: "1.5rem",
                    minWidth: "215.9mm",
                    maxWidth: "215.9mm",
                    minHeight: "165mm",
                    maxHeight: "165mm"
                }}
                ref={divToPrintRef}
            >
                <table>
                    <thead
                        style={{
                            display: "flex",
                            alignItems: "center",
                            width: "70rem",
                            justifyContent: "center",
                            gap: "0.5rem", // ✅ adds spacing between logo and text
                        }}
                    >
                        {/* LEFT - Logo */}
                        <tr
                            style={{
                                paddingTop: "1.5rem",
                                paddingRight: "3rem",
                            }}
                        >
                            <td>
                                <img
                                    src={fetchedLogo || EaristLogo} // ✅ Use dynamic logo with fallback
                                    alt="School Logo"
                                    style={{
                                        width: "8rem",
                                        height: "8rem",
                                        display: "block",
                                        objectFit: "cover",
                                        borderRadius: "50%",
                                    }}
                                />
                            </td>
                        </tr>

                        {/* CENTER - School Info */}
                        <tr style={{ marginTop: "1.5rem" }}>
                            <td
                                colSpan={15}
                                style={{
                                    textAlign: "center",
                                    fontFamily: "Arial",
                                    fontSize: "10px",
                                    lineHeight: "1.5",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "12px",
                                        letterSpacing: "1px",
                                    }}
                                >
                                    Republic of the Philippines
                                </div>

                                {/* ✅ Dynamically split company name into two lines */}
                                {companyName ? (
                                    (() => {
                                        const name = companyName.trim();
                                        const words = name.split(" ");
                                        const middleIndex = Math.ceil(words.length / 2);
                                        const firstLine = words.slice(0, middleIndex).join(" ");
                                        const secondLine = words.slice(middleIndex).join(" ");

                                        return (
                                            <>
                                                <Typography
                                                    style={{
                                                        textAlign: "center",
                                                        marginTop: "0rem",
                                                        lineHeight: "1",
                                                        fontSize: "1.6rem",
                                                        letterSpacing: "-1px",
                                                        fontWeight: "600",
                                                        fontFamily: "Times New Roman",
                                                    }}
                                                >
                                                    {firstLine} <br />
                                                    {secondLine}
                                                </Typography>

                                                {/* ✅ Dynamic Campus Address */}
                                                {campusAddress && (
                                                    <Typography
                                                        style={{
                                                            mt: 1,
                                                            textAlign: "center",
                                                            fontSize: "12px",
                                                            letterSpacing: "1px",

                                                        }}
                                                    >
                                                        {campusAddress}
                                                    </Typography>
                                                )}
                                            </>
                                        );
                                    })()
                                ) : (
                                    <div style={{ height: "24px" }}></div>
                                )}
                            </td>
                        </tr>
                    </thead>
                </table>

                {filteredStudents.length > 0 && (
                    <Box style={{ marginTop: "-1rem" }}>
                        <Typography style={{ marginLeft: "1rem", textAlign: "center", width: "80rem", fontSize: "1.6rem", letterSpacing: "-1px", fontWeight: "500", textDecoration: "underline", textUnderlineOffset: "0.4rem", }}>REPORT OF GRADES</Typography>
                        <Typography style={{ marginLeft: "1rem", marginTop: "-0.2rem", width: "80rem", textAlign: "center", letterSpacing: "-1px" }}>{filteredStudents[0]?.semester_description},  School Year {filteredStudents[0]?.current_year} - {filteredStudents[0]?.next_year}</Typography>
                    </Box>
                )}

                <Box style={{ display: "flex" }}>
                    <Box style={{ marginTop: "-1rem" }}>
                        <Box sx={{ padding: "1rem", marginLeft: "1rem", width: "70rem" }}>
                            <Box sx={{ display: "flex" }}>
                                <Box style={{ display: "flex", width: "38rem" }}>
                                    <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>Full Name:</Typography>
                                    <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}>{studentData.last_name && studentData.first_name && studentData.middle_name ? `${studentData.last_name}, ${studentData.first_name} ${studentData.middle_name}` : ""}</Typography>
                                </Box>
                                <Box style={{ display: "flex", width: "38rem" }}>
                                    <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>Student No:</Typography>
                                    <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}>{studentData.student_number}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <Box style={{ display: "flex", width: "38rem" }}>
                                    <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>Gender:</Typography>
                                    <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}>{studentData.gender === 0 ? "Male" : studentData.gender === 1 ? "Female" : ""}</Typography>
                                </Box>
                                <Box style={{ display: "flex", width: "38rem" }}>
                                    <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>Academic Year:</Typography>
                                    {filteredStudents.length > 0 && (
                                        <>
                                            <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}>{getShortTerm(filteredStudents[0]?.semester_description)} , {filteredStudents[0]?.current_year} - {filteredStudents[0]?.next_year}</Typography>
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <Box style={{ display: "flex", width: "34rem" }}>
                                    <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>College:</Typography>
                                    <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}>{studentData.dprtmnt_name}</Typography>
                                </Box>
                                <Box style={{ display: "flex" }}>
                                    <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>Year Level:</Typography>
                                    {filteredStudents.length > 0 && (
                                        <>
                                            <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}>{getLevelBySection(filteredStudents[0]?.section)}</Typography>
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <Box style={{ display: "flex", width: "38rem" }}>
                                <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>Program:</Typography>
                                <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}>{studentData.program_description}</Typography>
                            </Box>
                            <Box sx={{ display: "flex" }}>
                                <Box style={{ display: "flex", width: "38rem" }}>
                                    <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>Major:</Typography>
                                    <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}>{studentData.major}</Typography>
                                </Box>
                                <Box style={{ display: "flex", width: "38rem" }}>
                                    <Typography style={{ width: "9rem", fontSize: "1.05rem", letterSpacing: "-1px" }}>Rentention Status: </Typography>
                                    <Typography style={{ fontSize: "1.06rem", fontWeight: "500" }}></Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={{ display: "flex", flexWrap: "wrap", marginTop: "-1rem" }}>
                            <Box style={{ paddingLeft: "1rem", flex: "0 0 50%", marginBottom: "1rem", boxSizing: "border-box" }}>
                                <table style={{ border: "black 1px solid" }}>
                                    <thead>
                                        <tr style={{ borderBottom: "1px solid black" }}>
                                            <td style={{ display: "flex", height: "35px", alignItems: "center", justifyContent: "center", fontWeight: "600" }}>{studentData.program_description}</td>
                                        </tr>
                                        <tr style={{ display: "flex", height: "50px", borderBottom: "solid 1px black" }}>
                                            <td style={{ fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", width: "10rem" }}>
                                                <span>CODE</span>
                                            </td>
                                            <td style={{ fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", width: "24rem" }}>
                                                <span>TITLE</span>
                                            </td>
                                            <td style={{ fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", width: "12rem" }}>
                                                <span>CLASS SECTION</span>
                                            </td>
                                            <td style={{ fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", width: "6rem" }}>
                                                <span>GRADES</span>
                                            </td>
                                            <td style={{ fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", width: "6rem" }}>
                                                <span>RE-EXAM</span>
                                            </td>
                                            <td style={{ fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", width: "6rem" }}>
                                                <span style={{ textAlign: "center" }}>CREDIT UNIT</span>
                                            </td>
                                            <td style={{ fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", width: "10rem" }}>
                                                <span style={{ textAlign: "center" }}>REMARKS</span>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStudents.map((p) => (
                                            <tr style={{ display: "flex", height: "25px", alignItems: "start" }} key={p.enrolled_id}>
                                                <td style={{ display: "flex", alignItems: "center", justifyContent: "left", fontSize: "14px", width: "8rem" }}>
                                                    <span style={{ paddingLeft: "5px" }}>{p.course_code}</span>
                                                </td>
                                                <td style={{ display: "flex", width: "26rem" }}>
                                                    <span style={{ margin: "0", padding: "0", fontSize: "14px" }}>{p.course_description}</span>
                                                </td>
                                                <td style={{ display: "flex", width: "12rem", justifyContent: "center" }}>
                                                    <span style={{ margin: "0", padding: "0", fontSize: "14px" }}>{p.program_code} {p.section}</span>
                                                </td>
                                                <td>
                                                    <span style={{ margin: "0", padding: "0", display: "flex", justifyContent: "center", width: "6rem" }}>{p.final_grade}</span>
                                                </td>
                                                <td>
                                                    <span style={{ margin: "0", padding: "0", display: "flex", justifyContent: "center", width: "6rem" }}></span>
                                                </td>
                                                <td>
                                                    <span style={{ margin: "0", padding: "0", display: "flex", justifyContent: "center", width: "6rem" }}>
                                                        {totalUnitPerSubject(p.course_unit, p.lab_unit)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span style={{ margin: "0", padding: "0", display: "flex", justifyContent: "center", width: "10rem" }}>
                                                        {p.en_remarks === 0 ? "Ongoing" :
                                                            p.en_remarks === 1 ? "PASSED" :
                                                                p.en_remarks === 2 ? "FAILED" :
                                                                    p.en_remarks === 3 ? "INCOMPLETE" :
                                                                        p.en_remarks === 4 ? "DROPPED" :
                                                                            ""
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "0.5rem" }}>
                                                <div>
                                                    ***
                                                </div>
                                                <div style={{ height: "30px", margin: "0px 5px", fontSize: "0.9rem" }}>
                                                    Nothing Follows
                                                </div>
                                                <div>
                                                    ***
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Box>
                        </Box>
                        <Box style={{ display: "flex", marginTop: "-1rem" }}>
                            <Box style={{ maxWidth: "47rem" }}>
                                <Box style={{ display: "flex", justifyContent: "end" }}>
                                    <Typography style={{ width: "45rem", display: "flex", justifyContent: "end", fontSize: "0.9rem" }}>Total Subject Enrolled:</Typography>
                                    <Typography style={{ padding: "0rem 0.5rem", display: "flex", justifyContent: "end", fontSize: "0.9rem", width: "3rem" }}>
                                        {filteredStudents.length}
                                    </Typography>
                                </Box>
                                <Box style={{ display: "flex", justifyContent: "end" }}>
                                    <Typography style={{ width: "45rem", display: "flex", justifyContent: "end", fontSize: "0.9rem" }}>Total Credits Enrolled:</Typography>
                                    <Typography style={{ padding: "0rem 0.5rem", display: "flex", justifyContent: "end", fontSize: "0.9rem", width: "3rem" }}>
                                        {filteredStudents
                                            .reduce((total, subj) => total + (Number(subj.course_unit) || 0) + (Number(subj.lab_unit) || 0), 0)
                                            .toFixed(1)
                                        }
                                    </Typography>
                                </Box>
                                <Box style={{ display: "flex", justifyContent: "end" }}>
                                    <Typography style={{ width: "45rem", display: "flex", justifyContent: "end", fontSize: "0.9rem" }}>Total Credits Earned:</Typography>
                                    <Typography style={{ padding: "0rem 0.5rem", display: "flex", justifyContent: "end", fontSize: "0.9rem", width: "3rem" }}>
                                        {filteredStudents
                                            .filter(subj => subj.en_remarks === 1)
                                            .reduce((total, subj) => total + (Number(subj.course_unit) || 0) + (Number(subj.lab_unit) || 0), 0)
                                        }
                                    </Typography>
                                </Box>
                                <Box style={{ display: "flex", justifyContent: "end" }}>
                                    <Typography style={{ width: "45rem", display: "flex", justifyContent: "end", fontSize: "0.9rem" }}>Grade Point Average:</Typography>
                                    <Typography style={{ padding: "0rem 0.5rem", display: "flex", justifyContent: "end", fontSize: "0.9rem", width: "3rem" }}>
                                        {(
                                            filteredStudents.reduce((total, subj) => total + (Number(subj.final_grade) || 0), 0) / 8
                                        ).toFixed(2)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box style={{ height: "4.5rem", marginLeft: "6rem", width: "100%", display: "flex", flexDirection: "column", alignItems: "end", justifyContent: "end" }}>
                                <Box style={{ width: "100%", textAlign: "center", margin: "0", padding: "0" }}>
                                    <Typography style={{ borderBottom: "1px black solid", width: "100%" }}></Typography>
                                    <Typography style={{ fontSize: "0.7rem", marginBottom: "-0.2rem" }}>Registrar</Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={{ border: "black solid 1px", marginLeft: "1rem", padding: "0.5rem" }}>
                            <Box>
                                <Typography style={{ fontSize: "0.9rem" }}>Grading System</Typography>
                            </Box>
                            <Box style={{ display: "flex", alignItems: "center" }}>
                                <Box style={{ display: "flex", marginLeft: "1.2rem" }}>
                                    <Box>
                                        <Typography style={{ width: "6.5rem", fontSize: "0.9rem" }}>1.00 (97 - 100)</Typography>
                                        <Typography style={{ fontSize: "0.9rem" }}>1.25 (94 - 96)</Typography>
                                        <Typography style={{ fontSize: "0.9rem" }}>1.50 (91 - 93)</Typography>
                                        <Typography style={{ fontSize: "0.9rem" }}>1.75 (88 - 90)</Typography>
                                        <Typography style={{ fontSize: "0.9rem" }}>2.00 (85 - 87)</Typography>
                                    </Box>
                                    <Box>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Marked Excellent</Typography>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Excellent</Typography>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Very Superior</Typography>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Superior</Typography>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Very Good</Typography>
                                    </Box>
                                </Box>
                                <Box style={{ display: "flex" }}>
                                    <Box>
                                        <Typography style={{ width: "6.5rem", fontSize: "0.9rem" }}>2.00 (82 - 84)</Typography>
                                        <Typography style={{ width: "6.5rem", fontSize: "0.9rem" }}>2.25 (79 - 81)</Typography>
                                        <Typography style={{ width: "6.5rem", fontSize: "0.9rem" }}>2.50 (76 - 78)</Typography>
                                        <Typography style={{ width: "6.5rem", fontSize: "0.9rem" }}>3.00 (75)</Typography>
                                        <Typography style={{ width: "6.5rem", fontSize: "0.9rem" }}>4.00 (70 - 74)</Typography>
                                    </Box>
                                    <Box>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Good</Typography>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Satisfactory</Typography>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Fair</Typography>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Passed</Typography>
                                        <Typography style={{ width: "20rem", fontSize: "0.9rem" }}>Conditional Failure</Typography>
                                    </Box>
                                </Box>
                                <Box style={{ display: "flex" }}>
                                    <Box>
                                        <Typography style={{ width: "6rem", fontSize: "0.9rem" }}>5.00 (Below 70)</Typography>
                                        <Typography style={{ width: "6rem", fontSize: "0.9rem" }}>INC</Typography>
                                        <Typography style={{ width: "6rem", fontSize: "0.9rem" }}>DRP</Typography>
                                        <Typography style={{ width: "6rem", fontSize: "0.9rem" }}></Typography>
                                        <Typography style={{ width: "6rem", fontSize: "0.9rem" }}></Typography>
                                    </Box>
                                    <Box>
                                        <Typography style={{ fontSize: "0.9rem" }}>Failed</Typography>
                                        <Typography style={{ fontSize: "0.9rem" }}>Incomplete</Typography>
                                        <Typography style={{ fontSize: "0.9rem" }}>Drop Subject</Typography>
                                        <Typography style={{ fontSize: "0.9rem", height: "20px" }}></Typography>
                                        <Typography style={{ fontSize: "0.9rem", height: "20px" }}></Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={4000}
                            onClose={() => setOpenSnackbar(false)}
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: "100%" }}>
                                {snackbarMessage}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ReportOfGrade;