import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
    Box,
    TextField,
    Typography,
    Button,
    Grid,
    Card,
    TableContainer,
    TableHead,
    TableCell,
    TableRow,
    FormControlLabel,
    Checkbox,
    Container,
    Paper,
    Table,
} from "@mui/material";
import API_BASE_URL from "../apiConfig";
import { useNavigate } from "react-router-dom";
import SaveIcon from '@mui/icons-material/Save';
import { motion } from "framer-motion";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import SchoolIcon from '@mui/icons-material/School';
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import PsychologyIcon from "@mui/icons-material/Psychology";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import SearchIcon from "@mui/icons-material/Search";

const PhysicalNeuroExam = () => {
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



    const [studentNumber, setStudentNumber] = useState("");
    const [person, setPerson] = useState(null);

    const [persons, setPersons] = useState([]);

    const [selectedPerson, setSelectedPerson] = useState(null);
    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const queryParams = new URLSearchParams(location.search);
    const queryPersonId = queryParams.get("person_id")?.trim() || "";
    const [explicitSelection, setExplicitSelection] = useState(false);


    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);


    const pageId = 32;

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




    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState("");
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.trim() === "") return;

            try {
                const res = await axios.get(`${API_BASE_URL}/api/search-person-student`, {
                    params: { query: searchQuery }
                });

                console.log("Search result data:", res.data);
                setPerson(res.data);

                const idToStore = res.data.person_id || res.data.id;
                if (!idToStore) {
                    setSearchError("Invalid search result");
                    return;
                }

                sessionStorage.setItem("admin_edit_person_id", idToStore);
                sessionStorage.setItem("admin_edit_person_data", JSON.stringify(res.data)); // ✅ added
                setUserID(idToStore);
                setSearchError("");
            } catch (err) {
                console.error("Search failed:", err);
                setSearchError("Applicant not found");
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);


    useEffect(() => {
        if (!searchQuery.trim()) {
            // 🔹 If search is empty, clear everything
            setSelectedPerson(null);
            setPerson({
                profile_img: "",
                generalAverage1: "",
                height: "",
                applyingAs: "",
                document_status: "",
                last_name: "",
                first_name: "",
                middle_name: "",
                extension: "",
            });
            return;
        }

        // 🔹 Try to find a matching applicant from the list
        const match = persons.find((p) =>
            `${p.first_name} ${p.middle_name} ${p.last_name} ${p.emailAddress} ${p.applicant_number || ''}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );

        if (match) {
            // ✅ If found, set this as the "selectedPerson"
            setSelectedPerson(match);
        } else {
            // ❌ If not found, clear again
            setSelectedPerson(null);
            setPerson({
                profile_img: "",
                generalAverage1: "",
                height: "",
                applyingAs: "",
                document_status: "",
                last_name: "",
                first_name: "",
                middle_name: "",
                extension: "",
            });
        }
    }, [searchQuery, persons]);


    const fetchByPersonId = async (personID) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/person_with_applicant/${personID}`);
            setPerson(res.data);
            setSelectedPerson(res.data);
            if (res.data?.student_number) {
            }
        } catch (err) {
            console.error("❌ person_with_applicant failed:", err);
        }
    };

    useEffect(() => {
        let consumedFlag = false;

        const tryLoad = async () => {
            if (queryPersonId) {
                await fetchByPersonId(queryPersonId);
                setExplicitSelection(true);
                consumedFlag = true;
                return;
            }

            // fallback only if it's a fresh selection from Applicant List
            const source = sessionStorage.getItem("admin_edit_person_id_source");
            const tsStr = sessionStorage.getItem("admin_edit_person_id_ts");
            const id = sessionStorage.getItem("admin_edit_person_id");
            const ts = tsStr ? parseInt(tsStr, 10) : 0;
            const isFresh = source === "medical_applicant_list" && Date.now() - ts < 5 * 60 * 1000;

            if (id && isFresh) {
                await fetchByPersonId(id);
                setExplicitSelection(true);
                consumedFlag = true;
            }
        };

        tryLoad().finally(() => {
            // consume the freshness so it won't auto-load again later
            if (consumedFlag) {
                sessionStorage.removeItem("admin_edit_person_id_source");
                sessionStorage.removeItem("admin_edit_person_id_ts");
            }
        });
    }, [queryPersonId]);



    // Fetch person by ID (when navigating with ?person_id=... or sessionStorage)
    useEffect(() => {
        const fetchPersonById = async () => {
            if (!userID) return;

            try {
                const res = await axios.get(`${API_BASE_URL}/api/person_with_applicant/${userID}`);
                if (res.data) {
                    setPerson(res.data);
                    setSelectedPerson(res.data);
                } else {
                    console.warn("⚠️ No person found for ID:", userID);
                }
            } catch (err) {
                console.error("❌ Failed to fetch person by ID:", err);
            }
        };

        fetchPersonById();
    }, [userID]);


    const [form, setForm] = useState({
        student_number: "",
        pne_mental_status_check: 0,
        pne_mental_status_text: "",
        pne_sensory_check: 0,
        pne_sensory_text: "",
        pne_cranial_nerve_check: 0,
        pne_cranial_nerve_text: "",
        pne_cerebellar_check: 0,
        pne_cerebellar_text: "",
        pne_motor_check: 0,
        pne_motor_text: "",
        pne_reflexes_check: 0,
        pne_reflexes_text: "",
        pne_findings_psychological: "",
        pne_recommendations: "",
    });

    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(5);

    const tabs1 = [
        { label: "Medical Applicant List", to: "/medical_applicant_list", icon: <ListAltIcon /> },
        { label: "Applicant Form", to: "/medical_dashboard1", icon: <HowToRegIcon /> },
        { label: "Submitted Documents", to: "/medical_requirements", icon: <UploadFileIcon /> }, // updated icon
        { label: "Medical History", to: "/medical_requirements_form", icon: <PersonIcon /> },
        { label: "Dental Assessment", to: "/dental_assessment", icon: <DescriptionIcon /> },
        { label: "Physical and Neurological Examination", to: "/physical_neuro_exam", icon: <SchoolIcon /> },
    ];
    // 🧠 Auto-fetch record
    useEffect(() => {
        if (studentNumber.trim().length >= 9) {
            const debounce = setTimeout(() => fetchRecord(studentNumber), 500);
            return () => clearTimeout(debounce);
        }
    }, [studentNumber]);

    const fetchRecord = async (number) => {
        if (!number) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/api/physical-neuro/${number}`);
            setForm(res.data);
        } catch {
            setForm((prev) => ({ ...prev, student_number: number }));
        }
    };

    const handleCheckbox = (e) => {
        const { name, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!studentNumber) return alert("Enter a student number first.");
        try {
            await axios.put(`${API_BASE_URL}/api/physical-neuro`, {
                ...form,
                student_number: studentNumber,
            });
            alert("Record saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Save failed.");
        }
    };

    const fields = [
        { label: "Mental Status", check: "pne_mental_status_check", text: "pne_mental_status_text" },
        { label: "Sensory", check: "pne_sensory_check", text: "pne_sensory_text" },
        { label: "Cranial Nerve", check: "pne_cranial_nerve_check", text: "pne_cranial_nerve_text" },
        { label: "Cerebellar", check: "pne_cerebellar_check", text: "pne_cerebellar_text" },
        { label: "Motor", check: "pne_motor_check", text: "pne_motor_text" },
        { label: "Reflexes", check: "pne_reflexes_check", text: "pne_reflexes_text" },
    ];

    const handleStepClick = (index, path) => {
        setActiveStep(index);
        navigate(path);
    };

    const [medicalData, setMedicalData] = useState(null);
    const [personResults, setPersonResults] = useState([]);



    // Fetch person by student number or name
    const fetchByStudentNumber = async (number) => {
        if (!number.trim()) return;

        try {
            console.log("🔍 Searching for:", number);
            const res = await axios.get(`${API_BASE_URL}/api/search-person-student`, {
                params: { query: number },
            });

            console.log("✅ API response:", res.data);

            if (res.data && res.data.student_number) {
                setPerson(res.data); // ✅ directly set the object
                fetchMedicalData(res.data.student_number);
            } else {
                alert("⚠️ No matching student found.");
                setPerson(null);
            }
        } catch (err) {
            console.error("❌ Error fetching student:", err.response?.data || err.message);
            alert("Student not found or error fetching data.");
            setPerson(null);
        }
    };

    // Handle Enter key
    const handleSearch = async (e) => {
        if (e.key === "Enter") {
            await fetchByStudentNumber(studentNumber);
        }
    };

    // Handle button click
    const handleSearchClick = async () => {
        await fetchByStudentNumber(studentNumber);
    };

    const fetchMedicalData = async (studentNumber) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/medical-requirements/${studentNumber}`);
            setMedicalData(res.data);
            console.log("✅ Loaded medical data for:", studentNumber, res.data);
        } catch (err) {
            if (err.response?.status === 404) {
                console.warn(`ℹ️ No medical record found for ${studentNumber}`);
                setMedicalData(null);
            } else {
                console.error("❌ Failed to load medical data:", err);
            }
        }
    };


    // 🔍 Auto search when studentNumber changes
    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (!studentNumber.trim()) {
                setPerson(null);
                return;
            }

            try {
                console.log("🔍 Auto-searching:", studentNumber);
                const res = await axios.get(`${API_BASE_URL}/api/search-person-student`, {
                    params: { query: studentNumber },
                });

                if (res.data && res.data.student_number) {
                    setPerson(res.data);
                    fetchMedicalData(res.data.student_number);
                    console.log("✅ Auto-search success:", res.data);
                } else {
                    console.warn("⚠️ No student found.");
                    setPerson(null);
                }
            } catch (err) {
                console.error("❌ Auto-search failed:", err);
                setPerson(null);
            }
        }, 500); // ⏱️ 0.5 second debounce

        return () => clearTimeout(delayDebounce);
    }, [studentNumber]);




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
        <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", }}>


            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,

                }}
            >
                {/* 🦷 Left side: Title */}
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        fontWeight: "bold",
                        color: titleColor,
                        fontSize: "36px",
                    }}
                >
                    PHYSICAL AND NEUROLOGICAL EXAMINATION
                </Typography>

                {/* 🔍 Right side: Search input + button */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,

                    }}
                >
                    <TextField
                        variant="outlined"
                        placeholder="Search Student Name / Email / Applicant ID "
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
            </Box>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <div style={{ height: "20px" }}></div>

            {/* 🔹 Top Navigation Tabs */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    mb: 3,
                }}
            >
                {tabs1.map((tab, index) => (
                    <Card
                        key={index}
                        onClick={() => handleStepClick(index, tab.to)}
                        sx={{
                            flex: 1,
                            height: 100,
                            mx: 1,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 2,
                            cursor: "pointer",
                            border: `2px solid ${borderColor}`,
                            backgroundColor: activeStep === index ? settings?.header_color || "#1976d2" : "#E8C999",
                            color: activeStep === index ? "#fff" : "#000",
                            transition: "0.3s ease",
                            "&:hover": {
                                backgroundColor: activeStep === index ? "#000" : "#f5d98f",
                            },
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <Box sx={{ fontSize: 32, mb: 0.5 }}>{tab.icon}</Box>
                            <Typography sx={{ fontSize: 13, fontWeight: "bold", textAlign: "center" }}>
                                {tab.label}
                            </Typography>
                        </Box>
                    </Card>
                ))}
            </Box>

            <TableContainer component={Paper} sx={{ width: '100%', }}>
                <Table>
                    <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2", }}>
                        <TableRow>
                            {/* Left cell: Student Number */}
                            <TableCell sx={{ color: 'white', fontSize: '20px', fontFamily: 'Arial Black', border: 'none' }}>
                                Student Number:&nbsp;
                                <span style={{ fontFamily: "Arial", fontWeight: "normal", textDecoration: "underline" }}>
                                    {person?.student_number || "N/A"}
                                </span>
                            </TableCell>

                            {/* Right cell: Student Name */}
                            <TableCell
                                align="right"
                                sx={{ color: 'white', fontSize: '20px', fontFamily: 'Arial Black', border: 'none' }}
                            >
                                Student Name:&nbsp;
                                <span style={{ fontFamily: "Arial", fontWeight: "normal", textDecoration: "underline" }}>
                                    {person?.last_name?.toUpperCase()}, {person?.first_name?.toUpperCase()}{" "}
                                    {person?.middle_name?.toUpperCase()} {person?.extension?.toUpperCase() || ""}
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
            <Container
                maxWidth="100%"
                sx={{
                    backgroundColor: "#f1f1f1",
                    border: `2px solid ${borderColor}`,
                    padding: 4,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: 2,

                        pb: 1,
                        justifyContent: "flex-end", // ✅ aligns to right
                        pr: 1, // optional padding from right edge
                    }}
                >
                    {/* Student Health Record */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card
                            sx={{
                                height: 60,
                                width: 260, // ✅ same fixed width
                                borderRadius: 2,
                                border: "2px solid #6D2323",
                                backgroundColor: "#fff",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                p: 1.5,
                                cursor: "pointer",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    backgroundColor: settings?.header_color || "#1976d2",
                                    "& .card-text": { color: "#fff" },
                                    "& .card-icon": { color: "#fff" },
                                },
                            }}
                            onClick={() => navigate("/health_record")}
                        >
                            <PictureAsPdfIcon
                                className="card-icon"
                                sx={{ fontSize: 35, color: "#6D2323", mr: 1.5 }}
                            />
                            <Typography
                                className="card-text"
                                sx={{
                                    color: "#6D2323",
                                    fontFamily: "Arial",
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Student Health Record
                            </Typography>
                        </Card>
                    </motion.div>

                    {/* Medical Certificate */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                    >
                        <Card
                            sx={{
                                height: 60,
                                width: 260, // ✅ same fixed width as above
                                borderRadius: 2,
                                border: "2px solid #6D2323",
                                backgroundColor: "#fff",
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "center",
                                textAlign: "center",
                                p: 1.5,
                                cursor: "pointer",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                    transform: "scale(1.05)",
                                    backgroundColor: settings?.header_color || "#1976d2",
                                    "& .card-text": { color: "#fff" },
                                    "& .card-icon": { color: "#fff" },
                                },
                            }}
                            onClick={() => navigate("/medical_certificate")}
                        >
                            <PictureAsPdfIcon
                                className="card-icon"
                                sx={{ fontSize: 35, color: "#6D2323", mr: 1.5 }}
                            />
                            <Typography
                                className="card-text"
                                sx={{
                                    color: "#6D2323",
                                    fontFamily: "Arial",
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                }}
                            >
                                Medical Certificate
                            </Typography>
                        </Card>
                    </motion.div>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography fontWeight="bold" sx={{ mb: 1 }}>
                        Describe Abnormal Findings
                    </Typography>
                    <Grid container spacing={1}>
                        {fields.map((field) => (
                            <Grid item xs={12} key={field.label}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={!!form[field.check]}
                                                onChange={handleCheckbox}
                                                name={field.check}
                                            />
                                        }
                                        label={field.label}
                                        sx={{ minWidth: 160 }}
                                    />
                                    <TextField
                                        name={field.text}
                                        value={form[field.text]}
                                        onChange={handleChange}
                                        size="small"
                                        fullWidth
                                    />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>



                <Box sx={{ mb: 3 }}>
                    <Typography fontWeight={600} mb={0.5}>
                        FINDINGS / ASSESSMENT / PSYCHOLOGICAL:
                    </Typography>
                    <TextField
                        label="Findings / Assessment / Psychological"
                        name="pne_findings_psychological"
                        value={form.pne_findings_psychological}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        margin="dense"
                    />
                    <Typography fontWeight={600} mb={0.5}>
                        RECOMMENDATIONS:
                    </Typography>
                    <TextField
                        label="Recommendations"
                        name="pne_recommendations"
                        value={form.pne_recommendations}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        margin="dense"
                    />
                </Box>

                {/* 💾 Save Button */}
                <Box sx={{ textAlign: "left", pb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        sx={{
                            backgroundColor: '#primary', // maroon color
                            '&:hover': {
                                backgroundColor: '#000000', // darker maroon on hover
                            },
                        }}
                    >
                        Save Record
                    </Button>

                </Box>
            </Container>
        </Box>
    );
};

export default PhysicalNeuroExam;
