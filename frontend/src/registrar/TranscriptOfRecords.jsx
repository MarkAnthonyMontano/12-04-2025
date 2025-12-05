import { Box, Typography, TextField, Snackbar, Alert, Avatar, Card, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Checkbox } from "@mui/material";
import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import EaristLogo from "../assets/EaristLogo.png";
import { InsertPageBreak, Search } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import axios from "axios";
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
const TOR = () => {


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



    const [person, setPerson] = useState({

        profile_img: "",
        campus: "",
        academicProgram: "",
        classifiedAs: "",
        program: "",
        program2: "",
        program3: "",
        yearLevel: "",
        last_name: "",
        first_name: "",
        middle_name: "",
        extension: "",
        nickname: "",
        height: "",
        weight: "",
        lrnNumber: "",
        gender: "",
        pwdType: "",
        pwdId: "",
        birthOfDate: "",
        age: "",
        birthPlace: "",
        languageDialectSpoken: "",
        citizenship: "",
        religion: "",
        civilStatus: "",
        tribeEthnicGroup: "",
        otherEthnicGroup: "",
        cellphoneNumber: "",
        emailAddress: "",
        telephoneNumber: "",
        facebookAccount: "",
        presentStreet: "",
        presentBarangay: "",
        presentZipCode: "",
        presentRegion: "",
        presentProvince: "",
        presentMunicipality: "",
        presentDswdHouseholdNumber: "",
        permanentStreet: "",
        permanentBarangay: "",
        permanentZipCode: "",
        permanentRegion: "",
        permanentProvince: "",
        permanentMunicipality: "",
        permanentDswdHouseholdNumber: "",
        father_deceased: "",
        father_family_name: "", father_given_name: "", father_middle_name: "", father_ext: "", father_contact: "", father_occupation: "",
        father_income: "", father_email: "", mother_deceased: "", mother_family_name: "", mother_given_name: "", mother_middle_name: "",
        mother_contact: "", mother_occupation: "", mother_income: "", guardian: "", guardian_family_name: "", guardian_given_name: "",
        guardian_middle_name: "", guardian_ext: "", guardian_nickname: "", guardian_address: "", guardian_contact: "", guardian_email: "",
    });



    const [campusAddress, setCampusAddress] = useState("");

    useEffect(() => {
        if (settings && settings.address) {
            setCampusAddress(settings.address);
        }
    }, [settings]);

    // ✅ Fetch person data from backend
    const fetchPersonData = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/person/${id}`);
            setPerson(res.data); // make sure backend returns the correct format
        } catch (error) {
            console.error("Failed to fetch person:", error);
        }
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const queryPersonId = queryParams.get("person_id");
    const [registrars, setRegistrars] = useState([]);
    const [selectedPreparedBy, setSelectedPreparedBy] = useState(null);
    const [selectedCheckedBy, setSelectedCheckedBy] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const storedID = localStorage.getItem("person_id");

        if (storedUser && storedRole && storedID) {
            setUser(storedUser);
            setUserRole(storedRole);
            setUserID(storedID);

            if (storedRole === "applicant" || storedRole === "registrar") {
                fetchPersonData(storedID);
            } else {
                window.location.href = "/login";
            }
        } else {
            window.location.href = "/login";
        }
    }, []);




    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [employeeID, setEmployeeID] = useState("");
    const [studentData, setStudentData] = useState([]);
    const [studentNumber, setStudentNumber] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [studentDetails, setStudentDetails] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    const [activeStep, setActiveStep] = useState(5);
    const [clickedSteps, setClickedSteps] = useState([]);

    const navigate = useNavigate();

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

    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);


    const pageId = 62;

    //Put this After putting the code of the past code
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

    useEffect(() => {
        const fetchRegistrars = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/registrar-users`);
                setRegistrars(res.data.registrars);
            } catch (err) {
                console.error(err);
            }
        };
        fetchRegistrars();
    }, []);

    const totalUnitPerSubject = (course_unit, lab_unit) => {
        const lec = Number(course_unit) || 0;
        const lab = Number(lab_unit) || 0;
        return lec + lab;
    };

    const groupedDetails = {};
    if (Array.isArray(studentDetails)) {
        studentDetails.forEach(item => {
            const key = `${item.school_year}-${item.semester_description}`;
            if (!groupedDetails[key]) {
                groupedDetails[key] = [];
            }
            groupedDetails[key].push(item);
        });
    }

    function convertSemester(semester) {
        if (!semester) return "";

        const normalized = semester.replace(/\s+/g, "").toUpperCase();

        switch (normalized) {
            case "FIRSTSEMESTER":
                return "1st Semester";
            case "SECONDSEMESTER":
                return "2nd Semester";
            case "THIRDSEMESTER":
                return "3rd Semester";
            case "FOURTHSEMESTER":
                return "4th Semester";
            default:
                return semester;
        }
    }

    const groupedSubjects = Object.entries(groupedDetails).map(([key, courses]) => ({
        termKey: key,
        year: courses[0]?.current_year,
        nextYear: courses[0]?.next_year,
        semester: courses[0]?.semester_description,
        subjects: courses
    }));

    // Constants
    const MAX_PAGE_HEIGHT_REM = 54;
    const SUBJECT_HEIGHT_REM = 1.30;
    const MAX_SUBJECTS_PER_PAGE = Math.floor(MAX_PAGE_HEIGHT_REM / SUBJECT_HEIGHT_REM);

    // Function to chunk subjects into pages
    const chunkArray = (arr, maxSubjects) => {
        const result = [];
        let currentPage = [];
        let currentCount = 0;

        for (const group of arr) {
            let remainingSubjects = [...group.subjects];
            let isContinuation = false;

            while (remainingSubjects.length > 0) {
                const availableSpace = maxSubjects - currentCount;

                if (remainingSubjects.length <= availableSpace) {
                    // All subjects fit on this page
                    currentPage.push({
                        ...group,
                        subjects: remainingSubjects,
                        isContinuation
                    });
                    currentCount += remainingSubjects.length;
                    remainingSubjects = [];
                } else {
                    // Some subjects fit, others overflow → split group
                    const fitSubjects = remainingSubjects.slice(0, availableSpace);
                    const overflowSubjects = remainingSubjects.slice(availableSpace);

                    currentPage.push({
                        ...group,
                        subjects: fitSubjects,
                        isContinuation
                    });
                    result.push(currentPage);

                    // start new page with remaining subjects
                    currentPage = [];
                    currentCount = 0;
                    remainingSubjects = overflowSubjects;
                    isContinuation = true; // mark next split as continuation
                }

                if (currentCount >= maxSubjects) {
                    result.push(currentPage);
                    currentPage = [];
                    currentCount = 0;
                }
            }
        }

        if (currentPage.length > 0) result.push(currentPage);

        return result;
    };

    const paginatedSubjects = chunkArray(groupedSubjects, MAX_SUBJECTS_PER_PAGE);

    const formattedDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const todayDate = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const divToPrintRef = useRef();

    const printDiv = () => {
        window.print();
    };


    const handlePreparedByChange = (user) => {
        setSelectedPreparedBy(prev => prev?.employee_id === user.employee_id ? null : user);
    };

    const handleCheckedByChange = (user) => {
        setSelectedCheckedBy(prev => prev?.employee_id === user.employee_id ? null : user);
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
                className="navbars"
                sx={{
                    display: "flex",
                    background: "white",
                    alignItems: "center",
                    justifyContent: "space-between",

                    mb: 2,
                }}
            >
                {/* Left: Title */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        color: titleColor,
                        fontSize: "36px",
                        background: "white",
                        display: "flex",
                        alignItems: "center",

                    }}
                >
                    TRANSCRIPT OF RECORDS
                </Typography>

                {/* Right: Search + Print grouped together */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                            Print TOR
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
                            margin: 0 !important; 
                            padding: 0 !important;
                            size: 216mm 356mm;
                        }
                        
                        html, body {
                            margin: 0 !important;
                            padding: 0 !important;
                            height: auto;
                            position: relative
                        }
                    
                        body * {
                            visibility: hidden;
                        }
    
                        .body, .page {
                            display: block !important;
                            overflow: visible !important;
                            height: auto !important;
                            max-height: none !important;
                        }

                        .page {
                            zoom: 0.8;
                            position: absolute;
                            top: 0;
                        }

                        .print-container, .print-container *, .page, .page *{
                            visibility: visible;

                        }

                        .print-container {
                            display: block;
                            width: 100%;
                            position: relative;
                            margin-top: 0 !mportant;
                            margin-bottom: 0 !mportant;
                            margin-right: 0 !mportant;
                            padding: 0 !important;
                            min-height: 13.5in;
                            margin-left: -23.5%;
                            font-family: "Poppins", sans-serif;
                        }

                        .print-container:first-child {
                            page-break-after: auto;
                        }

                        .page-container{
                            display: block !important;
                        }
                            
                        .print-container:last-child {
                            page-break-after: auto;
                            margin-top: 0;
                        }

                        .print-container:first-child .page-header{
                            top: 0;
                        }

                        .page-header{
                            margin-top: -2rem !important;
                            height: 10rem !important;
                        }
                        
                        .table{
                            min-height: 85rem !important;
                            max-height: 85rem !important;
                        }

                        .no-border{
                            border-bottom: none !important;
                        }

                        button {
                            display: none !important; /* hide buttons */
                        }
                        
                    }
                `}
            </style>
            <Box style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Box style={{ background: "white", height: "12rem" }}>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={5} align="center" style={{ fontSize: "15px", color: "white", background: mainButtonColor, border: `1px solid ${borderColor}` }}><strong>REGISTRAR USERS</strong></TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ border: `2px solid ${borderColor}`, fontWeight: "600", color: titleColor }}>#</TableCell>
                                    <TableCell style={{ border: `2px solid ${borderColor}`, fontWeight: "600", color: titleColor }}>Employee ID</TableCell>
                                    <TableCell style={{ border: `2px solid ${borderColor}`, fontWeight: "600", color: titleColor }} align="center">Fullname</TableCell>
                                    <TableCell style={{ border: `2px solid ${borderColor}`, fontWeight: "600", color: titleColor }} align="center">Role</TableCell>
                                    <TableCell style={{ border: `2px solid ${borderColor}`, fontWeight: "600", color: titleColor }} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {registrars.map((user, index) => (
                                    <TableRow key={user.employee_id}>
                                        <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center", fontSize: "14px", color: titleColor }}>{index + 1}</TableCell>
                                        <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center", fontSize: "14px", color: titleColor }}>{user.employee_id}</TableCell>
                                        <TableCell style={{ border: `2px solid ${borderColor}`, color: titleColor }}>{`${user.first_name} ${user.middle_name || ""} ${user.last_name}`}</TableCell>
                                        <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center", color: titleColor }}>{user.role}</TableCell>
                                        <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center", color: titleColor }}>
                                            <Box display="flex" alignItems="center">
                                                <Box display="flex" alignItems="center" mb={0.5}>
                                                    <Checkbox
                                                        color="primary"
                                                        checked={selectedPreparedBy?.employee_id === user.employee_id}
                                                        onChange={() => handlePreparedByChange(user)}
                                                        disabled={selectedCheckedBy?.employee_id === user.employee_id}
                                                    /> Prepared By
                                                </Box>
                                                <Box display="flex" alignItems="center">
                                                    <Checkbox
                                                        color="secondary"
                                                        checked={selectedCheckedBy?.employee_id === user.employee_id}
                                                        onChange={() => handleCheckedByChange(user)}
                                                        disabled={selectedPreparedBy?.employee_id === user.employee_id}
                                                    />
                                                    Check By
                                                </Box>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
            <Box style={{ width: "100%", display: "flex", justifyContent: "center" }} className="page-container">
                <Box ref={divToPrintRef} className="page" style={{ minWidth: "215.9mm", minHeight: "356mm" }}>
                    {paginatedSubjects.map((pageGroups, pageIndex) => (
                        <Box key={pageIndex} className={`print-container print-container-${pageIndex + 1}`} style={{ pageBreakAfter: "always", breakAfter: "page", paddingRight: "1.5rem", marginTop: "3rem", paddingBottom: "1.5rem" }}>
                            {/* Start Of Header */}
                            <Box className="page-header" style={{ display: "flex", alignItems: "center", height: "10rem", width: "80rem", justifyContent: "center" }}>
                                <Box style={{ paddingTop: "1.5rem", marginLeft: "-10rem", paddingRight: "3rem" }}>
                                    <img
                                        src={fetchedLogo || EaristLogo} // use dynamic logo if available
                                        alt="Logo"
                                        style={{ width: "8rem", height: "8rem", borderRadius: "50%" }}
                                    />
                                </Box>
                                <Box style={{ marginTop: "1.5rem", textAlign: "center" }}>
                                    <Typography>Republic of the Philippines</Typography>

                                    {companyName && (
                                        (() => {
                                            const words = companyName.trim().split(" ");
                                            const middle = Math.ceil(words.length / 2);
                                            const firstLine = words.slice(0, middle).join(" ");
                                            const secondLine = words.slice(middle).join(" ");
                                            return (
                                                <>
                                                    <Typography
                                                        style={{
                                                            marginTop: "0rem",
                                                            lineHeight: "1",
                                                            fontSize: "1.6rem",
                                                            letterSpacing: "-1px",
                                                            fontWeight: "600",
                                                            fontFamily: "Times new roman"
                                                        }}
                                                    >
                                                        {firstLine}
                                                    </Typography>
                                                    {secondLine && (
                                                        <Typography
                                                            style={{
                                                                lineHeight: "1",
                                                                fontSize: "1.6rem",
                                                                letterSpacing: "-1px",
                                                                fontWeight: "600",
                                                                fontFamily: "Times new roman"
                                                            }}
                                                        >
                                                            {secondLine}
                                                        </Typography>
                                                    )}
                                                </>
                                            );
                                        })()
                                    )}

                                    <Typography style={{ fontSize: "12px" }}>{campusAddress}</Typography>
                                </Box>

                            </Box>
                            <Typography style={{ height: "1.5rem", marginLeft: "1rem", textAlign: "center", width: "80rem", fontSize: "1.6rem", letterSpacing: "-1px", fontWeight: "500" }}>OFFICE OF THE REGISTRAR</Typography>
                            <Typography style={{ height: "2.5rem", marginLeft: "1rem", marginTop: "-0.5rem", width: "80rem", textAlign: "center", fontSize: "2.75rem", letterSpacing: "-1px", fontWeight: "600" }}>OFFICIAL TRANSCRIPT OF RECORDS</Typography>
                            <Box style={{ display: "flex", marginTop: "1rem" }}>
                                <Box>
                                    <Box style={{ display: "flex", height: "17.5rem", }}>
                                        <Box sx={{ padding: "1rem", marginLeft: "1rem", borderBottom: "solid black 1px", width: "80rem" }}>
                                            <Box>
                                                <Box style={{ display: "flex", width: "40rem" }}>
                                                    <Typography style={{ width: "20rem", fontSize: "22px", letterSpacing: "-2px", wordSpacing: "14rem" }}>NAME :</Typography>

                                                    <Typography style={{ display: "flex", fontSize: "24px", fontWeight: "600", letterSpacing: "-1.5px", wordSpacing: "3px", alignItems: "center", height: "36px" }}>
                                                        {studentData && studentData.last_name
                                                            ? `${studentData.last_name.toUpperCase()}, ${studentData.first_name.toUpperCase()}`
                                                            : ""}
                                                    </Typography>
                                                </Box>
                                                <Box style={{ display: "flex", marginTop: "-6px" }}>
                                                    <Typography style={{ display: "flex", width: "17.8rem", height: "20px", alignItems: "center", fontSize: "22px", letterSpacing: "-1px", justifyContent: "space-between" }}>
                                                        <span>DATE OF BIRTH</span>
                                                        <span>:</span>
                                                    </Typography>
                                                    <Typography style={{ fontSize: "21px", marginTop: "-5px", marginLeft: "2.3rem", fontWeight: "400", letterSpacing: "-1px", wordSpacing: "3px" }}>{formattedDate(studentData.birthOfDate)}</Typography>
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Box style={{ display: "flex", width: "62rem", marginTop: "0.6rem" }}>
                                                    <Typography style={{ display: "flex", width: "17.8rem", height: "20px", alignItems: "center", fontSize: "22px", letterSpacing: "-2.3px", justifyContent: "space-between" }}>
                                                        <span>ADMISSION CREDENTIALS</span>
                                                        <span>:</span>
                                                    </Typography>
                                                    {studentData && studentData.requirements && (
                                                        <Typography style={{ fontSize: "21px", marginTop: "-5px", height: "30px", marginLeft: "2.3rem", fontWeight: "400", letterSpacing: "-2px", wordSpacing: "1px" }}>
                                                            {studentData.requirements
                                                                .map(reqId =>
                                                                    reqId === 0 ? "No Document" :
                                                                        reqId === 1 ? "F138" :
                                                                            reqId === 2 ? "Certificate Of Good Moral Character" :
                                                                                reqId === 3 ? "NSO Birth Certificate" :
                                                                                    reqId === 4 ? "F137" :
                                                                                        ""
                                                                )
                                                                .join("/")}
                                                        </Typography>
                                                    )}
                                                </Box>
                                                <Box style={{ display: "flex", marginTop: "-1px" }}>
                                                    <Typography style={{ display: "flex", width: "17.8rem", height: "20px", alignItems: "center", fontSize: "22px", letterSpacing: "-2.3px", justifyContent: "space-between" }}>
                                                        <span style={{ wordSpacing: "2px" }}>LAST SCHOOL ATTENDED</span>
                                                        <span>:</span>
                                                    </Typography>
                                                    <Typography style={{ fontSize: "22px", marginTop: "-5px", marginLeft: "2.3rem", fontWeight: "400", letterSpacing: "-1.5px", wordSpacing: "5px" }}>
                                                        {studentData.schoolLastAttended}
                                                    </Typography>
                                                </Box>
                                                <Box style={{ display: "flex", marginTop: "-3px" }}>
                                                    <Typography style={{ display: "flex", width: "17.8rem", height: "30px", alignItems: "center", fontSize: "22px", letterSpacing: "-2.3px", justifyContent: "space-between" }}>
                                                        <span style={{ wordSpacing: "3px" }}>DATE GRADUATED</span>
                                                        <span>:</span>
                                                    </Typography>
                                                    <Typography style={{ fontSize: "22px", marginTop: "-5px", marginLeft: "2.3rem", fontWeight: "400", letterSpacing: "-1.5px", wordSpacing: "5px" }}>
                                                        {studentData.previous_year} - {studentData.yearGraduated}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Box style={{ display: "flex", width: "38rem", marginTop: "0.9rem" }}>
                                                    <Typography style={{ display: "flex", width: "17.8rem", height: "20px", alignItems: "center", fontSize: "22px", letterSpacing: "-1px", justifyContent: "space-between" }}>
                                                        <span>STUDENT NUMBER</span>
                                                        <span>:</span>
                                                    </Typography>

                                                    <Typography style={{ fontSize: "21px", marginTop: "-5px", marginLeft: "2.3rem", fontWeight: "500", letterSpacing: "-1px", wordSpacing: "3px", height: "30px" }}>{studentData.student_number}</Typography>
                                                </Box>
                                                <Box style={{ display: "flex" }}>
                                                    <Typography style={{ display: "flex", width: "17.8rem", height: "20px", alignItems: "center", fontSize: "22px", letterSpacing: "-1px", justifyContent: "space-between" }}>
                                                        <span>DEGREE/TITLE EARNED</span>
                                                        <span>:</span>
                                                    </Typography>
                                                    <Typography style={{ fontSize: "22px", marginLeft: "2.3rem", marginTop: "-5.5px", fontWeight: "500", letterSpacing: "-1.5px", wordSpacing: "5px", height: "30px" }}>
                                                        {studentData && studentData.program_description
                                                            ? `${studentData.program_description.toUpperCase()}`
                                                            : ""}
                                                    </Typography>
                                                </Box>
                                                <Box style={{ display: "flex", marginTop: "1px" }}>
                                                    <Typography style={{ display: "flex", width: "17.8rem", height: "20px", alignItems: "center", fontSize: "22px", letterSpacing: "-1.5px", justifyContent: "space-between" }}>
                                                        <span>MAJOR</span>
                                                        <span>:</span>
                                                    </Typography>
                                                    <Typography style={{ fontSize: "22px", marginTop: "-5px", marginLeft: "2.3rem", fontWeight: "500", letterSpacing: "-1.5px", wordSpacing: "5px", height: "30px" }}>
                                                        {studentData && studentData.major
                                                            ? `${studentData.major.toUpperCase()}`
                                                            : ""}
                                                    </Typography>
                                                </Box>
                                                <Box style={{ display: "flex", marginTop: "1px" }}>
                                                    <Typography style={{ display: "flex", width: "17.8rem", height: "20px", alignItems: "center", fontSize: "22px", letterSpacing: "-2px", justifyContent: "space-between", wordSpacing: "4px" }}>
                                                        <span>DATE OF GRADUATION</span>
                                                        <span>:</span>
                                                    </Typography>
                                                    <Typography style={{ fontSize: "22px", marginTop: "-5px", marginLeft: "2.3rem", fontWeight: "500", letterSpacing: "-1.5px", wordSpacing: "5px" }}>

                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box style={{ marginLeft: "-12.6rem", marginTop: "1.3rem" }}>
                                            {!studentData?.profile_image ? (
                                                <Avatar
                                                    sx={{
                                                        width: 200,
                                                        height: 226,
                                                        border: "3px solid maroon",
                                                        color: "maroon",
                                                        bgcolor: "transparent",
                                                    }}
                                                    variant="square"
                                                />
                                            ) : (
                                                <Avatar
                                                    src={`${API_BASE_URL}/uploads/${studentData.profile_image}`}
                                                    sx={{
                                                        width: 200,
                                                        height: 246,
                                                        mx: "auto",
                                                    }}
                                                    variant="square"
                                                />
                                            )}
                                        </Box>
                                    </Box>
                                    {/* End of Header */}
                                    {/* Start of Main Content */}
                                    <Box style={{ display: "flex", marginLeft: "1rem", marginTop: "0.5rem", flexWrap: "wrap", borderTop: "solid black 1px", overflow: "hidden" }}>
                                        <Box style={{ flex: "0 0 50%", marginBottom: "1rem", boxSizing: "border-box" }}>
                                            <table className="table" style={{ minHeight: "67rem" }}>
                                                <thead>
                                                    <tr style={{ display: "flex", height: "65px", borderBottom: "solid 1px black" }}>
                                                        <td style={{ fontWeight: "600", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: "0.8px", width: "13rem" }}>
                                                            <span>TERM</span>
                                                        </td>
                                                        <td style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "38rem" }}>
                                                            <div style={{ margin: "-1px", fontWeight: "600", fontSize: "20px", textAlign: "center", letterSpacing: "-1px", width: "28rem" }}>SUBJECTS</div>
                                                            <div style={{ margin: "-1px", fontWeight: "600", fontSize: "20px", textAlign: "center", letterSpacing: "-1px", width: "28rem", wordSpacing: "3px" }}>CODE NUMBER WITH DESCRIPTIVE TITLE</div>
                                                        </td>
                                                        <td>
                                                            <div style={{ fontWeight: "600", textAlign: "center", fontSize: "20px", letterSpacing: "-1px", width: "13rem" }}>
                                                                <span style={{ marginLeft: "-1.6rem" }}>GRADES</span>
                                                            </div>
                                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                                <div style={{ fontWeight: "600", fontSize: "20px", textAlign: "center", letterSpacing: "-1px", width: "6rem" }}>
                                                                    <span>FINAL</span>
                                                                </div>
                                                                <div style={{ textAlign: "center", fontWeight: "600", fontSize: "20px", marginLeft: "-2rem", letterSpacing: "-1px", width: "7rem" }}>
                                                                    <span>RE-EXAM</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontWeight: "600", display: "flex", fontSize: "20px", alignItems: "center", justifyContent: "center", letterSpacing: "-1px", width: "7rem" }}>
                                                            <span>CREDITS</span>
                                                        </td>
                                                        <td style={{ fontWeight: "600", display: "flex", fontSize: "20px", alignItems: "center", justifyContent: "center", letterSpacing: "-1px", width: "8.9rem" }}>
                                                            <span>REMARKS</span>
                                                        </td>
                                                    </tr>
                                                </thead>
                                                <tbody style={{ maxWidth: "650px", overflowY: "hidden" }}>
                                                    <tr>
                                                        <td style={{ fontWeight: "500", textUnderlineOffset: "3px", textDecoration: "underline", letterSpacing: "-1px", paddingLeft: "1.5rem", fontSize: "20px" }}>
                                                            {studentData && studentData.program_description
                                                                ? `${studentData.program_description.toUpperCase()}`
                                                                : ""}
                                                        </td>
                                                    </tr>

                                                    {pageGroups.map(group => (
                                                        <React.Fragment key={group.termKey}>
                                                            {group.subjects.map((p, index) => (
                                                                <tr style={{ display: "flex" }} key={p.enrolled_id}>
                                                                    <td
                                                                        style={{
                                                                            width: "13rem",
                                                                            fontWeight: "400",
                                                                            display: "flex",
                                                                            flexDirection: "column",
                                                                            justifyContent: "center",
                                                                            alignItems: "flex-start",
                                                                            position: "relative",
                                                                            paddingTop: index === 0 ? "0" : "0",
                                                                        }}
                                                                    >
                                                                        {!group.isContinuation && index === 0 && (
                                                                            <>
                                                                                <span style={{ fontSize: "18px", textAlign: "center", width: "14rem", fontWeight: "500" }}>
                                                                                    {convertSemester(p.semester_description)}
                                                                                </span>
                                                                                <span
                                                                                    style={{
                                                                                        fontSize: "17px",
                                                                                        marginTop: "3rem",
                                                                                        position: "absolute",
                                                                                        textAlign: "center",
                                                                                        width: "13.5rem",
                                                                                        fontWeight: "500"
                                                                                    }}
                                                                                >
                                                                                    {p.current_year} - {p.next_year}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </td>
                                                                    <td style={{ display: "flex", width: "38rem" }}>
                                                                        <span style={{ width: "90px", margin: "0", padding: "0", fontSize: "18px", letterSpacing: "-0.5px" }}>{p.course_code}</span>
                                                                        <span style={{ marginLeft: "30px", padding: "0", fontSize: "18px", letterSpacing: "-0.5px" }}>{p.course_description.toUpperCase()}</span>
                                                                    </td>
                                                                    <td>
                                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                                            <div style={{ fontSize: "18px", width: "6rem", textAlign: "center" }}>
                                                                                <span>{p.final_grade}</span>
                                                                            </div>
                                                                            <div style={{ fontSize: "18px", textAlign: "center", width: "7rem", marginLeft: "-2rem" }}>
                                                                                <span></span>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div style={{ display: "flex", fontSize: "18px", alignItems: "center", width: "7rem", marginLeft: "1.7rem", justifyContent: "center" }}>
                                                                            {totalUnitPerSubject(p.course_unit, p.lab_unit)}
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div style={{ display: "flex", alignItems: "center", width: "8.9rem", fontSize: "18px", justifyContent: "center" }}>
                                                                            {p.en_remarks === 0 ? "Incomplete" :
                                                                                p.en_remarks === 1 ? "Passed" :
                                                                                    p.en_remarks === 2 ? "Failed" :
                                                                                        p.en_remarks === 3 ? "Incomplete" :
                                                                                            p.en_remarks === 4 ? "Dropped" :
                                                                                                ""
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}

                                                          

                                                        </React.Fragment>
                                                    ))}

                                                    <tr style={{ height: "30px" }}>
                                                        {pageIndex === paginatedSubjects.length - 1 ? (
                                                            <td className="table-cell-padding" style={{ textAlign: "center", marginTop: "2rem", paddingTop: "1rem" }}>
                                                                <span style={{ fontSize: "17px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", maxWidth: "100px", width: "100%" }}>
                                                                    <span style={{ fontSize: "14px", marginRight: "2px" }}>{"earist".repeat(13)} xxx </span>NOTHING FOLLOWS
                                                                    <span style={{ fontSize: "14px", marginLeft: "2px" }}> xxx {"earist".repeat(13)}</span>
                                                                </span>
                                                            </td>
                                                        ) : (
                                                            <td style={{ textAlign: "center", borderTop: "dashed 1px black" }}>
                                                                <span style={{ fontSize: "17px", fontWeight: "600" }}>
                                                                    - continue on next page -
                                                                </span>
                                                            </td>
                                                        )}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Box>
                                    </Box>
                                    {/* End of Main Content */}
                                    {/* Start Of Footer */}
                                    <Box className="page-footer" style={{ display: "flex", marginLeft: "1rem", marginTop: "-1rem", flexWrap: "wrap" }}>
                                        <Box style={{ flex: "0 0 50%", marginBottom: "1rem", boxSizing: "border-box" }}>
                                            <table >
                                                <thead>
                                                    <tr className="grading_sytse_tble" style={{ display: "flex", height: "145px", borderTop: "solid 1px black" }}>
                                                        <td style={{ fontWeight: "400", fontSize: "18px", display: "flex", alignItems: "start", justifyContent: "center", letterSpacing: "-1px", width: "13rem" }}>
                                                            <span>GRADING SYSTEM</span>

                                                        </td>
                                                        <td style={{ display: "flex", flexDirection: "column", alignItems: "start", width: "4.5rem" }}>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "0px", paddingTop: "3px" }}>1.00</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "0px" }}>1.25</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "0px" }}>1.50</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "0px" }}>1.75</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>2.00</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>2.25</div>
                                                        </td>
                                                        <td style={{ display: "flex", flexDirection: "column", alignItems: "start", width: "6.5rem" }}>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px", paddingTop: "3px" }}>(97-100)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>(94-96)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>(91-93)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>(88-90)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>(85-87)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>(82-84)</div>
                                                        </td>
                                                        <td style={{ display: "flex", flexDirection: "column", alignItems: "start", width: "15.5rem" }}>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px", paddingTop: "3px" }}>Marked Excellence</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Excellent</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Very Superior</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Superior</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Very Good</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Good</div>
                                                        </td>
                                                        <td style={{ display: "flex", flexDirection: "column", alignItems: "start", width: "4.5rem" }}>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px", paddingTop: "3px" }}>2.50</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>2.75</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>3.00</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>5.00</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>INC</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>DRP</div>
                                                        </td>
                                                        <td style={{ display: "flex", flexDirection: "column", alignItems: "start", width: "14rem" }}>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px", paddingTop: "3px" }}>(79-81)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>(76-78)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-2px" }}>(75)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1.5px" }}>(Below 75)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1.5px" }}>(Incomplete)</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1.5px" }}>(Dropped Officially/Unofficialy)</div>
                                                        </td>
                                                        <td style={{ display: "flex", flexDirection: "column", alignItems: "start", width: "22rem" }}>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px", paddingTop: "3px" }}>Satisfactory</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Fair</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Passed</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Failed</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Incomplete</div>
                                                            <div style={{ margin: "-1px", fontWeight: "400", fontSize: "16px", letterSpacing: "-1px" }}>Dropped</div>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ display: "flex", paddingLeft: "2rem", height: "35px", borderBottom: "solid 1px black" }}>
                                                        <td>
                                                            <span style={{ fontSize: "18px" }}>
                                                                CREDITS, O
                                                            </span>
                                                            <span>
                                                                ne college units is at least (17) full hours of instruction in academic or professional subject within a semester.
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ display: "flex", paddingLeft: "2rem", height: "65px", borderBottom: "solid 1px black" }}>
                                                        <td style={{ marginTop: "8px" }}>
                                                            <span style={{ fontSize: "18px", marginRight: "8px", letterSpacing: "-0.8px", wordSpacing: "1px" }}>
                                                                EULOGIO "AMANG" RODRIGUEZ INSTITUTE OF SCIENCE AND TECHNOLOGY
                                                            </span>
                                                            <span style={{ letterSpacing: "-0.8px", fontSize: "17px", wordSpacing: "1px" }}>
                                                                is a State College; hence, a SPECIAL ORDER is not issued to its graduates. The <br />
                                                                issuance of the Official Transcript of Records and Diploma is a sufficient proof for Graduation.
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ display: "flex", paddingLeft: "1rem", marginTop: "0.3rem", height: "65px", borderTop: "solid 1px black", borderBottom: "solid 1px black" }}>
                                                        <td style={{ marginTop: "8px" }}>
                                                            <span style={{ fontSize: "18px", fontWeight: "600", marginRight: "8px", letterSpacing: "-0.8px", wordSpacing: "1px" }}>
                                                                REMARKS:
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr style={{ display: "flex", paddingLeft: "1rem", marginTop: "0.3rem", height: "35px" }}>
                                                        <td style={{ marginTop: "3px" }}>
                                                            <span style={{ fontSize: "18px", fontWeight: "400", marginRight: "2.4rem", letterSpacing: "-0.8px", wordSpacing: "1px" }}>
                                                                DATE ISSUED:
                                                            </span>
                                                            <span style={{ fontSize: "18px", letterSpacing: "-1px", wordSpacing: "3px" }}>
                                                                {todayDate}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    <tr className="no-border" style={{ display: "flex", paddingLeft: "1rem", marginTop: "0.3rem", height: "9rem", borderBottom: "solid black 1px" }}>
                                                        <td style={{ marginTop: "3px", width: "17rem" }}>
                                                            <div>
                                                                <span style={{ fontSize: "18px", letterSpacing: "-1px", wordSpacing: "3px" }}>

                                                                </span>
                                                                <span>

                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td style={{ marginTop: "3px", width: "20rem" }}>
                                                            <span style={{ fontSize: "18px", fontWeight: "400", marginRight: "2.4rem", letterSpacing: "-0.8px", wordSpacing: "1px" }}>
                                                                PREPARED BY:
                                                            </span>
                                                            <div style={{ marginTop: "2.3rem", }}>
                                                                <span style={{ fontSize: "24px", fontWeight: "500", letterSpacing: "-1px", wordSpacing: "3px" }}>
                                                                    {selectedPreparedBy
                                                                        ? `${selectedPreparedBy.first_name} 
                                                                        ${selectedPreparedBy.middle_name ? selectedPreparedBy.middle_name[0] + "." : ""} 
                                                                        ${selectedPreparedBy.last_name}`.toUpperCase()
                                                                        : ""}
                                                                </span>
                                                                <span>

                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td style={{ marginTop: "3px", width: "20rem" }}>
                                                            <span style={{ fontSize: "18px", fontWeight: "400", marginRight: "2.4rem", letterSpacing: "-0.8px", wordSpacing: "1px" }}>
                                                                CHECKED BY:
                                                            </span>
                                                            <div style={{ marginTop: "2.3rem", }}>
                                                                <span style={{ fontSize: "24px", fontWeight: "500", letterSpacing: "-1px", wordSpacing: "3px" }}>
                                                                    {selectedCheckedBy
                                                                        ? `${selectedCheckedBy.first_name} 
                                                                        ${selectedCheckedBy.middle_name ? selectedCheckedBy.middle_name[0] + "." : ""} 
                                                                        ${selectedCheckedBy.last_name}`.toUpperCase()
                                                                        : ""}
                                                                </span>
                                                                <span>
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td style={{ marginTop: "-3px", width: "21rem", justifyContent: "center", alignContent: "center" }}>
                                                            <div style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
                                                                <span style={{ fontSize: "24px", letterSpacing: "-2px", wordSpacing: "3px" }}>
                                                                    JULIE ANN O. ESPIRITU, JD.
                                                                </span>
                                                                <span style={{ marginTop: "-0.8rem", fontSize: "24px", fontWeight: "500", letterSpacing: "-2px" }}>
                                                                    REGISTRAR
                                                                </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </Box>
                                    </Box>
                                    {/* End Of Footer */}
                                </Box>
                            </Box>
                        </Box>
                    ))}
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
    )
}

export default TOR;