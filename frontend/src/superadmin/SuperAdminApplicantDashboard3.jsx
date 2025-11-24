import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Button, Box, TextField, Container, Typography, Card, TableContainer, Paper, Table, TableHead, TableRow, TableCell, FormHelperText, FormControl, InputLabel, Select, MenuItem, Modal, FormControlLabel, Checkbox, IconButton } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SchoolIcon from "@mui/icons-material/School";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InfoIcon from "@mui/icons-material/Info";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorIcon from '@mui/icons-material/Error';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ExamPermit from "../applicant/ExamPermit";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";

import API_BASE_URL from "../apiConfig";

const SuperAdminApplicantDashboard3 = () => {

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


    const navigate = useNavigate();
    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [person, setPerson] = useState({
        schoolLevel: "",
        schoolLastAttended: "",
        schoolAddress: "",
        courseProgram: "",
        honor: "",
        generalAverage: "",
        yearGraduated: "",
        schoolLevel1: "",
        schoolLastAttended1: "",
        schoolAddress1: "",
        courseProgram1: "",
        honor1: "",
        generalAverage1: "",
        yearGraduated1: "",
        strand: "",
    });


    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);


    const pageId = 77;

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


    // do not alter
    const location = useLocation();


    const queryParams = new URLSearchParams(location.search);
    const queryPersonId = queryParams.get("person_id");

    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const loggedInPersonId = localStorage.getItem("person_id");
        const searchedPersonId = sessionStorage.getItem("admin_edit_person_id");

        if (!storedUser || !storedRole || !loggedInPersonId) {
            window.location.href = "/login";
            return;
        }

        setUser(storedUser);
        setUserRole(storedRole);

        // Roles that can access
        const allowedRoles = ["registrar", "applicant", "superadmin"];
        if (allowedRoles.includes(storedRole)) {
            // ✅ Always take URL param first
            const targetId = queryPersonId || searchedPersonId || loggedInPersonId;

            // Save it so other pages (ECAT, forms) can use it
            sessionStorage.setItem("admin_edit_person_id", targetId);

            setUserID(targetId);
            fetchByPersonId(targetId);
            return;
        }

        window.location.href = "/login";
    }, [queryPersonId]);


    const [selectedPerson, setSelectedPerson] = useState(null);
    const fetchByPersonId = async (personID) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/person_with_applicant/${personID}`);
            setPerson(res.data);
            setSelectedPerson(res.data);
            if (res.data?.applicant_number) {
            }
        } catch (err) {
            console.error("❌ person_with_applicant failed:", err);
        }
    };






    // Do not alter
    // ✅ Universal update for SuperAdmin (edits any applicant safely)
    const handleUpdate = async (updatedData) => {
        if (!person) return;

        try {
            // ✅ Get correct applicant ID
            const targetId = selectedPerson?.person_id || queryPersonId || person.person_id;
            if (!targetId) {
                console.warn("⚠️ No valid applicant ID found — skipping update.");
                return;
            }

            const allowedFields = [
                "person_id", "profile_img", "campus", "academicProgram", "classifiedAs", "applyingAs",
                "program", "program2", "program3", "yearLevel",
                "last_name", "first_name", "middle_name", "extension", "nickname",
                "height", "weight", "lrnNumber", "nolrnNumber", "gender",
                "pwdMember", "pwdType", "pwdId",
                "birthOfDate", "age", "birthPlace", "languageDialectSpoken",
                "citizenship", "religion", "civilStatus", "tribeEthnicGroup",
                "cellphoneNumber", "emailAddress",
                "presentStreet", "presentBarangay", "presentZipCode", "presentRegion",
                "presentProvince", "presentMunicipality", "presentDswdHouseholdNumber",
                "sameAsPresentAddress",
                "permanentStreet", "permanentBarangay", "permanentZipCode",
                "permanentRegion", "permanentProvince", "permanentMunicipality",
                "permanentDswdHouseholdNumber",
                "solo_parent",
                "father_deceased", "father_family_name", "father_given_name", "father_middle_name",
                "father_ext", "father_nickname", "father_education", "father_education_level",
                "father_last_school", "father_course", "father_year_graduated", "father_school_address",
                "father_contact", "father_occupation", "father_employer", "father_income", "father_email",
                "mother_deceased", "mother_family_name", "mother_given_name", "mother_middle_name",
                "mother_ext", "mother_nickname", "mother_education", "mother_education_level",
                "mother_last_school", "mother_course", "mother_year_graduated", "mother_school_address",
                "mother_contact", "mother_occupation", "mother_employer", "mother_income", "mother_email",
                "guardian", "guardian_family_name", "guardian_given_name", "guardian_middle_name",
                "guardian_ext", "guardian_nickname", "guardian_address", "guardian_contact", "guardian_email",
                "annual_income",
                "schoolLevel", "schoolLastAttended", "schoolAddress", "courseProgram",
                "honor", "generalAverage", "yearGraduated",
                "schoolLevel1", "schoolLastAttended1", "schoolAddress1", "courseProgram1",
                "honor1", "generalAverage1", "yearGraduated1",
                "strand",
                // 🩺 Health and medical
                "cough", "colds", "fever", "asthma", "faintingSpells", "heartDisease",
                "tuberculosis", "frequentHeadaches", "hernia", "chronicCough", "headNeckInjury",
                "hiv", "highBloodPressure", "diabetesMellitus", "allergies", "cancer",
                "smokingCigarette", "alcoholDrinking", "hospitalized", "hospitalizationDetails",
                "medications",
                // 🧬 Covid / Vaccination
                "hadCovid", "covidDate",
                "vaccine1Brand", "vaccine1Date", "vaccine2Brand", "vaccine2Date",
                "booster1Brand", "booster1Date", "booster2Brand", "booster2Date",
                // 🧪 Lab results / medical findings
                "chestXray", "cbc", "urinalysis", "otherworkups",
                // 🧍 Additional fields
                "symptomsToday", "remarks",
                // ✅ Agreement / Meta
                "termsOfAgreement", "created_at", "current_step"
            ];
            // ✅ Clean the payload
            const cleanedData = Object.fromEntries(
                Object.entries(updatedData).filter(([key]) => allowedFields.includes(key))
            );

            if (Object.keys(cleanedData).length === 0) {
                console.warn("⚠️ No valid fields to update — skipping request.");
                return;
            }

            // ✅ Send update request
            await axios.put(`${API_BASE_URL}/api/person/${targetId}`, cleanedData);

            console.log(`✅ SuperAdmin updated person_id: ${targetId} successfully.`);
        } catch (error) {
            console.error("❌ SuperAdmin update failed:", {
                message: error.message,
                status: error.response?.status,
                details: error.response?.data || error,
            });
        }
    };


    // Real-time save on every character typed
    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const updatedPerson = {
            ...person,
            [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        };
        setPerson(updatedPerson);
        handleUpdate(updatedPerson); // No delay, real-time save
    };



    const handleBlur = async () => {
        try {
            // ✅ Determine correct applicant/person_id
            const targetId = selectedPerson?.person_id || queryPersonId || person.person_id;
            if (!targetId) {
                console.warn("⚠️ No valid applicant ID found — skipping update.");
                return;
            }

            const allowedFields = [
                "person_id", "profile_img", "campus", "academicProgram", "classifiedAs", "applyingAs",
                "program", "program2", "program3", "yearLevel",
                "last_name", "first_name", "middle_name", "extension", "nickname",
                "height", "weight", "lrnNumber", "nolrnNumber", "gender",
                "pwdMember", "pwdType", "pwdId",
                "birthOfDate", "age", "birthPlace", "languageDialectSpoken",
                "citizenship", "religion", "civilStatus", "tribeEthnicGroup",
                "cellphoneNumber", "emailAddress",
                "presentStreet", "presentBarangay", "presentZipCode", "presentRegion",
                "presentProvince", "presentMunicipality", "presentDswdHouseholdNumber",
                "sameAsPresentAddress",
                "permanentStreet", "permanentBarangay", "permanentZipCode",
                "permanentRegion", "permanentProvince", "permanentMunicipality",
                "permanentDswdHouseholdNumber",
                "solo_parent",
                "father_deceased", "father_family_name", "father_given_name", "father_middle_name",
                "father_ext", "father_nickname", "father_education", "father_education_level",
                "father_last_school", "father_course", "father_year_graduated", "father_school_address",
                "father_contact", "father_occupation", "father_employer", "father_income", "father_email",
                "mother_deceased", "mother_family_name", "mother_given_name", "mother_middle_name",
                "mother_ext", "mother_nickname", "mother_education", "mother_education_level",
                "mother_last_school", "mother_course", "mother_year_graduated", "mother_school_address",
                "mother_contact", "mother_occupation", "mother_employer", "mother_income", "mother_email",
                "guardian", "guardian_family_name", "guardian_given_name", "guardian_middle_name",
                "guardian_ext", "guardian_nickname", "guardian_address", "guardian_contact", "guardian_email",
                "annual_income",
                "schoolLevel", "schoolLastAttended", "schoolAddress", "courseProgram",
                "honor", "generalAverage", "yearGraduated",
                "schoolLevel1", "schoolLastAttended1", "schoolAddress1", "courseProgram1",
                "honor1", "generalAverage1", "yearGraduated1",
                "strand",
                // 🩺 Health and medical
                "cough", "colds", "fever", "asthma", "faintingSpells", "heartDisease",
                "tuberculosis", "frequentHeadaches", "hernia", "chronicCough", "headNeckInjury",
                "hiv", "highBloodPressure", "diabetesMellitus", "allergies", "cancer",
                "smokingCigarette", "alcoholDrinking", "hospitalized", "hospitalizationDetails",
                "medications",
                // 🧬 Covid / Vaccination
                "hadCovid", "covidDate",
                "vaccine1Brand", "vaccine1Date", "vaccine2Brand", "vaccine2Date",
                "booster1Brand", "booster1Date", "booster2Brand", "booster2Date",
                // 🧪 Lab results / medical findings
                "chestXray", "cbc", "urinalysis", "otherworkups",
                // 🧍 Additional fields
                "symptomsToday", "remarks",
                // ✅ Agreement / Meta
                "termsOfAgreement", "created_at", "current_step"
            ];

            // ✅ Clean payload before sending
            const cleanedData = Object.fromEntries(
                Object.entries(person).filter(([key]) => allowedFields.includes(key))
            );

            if (Object.keys(cleanedData).length === 0) {
                console.warn("⚠️ No valid fields to update — skipping blur save.");
                return;
            }

            // ✅ Execute safe update
            await axios.put(`${API_BASE_URL}/api/person/${targetId}`, cleanedData);
            console.log(`💾 Auto-saved (on blur) for person_id: ${targetId}`);
        } catch (err) {
            console.error("❌ Auto-save (on blur) failed:", {
                message: err.message,
                status: err.response?.status,
                details: err.response?.data || err,
            });
        }
    };



    const [activeStep, setActiveStep] = useState(2);
    const [clickedSteps, setClickedSteps] = useState([]);

    const steps = [
        { label: "Personal Information", icon: <PersonIcon />, path: "/super_admin_applicant_dashboard1" },
        { label: "Family Background", icon: <FamilyRestroomIcon />, path: "/super_admin_applicant_dashboard2" },
        { label: "Educational Attainment", icon: <SchoolIcon />, path: "/super_admin_applicant_dashboard3" },
        { label: "Health Medical Records", icon: <HealthAndSafetyIcon />, path: "/super_admin_applicant_dashboard4" },
        { label: "Other Information", icon: <InfoIcon />, path: "/super_admin_applicant_dashboard5" },
    ];

    const handleStepClick = (index) => {
        setActiveStep(index);
        setClickedSteps((prev) => [...new Set([...prev, index])]);
        navigate(steps[index].path); // Go to the clicked step’s page
    };


    const [errors, setErrors] = useState({});




    const divToPrintRef = useRef();
    const [showPrintView, setShowPrintView] = useState(false);

    const printDiv = () => {
        const divToPrint = divToPrintRef.current;
        if (divToPrint) {
            const newWin = window.open("", "Print-Window");
            newWin.document.open();
            newWin.document.write(`
        <html>
          <head>
            <title>Examination Permit</title>
            <style>
              @page { size: A4; margin: 0; }
              body {
                margin: 0;
                padding: 0;
                display: flex;
                margin-left: "
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              .print-container {
                width: 8.5in;
                min-height: 11in;
                margin: auto;
                background: white;
              }
              * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            </style>
          </head>
          <body onload="window.print(); setTimeout(() => window.close(), 100);">
            <div class="print-container">${divToPrint.innerHTML}</div>
          </body>
        </html>
      `);
            newWin.document.close();
        }
    };


    const [examPermitError, setExamPermitError] = useState("");
    const [examPermitModalOpen, setExamPermitModalOpen] = useState(false);

    const handleCloseExamPermitModal = () => {
        setExamPermitModalOpen(false);
        setExamPermitError("");
    };

    const handleExamPermitClick = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/verified-exam-applicants`);
            const verified = res.data.some(a => a.person_id === parseInt(userID));

            if (!verified) {
                setExamPermitError("❌ You cannot print the Exam Permit until all required documents are verified.");
                setExamPermitModalOpen(true);
                return;
            }

            // ✅ Render permit and print
            setShowPrintView(true);
            setTimeout(() => {
                printDiv();
                setShowPrintView(false);
            }, 500);
        } catch (err) {
            console.error("Error verifying exam permit eligibility:", err);
            setExamPermitError("⚠️ Unable to check document verification status right now.");
            setExamPermitModalOpen(true);
        }
    };



    const links = [
        {
            to: userID ? `/admin_ecat_application_form?person_id=${userID}` : "/admin_ecat_application_form",
            label: "ECAT Application Form",
        },
        {
            to: userID ? `/admin_admission_form_process?person_id=${userID}` : "/admin_admission_form_process",
            label: "Admission Form Process",
        },
        {
            to: userID ? `/admin_personal_data_form?person_id=${userID}` : "/admin_personal_data_form",
            label: "Personal Data Form",
        },
        {
            to: userID ? `/admin_office_of_the_registrar?person_id=${userID}` : "/admin_office_of_the_registrar",
            label: `Application For ${shortTerm ? shortTerm.toUpperCase() : ""} College Admission`,
        },
        { to: "/admission_services", label: "Application/Student Satisfactory Survey" },
        { label: "Examination Permit", onClick: handleExamPermitClick },
    ];



    const [canPrintPermit, setCanPrintPermit] = useState(false);

    useEffect(() => {
        if (!userID) return;
        axios.get(`${API_BASE_URL}/api/verified-exam-applicants`)
            .then(res => {
                const verified = res.data.some(a => a.person_id === parseInt(userID));
                setCanPrintPermit(verified);
            });
    }, [userID]);



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
            {showPrintView && (
                <div ref={divToPrintRef} style={{ display: "block" }}>
                    <ExamPermit personId={userID} />   {/* ✅ pass the searched person_id */}
                </div>
            )}

            {/* Top header: DOCUMENTS SUBMITTED + Search */}
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
                    APPLICANT - EDUCATIONAL ATTAINMENT
                </Typography>


            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />


            <TableContainer component={Paper} sx={{ width: '100%', mb: 1 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2", border: `2px solid ${borderColor}`, }}>
                        <TableRow>
                            {/* Left cell: Applicant ID */}
                            <TableCell sx={{ color: 'white', fontSize: '20px', fontFamily: 'Arial Black', border: 'none' }}>
                                Applicant ID:&nbsp;
                                <span style={{ fontFamily: "Arial", fontWeight: "normal", textDecoration: "underline" }}>
                                    {person?.applicant_number || "N/A"}

                                </span>
                            </TableCell>

                            {/* Right cell: Applicant Name */}
                            <TableCell
                                align="right"
                                sx={{ color: 'white', fontSize: '20px', fontFamily: 'Arial Black', border: 'none' }}
                            >
                                Applicant Name:&nbsp;
                                <span style={{ fontFamily: "Arial", fontWeight: "normal", textDecoration: "underline" }}>
                                    {person?.last_name?.toUpperCase()}, {person?.first_name?.toUpperCase()}{" "}
                                    {person?.middle_name?.toUpperCase()} {person?.extension?.toUpperCase() || ""}
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>


            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                    mt: 2,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        borderRadius: "10px",
                        backgroundColor: "#fffaf5",
                        border: "1px solid #6D2323",
                        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
                        width: "100%",
                        overflow: "hidden",
                    }}
                >
                    {/* Icon */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#800000",
                            borderRadius: "8px",
                            width: 50,
                            height: 50,
                            flexShrink: 0,
                        }}
                    >
                        <ErrorIcon sx={{ color: "white", fontSize: 36 }} />
                    </Box>

                    {/* Text */}
                    <Typography
                        sx={{
                            fontSize: "20px",
                            fontFamily: "Arial",
                            color: "#3e3e3e",
                            lineHeight: 1.3, // slightly tighter to fit in fewer rows
                            whiteSpace: "normal",
                            overflow: "hidden",
                        }}
                    >
                        <strong style={{ color: "maroon" }}>Notice:</strong> &nbsp;
                        <strong>1.</strong> Kindly type <strong>'NA'</strong> in boxes where there are no possible answers to the information being requested. &nbsp; | &nbsp;
                        <strong>2.</strong> To use the letter <strong>'Ñ'</strong>, press <kbd>ALT</kbd> + <kbd>165</kbd>; for <strong>'ñ'</strong>, press <kbd>ALT</kbd> + <kbd>164</kbd>. &nbsp; | &nbsp;
                        <strong>3.</strong> This is the list of all printable files.
                    </Typography>
                </Box>
            </Box>

            {/* Cards Section */}
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mt: 2,
                    pb: 1,
                    justifyContent: "center", // Centers all cards horizontally
                }}
            >
                {links.map((lnk, i) => (
                    <motion.div
                        key={i}
                        style={{ flex: "0 0 calc(30% - 16px)" }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                        <Card
                            sx={{
                                minHeight: 60,
                                borderRadius: 2,
                                border: `2px solid ${borderColor}`,

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

                                    "& .card-text": {
                                        color: "#fff", // ✅ text becomes white
                                    },
                                    "& .card-icon": {
                                        color: "#fff", // ✅ icon becomes white
                                    },
                                },
                            }}
                            onClick={() => {
                                if (lnk.onClick) {
                                    lnk.onClick(); // run handler
                                } else if (lnk.to) {
                                    navigate(lnk.to); // navigate if it has a `to`
                                }
                            }}
                        >
                            {/* Icon */}
                            <PictureAsPdfIcon
                                className="card-icon"
                                sx={{ fontSize: 35, color: "#6D2323", mr: 1.5 }}
                            />

                            {/* Label */}
                            <Typography
                                className="card-text"
                                sx={{
                                    color: "#6D2323",
                                    fontFamily: "Arial",
                                    fontWeight: "bold",
                                    fontSize: "0.85rem",
                                }}
                            >
                                {lnk.label}
                            </Typography>
                        </Card>
                    </motion.div>
                ))}
            </Box>






            <Container>

                <Container>
                    <h1
                        style={{
                            fontSize: "50px",
                            fontWeight: "bold",
                            textAlign: "center",
                            color: subtitleColor,
                            marginTop: "25px",
                        }}
                    >
                        APPLICANT FORM
                    </h1>
                    <div style={{ textAlign: "center" }}>
                        Complete the applicant form to secure your place for the upcoming academic year at{" "}
                        {shortTerm ? (
                            <>
                                <strong>{shortTerm.toUpperCase()}</strong> <br />
                                {companyName || ""}
                            </>
                        ) : (
                            companyName || ""
                        )}
                        .
                    </div>


                </Container>
                <br />

                <Box sx={{ display: "flex", justifyContent: "center", width: "100%", px: 4 }}>
                    {steps.map((step, index) => (
                        <React.Fragment key={index}>
                            {/* Wrap the step with Link for routing */}
                            <Link to={step.path} style={{ textDecoration: "none" }}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => handleStepClick(index)}
                                >
                                    {/* Step Icon */}
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: "50%",
                                            border: `2px solid ${borderColor}`,
                                            backgroundColor: activeStep === index ? settings?.header_color || "#1976d2" : "#E8C999",
                                            color: activeStep === index ? "#fff" : "#000",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        {step.icon}
                                    </Box>

                                    {/* Step Label */}
                                    <Typography
                                        sx={{
                                            mt: 1,
                                            color: activeStep === index ? "#6D2323" : "#000",
                                            fontWeight: activeStep === index ? "bold" : "normal",
                                            fontSize: 14,
                                        }}
                                    >
                                        {step.label}
                                    </Typography>
                                </Box>
                            </Link>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <Box
                                    sx={{
                                        height: "2px",
                                        backgroundColor: "#6D2323",
                                        flex: 1,
                                        alignSelf: "center",
                                        mx: 2,
                                    }}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </Box>
                <br />

                <form>
                    <Container
                        maxWidth="100%"
                        sx={{
                            backgroundColor: settings?.header_color || "#1976d2",
                            border: "2px solid black",
                            maxHeight: "500px",
                            overflowY: "auto",
                            color: "white",
                            borderRadius: 2,
                            boxShadow: 3,
                            padding: "4px",
                        }}
                    >
                        <Box sx={{ width: "100%" }}>
                            <Typography style={{ fontSize: "20px", padding: "10px", fontFamily: "Arial Black" }}>Step 3: Educational Attainment</Typography>
                        </Box>
                    </Container>

                    <Container maxWidth="100%" sx={{ backgroundColor: "#f1f1f1", border: `2px solid ${borderColor}`, padding: 4, borderRadius: 2, boxShadow: 3 }}>
                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Junior High School - Background:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />


                        <Box
                            sx={{
                                display: "flex",
                                gap: 2, // space between fields
                                mb: 2,
                            }}
                        >
                            {/* Each Box here is one input container */}
                            <Box sx={{ flex: "1 1 25%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    School Level
                                </Typography>
                                <Box sx={{ flex: "1 1 25%" }}>
                                    <FormControl fullWidth size="small" required error={!!errors.schoolLevel}>
                                        <InputLabel id="schoolLevel-label">School Level</InputLabel>
                                        <Select
                                            labelId="schoolLevel-label"
                                            id="schoolLevel"
                                            name="schoolLevel"
                                            value={person.schoolLevel ?? ""}
                                            label="School Level"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <MenuItem value="">
                                                <em>Select School Level</em>
                                            </MenuItem>
                                            <MenuItem value="High School/Junior High School">High School/Junior High School</MenuItem>
                                            <MenuItem value="Senior High School">Senior High School</MenuItem>
                                            <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                                            <MenuItem value="Graduate">Graduate</MenuItem>
                                            <MenuItem value="ALS">ALS</MenuItem>
                                            <MenuItem value="Vocational/Trade Course">Vocational/Trade Course</MenuItem>
                                        </Select>
                                        {errors.schoolLevel && (
                                            <FormHelperText>This field is required.</FormHelperText>
                                        )}
                                    </FormControl>
                                </Box>

                            </Box>


                            <Box sx={{ flex: "1 1 25%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    School Last Attended
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="schoolLastAttended"
                                    placeholder="Enter School Last Attended"
                                    value={person.schoolLastAttended ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.schoolLastAttended}
                                    helperText={errors.schoolLastAttended ? "This field is required." : ""}
                                />
                            </Box>

                            <Box sx={{ flex: "1 1 25%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    School Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="schoolAddress"
                                    value={person.schoolAddress ?? ""}
                                    onChange={handleChange}
                                    placeholder="Enter your School Address"
                                    onBlur={handleBlur}
                                    error={errors.schoolAddress}
                                    helperText={errors.schoolAddress ? "This field is required." : ""}
                                />
                            </Box>

                            <Box sx={{ flex: "1 1 25%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Course Program
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="courseProgram"
                                    required
                                    value={person.courseProgram ?? ""}
                                    placeholder="Enter your Course Program"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.courseProgram}
                                    helperText={errors.courseProgram ? "This field is required." : ""}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            <Box sx={{ flex: "1 1 33%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Honor
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="honor"
                                    required
                                    value={person.honor ?? ""}
                                    placeholder="Enter your Honor"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.honor}
                                    helperText={errors.honor ? "This field is required." : ""}
                                />
                            </Box>

                            <Box sx={{ flex: "1 1 33%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    General Average
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="generalAverage"
                                    value={person.generalAverage ?? ""}
                                    placeholder="Enter your General Average"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.generalAverage}
                                    helperText={errors.generalAverage ? "This field is required." : ""}
                                />
                            </Box>

                            <Box sx={{ flex: "1 1 33%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Year Graduated
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="yearGraduated"
                                    placeholder="Enter your Year Graduated"
                                    value={person.yearGraduated ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.yearGraduated}
                                    helperText={errors.yearGraduated ? "This field is required." : ""}
                                />
                            </Box>
                        </Box>





                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Senior High School - Background:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            {/* School Level 1 */}
                            <Box sx={{ flex: "1 1 25%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    School Level
                                </Typography>
                                <FormControl fullWidth size="small" required error={!!errors.schoolLevel1}>
                                    <InputLabel id="schoolLevel1-label">School Level</InputLabel>
                                    <Select
                                        labelId="schoolLevel1-label"
                                        id="schoolLevel1"
                                        name="schoolLevel1"
                                        value={person.schoolLevel1 ?? ""}
                                        label="School Level"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <MenuItem value=""><em>Select School Level</em></MenuItem>
                                        <MenuItem value="High School/Junior High School">High School/Junior High School</MenuItem>
                                        <MenuItem value="Senior High School">Senior High School</MenuItem>
                                        <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                                        <MenuItem value="Graduate">Graduate</MenuItem>
                                        <MenuItem value="ALS">ALS</MenuItem>
                                        <MenuItem value="Vocational/Trade Course">Vocational/Trade Course</MenuItem>
                                    </Select>
                                    {errors.schoolLevel1 && (
                                        <FormHelperText>This field is required.</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            {/* School Last Attended 1 */}
                            <Box sx={{ flex: "1 1 25%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    School Last Attended
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="schoolLastAttended1"
                                    placeholder="Enter School Last Attended"
                                    value={person.schoolLastAttended1 ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.schoolLastAttended1}
                                    helperText={errors.schoolLastAttended1 ? "This field is required." : ""}
                                />
                            </Box>

                            {/* School Address 1 */}
                            <Box sx={{ flex: "1 1 25%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    School Address
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="schoolAddress1"
                                    placeholder="Enter your School Address"
                                    value={person.schoolAddress1 ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.schoolAddress1}
                                    helperText={errors.schoolAddress1 ? "This field is required." : ""}
                                />
                            </Box>

                            {/* Course Program 1 */}
                            <Box sx={{ flex: "1 1 25%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Course Program
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="courseProgram1"
                                    placeholder="Enter your Course Program"
                                    value={person.courseProgram1 ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.courseProgram1}
                                    helperText={errors.courseProgram1 ? "This field is required." : ""}
                                />
                            </Box>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                mb: 2,
                            }}
                        >
                            {/* Honor 1 */}
                            <Box sx={{ flex: "1 1 33%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Honor
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="honor1"
                                    placeholder="Enter your Honor"
                                    value={person.honor1 ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.honor1}
                                    helperText={errors.honor1 ? "This field is required." : ""}
                                />
                            </Box>

                            {/* General Average 1 */}
                            <Box sx={{ flex: "1 1 33%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    General Average
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="generalAverage1"
                                    placeholder="Enter your General Average"
                                    value={person.generalAverage1 ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.generalAverage1}
                                    helperText={errors.generalAverage1 ? "This field is required." : ""}
                                />
                            </Box>

                            {/* Year Graduated 1 */}
                            <Box sx={{ flex: "1 1 33%" }}>
                                <Typography variant="subtitle1" mb={1}>
                                    Year Graduated
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    name="yearGraduated1"
                                    placeholder="Enter your Year Graduated"
                                    value={person.yearGraduated1 ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={errors.yearGraduated1}
                                    helperText={errors.yearGraduated1 ? "This field is required." : ""}
                                />
                            </Box>
                        </Box>

                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>
                            Strand (For Senior High School)
                        </Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />


                        <FormControl fullWidth size="small" required error={!!errors.strand} className="mb-4">
                            <InputLabel id="strand-label">Strand</InputLabel>
                            <Select
                                labelId="strand-label"
                                id="strand-select"
                                name="strand"
                                value={person.strand ?? ""}
                                label="Strand"
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                <MenuItem value="">
                                    <em>Select Strand</em>
                                </MenuItem>
                                <MenuItem value="Accountancy, Business and Management (ABM)">
                                    Accountancy, Business and Management (ABM)
                                </MenuItem>
                                <MenuItem value="Humanities and Social Sciences (HUMSS)">
                                    Humanities and Social Sciences (HUMSS)
                                </MenuItem>
                                <MenuItem value="Science, Technology, Engineering, and Mathematics (STEM)">
                                    Science, Technology, Engineering, and Mathematics (STEM)
                                </MenuItem>
                                <MenuItem value="General Academic (GAS)">General Academic (GAS)</MenuItem>
                                <MenuItem value="Home Economics (HE)">Home Economics (HE)</MenuItem>
                                <MenuItem value="Information and Communications Technology (ICT)">
                                    Information and Communications Technology (ICT)
                                </MenuItem>
                                <MenuItem value="Agri-Fishery Arts (AFA)">Agri-Fishery Arts (AFA)</MenuItem>
                                <MenuItem value="Industrial Arts (IA)">Industrial Arts (IA)</MenuItem>
                                <MenuItem value="Sports Track">Sports Track</MenuItem>
                                <MenuItem value="Design and Arts Track">Design and Arts Track</MenuItem>
                            </Select>
                            {errors.strand && (
                                <FormHelperText>This field is required.</FormHelperText>
                            )}
                        </FormControl>

                        <Modal
                            open={examPermitModalOpen}
                            onClose={handleCloseExamPermitModal}
                            aria-labelledby="exam-permit-error-title"
                            aria-describedby="exam-permit-error-description"
                        >
                            <Box
                                sx={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    width: 400,
                                    bgcolor: "background.paper",
                                    border: "2px solid #6D2323",
                                    boxShadow: 24,
                                    p: 4,
                                    borderRadius: 2,
                                    textAlign: "center",
                                }}
                            >
                                <ErrorIcon sx={{ color: "#6D2323", fontSize: 50, mb: 2 }} />
                                <Typography id="exam-permit-error-title" variant="h6" component="h2" color="maroon">
                                    Exam Permit Notice
                                </Typography>
                                <Typography id="exam-permit-error-description" sx={{ mt: 2 }}>
                                    {examPermitError}
                                </Typography>
                                <Button
                                    onClick={handleCloseExamPermitModal}
                                    variant="contained"
                                    sx={{ mt: 3, backgroundColor: "#6D2323", "&:hover": { backgroundColor: "#8B0000" } }}
                                >
                                    Close
                                </Button>
                            </Box>
                        </Modal>







                        <Box display="flex" justifyContent="space-between" mt={4}>
                            {/* Previous Page Button */}
                            <Button
                                variant="contained"
                                component={Link}
                                to={`/super_admin_applicant_dashboard2?person_id=${userID}`}
                                startIcon={
                                    <ArrowBackIcon
                                        sx={{
                                            color: "#000",
                                            transition: "color 0.3s",
                                        }}
                                    />
                                }
                                sx={{
                                    backgroundColor: subButtonColor,
                                    border: `2px solid ${borderColor}`,

                                    color: "#000",
                                    "&:hover": {
                                        backgroundColor: "#000000",
                                        color: "#fff",
                                        "& .MuiSvgIcon-root": {
                                            color: "#fff",
                                        },
                                    },
                                }}
                            >
                                Previous Step
                            </Button>

                            {/* Next Step Button */}
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleUpdate();
                                    navigate(`/super_admin_applicant_dashboard4?person_id=${userID}`);

                                }}
                                endIcon={
                                    <ArrowForwardIcon
                                        sx={{
                                            color: "#fff",
                                            transition: "color 0.3s",
                                        }}
                                    />
                                }
                                sx={{
                                    backgroundColor: mainButtonColor,
                                    border: `2px solid ${borderColor}`,
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: "#000000",
                                        color: '#fff',
                                        '& .MuiSvgIcon-root': {
                                            color: '#fff',
                                        },
                                    },
                                }}
                            >
                                Next Step
                            </Button>
                        </Box>


                    </Container>
                </form>
            </Container>
        </Box>
    );
};


export default SuperAdminApplicantDashboard3;
