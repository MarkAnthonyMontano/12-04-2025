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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import regions from "../data/region.json";
import provinces from "../data/province.json";
import cities from "../data/city.json";
import barangays from "../data/barangay.json";
import { useNavigate } from 'react-router-dom';
import Search from '@mui/icons-material/Search';
import { motion } from "framer-motion";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { FaFileExcel } from "react-icons/fa";
import ExamPermit from "../applicant/ExamPermit";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import SearchIcon from "@mui/icons-material/Search";
import { Snackbar, Alert } from "@mui/material";
import API_BASE_URL from "../apiConfig";
const SuperAdminApplicantDashboard1 = () => {

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
        profile_img: "",
        campus: "",
        academicProgram: "",
        classifiedAs: "",
        applyingAs: "",
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
        nolrnNumber: "",
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
        cellphoneNumber: "",
        emailAddress: "",
        presentStreet: "",
        presentBarangay: "",
        presentZipCode: "",
        presentRegion: "",
        presentProvince: "",
        presentMunicipality: "",
        presentDswdHouseholdNumber: "",
        sameAsPresentAddress: "",
        permanentStreet: "",
        permanentBarangay: "",
        permanentZipCode: "",
        permanentRegion: "",
        permanentProvince: "",
        permanentMunicipality: "",
        permanentDswdHouseholdNumber: "",
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);


    const pageId = 75;

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




    const [activeStep, setActiveStep] = useState(0);
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

            // ✅ Only include valid columns existing in person_table
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


    // Helper: parse "YYYY-MM-DD" safely (local date in Asia/Manila)
    const parseISODate = (dateString) => {
        if (!dateString) return null;
        const [y, m, d] = dateString.split("-").map(Number);
        if (!y || !m || !d) return null;
        return new Date(y, m - 1, d);
    };

    // Helper: get current date in Asia/Manila (no time portion)
    const getManilaDate = () => {
        const now = new Date();
        // Convert current UTC time to Manila time using locale
        const manilaString = now.toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });

        // manilaString format: "MM/DD/YYYY"
        const [month, day, year] = manilaString.split("/");
        return new Date(`${year}-${month}-${day}`);
    };

    // 🧮 Calculate age using Manila time
    const calculateAge = (birthDateString) => {
        const birthDate = parseISODate(birthDateString);
        if (!birthDate) return "";

        const today = getManilaDate();

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        // 🎂 Subtract 1 if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }

        return age < 0 ? "" : age;
    };

    // 🧩 Real-time handleChange with Manila-based age
    const handleChange = (e) => {
        const target = e && e.target ? e.target : {};
        const { name, type, checked, value } = target;

        const updatedValue = type === "checkbox" ? (checked ? 1 : 0) : value;

        const updatedPerson = {
            ...person,
            [name]: updatedValue,
        };

        // Auto-calculate age if birthOfDate changes
        if (name === "birthOfDate") {
            updatedPerson.age = calculateAge(value);
        }

        // Auto yearLevel if Freshman
        if (name === "classifiedAs" && value === "Freshman (First Year)") {
            updatedPerson.yearLevel = "First Year";
        }

        setPerson(updatedPerson);
        handleUpdate(updatedPerson); // real-time save
    };


    // ✅ Safe handleBlur for SuperAdmin — updates correct applicant only
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

    // ✅ Safe autoSave for SuperAdmin — same logic as handleBlur
    const autoSave = async () => {
        try {
            const targetId = selectedPerson?.person_id || queryPersonId || person.person_id;
            if (!targetId) {
                console.warn("⚠️ No valid applicant ID found — skipping autoSave.");
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
            const cleanedData = Object.fromEntries(
                Object.entries(person).filter(([key]) => allowedFields.includes(key))
            );

            if (Object.keys(cleanedData).length === 0) {
                console.warn("⚠️ No valid fields to update — skipping autoSave.");
                return;
            }

            await axios.put(`${API_BASE_URL}/api/person/${targetId}`, cleanedData);
            console.log(`💾 Auto-saved (manual) for person_id: ${targetId}`);
        } catch (err) {
            console.error("❌ Auto-save (manual) failed:", {
                message: err.message,
                status: err.response?.status,
                details: err.response?.data || err,
            });
        }
    };


    const [uploadedImage, setUploadedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null);
        setPreview(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

        // Check file type
        if (!validTypes.includes(file.type)) {
            setSnackbar({ open: true, message: "Invalid file type. Please select a JPEG or PNG file.", severity: "error" });
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // Check file size
        if (file.size > maxSizeInBytes) {
            setSnackbar({ open: true, message: "File is too large. Maximum allowed size is 2MB.", severity: "error" });
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // If valid, set file and preview
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setSnackbar({ open: true, message: "Please select a file first.", severity: "warning" });
            return;
        }

        const formData = new FormData();
        formData.append("profile_picture", selectedFile);
        formData.append("person_id", userID);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/upload-profile-picture`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const fileName = response.data.filename || response.data.profile_img;

            // ✅ Set image AND trigger auto-save
            const updatedPerson = {
                ...person,
                profile_img: fileName,
            };

            setPerson(updatedPerson);
            await handleUpdate(updatedPerson); // ✅ this pushes the profile_img change into DB

            setUploadedImage(`${API_BASE_URL}/uploads/${fileName}`);
            setSnackbar({ open: true, message: "Upload successful!", severity: "success" });
            handleClose();
        } catch (error) {
            console.error("Upload failed:", error);
            setSnackbar({ open: true, message: "Upload failed.", severity: "error" });
        }
    };

    const [isLrnNA, setIsLrnNA] = useState(false);

    const handlePwdCheck = (event) => {
        const checked = event.target.checked;

        setPerson((prev) => ({
            ...prev,
            pwdMember: checked ? 1 : 0,
            pwdType: checked ? prev.pwdType || "" : "",
            pwdId: checked ? prev.pwdId || "" : "",
        }));
    };



    // ✅ ADDRESS STATE
    const [regionList, setRegionList] = useState([]);
    const [provinceList, setProvinceList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const [barangayList, setBarangayList] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedBarangay, setSelectedBarangay] = useState("");

    // ✅ REGION LIST STATIC LOAD
    useEffect(() => {
        setRegionList(regions);
    }, []);

    // ✅ PROVINCES BASED ON SELECTED REGION
    useEffect(() => {
        const region = regions.find((r) => r.region_name === selectedRegion);
        if (region) {
            setProvinceList(provinces.filter((p) => p.region_code === region.region_code));
        } else {
            setProvinceList([]);
        }
    }, [selectedRegion]);

    // ✅ CITIES BASED ON SELECTED PROVINCE
    useEffect(() => {
        const province = provinces.find((p) => p.province_name === selectedProvince);
        if (province) {
            setCityList(cities.filter((c) => c.province_code === province.province_code));
        } else {
            setCityList([]);
        }
    }, [selectedProvince]);

    // ✅ BARANGAYS BASED ON SELECTED CITY
    useEffect(() => {
        const city = cities.find((c) => c.city_name === selectedCity);
        if (city) {
            setBarangayList(barangays.filter((b) => b.city_code === city.city_code));
        } else {
            setBarangayList([]);
        }
    }, [selectedCity]);

    // ✅ UPDATE ON PERSON STATE
    useEffect(() => {
        const region = regions.find((r) => r.region_name === person.presentRegion);
        if (region) {
            setProvinceList(provinces.filter((p) => p.region_code === region.region_code));
        } else {
            setProvinceList([]);
        }
    }, [person.presentRegion]);

    useEffect(() => {
        const province = provinces.find((p) => p.province_name === person.presentProvince);
        if (province) {
            setCityList(cities.filter((c) => c.province_code === province.province_code));
        } else {
            setCityList([]);
        }
    }, [person.presentProvince]);

    useEffect(() => {
        const city = cities.find((c) => c.city_name === person.presentMunicipality);
        if (city) {
            setBarangayList(barangays.filter((b) => b.city_code === city.city_code));
        } else {
            setBarangayList([]);
        }
    }, [person.presentMunicipality]);

    // ✅ PERMANENT ADDRESS STATES
    const [permanentRegionList, setPermanentRegionList] = useState([]);
    const [permanentProvinceList, setPermanentProvinceList] = useState([]);
    const [permanentCityList, setPermanentCityList] = useState([]);
    const [permanentBarangayList, setPermanentBarangayList] = useState([]);

    const [permanentRegion, setPermanentRegion] = useState("");
    const [permanentProvince, setPermanentProvince] = useState("");
    const [permanentCity, setPermanentCity] = useState("");
    const [permanentBarangay, setPermanentBarangay] = useState("");

    // Initial load of permanent region list
    useEffect(() => {
        setPermanentRegionList(regions);
    }, []);

    // Update provinces when permanent region changes
    useEffect(() => {
        const region = regions.find((r) => r.region_name === person.permanentRegion);
        if (region) {
            setPermanentProvinceList(provinces.filter((p) => p.region_code === region.region_code));
        } else {
            setPermanentProvinceList([]);
        }
    }, [person.permanentRegion]);

    // Update cities when permanent province changes
    useEffect(() => {
        const province = provinces.find((p) => p.province_name === person.permanentProvince);
        if (province) {
            setPermanentCityList(cities.filter((c) => c.province_code === province.province_code));
        } else {
            setPermanentCityList([]);
        }
    }, [person.permanentProvince]);

    // Update barangays when permanent city changes
    useEffect(() => {
        const city = cities.find((c) => c.city_name === person.permanentMunicipality);
        if (city) {
            setPermanentBarangayList(barangays.filter((b) => b.city_code === city.city_code));
        } else {
            setPermanentBarangayList([]);
        }
    }, [person.permanentMunicipality]);


    const [curriculumOptions, setCurriculumOptions] = useState([]);

    useEffect(() => {
        const fetchCurriculums = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/applied_program`);
                setCurriculumOptions(response.data); // array of { curriculum_id: "..." }
            } catch (error) {
                console.error("Error fetching curriculum options:", error);
            }
        };

        fetchCurriculums();
    }, []);


    const [errors, setErrors] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState("");

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.trim() === "") return; // Don't search empty

            try {
                const res = await axios.get(`${API_BASE_URL}/api/search-person`, {
                    params: { query: searchQuery }
                });

                console.log("Search result data:", res.data); // See what the backend returns

                setPerson(res.data);

                // ✅ Adjust key based on backend response
                const idToStore = res.data.person_id || res.data.id;
                if (!idToStore) {
                    console.error("No valid person ID found in search result");
                    setSearchError("Invalid search result");
                    return;
                }

                // Store globally for ECAT and other dashboards
                sessionStorage.setItem("admin_edit_person_id", idToStore);
                setUserID(idToStore);

                setSearchError("");
            } catch (err) {
                console.error("Search failed:", err);
                setSearchError("Applicant not found");
            }
        }, 500); // debounce so it doesn't search on every keystroke instantly

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);




    const [selectedPerson, setSelectedPerson] = useState(null);
    const [persons, setPersons] = useState([]);

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


    // ✅ For Excel Import
    const [excelFile, setExcelFile] = useState(null);

    const handleExcelChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setExcelFile(file);
        }
    };

    const handleImportExcel = async () => {
        try {
            if (!excelFile) {
                alert("⚠️ Please select an Excel file first.");
                return;
            }

            const formData = new FormData();
            formData.append("file", excelFile);

            const res = await axios.post(`${API_BASE_URL}/api/person/import`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                alert("✅ Excel imported successfully!");
                window.location.reload();
            } else {
                alert("❌ Failed: " + (res.data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("❌ Import failed:", err);
            alert("❌ Import failed: " + (err.response?.data?.error || err.message));
        }
    };

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





    // dot not alter
    return (
        <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>
            {showPrintView && (
                <div ref={divToPrintRef} style={{ display: "block" }}>
                    <ExamPermit personId={userID} />   {/* ✅ pass the searched person_id */}
                </div>
            )}


            {/* Top header: DOCUMENTS SUBMITTED + Search + Import */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",

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
                    APPLICANT - PERSONAL INFORMATION
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search Applicant Name / Email / Applicant ID"
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

            {searchError && <Typography color="error">{searchError}</Typography>}

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

            <Container>



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
                            <Typography style={{ fontSize: "20px", padding: "10px", fontFamily: "Arial Black" }}>Step 1: Personal Information</Typography>
                        </Box>
                    </Container>

                    <Container maxWidth="100%" sx={{ backgroundColor: "#f1f1f1", border: `2px solid ${borderColor}`, padding: 4, borderRadius: 2, boxShadow: 3 }}>
                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Personal Information:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />

                        <div className="flex items-center mb-4 gap-4">
                            <label className="w-40 font-medium">Campus:</label>
                            <FormControl fullWidth size="small" required error={!!errors.campus} className="mb-4">
                                <InputLabel id="campus-label">Campus (Manila/Cavite)</InputLabel>
                                <Select
                                    labelId="campus-label"
                                    id="campus-select"
                                    name="campus"
                                    value={person.campus == null ? "" : String(person.campus)}
                                    label="Campus (Manila/Cavite)"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        handleChange({
                                            target: {
                                                name: "campus",
                                                value: val === "" ? null : parseInt(val, 10),
                                            },
                                        });
                                    }}
                                    onBlur={handleBlur}
                                >
                                    <MenuItem value=""><em>Select Campus</em></MenuItem>
                                    <MenuItem value="0">MANILA</MenuItem>
                                    <MenuItem value="1">CAVITE</MenuItem>
                                </Select>
                                {errors.campus && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>
                        </div>



                        <div className="flex items-center mb-4 gap-4">
                            <label className="w-40 font-medium">Academic Program:</label>
                            <FormControl fullWidth size="small" required error={!!errors.academicProgram} className="mb-4">
                                <InputLabel id="academic-program-label">Academic Program</InputLabel>
                                <Select
                                    labelId="academic-program-label"
                                    id="academic-program-select"
                                    name="academicProgram"
                                    value={person.academicProgram ?? ""}
                                    label="Academic Program"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <MenuItem value=""><em>Select Program</em></MenuItem>
                                    <MenuItem value="Techvoc">Techvoc</MenuItem>
                                    <MenuItem value="Undergraduate">Undergraduate</MenuItem>
                                    <MenuItem value="Graduate">Graduate</MenuItem>
                                </Select>
                                {errors.academicProgram && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <div className="flex items-center mb-4 gap-4">
                            <label className="w-40 font-medium">Classified As:</label>
                            <FormControl fullWidth size="small" required error={!!errors.classifiedAs} className="mb-4">
                                <InputLabel id="classified-as-label">Classified As</InputLabel>
                                <Select
                                    labelId="classified-as-label"
                                    id="classified-as-select"
                                    name="classifiedAs"
                                    value={person.classifiedAs ?? ""}
                                    label="Classified As"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <MenuItem value=""><em>Select Classification</em></MenuItem>
                                    <MenuItem value="Freshman (First Year)">Freshman (First Year)</MenuItem>
                                    <MenuItem value="Transferee">Transferee</MenuItem>
                                    <MenuItem value="Returnee">Returnee</MenuItem>
                                    <MenuItem value="Shiftee">Shiftee</MenuItem>
                                    <MenuItem value="Foreign Student">Foreign Student</MenuItem>
                                </Select>
                                {errors.classifiedAs && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>

                        </div>

                        <div className="flex items-center mb-4 gap-4">
                            <label className="w-40 font-medium">Applying As:</label>
                            <FormControl fullWidth size="small" required error={!!errors.applyingAs} className="mb-4">
                                <InputLabel id="applying-as-label">Applying As</InputLabel>
                                <Select
                                    labelId="applying-as-label"
                                    id="applying-as-select"
                                    name="applyingAs"
                                    value={person.applyingAs ?? ""}
                                    label="Applying As"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <MenuItem value=""><em>Select Applying</em></MenuItem>
                                    <MenuItem value="Senior High School Graduate">Senior High School Graduate</MenuItem>
                                    <MenuItem value="Senior High School Graduating Student">Senior High School Graduating Student</MenuItem>
                                    <MenuItem value="ALS Passer">ALS (Alternative Learning System) Passer</MenuItem>
                                    <MenuItem value="Transferee">Transferee from other University/College</MenuItem>
                                    <MenuItem value="Cross Enrolee">Cross Enrolee Student</MenuItem>
                                    <MenuItem value="Foreign Applicant">Foreign Applicant/Student</MenuItem>
                                    <MenuItem value="Baccalaureate Graduate">Baccalaureate Graduate</MenuItem>
                                    <MenuItem value="Master Degree Graduate">Master Degree Graduate</MenuItem>
                                </Select>
                                {errors.applyingAs && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>
                        </div>


                        <br />

                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Course Program:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />

                        <Box display="flex" width="100%" gap={2}>
                            {/* Left Side: TextFields with label beside each input */}
                            <Box display="flex" flexDirection="column" sx={{ width: "75%" }}>
                                {/* Program Fields */}
                                <Box display="flex" flexDirection="column" sx={{ width: "100%" }}>
                                    {/* Program 1 */}
                                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                                        <label className="w-40 font-medium">Program:</label>
                                        <FormControl fullWidth size="small" required error={!!errors.program}>
                                            <InputLabel>Program</InputLabel>
                                            <Select
                                                name="program"
                                                value={person.program ?? ""}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Program"
                                            >
                                                <MenuItem value=""><em>Select Program</em></MenuItem>
                                                {curriculumOptions.map((item, index) => (
                                                    <MenuItem key={index} value={item.curriculum_id}>
                                                        ({item.program_code}) - {item.program_description} {item.major}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.program && (
                                                <FormHelperText>This field is required.</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Box>

                                    {/* Program 2 */}
                                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                                        <label className="w-40 font-medium">Program 2:</label>
                                        <FormControl fullWidth size="small" required error={!!errors.program2}>
                                            <InputLabel>Program 2</InputLabel>
                                            <Select
                                                name="program2"
                                                value={person.program2 ?? ""}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Program 2"
                                            >
                                                <MenuItem value=""><em>Select Program</em></MenuItem>
                                                {curriculumOptions.map((item, index) => (
                                                    <MenuItem key={index} value={item.curriculum_id}>
                                                        ({item.program_code}) - {item.program_description} {item.major}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.program2 && (
                                                <FormHelperText>This field is required.</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Box>

                                    {/* Program 3 */}
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <label className="w-40 font-medium">Program 3:</label>
                                        <FormControl fullWidth size="small" required error={!!errors.program3}>
                                            <InputLabel>Program 3</InputLabel>
                                            <Select
                                                name="program3"
                                                value={person.program3 ?? ""}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                label="Program 3"
                                            >
                                                <MenuItem value=""><em>Select Program</em></MenuItem>
                                                {curriculumOptions.map((item, index) => (
                                                    <MenuItem key={index} value={item.curriculum_id}>
                                                        ({item.program_code}) - {item.program_description} {item.major}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.program3 && (
                                                <FormHelperText>This field is required.</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Box>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    textAlign: "center",
                                    marginTop: "10px",
                                    marginLeft: "35px",
                                    marginBottom: "20px",
                                    border: errors.profile_img ? "1px solid red" : "1px solid black",
                                    width: "5.08cm",
                                    height: "5.08cm",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    backgroundColor: "white",
                                }}
                            >
                                {person.profile_img && person.profile_img !== "" ? (
                                    <img
                                        src={`${API_BASE_URL}/uploads/${person.profile_img}?t=${Date.now()}`}
                                        alt="Profile"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />

                                ) : (
                                    <>
                                        <Typography fontSize={12} color={errors.profile_img ? "error" : "textSecondary"}>
                                            No Profile Image Uploaded
                                        </Typography>
                                        {errors.profile_img && (
                                            <Typography fontSize={12} color="error">
                                                This field is required.
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </Box>

                        </Box>

                        {/* Year Level */}
                        <div className="flex items-center mb-4 gap-2">
                            <label className="w-40 font-medium">Year Level:</label>
                            <FormControl fullWidth size="small" required error={!!errors.yearLevel}>
                                <InputLabel id="year-level-label">Year Level</InputLabel>
                                <Select
                                    labelId="year-level-label"
                                    id="year-level-select"
                                    name="yearLevel"
                                    value={person.yearLevel ?? ""}
                                    label="Year Level"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                >
                                    <MenuItem value=""><em>Select Year Level</em></MenuItem>
                                    <MenuItem value="First Year">First Year</MenuItem>
                                    <MenuItem value="Second Year">Second Year</MenuItem>
                                    <MenuItem value="Third Year">Third Year</MenuItem>
                                    <MenuItem value="Fourth Year">Fourth Year</MenuItem>
                                    <MenuItem value="Fifth Year">Fifth Year</MenuItem>
                                </Select>
                                {errors.yearLevel && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>
                        </div>

                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Person Details:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />

                        <Box display="flex" gap={2} mb={2}>
                            {/* Last Name */}
                            <Box flex="1 1 20%">
                                <Typography mb={1} fontWeight="medium">Last Name</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="last_name"
                                    required
                                    value={person.last_name ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your Last Name"
                                    error={errors.last_name}
                                    helperText={errors.last_name ? "This field is required." : ""}

                                />
                            </Box>

                            {/* First Name */}
                            <Box flex="1 1 20%">
                                <Typography mb={1} fontWeight="medium">First Name</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="first_name"
                                    required
                                    value={person.first_name ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your First Name"
                                    error={errors.first_name}
                                    helperText={errors.first_name ? "This field is required." : ""}
                                />
                            </Box>

                            {/* Middle Name */}
                            <Box flex="1 1 20%">
                                <Typography mb={1} fontWeight="medium">Middle Name</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="middle_name"
                                    required
                                    value={person.middle_name ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your Middle Name"
                                    error={errors.middle_name}
                                    helperText={errors.middle_name ? "This field is required." : ""}
                                />
                            </Box>

                            {/* Extension */}
                            <Box flex="1 1 20%">
                                <Typography mb={1} fontWeight="medium">Extension</Typography>
                                <FormControl fullWidth size="small" error={errors.extension}>
                                    <InputLabel id="extension-label">Extension</InputLabel>
                                    <Select
                                        labelId="extension-label"
                                        id="extension-select"
                                        name="extension"
                                        value={person.extension ?? ""}
                                        label="Extension"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value="Jr.">Jr.</MenuItem>
                                        <MenuItem value="Sr.">Sr.</MenuItem>
                                        <MenuItem value="I">I</MenuItem>
                                        <MenuItem value="II">II</MenuItem>
                                        <MenuItem value="III">III</MenuItem>
                                        <MenuItem value="IV">IV</MenuItem>
                                        <MenuItem value="V">V</MenuItem>
                                    </Select>
                                    {errors.extension && (
                                        <FormHelperText>This field is required.</FormHelperText>
                                    )}
                                </FormControl>
                            </Box>

                            {/* Nickname */}
                            <Box flex="1 1 20%">
                                <Typography mb={1} fontWeight="medium">Nickname</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="nickname"
                                    required
                                    value={person.nickname ?? ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter your Nickname"
                                    error={errors.nickname}
                                    helperText={errors.nickname ? "This field is required." : ""}
                                />
                            </Box>
                        </Box>
                        <Box display="flex" gap={4} mb={2}>
                            {/* Height Field */}
                            <Box display="flex" flexDirection="column" flex="0 0 24%">
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography fontWeight="medium" minWidth="60px">
                                        Height:
                                    </Typography>
                                    <TextField
                                        size="small"
                                        name="height"
                                        value={person.height ?? ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your Height"
                                        error={!!errors.height}
                                        fullWidth
                                    />
                                    <Typography variant="body2">cm.</Typography>
                                </Box>
                                {errors.height && (
                                    <Typography color="error" variant="caption" mt={0.5}>
                                        This field is required.
                                    </Typography>
                                )}
                            </Box>

                            {/* Weight Field */}
                            <Box display="flex" flexDirection="column" flex="0 0 24%">
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography fontWeight="medium" minWidth="60px">
                                        Weight:
                                    </Typography>
                                    <TextField
                                        size="small"
                                        name="weight"
                                        value={person.weight ?? ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Enter your Weight"
                                        error={!!errors.weight}
                                        fullWidth
                                    />
                                    <Typography variant="body2">kg</Typography>
                                </Box>
                                {errors.weight && (
                                    <Typography color="error" variant="caption" mt={0.5}>
                                        This field is required.
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        <Box display="flex" alignItems="center" gap={2} flexWrap="nowrap" width="100%" mb={2}>
                            {/* LRN Label */}
                            <Typography fontWeight="medium" minWidth="180px">
                                Learning Reference Number:
                            </Typography>

                            {/* LRN Input */}
                            <TextField
                                id="lrnNumber"
                                name="lrnNumber"
                                required={person.lrnNumber !== "No LRN Number"}
                                label="Enter your LRN Number"
                                value={person.lrnNumber === "No LRN Number" ? "" : person.lrnNumber ?? ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={person.lrnNumber === "No LRN Number"}
                                size="small"
                                sx={{ width: 220 }}
                                InputProps={{ sx: { height: 40 } }}
                                inputProps={{ style: { height: 40, padding: "10.5px 14px" } }}
                                error={errors.lrnNumber}
                                helperText={errors.lrnNumber ? "This field is required." : ""}
                            />


                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="lrn_na"
                                        checked={person.lrnNumber === "No LRN Number"}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            const updatedPerson = {
                                                ...person,
                                                lrnNumber: checked ? "No LRN Number" : "",
                                            };

                                            setPerson(updatedPerson);
                                            setIsLrnNA(checked);         // optional: if you're tracking this separately
                                            setLrnNAFlag(checked ? "1" : "0"); // optional: if you're sending this to backend
                                        }}
                                        onBlur={handleBlur}
                                    />
                                }
                                label="N/A"
                                sx={{ mr: 2 }}
                            />



                            {/* Gender */}
                            <TextField
                                select
                                size="small"
                                label="Gender"
                                name="gender"
                                required
                                value={person.gender == null ? "" : String(person.gender)}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    handleChange({
                                        target: {
                                            name: "gender",
                                            value: val === "" ? null : parseInt(val, 10),
                                        },
                                    });
                                }}
                                onBlur={handleBlur}
                                error={Boolean(errors.gender)}
                                sx={{ width: 150 }}
                                InputProps={{ sx: { height: 40 } }}
                                inputProps={{ style: { height: 40 } }}
                            >
                                <MenuItem value=""><em>Select Gender</em></MenuItem>
                                <MenuItem value="0">MALE</MenuItem>
                                <MenuItem value="1">FEMALE</MenuItem>
                            </TextField>

                            {errors.gender && (
                                <Typography color="error" variant="caption" ml={1}>
                                    This field is required.
                                </Typography>
                            )}


                            {/* PWD Checkbox */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={person.pwdMember === 1}
                                        onChange={handlePwdCheck}
                                        inputProps={{ "aria-label": "PWD Checkbox" }}
                                    />
                                }
                                label="PWD"
                                sx={{ ml: 2 }}
                            />

                            {person.pwdMember === 1 && (
                                <>
                                    {/* PWD Type */}
                                    <TextField
                                        select
                                        size="small"
                                        label="PWD Type"
                                        name="pwdType"
                                        value={person.pwdType ?? ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required={person.pwdMember === 1}
                                        error={person.pwdMember === 1 && !!errors.pwdType}
                                        helperText={
                                            person.pwdMember === 1 && errors.pwdType
                                                ? "This field is required."
                                                : ""
                                        }
                                        sx={{ width: 220 }}
                                        InputProps={{ sx: { height: 40 } }}
                                        inputProps={{ style: { height: 40 } }}
                                    >
                                        <MenuItem value=""><em>None</em></MenuItem>
                                        <MenuItem value="Blindness">Blindness</MenuItem>
                                        <MenuItem value="Low-vision">Low-vision</MenuItem>
                                        <MenuItem value="Leprosy Cured persons">Leprosy Cured persons</MenuItem>
                                        <MenuItem value="Hearing Impairment">Hearing Impairment</MenuItem>
                                        <MenuItem value="Locomotor Disability">Locomotor Disability</MenuItem>
                                        <MenuItem value="Dwarfism">Dwarfism</MenuItem>
                                        <MenuItem value="Intellectual Disability">Intellectual Disability</MenuItem>
                                        <MenuItem value="Mental Illness">Mental Illness</MenuItem>
                                        <MenuItem value="Autism Spectrum Disorder">Autism Spectrum Disorder</MenuItem>
                                        <MenuItem value="Cerebral Palsy">Cerebral Palsy</MenuItem>
                                        <MenuItem value="Muscular Dystrophy">Muscular Dystrophy</MenuItem>
                                        <MenuItem value="Chronic Neurological conditions">Chronic Neurological conditions</MenuItem>
                                        <MenuItem value="Specific Learning Disabilities">Specific Learning Disabilities</MenuItem>
                                        <MenuItem value="Multiple Sclerosis">Multiple Sclerosis</MenuItem>
                                        <MenuItem value="Speech and Language disability">Speech and Language disability</MenuItem>
                                        <MenuItem value="Thalassemia">Thalassemia</MenuItem>
                                        <MenuItem value="Hemophilia">Hemophilia</MenuItem>
                                        <MenuItem value="Sickle cell disease">Sickle cell disease</MenuItem>
                                        <MenuItem value="Multiple Disabilities including">Multiple Disabilities including</MenuItem>
                                    </TextField>

                                    {/* PWD ID */}
                                    <TextField
                                        size="small"
                                        label="PWD ID"
                                        name="pwdId"
                                        value={person.pwdId ?? ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        required={person.pwdMember === 1}
                                        error={person.pwdMember === 1 && !!errors.pwdId}
                                        helperText={
                                            person.pwdMember === 1 && errors.pwdId
                                                ? "This field is required."
                                                : ""
                                        }
                                        sx={{ width: 200 }}
                                        InputProps={{ sx: { height: 40 } }}
                                        inputProps={{ style: { height: 40 } }}
                                    />
                                </>
                            )}


                        </Box>

                        {/* Row 1: Birth Place + Citizenship */}


                        <Box display="flex" gap={2} mb={2}>
                            {/* 🎂 Birth Date */}
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">
                                    Birth of Date
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="date"
                                    name="birthOfDate"
                                    required
                                    value={person.birthOfDate || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.birthOfDate}
                                    helperText={errors.birthOfDate ? "This field is required." : ""}
                                />
                            </Box>

                            {/* 👤 Age (auto-filled, read-only) */}
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">
                                    Age
                                </Typography>
                                <TextField

                                    fullWidth
                                    size="small"
                                    name="age"
                                    value={person.age || ""}
                                    placeholder="Enter your Age"
                                    required
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!errors.age}
                                    helperText={errors.age ? "This field is required." : ""}
                                    InputProps={{ readOnly: true }} // read-only so user can’t manually change
                                />
                            </Box>
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">
                                    Birth Place
                                </Typography>
                                <TextField fullWidth size="small" name="birthPlace" placeholder="Enter your Birth Place" value={person.birthPlace ?? ""} required onBlur={handleBlur} onChange={handleChange} error={!!errors.birthPlace}
                                    helperText={errors.birthPlace ? "This field is required." : ""} />
                            </Box>
                            <Box flex={1} >
                                <Typography mb={1} fontWeight="medium">
                                    Language/Dialect Spoken
                                </Typography>
                                <TextField fullWidth size="small" name="languageDialectSpoken" placeholder="Enter your Language Spoken" value={person.languageDialectSpoken ?? ""} required onBlur={handleBlur} onChange={handleChange} error={!!errors.languageDialectSpoken}
                                    helperText={errors.languageDialectSpoken ? "This field is required." : ""}
                                />
                            </Box>
                        </Box>


                        <Box display="flex" gap={2}>


                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">
                                    Citizenship
                                </Typography>
                                <FormControl fullWidth size="small" required error={!!errors.citizenship}>
                                    <InputLabel id="citizenship-label">Citizenship</InputLabel>
                                    <Select
                                        labelId="citizenship-label"
                                        id="citizenship"
                                        name="citizenship"
                                        value={person.citizenship ?? ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Citizenship" // Required for floating label
                                    >
                                        <MenuItem value="">
                                            <em>Select Citizenship</em>
                                        </MenuItem>
                                        <MenuItem value="AFGHAN">AFGHAN</MenuItem>
                                        <MenuItem value="ALBANIAN">ALBANIAN</MenuItem>
                                        <MenuItem value="ARAB">ARAB</MenuItem>
                                        <MenuItem value="ARGENTINIAN">ARGENTINIAN</MenuItem>
                                        <MenuItem value="AUSTRALIAN">AUSTRALIAN</MenuItem>
                                        <MenuItem value="AUSTRIAN">AUSTRIAN</MenuItem>
                                        <MenuItem value="BELGIAN">BELGIAN</MenuItem>
                                        <MenuItem value="BANGLADESHI">BANGLADESHI</MenuItem>
                                        <MenuItem value="BAHAMIAN">BAHAMIAN</MenuItem>
                                        <MenuItem value="BHUTANESE">BHUTANESE</MenuItem>
                                        <MenuItem value="BERMUDAN">BERMUDAN</MenuItem>
                                        <MenuItem value="BOLIVIAN">BOLIVIAN</MenuItem>
                                        <MenuItem value="BRAZILIAN">BRAZILIAN</MenuItem>
                                        <MenuItem value="BRUNEI">BRUNEI</MenuItem>
                                        <MenuItem value="BOTSWANIAN">BOTSWANIAN</MenuItem>
                                        <MenuItem value="CANADIAN">CANADIAN</MenuItem>
                                        <MenuItem value="CHILE">CHILE</MenuItem>
                                        <MenuItem value="CHINESE">CHINESE</MenuItem>
                                        <MenuItem value="COLOMBIAN">COLOMBIAN</MenuItem>
                                        <MenuItem value="COSTA RICAN">COSTA RICAN</MenuItem>
                                        <MenuItem value="CUBAN">CUBAN</MenuItem>
                                        <MenuItem value="CYPRIOT">CYPRIOT</MenuItem>
                                        <MenuItem value="CZECH">CZECH</MenuItem>
                                        <MenuItem value="DANISH">DANISH</MenuItem>
                                        <MenuItem value="DOMINICAN">DOMINICAN</MenuItem>
                                        <MenuItem value="ALGERIAN">ALGERIAN</MenuItem>
                                        <MenuItem value="EGYPTIAN">EGYPTIAN</MenuItem>
                                        <MenuItem value="SPANISH">SPANISH</MenuItem>
                                        <MenuItem value="ESTONIAN">ESTONIAN</MenuItem>
                                        <MenuItem value="ETHIOPIAN">ETHIOPIAN</MenuItem>
                                        <MenuItem value="FIJI">FIJI</MenuItem>
                                        <MenuItem value="FILIPINO">FILIPINO</MenuItem>
                                        <MenuItem value="FINISH">FINISH</MenuItem>
                                        <MenuItem value="FRENCH">FRENCH</MenuItem>
                                        <MenuItem value="BRITISH">BRITISH</MenuItem>
                                        <MenuItem value="GERMAN">GERMAN</MenuItem>
                                        <MenuItem value="GHANAIAN">GHANAIAN</MenuItem>
                                        <MenuItem value="GREEK">GREEK</MenuItem>
                                        <MenuItem value="GUAMANIAN">GUAMANIAN</MenuItem>
                                        <MenuItem value="GUATEMALAN">GUATEMALAN</MenuItem>
                                        <MenuItem value="HONG KONG">HONG KONG</MenuItem>
                                        <MenuItem value="CROATIAN">CROATIAN</MenuItem>
                                        <MenuItem value="HAITIAN">HAITIAN</MenuItem>
                                        <MenuItem value="HUNGARIAN">HUNGARIAN</MenuItem>
                                        <MenuItem value="INDONESIAN">INDONESIAN</MenuItem>
                                        <MenuItem value="INDIAN">INDIAN</MenuItem>
                                        <MenuItem value="IRANIAN">IRANIAN</MenuItem>
                                        <MenuItem value="IRAQI">IRAQI</MenuItem>
                                        <MenuItem value="IRISH">IRISH</MenuItem>
                                        <MenuItem value="ICELANDER">ICELANDER</MenuItem>
                                        <MenuItem value="ISRAELI">ISRAELI</MenuItem>
                                        <MenuItem value="ITALIAN">ITALIAN</MenuItem>
                                        <MenuItem value="JAMAICAN">JAMAICAN</MenuItem>
                                        <MenuItem value="JORDANIAN">JORDANIAN</MenuItem>
                                        <MenuItem value="JAPANESE">JAPANESE</MenuItem>
                                        <MenuItem value="CAMBODIAN">CAMBODIAN</MenuItem>
                                        <MenuItem value="KOREAN">KOREAN</MenuItem>
                                        <MenuItem value="KUWAITI">KUWAITI</MenuItem>
                                        <MenuItem value="KENYAN">KENYAN</MenuItem>
                                        <MenuItem value="LAOTIAN">LAOTIAN</MenuItem>
                                        <MenuItem value="LEBANESE">LEBANESE</MenuItem>
                                        <MenuItem value="LIBYAN">LIBYAN</MenuItem>
                                        <MenuItem value="LUXEMBURGER">LUXEMBURGER</MenuItem>
                                        <MenuItem value="MALAYSIAN">MALAYSIAN</MenuItem>
                                        <MenuItem value="MOROCCAN">MOROCCAN</MenuItem>
                                        <MenuItem value="MEXICAN">MEXICAN</MenuItem>
                                        <MenuItem value="BURMESE">BURMESE</MenuItem>
                                        <MenuItem value="MYANMAR">MYANMAR</MenuItem>
                                        <MenuItem value="NIGERIAN">NIGERIAN</MenuItem>
                                        <MenuItem value="NOT INDICATED">NOT INDICATED</MenuItem>
                                        <MenuItem value="DUTCH">DUTCH</MenuItem>
                                        <MenuItem value="NORWEGIAN">NORWEGIAN</MenuItem>
                                        <MenuItem value="NEPALI">NEPALI</MenuItem>
                                        <MenuItem value="NEW ZEALANDER">NEW ZEALANDER</MenuItem>
                                        <MenuItem value="OMANI">OMANI</MenuItem>
                                        <MenuItem value="PAKISTANI">PAKISTANI</MenuItem>
                                        <MenuItem value="PANAMANIAN">PANAMANIAN</MenuItem>
                                        <MenuItem value="PERUVIAN">PERUVIAN</MenuItem>
                                        <MenuItem value="PAPUAN">PAPUAN</MenuItem>
                                        <MenuItem value="POLISH">POLISH</MenuItem>
                                        <MenuItem value="PUERTO RICAN">PUERTO RICAN</MenuItem>
                                        <MenuItem value="PORTUGUESE">PORTUGUESE</MenuItem>
                                        <MenuItem value="PARAGUAYAN">PARAGUAYAN</MenuItem>
                                        <MenuItem value="PALESTINIAN">PALESTINIAN</MenuItem>
                                        <MenuItem value="QATARI">QATARI</MenuItem>
                                        <MenuItem value="ROMANIAN">ROMANIAN</MenuItem>
                                        <MenuItem value="RUSSIAN">RUSSIAN</MenuItem>
                                        <MenuItem value="RWANDAN">RWANDAN</MenuItem>
                                        <MenuItem value="SAUDI ARABIAN">SAUDI ARABIAN</MenuItem>
                                        <MenuItem value="SUDANESE">SUDANESE</MenuItem>
                                        <MenuItem value="SINGAPOREAN">SINGAPOREAN</MenuItem>
                                        <MenuItem value="SRI LANKAN">SRI LANKAN</MenuItem>
                                        <MenuItem value="EL SALVADORIAN">EL SALVADORIAN</MenuItem>
                                        <MenuItem value="SOMALIAN">SOMALIAN</MenuItem>
                                        <MenuItem value="SLOVAK">SLOVAK</MenuItem>
                                        <MenuItem value="SWEDISH">SWEDISH</MenuItem>
                                        <MenuItem value="SWISS">SWISS</MenuItem>
                                        <MenuItem value="SYRIAN">SYRIAN</MenuItem>
                                        <MenuItem value="THAI">THAI</MenuItem>
                                        <MenuItem value="TRINIDAD AND TOBAGO">TRINIDAD AND TOBAGO</MenuItem>
                                        <MenuItem value="TUNISIAN">TUNISIAN</MenuItem>
                                        <MenuItem value="TURKISH">TURKISH</MenuItem>
                                        <MenuItem value="TAIWANESE">TAIWANESE</MenuItem>
                                        <MenuItem value="UKRAINIAN">UKRAINIAN</MenuItem>
                                        <MenuItem value="URUGUYAN">URUGUYAN</MenuItem>
                                        <MenuItem value="UNITED STATES">UNITED STATES</MenuItem>
                                        <MenuItem value="VENEZUELAN">VENEZUELAN</MenuItem>
                                        <MenuItem value="VIRGIN ISLANDS">VIRGIN ISLANDS</MenuItem>
                                        <MenuItem value="VIETNAMESE">VIETNAMESE</MenuItem>
                                        <MenuItem value="YEMENI">YEMENI</MenuItem>
                                        <MenuItem value="YUGOSLAVIAN">YUGOSLAVIAN</MenuItem>
                                        <MenuItem value="SOUTH AFRICAN">SOUTH AFRICAN</MenuItem>
                                        <MenuItem value="ZAIREAN">ZAIREAN</MenuItem>
                                        <MenuItem value="ZIMBABWEAN">ZIMBABWEAN</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                    </Select>
                                    {errors.citizenship && (
                                        <FormHelperText>This field is required.</FormHelperText>
                                    )}
                                </FormControl>

                            </Box>

                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">
                                    Religion
                                </Typography>
                                <FormControl fullWidth size="small" required error={!!errors.religion}>
                                    <InputLabel id="religion-label">Religion</InputLabel>
                                    <Select
                                        labelId="religion-label"
                                        id="religion"
                                        name="religion"
                                        value={person.religion ?? ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Religion" // Enables floating label
                                    >
                                        <MenuItem value="">
                                            <em>Select Religion</em>
                                        </MenuItem>
                                        <MenuItem value="Jehovah's Witness">Jehovah's Witness</MenuItem>
                                        <MenuItem value="Buddist">Buddist</MenuItem>
                                        <MenuItem value="Catholic">Catholic</MenuItem>
                                        <MenuItem value="Dating Daan">Dating Daan</MenuItem>
                                        <MenuItem value="Pagano">Pagano</MenuItem>
                                        <MenuItem value="Atheist">Atheist</MenuItem>
                                        <MenuItem value="Born Again">Born Again</MenuItem>
                                        <MenuItem value="Adventis">Adventis</MenuItem>
                                        <MenuItem value="Baptist">Baptist</MenuItem>
                                        <MenuItem value="Mormons">Mormons</MenuItem>
                                        <MenuItem value="Free Methodist">Free Methodist</MenuItem>
                                        <MenuItem value="Christian">Christian</MenuItem>
                                        <MenuItem value="Protestant">Protestant</MenuItem>
                                        <MenuItem value="Aglipay">Aglipay</MenuItem>
                                        <MenuItem value="Islam">Islam</MenuItem>
                                        <MenuItem value="LDS">LDS</MenuItem>
                                        <MenuItem value="Seventh Day Adventist">Seventh Day Adventist</MenuItem>
                                        <MenuItem value="Iglesia Ni Cristo">Iglesia Ni Cristo</MenuItem>
                                        <MenuItem value="UCCP">UCCP</MenuItem>
                                        <MenuItem value="PMCC">PMCC</MenuItem>
                                        <MenuItem value="Baha'i Faith">Baha'i Faith</MenuItem>
                                        <MenuItem value="None">None</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                    </Select>
                                    {errors.religion && (
                                        <FormHelperText>This field is required.</FormHelperText>
                                    )}
                                </FormControl>

                            </Box>
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">
                                    Civil Status
                                </Typography>
                                <FormControl fullWidth size="small" required error={!!errors.civilStatus}>
                                    <InputLabel id="civil-status-label">Civil Status</InputLabel>
                                    <Select
                                        labelId="civil-status-label"
                                        id="civilStatus"
                                        name="civilStatus"
                                        value={person.civilStatus ?? ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Civil Status"
                                    >
                                        <MenuItem value="">
                                            <em> Select Status </em>
                                        </MenuItem>
                                        <MenuItem value="Single">Single</MenuItem>
                                        <MenuItem value="Married">Married</MenuItem>
                                        <MenuItem value="Legally Seperated">Legally Seperated</MenuItem>
                                        <MenuItem value="Widowed">Widowed</MenuItem>
                                        <MenuItem value="Solo Parent">Solo Parent</MenuItem>
                                    </Select>
                                    {errors.civilStatus && (
                                        <FormHelperText>This field is required.</FormHelperText>
                                    )}
                                </FormControl>

                            </Box>
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">
                                    Tribe/Ethnic Group
                                </Typography>
                                <FormControl fullWidth size="small" required error={!!errors.tribeEthnicGroup}>
                                    <InputLabel id="tribe-label">Tribe/Ethnic Group</InputLabel>
                                    <Select
                                        labelId="tribe-label"
                                        id="tribeEthnicGroup"
                                        name="tribeEthnicGroup"
                                        value={person.tribeEthnicGroup ?? ""}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Tribe/Ethnic Group"
                                    >
                                        <MenuItem value="">
                                            <em>Select Tribe/Ethnic Group</em>
                                        </MenuItem>
                                        <MenuItem value="Agta">Agta</MenuItem>
                                        <MenuItem value="Agutaynen">Agutaynen</MenuItem>
                                        <MenuItem value="Aklanon">Aklanon</MenuItem>
                                        <MenuItem value="Alangan">Alangan</MenuItem>
                                        <MenuItem value="Alta">Alta</MenuItem>
                                        <MenuItem value="Amersian">Amersian</MenuItem>
                                        <MenuItem value="Ati">Ati</MenuItem>
                                        <MenuItem value="Atta">Atta</MenuItem>
                                        <MenuItem value="Ayta">Ayta</MenuItem>
                                        <MenuItem value="B'laan">B'laan</MenuItem>
                                        <MenuItem value="Badjao">Badjao</MenuItem>
                                        <MenuItem value="Bagobo">Bagobo</MenuItem>
                                        <MenuItem value="Balangao">Balangao</MenuItem>
                                        <MenuItem value="Balangingi">Balangingi</MenuItem>
                                        <MenuItem value="Bangon">Bangon</MenuItem>
                                        <MenuItem value="Bantoanon">Bantoanon</MenuItem>
                                        <MenuItem value="Banwaon">Banwaon</MenuItem>
                                        <MenuItem value="Batak">Batak</MenuItem>
                                        <MenuItem value="Bicolano">Bicolano</MenuItem>
                                        <MenuItem value="Binukid">Binukid</MenuItem>
                                        <MenuItem value="Bohalano">Bohalano</MenuItem>
                                        <MenuItem value="Bolinao">Bolinao</MenuItem>
                                        <MenuItem value="Bontoc">Bontoc</MenuItem>
                                        <MenuItem value="Buhid">Buhid</MenuItem>
                                        <MenuItem value="Butuanon">Butuanon</MenuItem>
                                        <MenuItem value="Cagyanen">Cagyanen</MenuItem>
                                        <MenuItem value="Caray-a">Caray-a</MenuItem>
                                        <MenuItem value="Cebuano">Cebuano</MenuItem>
                                        <MenuItem value="Cuyunon">Cuyunon</MenuItem>
                                        <MenuItem value="Dasen">Dasen</MenuItem>
                                        <MenuItem value="Ilocano">Ilocano</MenuItem>
                                        <MenuItem value="Ilonggo">Ilonggo</MenuItem>
                                        <MenuItem value="Jamah Mapun">Jamah Mapun</MenuItem>
                                        <MenuItem value="Malay">Malay</MenuItem>
                                        <MenuItem value="Mangyan">Mangyan</MenuItem>
                                        <MenuItem value="Maranao">Maranao</MenuItem>
                                        <MenuItem value="Molbogs">Molbogs</MenuItem>
                                        <MenuItem value="Palawano">Palawano</MenuItem>
                                        <MenuItem value="Panimusan">Panimusan</MenuItem>
                                        <MenuItem value="Tagbanua">Tagbanua</MenuItem>
                                        <MenuItem value="Tao't">Tao't</MenuItem>
                                        <MenuItem value="Bato">Bato</MenuItem>
                                        <MenuItem value="Tausug">Tausug</MenuItem>
                                        <MenuItem value="Waray">Waray</MenuItem>
                                        <MenuItem value="None">None</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                    </Select>
                                    {errors.tribeEthnicGroup && (
                                        <FormHelperText>This field is required.</FormHelperText>
                                    )}
                                </FormControl>

                            </Box>
                        </Box>

                        <br />
                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Contact Information:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />

                        <Box display="flex" gap={2} mb={2}>

                            <Box flex={1} display="flex" alignItems="center" gap={2}>
                                <Typography sx={{ width: 180 }} fontWeight="medium">
                                    Cellphone Number:
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="cellphoneNumber"
                                    placeholder="Enter your Cellphone Number +63"
                                    required
                                    value={person.cellphoneNumber ?? ""}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!errors.cellphoneNumber}
                                    helperText={errors.cellphoneNumber && "This field is required."}
                                />
                            </Box>


                            <Box flex={1} display="flex" alignItems="center" gap={2}>
                                <Typography sx={{ width: 180 }} fontWeight="medium">
                                    Email Address:
                                </Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="emailAddress"
                                    required
                                    value={person.emailAddress ?? ""}
                                    placeholder="Enter your Email Address (e.g., username@gmail.com)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!errors.emailAddress}
                                    helperText={errors.emailAddress && "This field is required."}
                                />
                            </Box>
                        </Box>




                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Present Address:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />


                        <Box display="flex" gap={2} mb={2}>
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">Present Street</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="presentStreet"
                                    value={person.presentStreet ?? ""}
                                    onBlur={handleBlur}
                                    placeholder="Enter your Present Street"
                                    onChange={handleChange}
                                    error={!!errors.presentStreet}
                                    helperText={errors.presentStreet && "This field is required."}
                                />
                            </Box>

                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">Present Zip Code</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="presentZipCode"
                                    placeholder="Enter your Zip Code"
                                    value={person.presentZipCode ?? ""}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!errors.presentZipCode}
                                    helperText={errors.presentZipCode && "This field is required."}
                                />
                            </Box>
                        </Box>


                        <Box display="flex" gap={2} mb={2}>

                            <FormControl fullWidth size="small" required error={!!errors.presentRegion}>
                                <InputLabel id="present-region-label">Region</InputLabel>
                                <Select
                                    labelId="present-region-label"
                                    name="presentRegion"
                                    value={person.presentRegion ?? ""}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setSelectedRegion(e.target.value);
                                        setSelectedProvince("");
                                        setSelectedCity("");
                                        setSelectedBarangay("");
                                        setProvinceList([]);
                                        setCityList([]);
                                        setBarangayList([]);
                                        autoSave();
                                    }}
                                    label="Region"
                                >
                                    <MenuItem value="">
                                        <em>Select Region</em>
                                    </MenuItem>
                                    {regionList.map((region) => (
                                        <MenuItem key={region.region_code} value={region.region_name}>
                                            {region.region_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.presentRegion && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>


                            <FormControl fullWidth size="small" required error={!!errors.presentProvince}>
                                <InputLabel id="present-province-label">Province</InputLabel>
                                <Select
                                    labelId="present-province-label"
                                    name="presentProvince"
                                    value={person.presentProvince ?? ""}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setSelectedProvince(e.target.value);
                                        setSelectedCity("");
                                        setSelectedBarangay("");
                                        setCityList([]);
                                        setBarangayList([]);
                                        autoSave();
                                    }}
                                    label="Province"
                                    disabled={!person.presentRegion}
                                >
                                    <MenuItem value="">
                                        <em>Select Province</em>
                                    </MenuItem>
                                    {provinceList.map((province) => (
                                        <MenuItem key={province.province_code} value={province.province_name}>
                                            {province.province_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.presentProvince && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>
                        </Box>

                        {/* Municipality & Barangay */}
                        <Box display="flex" gap={2} mb={2}>
                            {/* Present Municipality */}
                            <FormControl fullWidth size="small" required error={!!errors.presentMunicipality}>
                                <InputLabel id="present-municipality-label">Municipality</InputLabel>
                                <Select
                                    labelId="present-municipality-label"
                                    name="presentMunicipality"
                                    value={person.presentMunicipality ?? ""}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setSelectedCity(e.target.value);
                                        setSelectedBarangay("");
                                        setBarangayList([]);
                                        autoSave();
                                    }}
                                    label="Municipality"
                                    disabled={!person.presentProvince}
                                >
                                    <MenuItem value="">
                                        <em>Select Municipality</em>
                                    </MenuItem>
                                    {cityList.map((city) => (
                                        <MenuItem key={city.city_code} value={city.city_name}>
                                            {city.city_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.presentMunicipality && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>

                            {/* Present Barangay */}
                            <FormControl fullWidth size="small" required error={!!errors.presentBarangay}>
                                <InputLabel id="present-barangay-label">Barangay</InputLabel>
                                <Select
                                    labelId="present-barangay-label"
                                    name="presentBarangay"
                                    value={person.presentBarangay ?? ""}
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setSelectedBarangay(e.target.value);
                                        autoSave();
                                    }}
                                    label="Barangay"
                                    disabled={!person.presentMunicipality}
                                >
                                    <MenuItem value="">
                                        <em>Select Barangay</em>
                                    </MenuItem>
                                    {barangayList.map((brgy) => (
                                        <MenuItem key={brgy.brgy_code} value={brgy.brgy_name}>
                                            {brgy.brgy_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.presentBarangay && (
                                    <FormHelperText>This field is required.</FormHelperText>
                                )}
                            </FormControl>
                        </Box>


                        {/* DSWD Household Number */}
                        <Box mb={2}>
                            <Typography mb={1} fontWeight="medium">Present DSWD Household Number</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                name="presentDswdHouseholdNumber"
                                value={person.presentDswdHouseholdNumber ?? ""}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter your Present DSWD Household Number"
                                error={!!errors.presentDswdHouseholdNumber}
                                helperText={errors.presentDswdHouseholdNumber && "This field is required."}
                            />
                        </Box>

                        <Typography style={{ fontSize: "20px", color: "#6D2323", fontWeight: "bold" }}>Permanent Address:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%" }} />
                        <br />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="sameAsPresentAddress"
                                    checked={person.sameAsPresentAddress === 1}
                                    onChange={(e) => {
                                        const checked = e.target.checked;

                                        const updatedPerson = {
                                            ...person,
                                            sameAsPresentAddress: checked ? 1 : 0,
                                        };

                                        if (checked) {
                                            updatedPerson.permanentStreet = person.presentStreet;
                                            updatedPerson.permanentZipCode = person.presentZipCode;
                                            updatedPerson.permanentRegion = person.presentRegion;
                                            updatedPerson.permanentProvince = person.presentProvince;
                                            updatedPerson.permanentMunicipality = person.presentMunicipality;
                                            updatedPerson.permanentBarangay = person.presentBarangay;
                                            updatedPerson.permanentDswdHouseholdNumber = person.presentDswdHouseholdNumber;

                                            setPermanentRegion(person.presentRegion);
                                            setPermanentProvince(person.presentProvince);
                                            setPermanentCity(person.presentMunicipality);
                                            setPermanentBarangay(person.presentBarangay);
                                        }

                                        setPerson(updatedPerson);
                                        handleUpdate(updatedPerson); // optional: real-time save
                                    }}
                                    onBlur={handleBlur}
                                />
                            }
                            label="Same as Present Address"
                        />


                        {/* Street & Zip Code */}
                        <Box display="flex" gap={2} mb={2}>
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">Permanent Street</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="permanentStreet"
                                    placeholder="Enter your Permanent Street"
                                    value={person.permanentStreet ?? ""}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!errors.permanentStreet}
                                    helperText={errors.permanentStreet && "This field is required."}
                                />
                            </Box>

                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">Permanent Zip Code</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="permanentZipCode"
                                    placeholder="Enter your Permanent Zip Code"
                                    value={person.permanentZipCode ?? ""}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    error={!!errors.permanentZipCode}
                                    helperText={errors.permanentZipCode && "This field is required."}
                                />
                            </Box>
                        </Box>
                        {/* Permanent Region & Province */}
                        <Box display="flex" gap={2} mb={2}>
                            {/* Permanent Region */}
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">Permanent Region</Typography>
                                <FormControl fullWidth size="small" required error={!!errors.permanentRegion}>
                                    <InputLabel id="permanent-region-label">Select Region</InputLabel>
                                    <Select
                                        labelId="permanent-region-label"
                                        id="permanentRegion"
                                        name="permanentRegion"
                                        value={person.permanentRegion ?? ""}
                                        label="Select Region"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setPermanentRegion(e.target.value);
                                            setPermanentProvince("");
                                            setPermanentCity("");
                                            setPermanentBarangay("");
                                            setPermanentProvinceList([]);
                                            setPermanentCityList([]);
                                            setPermanentBarangayList([]);
                                            autoSave();
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>Select Region</em>
                                        </MenuItem>
                                        {permanentRegionList.map((region) => (
                                            <MenuItem key={region.region_code} value={region.region_name}>
                                                {region.region_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.permanentRegion && (
                                        <Typography variant="caption" color="error">This field is required.</Typography>
                                    )}
                                </FormControl>
                            </Box>

                            {/* Permanent Province */}
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">Permanent Province</Typography>
                                <FormControl fullWidth size="small" required error={!!errors.permanentProvince}>
                                    <InputLabel id="permanent-province-label">Select Province</InputLabel>
                                    <Select
                                        labelId="permanent-province-label"
                                        id="permanentProvince"
                                        name="permanentProvince"
                                        value={person.permanentProvince ?? ""}
                                        label="Select Province"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setPermanentProvince(e.target.value);
                                            setPermanentCity("");
                                            setPermanentBarangay("");
                                            setPermanentCityList([]);
                                            setPermanentBarangayList([]);
                                            autoSave();
                                        }}
                                        disabled={!person.permanentRegion}
                                    >
                                        <MenuItem value="">
                                            <em>Select Province</em>
                                        </MenuItem>
                                        {permanentProvinceList.map((province) => (
                                            <MenuItem key={province.province_code} value={province.province_name}>
                                                {province.province_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.permanentProvince && (
                                        <Typography variant="caption" color="error">This field is required.</Typography>
                                    )}
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Permanent Municipality & Barangay */}
                        <Box display="flex" gap={2} mb={2}>
                            {/* Permanent Municipality */}
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">Permanent Municipality</Typography>
                                <FormControl fullWidth size="small" required error={!!errors.permanentMunicipality}>
                                    <InputLabel id="permanent-municipality-label">Select Municipality</InputLabel>
                                    <Select
                                        labelId="permanent-municipality-label"
                                        id="permanentMunicipality"
                                        name="permanentMunicipality"
                                        value={person.permanentMunicipality ?? ""}
                                        label="Select Municipality"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setPermanentCity(e.target.value);
                                            setPermanentBarangay("");
                                            setPermanentBarangayList([]);
                                            autoSave();
                                        }}
                                        disabled={!person.permanentProvince}
                                    >
                                        <MenuItem value="">
                                            <em>Select Municipality</em>
                                        </MenuItem>
                                        {permanentCityList.map((city) => (
                                            <MenuItem key={city.city_code} value={city.city_name}>
                                                {city.city_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.permanentMunicipality && (
                                        <Typography variant="caption" color="error">This field is required.</Typography>
                                    )}
                                </FormControl>
                            </Box>

                            {/* Permanent Barangay */}
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">Permanent Barangay</Typography>
                                <FormControl fullWidth size="small" required error={!!errors.permanentBarangay}>
                                    <InputLabel id="permanent-barangay-label">Select Barangay</InputLabel>
                                    <Select
                                        labelId="permanent-barangay-label"
                                        id="permanentBarangay"
                                        name="permanentBarangay"
                                        value={person.permanentBarangay ?? ""}
                                        label="Select Barangay"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            handleChange(e);
                                            setPermanentBarangay(e.target.value);
                                            autoSave();
                                        }}
                                        disabled={!person.permanentMunicipality}
                                    >
                                        <MenuItem value="">
                                            <em>Select Barangay</em>
                                        </MenuItem>
                                        {permanentBarangayList.map((brgy) => (
                                            <MenuItem key={brgy.brgy_code} value={brgy.brgy_name}>
                                                {brgy.brgy_name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.permanentBarangay && (
                                        <Typography variant="caption" color="error">This field is required.</Typography>
                                    )}
                                </FormControl>
                            </Box>
                        </Box>


                        {/* DSWD Household Number */}
                        <Box mb={2}>
                            <Typography mb={1} fontWeight="medium">Permanent DSWD Household Number</Typography>
                            <TextField
                                fullWidth
                                size="small"
                                variant="outlined"
                                placeholder="Enter your Permanent DSWD Household Number"
                                name="permanentDswdHouseholdNumber"
                                value={person.permanentDswdHouseholdNumber ?? ""}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                error={!!errors.permanentDswdHouseholdNumber}
                                helperText={errors.permanentDswdHouseholdNumber && "This field is required."}
                            />
                        </Box>

                        <Modal open={open} onClose={handleClose}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100vh",
                                    // subtle blur for modern look
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: 600,
                                        bgcolor: "background.paper",
                                        borderRadius: 3,
                                        boxShadow: 24,
                                        p: 4,
                                        maxHeight: "90vh",
                                        overflowY: "auto",
                                    }}
                                >
                                    {/* Close (X) Button in top-right */}
                                    <IconButton
                                        aria-label="close"
                                        onClick={handleClose}
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            color: "#fff",
                                            backgroundColor: settings?.header_color || "#1976d2",


                                            border: `2px solid ${borderColor}`,

                                            "&:hover": {
                                                bgcolor: "#000",
                                            },
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>

                                    {/* Header */}
                                    <Box
                                        sx={{
                                            backgroundColor: settings?.header_color || "#1976d2",


                                            border: `2px solid ${borderColor}`,

                                            color: "white",
                                            py: 2,
                                            px: 3,
                                            borderRadius: 2,
                                            textAlign: "center",
                                            mb: 3,
                                        }}
                                    >
                                        <Typography variant="h6" fontWeight="bold">
                                            Upload Your Photo
                                        </Typography>
                                    </Box>

                                    {/* Preview Image */}
                                    {preview && (
                                        <Box sx={{ display: "flex", justifyContent: "center", my: 2, position: "relative" }}>
                                            <Box
                                                component="img"
                                                src={preview}
                                                alt="Preview"
                                                sx={{
                                                    width: "192px",
                                                    height: "192px",
                                                    objectFit: "cover",
                                                    border: "2px solid #6D2323",
                                                    borderRadius: 2,
                                                }}
                                            />
                                            <Button
                                                size="small"
                                                onClick={() => {
                                                    setSelectedFile(null);
                                                    setPreview(null);
                                                }}
                                                sx={{
                                                    position: "absolute",
                                                    top: -8,
                                                    right: "calc(50% - 96px)",
                                                    minWidth: 0,
                                                    width: 28,
                                                    height: 28,
                                                    fontSize: "18px",
                                                    p: 0,
                                                    color: "#fff",
                                                    bgcolor: "#d32f2f",
                                                    borderRadius: "50%",
                                                    "&:hover": { bgcolor: "#b71c1c" },
                                                }}
                                            >
                                                ×
                                            </Button>
                                        </Box>
                                    )}

                                    {/* Guidelines Section */}
                                    <Box
                                        sx={{
                                            border: "2px dashed #ccc",
                                            p: 2,
                                            borderRadius: 2,
                                            mb: 3,
                                            backgroundColor: "#f9f9f9",
                                        }}
                                    >
                                        <Typography variant="body1" fontWeight="bold" mb={1}>
                                            Guidelines:
                                        </Typography>
                                        <Box sx={{ ml: 2, fontSize: "15px" }}>
                                            - Size: 2" x 2"
                                            <br />
                                            - Color: Your photo must be in colored.
                                            <br />
                                            - Background: White.
                                            <br />
                                            - Head size and position: Look directly into the camera
                                            at a straight angle, face centered.
                                            <br />
                                            - File types: JPEG, JPG, PNG
                                            <br />
                                            - Attire must be formal.
                                            <br />
                                            - Required File Size: 2mb

                                        </Box>

                                        <Typography variant="body1" fontWeight="bold" mt={2}>
                                            How to Change the Photo?
                                        </Typography>
                                        <Box sx={{ ml: 2, fontSize: "15px" }}>
                                            - Click the X Button
                                            <br />
                                            - Choose a new file
                                            <br />- Click the Upload button
                                        </Box>
                                    </Box>

                                    {/* File Input */}
                                    <Typography
                                        sx={{
                                            fontSize: "18px",
                                            color: "#6D2323",
                                            fontWeight: "bold",
                                            mb: 1,
                                        }}
                                    >
                                        Select Your Image:
                                    </Typography>
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onClick={(e) => (e.target.value = null)}
                                        onChange={handleFileChange}
                                        style={{
                                            display: "block",
                                            width: "100%",
                                            padding: "10px",
                                            border: "1px solid #ccc",
                                            borderRadius: "4px",
                                            marginBottom: "16px",
                                        }}
                                    />

                                    {/* Upload Button */}
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={handleUpload}
                                        sx={{
                                            backgroundColor: settings?.header_color || "#1976d2",


                                            border: `2px solid ${borderColor}`,

                                            color: "white",
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: "#000",
                                            },
                                        }}
                                    >
                                        Upload
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>


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





                        <Box display="flex" justifyContent="right" mt={4}>
                            {/* Previous Page Button */}
                            <Button
                                variant="contained"
                                onClick={handleOpen}
                                sx={{
                                    backgroundColor: mainButtonColor,
                                    border: `2px solid ${borderColor}`,

                                    color: "#fff", // Set text color to white
                                    marginRight: "5px", // Add margin between buttons
                                    "&:hover": {
                                        backgroundColor: "#000000", // Adjust hover color to match
                                    },
                                    display: "flex", // Ensure icon and text are aligned
                                    alignItems: "center", // Center the content vertically
                                }}
                            >
                                <PhotoCameraIcon sx={{ marginRight: "8px" }} /> {/* Photo Icon */}
                                Upload Photo <br /> Student Picture
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    handleUpdate();
                                    navigate("/super_admin_applicant_dashboard2");
                                }}
                                endIcon={
                                    <ArrowForwardIcon
                                        sx={{
                                            color: '#fff',
                                            transition: 'color 0.3s',
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


                        <Snackbar
                            open={snackbar.open}
                            autoHideDuration={3000}
                            onClose={handleCloseSnackbar}
                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                        >
                            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                                {snackbar.message}
                            </Alert>
                        </Snackbar>


                    </Container>
                </form>
            </Container >
        </Box >
    );
};

export default SuperAdminApplicantDashboard1;
