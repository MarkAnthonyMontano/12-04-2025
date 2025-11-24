import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";

import axios from "axios";
import { Button, Box, TextField, Container, Typography, Card, TableContainer, Paper, Table, TableHead, TableRow, TableCell, FormHelperText, FormControl, InputLabel, Select, MenuItem, Modal, FormControlLabel, Checkbox, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import InfoIcon from "@mui/icons-material/Info";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import ErrorIcon from "@mui/icons-material/Error";
import Search from '@mui/icons-material/Search';
import regions from "../data/region.json";
import provinces from "../data/province.json";
import cities from "../data/city.json";
import barangays from "../data/barangay.json";
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import API_BASE_URL from "../apiConfig";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import AssignmentIcon from "@mui/icons-material/Assignment";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FactCheckIcon from '@mui/icons-material/FactCheck';

const StudentDashboard1 = () => {
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

    const fetchByPersonId = async (personID) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/enrollment_person/${personID}`);
            setPerson(res.data);
            setSelectedPerson(res.data);
            if (res.data?.applicant_number) {
            }
        } catch (err) {
            console.error("❌ person_with_applicant failed:", err);
        }
    };


    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");

    const location = useLocation();
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [persons, setPersons] = useState([]);
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
    const [studentNumber, setStudentNumber] = useState("");

    const queryParams = new URLSearchParams(location.search);
    const queryPersonId = queryParams.get("person_id");

    // Always pull student_number from sessionStorage
    const queryStudentNumber = sessionStorage.getItem("student_number");

    useEffect(() => {
        if (!queryStudentNumber) return;
        const fetchPersonId = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/person_id/${queryStudentNumber}`);
                setUserID(res.data.person_id);
                setStudentNumber(queryStudentNumber);
                setPerson(res.data);
                setSelectedPerson(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch person_id:", err);
            }
        };
        fetchPersonId();
    }, [queryStudentNumber]);


    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const loggedInPersonId = localStorage.getItem("person_id");
        const searchedPersonId = sessionStorage.getItem("student_edit_person_id");

        if (!storedUser || !storedRole || !loggedInPersonId) {
            window.location.href = "/login";
            return;
        }

        setUser(storedUser);
        setUserRole(storedRole);

        // Roles that can access
        const allowedRoles = ["student", "registrar"];
        if (allowedRoles.includes(storedRole)) {
            // ✅ Prefer URL param if student is editing, otherwise logged-in student
            const targetId = queryPersonId || searchedPersonId || loggedInPersonId;

            // Make sure student_number is in sessionStorage for later steps
            if (studentNumber) {
                sessionStorage.setItem("student_number", studentNumber);
            }

            setUserID(targetId);
            return;
        }

        window.location.href = "/login";
    }, [queryPersonId, studentNumber]);

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
            const source = sessionStorage.getItem("student_edit_person_id_source");
            const tsStr = sessionStorage.getItem("student_edit_person_id_ts");
            const id = sessionStorage.getItem("student_edit_person_id");
            const ts = tsStr ? parseInt(tsStr, 10) : 0;
            const isFresh = source === "applicant_list" && Date.now() - ts < 5 * 60 * 1000;

            if (id && isFresh) {
                await fetchByPersonId(id);
                setExplicitSelection(true);
                consumedFlag = true;
            }
        };

        tryLoad().finally(() => {
            if (consumedFlag) {
                sessionStorage.removeItem("student_edit_person_id_source");
                sessionStorage.removeItem("student_edit_person_id_ts");
            }
        });
    }, [queryPersonId]);


    // Fetch person by ID (when navigating with ?person_id=... or sessionStorage)
    useEffect(() => {
        const fetchPersonById = async () => {
            if (!userID) return;

            try {
                const res = await axios.get(`${API_BASE_URL}/api/student_data_as_applicant/${userID}`);
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




    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/enrollment_upload_documents`);
                setPersons(res.data);
            } catch (err) {
                console.error("❌ Failed to fetch persons list", err);
            }
        };

        fetchPersons();
    }, []);





    const steps = [
        { label: "Personal Information", icon: <PersonIcon />, path: `/student_dashboard1` },
        { label: "Family Background", icon: <FamilyRestroomIcon />, path: `/student_dashboard2` },
        { label: "Educational Attainment", icon: <SchoolIcon />, path: `/student_dashboard3` },
        { label: "Health Medical Records", icon: <HealthAndSafetyIcon />, path: `/student_dashboard4` },
        { label: "Other Information", icon: <InfoIcon />, path: `/student_dashboard5` },
    ];



    const [activeStep, setActiveStep] = useState(0);
    const [clickedSteps, setClickedSteps] = useState(Array(steps.length).fill(false));
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepClick = (index, to) => {
        setActiveStep(index);
        navigate(to);
    };
    // Do not alter
    const handleUpdate = async (updatedData) => {
        if (!person || !person.person_id) return;

        try {
            await axios.put(
                `${API_BASE_URL}/api/enrollment_person/${person.person_id}`, // ✅ use new API
                updatedData
            );
            console.log("✅ Auto-saved successfully");
        } catch (error) {
            console.error("❌ Auto-save failed:", error);
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



    const handleBlur = async () => {
        try {
            const personIdToUpdate = selectedPerson?.person_id || userID;

            // clone without person_id
            const { person_id, ...updatePayload } = person;

            await axios.put(
                `${API_BASE_URL}/api/enrollment_person/${personIdToUpdate}`,
                updatePayload
            );

            console.log("Auto-saved on blur");
        } catch (err) {
            console.error("Auto-save failed", err);
        }
    };


    const autoSave = async () => {
        try {
            const personIdToUpdate = selectedPerson?.person_id || userID;
            await axios.put(
                `${API_BASE_URL}/api/enrollment_person/${personIdToUpdate}`,
                person
            );
            console.log("Auto-saved.");
        } catch (err) {
            console.error("Auto-save failed.");
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
            alert("Invalid file type. Please select a JPEG or PNG file.");
            setSelectedFile(null);
            setPreview(null);
            return;
        }

        // Check file size
        if (file.size > maxSizeInBytes) {
            alert("File is too large. Maximum allowed size is 2MB.");
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
            alert("Please select a file first.");
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
            alert("Upload successful!");
            handleClose();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("Upload failed.");
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

    const isFormValid = () => {
        const requiredFields = [
            "campus", "academicProgram", "classifiedAs", "applyingAs", "program", "program2", "program3",
            "yearLevel", "profile_img", "last_name", "first_name", "middle_name", "nickname",
            "height", "weight", "gender", "birthOfDate", "age", "birthPlace",
            "languageDialectSpoken", "citizenship", "religion", "civilStatus", "tribeEthnicGroup",
            "cellphoneNumber", "emailAddress",
            "presentStreet", "presentZipCode", "presentRegion", "presentProvince",
            "presentMunicipality", "presentBarangay", "presentDswdHouseholdNumber",
            "permanentStreet", "permanentZipCode", "permanentRegion", "permanentProvince",
            "permanentMunicipality", "permanentBarangay", "permanentDswdHouseholdNumber"
        ];

        let newErrors = {};
        let isValid = true;

        // Generic required fields
        requiredFields.forEach((field) => {
            const value = person[field];
            const stringValue = value?.toString().trim();

            if (!stringValue) {
                newErrors[field] = true;
                isValid = false;
            }
        });

        // ✅ LRN Number: required only if N/A is NOT checked
        if (!isLrnNA) {
            const lrnValue = person.lrnNumber?.toString().trim();
            if (!lrnValue) {
                newErrors.lrnNumber = true;
                isValid = false;
            }
        }

        // ✅ PWD fields: required only if PWD checkbox is checked
        if (person.pwdMember === 1) {
            const pwdTypeValue = person.pwdType?.toString().trim();
            const pwdIdValue = person.pwdId?.toString().trim();

            if (!pwdTypeValue) {
                newErrors.pwdType = true;
                isValid = false;
            }

            if (!pwdIdValue) {
                newErrors.pwdId = true;
                isValid = false;
            }
        }

        setErrors(newErrors);
        return isValid;
    };

    const links = [
        { to: `/student_ecat_application_form`, label: "ECAT Application Form" },
        { to: `/student_form_process`, label: "Admission Form Process" },
        { to: `/student_personal_data_form`, label: "Personal Data Form" },
        { to: `/student_office_of_the_registrar`, label: `Application For ${shortTerm ? shortTerm.toUpperCase() : ""}  College Admission" ` },
        { to: `/student_admission_services`, label: "Admission Services" },

    ];


    const [searchQuery, setSearchQuery] = useState("");
    const [searchError, setSearchError] = useState("");

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchQuery.trim() === "") return; // Don't search empty

            try {
                const res = await axios.get(`${API_BASE_URL}/api/search-person`, {
                    params: { query: searchQuery }
                });

                if (res.data && res.data.person_id) {
                    const details = await axios.get(`${API_BASE_URL}/api/student_data_as_applicant/${res.data.person_id}`);
                    setPerson(details.data);

                    sessionStorage.setItem("student_edit_person_id", details.data.person_id);
                    setUserID(details.data.person_id);
                    setSearchError("");
                } else {
                    console.error("No valid person ID found in search result");
                    setSearchError("Invalid search result");
                }
            } catch (err) {
                console.error("Search failed:", err);
                setSearchError("Applicant not found");
            }
        }, 500); // debounce

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // 🔒 Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 🔒 Block DevTools shortcuts silently
    document.addEventListener('keydown', (e) => {
        const isBlockedKey =
            e.key === 'F12' ||
            e.key === 'F11' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U');

        if (isBlockedKey) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    // dot not alter
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
                    PERSONAL INFORMATION
                </Typography>




            </Box>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            <br />




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
                            <Typography style={{ fontSize: "20px", padding: "10px", fontFamily: "Arial Black" }}>Step 1: Personal Information</Typography>
                        </Box>
                    </Container>

                    <Container maxWidth="100%" sx={{ backgroundColor: "#f1f1f1", border: "2px solid black", padding: 4, borderRadius: 2, boxShadow: 3 }}>
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
                                    readOnly
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
                                    readOnly
                                    value={person.academicProgram || ""}
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
                                    readOnly
                                    value={person.classifiedAs || ""}
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
                                    readOnly
                                    value={person.applyingAs || ""}
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
                                                readOnly
                                                name="program"
                                                value={person.program || ""}
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
                                                readOnly
                                                name="program2"
                                                value={person.program2 || ""}
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
                                                readOnly
                                                name="program3"
                                                value={person.program3 || ""}
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
                                    readOnly
                                    value={person.yearLevel || ""}
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
                                    InputProps={{ readOnly: true }}

                                    value={person.last_name}
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
                                    InputProps={{ readOnly: true }}

                                    value={person.first_name}
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
                                    InputProps={{ readOnly: true }}

                                    value={person.middle_name}
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
                                        readOnly
                                        name="extension"
                                        value={person.extension || ""}
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
                                    InputProps={{ readOnly: true }}

                                    value={person.nickname}
                                    onChange={handleChange}
                                    readOnly
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
                                        value={person.height}
                                        InputProps={{ readOnly: true }}

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
                                        value={person.weight}
                                        InputProps={{ readOnly: true }}

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
                                value={person.lrnNumber === "No LRN Number" ? "" : person.lrnNumber || ""}
                                onChange={handleChange}
                                readOnly
                                onBlur={handleBlur}
                                disabled={person.lrnNumber === "No LRN Number"}
                                size="small"
                                sx={{ width: 220 }}
                                InputProps={{ sx: { height: 40, readOnly: true } }}
                                inputProps={{ style: { height: 40, padding: "10.5px 14px" } }}
                                error={errors.lrnNumber}
                                helperText={errors.lrnNumber ? "This field is required." : ""}
                            />


                            <FormControlLabel
                                control={
                                    <Checkbox
                                        disabled
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
                                readOnly
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
                                        disabled
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
                                        readOnly
                                        name="pwdType"
                                        value={person.pwdType || ""}
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
                                        disabled
                                        value={person.pwdId || ""}
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



                        <Box display="flex" gap={2} mb={2}>
                            {/* 🎂 Birth Date */}
                            <Box flex={1}>
                                <Typography mb={1} fontWeight="medium">
                                    Birth of Date
                                </Typography>
                                <TextField
                                    disabled
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
                                    readOnly
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
                                <TextField fullWidth size="small" name="birthPlace" InputProps={{ readOnly: true }}
                                    placeholder="Enter your Birth Place" value={person.birthPlace} required onBlur={handleBlur} onChange={handleChange} error={!!errors.birthPlace}
                                    helperText={errors.birthPlace ? "This field is required." : ""} />
                            </Box>
                            <Box flex={1} >
                                <Typography mb={1} fontWeight="medium">
                                    Language/Dialect Spoken
                                </Typography>
                                <TextField fullWidth size="small" InputProps={{ readOnly: true }}
                                    name="languageDialectSpoken" placeholder="Enter your Language Spoken" value={person.languageDialectSpoken || ""} required onBlur={handleBlur} onChange={handleChange} error={!!errors.languageDialectSpoken}
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
                                        readOnly
                                        value={person.citizenship || ""}
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
                                        readOnly
                                        name="religion"
                                        value={person.religion || ""}
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
                                        readOnly
                                        name="civilStatus"
                                        value={person.civilStatus || ""}
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
                                        readOnly
                                        name="tribeEthnicGroup"
                                        value={person.tribeEthnicGroup || ""}
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
                                    InputProps={{ readOnly: true }}

                                    value={person.cellphoneNumber}
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
                                    InputProps={{ readOnly: true }}

                                    required
                                    value={person.emailAddress}
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
                                    InputProps={{ readOnly: true }}

                                    name="presentStreet"
                                    value={person.presentStreet}
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
                                    InputProps={{ readOnly: true }}

                                    name="presentZipCode"
                                    placeholder="Enter your Zip Code"
                                    value={person.presentZipCode}
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
                                    readOnly
                                    value={person.presentRegion || ""}
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
                                    readOnly
                                    value={person.presentProvince || ""}
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
                                    readOnly
                                    value={person.presentMunicipality || ""}
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
                                    readOnly
                                    value={person.presentBarangay || ""}
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
                                InputProps={{ readOnly: true }}

                                value={person.presentDswdHouseholdNumber}
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
                                    name="same_as_present_address"
                                    disabled
                                    checked={person.same_as_present_address === 1}
                                    onChange={(e) => {
                                        const checked = e.target.checked;

                                        const updatedPerson = {
                                            ...person,
                                            same_as_present_address: checked ? 1 : 0,
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
                                    InputProps={{ readOnly: true }}

                                    placeholder="Enter your Permanent Street"
                                    value={person.permanentStreet}
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
                                    InputProps={{ readOnly: true }}

                                    placeholder="Enter your Permanent Zip Code"
                                    value={person.permanentZipCode}
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
                                        readOnly
                                        name="permanentRegion"
                                        value={person.permanentRegion || ""}
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
                                        readOnly
                                        name="permanentProvince"
                                        value={person.permanentProvince || ""}
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
                                        readOnly
                                        name="permanentMunicipality"
                                        value={person.permanentMunicipality || ""}
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
                                        readOnly
                                        name="permanentBarangay"
                                        value={person.permanentBarangay || ""}
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
                                InputProps={{ readOnly: true }}

                                value={person.permanentDswdHouseholdNumber || ""}
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
                                            bgcolor: "#6D2323",
                                            "&:hover": {
                                                bgcolor: "#5a1f1f",
                                            },
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>

                                    {/* Header */}
                                    <Box
                                        sx={{
                                            bgcolor: "#6D2323",
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
                                            backgroundColor: "#6D2323",
                                            border: `2px solid ${borderColor}`, 
                                            color: "white",
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: "#5a1f1f",
                                            },
                                        }}
                                    >
                                        Upload
                                    </Button>
                                </Box>
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
                                onClick={(e) => {
                                    handleUpdate();

                                    if (isFormValid()) {
                                        navigate("/student_dashboard2");
                                    } else {
                                        alert("Please complete all required fields before proceeding.");
                                    }
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


                    </Container>
                </form>
            </Container >
        </Box >
    );
};

export default StudentDashboard1;