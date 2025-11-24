import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Container, Typography } from "@mui/material";
import EaristLogo from "../assets/EaristLogo.png";
import { FcPrint } from "react-icons/fc";
import { useLocation } from "react-router-dom";
import API_BASE_URL from "../apiConfig";

const PersonalDataForm = () => {

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
    const [person, setPerson] = useState({
        applicant_number: "",
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

    // do not alter

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


    const [shortDate, setShortDate] = useState("");
    const [longDate, setLongDate] = useState("");

    useEffect(() => {
        const updateDates = () => {
            const now = new Date();

            // Format 1: MM/DD/YYYY
            const formattedShort = `${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}/${now.getFullYear()}`;
            setShortDate(formattedShort);

            // Format 2: MM DD, YYYY hh:mm:ss AM/PM
            const day = String(now.getDate()).padStart(2, "0");
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const year = now.getFullYear();
            const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            const ampm = now.getHours() >= 12 ? "PM" : "AM";

            const formattedLong = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
            setLongDate(formattedLong);
        };

        updateDates(); // Set initial values
        const interval = setInterval(updateDates, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const divToPrintRef = useRef();
    const printDiv = () => {
        const divToPrint = divToPrintRef.current;
        if (divToPrint) {
            // Clone to preserve React bindings
            const clonedDiv = divToPrint.cloneNode(true);

            // Manually add 'checked' attribute to checked checkboxes
            const checkboxes = clonedDiv.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((checkbox) => {
                if (checkbox.checked) {
                    checkbox.setAttribute("checked", "checked");
                } else {
                    checkbox.removeAttribute("checked");
                }
            });

            const newWin = window.open('', 'Print-Window');
            newWin.document.open();
            newWin.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }

            html, body {
              margin: 0;
              padding: 0;
              width: 210mm;
              height: 297mm;
              font-family: Arial, sans-serif;
              overflow: hidden;
            }

            .print-container {
              width: 110%;
              height: 100%;
              box-sizing: border-box;
              transform: scale(0.90);
              transform-origin: top left;
            }

            .student-table {
              margin-top: 15px !important;
            }

            input[type="checkbox"] {
              width: 12px;
              height: 12px;
              transform: scale(1);
              margin: 2px;
            }

            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            button {
              display: none;
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 100);">
          <div class="print-container">
            ${clonedDiv.innerHTML}
          </div>
        </body>
      </html>
    `);
            newWin.document.close();
        } else {
            console.error("divToPrintRef is not set.");
        }
    };


    const [curriculumOptions, setCurriculumOptions] = useState([]);

    useEffect(() => {
        const fetchCurriculums = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/applied_program`);
                setCurriculumOptions(response.data);
            } catch (error) {
                console.error("Error fetching curriculum options:", error);
            }
        };

        fetchCurriculums();
    }, []);

    console.log("person.program:", person.program);
    console.log("curriculumOptions:", curriculumOptions);

    {
        curriculumOptions.find(
            (item) =>
                item?.curriculum_id?.toString() === (person?.program ?? "").toString()
        )?.program_description || (person?.program ?? "")

    }




    return (
        <Box
            sx={{
                height: "calc(100vh - 150px)",
                overflowY: "auto",
                paddingRight: 1,
                backgroundColor: "transparent",
            }}
        >
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
                    PERSONAL DATA FORM
                </Typography>
            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />

            {/* ✅ PRINT BUTTON (unchanged) */}
            <button
                onClick={printDiv}
                style={{
                    marginBottom: "1rem",
                    padding: "10px 20px",
                    border: "2px solid black",
                    backgroundColor: "#f0f0f0",
                    color: "black",
                    borderRadius: "5px",
                    marginTop: "20px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "background-color 0.3s, transform 0.2s",
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
                    Print Personal Data Form
                </span>
            </button>

            <Container>
                <div ref={divToPrintRef}>
                    <div>
                        <style>
                            {`
          @media print {
            button {
              display: none;
            }
          }
        `}
                        </style>


                    </div>

                    <Container>

                        <br />
                        <div
                            className="student-table"
                            style={{

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center", // Center horizontally
                                padding: "10px 20px",
                                width: "100%",

                                boxSizing: "border-box"
                            }}>
                            {/* Wrapper to contain logo and text side by side without stretching */}
                            <div style={{
                                display: "flex",

                                alignItems: "center"
                            }}>
                                {/* Logo */}
                                <div style={{ flexShrink: 0, marginRight: "20px" }}>
                                    <img
                                        src={fetchedLogo}
                                        alt="School Logo"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            objectFit: "cover",   // ✅ ensures image fills the circle cleanly
                                            borderRadius: "50%",  // ✅ makes it circular

                                            marginLeft: "10px",
                                            marginTop: "-25px",
                                        }}
                                    />
                                </div>


                                <div>
                                    {/* Top Line: Republic */}
                                    <div style={{
                                        fontSize: "14px",
                                        fontFamily: "Arial, sans-serif",
                                        textAlign: "left",
                                        marginBottom: "5px"
                                    }}>
                                        Republic of the Philippines
                                    </div>

                                    {/* Institute Name */}
                                    <div style={{
                                        textAlign: "center",
                                        fontSize: "23px",
                                        fontWeight: "bold",
                                        color: "black",
                                        fontFamily: "Times new roman",
                                        marginBottom: "5px"
                                    }}>
                                        {companyName}
                                    </div>

                                    {/* Horizontal Line */}
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "5px" }}>
                                        <hr style={{ width: "100%", maxWidth: "700px", border: "1px solid #000", margin: 0 }} />
                                    </div>
                                    <br />
                                    {/* Office Name */}
                                    <div style={{
                                        textAlign: "center",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        fontFamily: "Arial, sans-serif",
                                        marginLeft: "-130px",
                                        marginTop: "-10px"
                                    }}>
                                        OFFICE OF STUDENT AFFAIRS AND SERVICES
                                    </div>
                                </div>
                            </div>
                        </div>

                    </Container>




                    <form>

                        <table
                            style={{
                                marginTop: "-23px",
                                border: "2px solid black",
                                borderCollapse: "collapse",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                width: "8in",
                                margin: "0 auto",
                                textAlign: "center",
                                tableLayout: "fixed",
                            }}
                        >
                            <tbody>

                                {/* Title: PERSONAL DATA FORM */}
                                <tr>
                                    <td colSpan={40} style={{ textAlign: "center", padding: "10px" }}>
                                        <span
                                            style={{
                                                fontSize: "25px",
                                                color: "black",
                                                fontWeight: "bold",
                                                fontFamily: "Times new Roman",
                                            }}
                                        >
                                            PERSONAL DATA FORM
                                        </span>
                                    </td>
                                </tr>

                                {/* Spacer */}


                                {/* Section Title: I. PERSONAL INFORMATION */}


                                <tr>
                                    {/* Left side: Print Legibly with MUI checkboxes */}
                                    <td colSpan={25} style={{ fontSize: "12px", fontFamily: "Arial", padding: "5px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <span style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                                Print Legibly. Mark appropriate boxes.
                                            </span>

                                            <label style={{ display: "flex", alignItems: "center", gap: "5px", fontWeight: "bold", }}>
                                                <input
                                                    type="checkbox"
                                                    checked // or controlled via state
                                                    readOnly
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        border: "1px solid black",
                                                        backgroundColor: "white",
                                                        appearance: "none",

                                                        WebkitAppearance: "none",
                                                        MozAppearance: "none",
                                                        display: "inline-block",
                                                        position: "relative",
                                                    }}
                                                    className="custom-checkbox"
                                                />
                                                <span style={{ fontSize: "12px", fontFamily: "Arial" }}>With</span>
                                            </label>

                                            <div style={{ fontWeight: "bold", fontSize: "20px" }}>✓</div>
                                        </div>

                                        <style>
                                            {`
      .custom-checkbox:checked::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 3px;
        font-size: 16px;
        color: black;
      }
    `}
                                        </style>
                                    </td>




                                    {/* Right side: Date input and label */}
                                    <td colSpan={15} style={{ fontSize: "12px", fontFamily: "Arial", padding: "5px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <input
                                                type="text"
                                                value={shortDate}
                                                readOnly
                                                style={{
                                                    width: "75%",
                                                    textAlign: "center",
                                                    border: "none",
                                                    borderBottom: "1px solid black",
                                                    fontWeight: "bold",
                                                    background: "none",
                                                    fontSize: "12px",
                                                    marginBottom: "2px",
                                                }}
                                            />
                                            <div style={{ fontWeight: "bold", textAlign: "center" }}>
                                                Date of Registration
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        colSpan={40}
                                        style={{
                                            height: "0.2in",
                                            fontSize: "72.5%",

                                            color: "white",
                                        }}
                                    >
                                        <b>
                                            <b style={{
                                                color: "black",
                                                fontFamily: "Times new Roman",
                                                fontSize: '15px',
                                                textAlign: "left",
                                                display: "block",
                                                fontStyle: 'italic'
                                            }}>
                                                {"\u00A0\u00A0"}I. PERSONAL INFORMATION
                                            </b>

                                        </b>
                                    </td>
                                </tr>
                                {/* SURNAME */}
                                {/* SURNAME */}
                                <tr>
                                    <td colSpan={6} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontWeight: "bold", fontSize: "14px", fontFamily: "Times new Roman" }}>
                                        SURNAME
                                    </td>
                                    <td colSpan={34} style={{ border: "1px solid black", padding: "8px" }}>
                                        <input
                                            type="text"
                                            value={person?.last_name?.toUpperCase() || ""}
                                            readOnly
                                            style={{
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontWeight: "bold",
                                                letterSpacing: '3px',
                                                fontFamily: "Times new Roman"
                                            }}
                                        />
                                    </td>
                                </tr>

                                {/* FIRST NAME */}
                                <tr>
                                    <td colSpan={6} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontWeight: "bold", fontSize: "14px", fontFamily: "Times new Roman" }}>
                                        FIRST NAME
                                    </td>
                                    <td colSpan={34} style={{ border: "1px solid black", padding: "8px" }}>
                                        <input
                                            type="text"
                                            value={person?.first_name?.toUpperCase() || ""}

                                            readOnly
                                            style={{
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontWeight: "bold",
                                                fontSize: "15px",
                                                letterSpacing: '3px',
                                                fontFamily: "Times new Roman"
                                            }}
                                        />
                                    </td>
                                </tr>

                                {/* MIDDLE NAME */}
                                <tr>
                                    {/* MIDDLE NAME */}
                                    <td colSpan={6} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        textAlign: "Center",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        fontFamily: "Times new Roman"

                                    }}>
                                        MIDDLE NAME
                                    </td>

                                    <td colSpan={19} style={{
                                        border: "1px solid black",
                                        padding: "8px",

                                    }}>
                                        <input
                                            type="text"
                                            value={person?.middle_name?.toUpperCase() || ""}
                                            readOnly
                                            style={{

                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontWeight: "bold",
                                                fontSize: "15px",
                                                letterSpacing: '3px',
                                                fontFamily: "Times new Roman"
                                            }}
                                        />
                                    </td>

                                    {/* NAME EXTENSION */}
                                    <td colSpan={15} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        verticalAlign: "top",
                                        fontFamily: "Times new Roman",

                                    }}>
                                        NAME EXTENSION (e.g. Jr., Sr.)
                                        <input
                                            type="text"
                                            value={person?.extension?.toUpperCase() || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "14px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>
                                </tr>


                                {/* COURSE */}
                                <tr>
                                    {/* COURSE (COMPLETE NAME) */}
                                    <td
                                        colSpan={30}
                                        style={{
                                            border: "1px solid black",
                                            textAlign: "left",
                                            fontSize: "14px",
                                            fontFamily: "Times New Roman",
                                            verticalAlign: "top",
                                        }}
                                    >
                                        <div style={{ fontWeight: "bold" }}>COURSE (COMPLETE NAME)</div>
                                        <input
                                            type="text"
                                            value={
                                                curriculumOptions.length > 0
                                                    ? curriculumOptions.find(
                                                        (item) =>
                                                            item?.curriculum_id?.toString() ===
                                                            (person?.program ?? "").toString()
                                                    )?.program_description?.toUpperCase() ||
                                                    (person?.program?.toString()?.toUpperCase() ?? "")
                                                    : "LOADING..."
                                            }
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "12px",
                                                fontFamily: "Times New Roman",
                                                textTransform: "uppercase", // visual effect
                                            }}
                                        />
                                    </td>

                                    {/* YEAR LEVEL */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",


                                        fontFamily: "Times new Roman",
                                        fontSize: "14px",
                                        verticalAlign: "top"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>YEAR LEVEL (1,2,3,4,5)</div>
                                        <input
                                            type="text"
                                            value={person?.yearLevel?.toUpperCase() || ""}

                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",

                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                                textTransform: "uppercase",
                                            }}
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    {/* DATE OF BIRTH */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        fontFamily: "Times New Roman",

                                        fontSize: "14px",
                                        verticalAlign: "top"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>DATE OF BIRTH (e.g. June 15, 2019)</div>
                                        <input
                                            type="text"
                                            value={
                                                person.birthOfDate
                                                    ? new Date(person.birthOfDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric"
                                                    })
                                                    : ""
                                            }
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                                textTransform: "uppercase"
                                            }}
                                        />
                                    </td>


                                    {/* PLACE OF BIRTH */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",


                                        fontSize: "14px",
                                        verticalAlign: "top",
                                        fontFamily: "Times new Roman",
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>PLACE OF BIRTH</div>
                                        <input
                                            type="text"
                                            value={person.birthPlace || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                fontFamily: "Times new Roman",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",


                                            }}
                                        />
                                    </td>

                                    {/* ETHNICITY */}
                                    <td colSpan={14} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new Roman",
                                        fontSize: "14px",
                                        verticalAlign: "top"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>ETHNICITY (e.g. Tagbanua, Palaw’an)<br />
                                            Pangkat etniko / Kinaanibang pangkat</div>

                                        <input
                                            type="text"
                                            value={person.tribeEthnicGroup || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>
                                </tr>
                                {/* STUDENT ID NUMBER */}
                                <tr>
                                    {/* STUDENT ID NUMBER */}
                                    <td colSpan={13}
                                        style={{
                                            border: "1px solid black",
                                            textAlign: "left",
                                            fontFamily: "Times new Roman",
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                            verticalAlign: "top"
                                        }}
                                    >
                                        <div style={{ fontWeight: "bold" }}>APPLICANT ID:</div>

                                        <input
                                            type="text"
                                            value={person.applicant_number || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                fontWeight: "normal",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                           
                                            }}
                                        />
                                    </td>


                                    {/* LEARNER’S REFERENCE NUMBER */}
                                    <td colSpan={13}

                                        style={{
                                            border: "1px solid black",
                                            textAlign: "left",
                                            fontFamily: "Times new Roman",

                                            fontSize: "14px",
                                            verticalAlign: "top"
                                        }}>
                                        <div style={{ fontWeight: "bold" }}>LEARNER’S REFERENCE NUMBER</div>
                                        <input
                                            type="text"
                                            readOnly
                                            value={person.lrnNumber || ""}

                                            style={{
                                                marginTop: "5px",

                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>

                                    {/* DISABILITY */}
                                    <td colSpan={14} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new Roman",
                                        fontSize: "14px",
                                        verticalAlign: "top"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>DISABILITY</div>

                                        <input

                                            type="text"
                                            readOnly
                                            value={person.pwdType || ""}

                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    {/* SEX */}
                                    <td
                                        colSpan={15}
                                        style={{
                                            border: "1px solid black",
                                            textAlign: "left",

                                            fontWeight: "bold",
                                            fontSize: "14px",
                                            verticalAlign: "top",
                                            fontFamily: "Times new Roman",
                                        }}
                                    >
                                        SEX
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "center",
                                                gap: "40px",
                                                alignItems: "center",
                                                fontFamily: "Times new Roman",
                                                width: "100%",
                                                marginTop: "5px",
                                            }}
                                        >
                                            <label
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    fontSize: "15px",
                                                    fontFamily: "Times new Roman",
                                                    marginBottom: "10px"
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={person.gender === 0}
                                                    readOnly
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        border: "1px solid black",
                                                        backgroundColor: "white",

                                                        appearance: "none",
                                                        WebkitAppearance: "none",
                                                        MozAppearance: "none",
                                                        display: "inline-block",
                                                        position: "relative",
                                                    }}
                                                    className="custom-checkbox"
                                                />
                                                Male
                                            </label>

                                            <label
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    fontSize: "15px",
                                                    fontFamily: "Times new Roman",
                                                    marginBottom: "10px"
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={person.gender === 1}
                                                    readOnly
                                                    style={{
                                                        width: "20px",
                                                        height: "20px",
                                                        border: "1px solid black",
                                                        backgroundColor: "white",
                                                        appearance: "none",
                                                        WebkitAppearance: "none",
                                                        MozAppearance: "none",

                                                        display: "inline-block",
                                                        position: "relative",
                                                    }}
                                                    className="custom-checkbox"
                                                />
                                                Female
                                            </label>
                                        </div>

                                        {/* ✅ Style block for ✓ checkmark */}
                                        <style>
                                            {`
      .custom-checkbox:checked::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 3px;
        font-size: 16px;
        color: black;
      }
    `}
                                        </style>
                                    </td>




                                    {/* E-MAIL ADDRESS */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontSize: "14px",
                                        verticalAlign: "top",
                                        fontFamily: "Times new Roman",
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>E-MAIL ADDRESS</div>
                                        <input
                                            type="text"
                                            value={person.emailAddress || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>
                                    <td colSpan={15} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontSize: "14px",
                                        verticalAlign: "top",
                                        fontFamily: "Times new Roman",
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>YEAR GRADUATED</div>
                                        <input
                                            type="text"
                                            value={person.yearGraduated1 || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    <td
                                        colSpan={18}
                                        style={{
                                            border: "1px solid black",
                                            verticalAlign: "top",
                                            fontSize: "14px",

                                            padding: "8px",
                                            fontFamily: "Times new Roman",
                                        }}
                                    >
                                        <div style={{ fontWeight: "bold", paddingLeft: "-10px" }}>CIVIL STATUS</div>
                                        <div
                                            style={{
                                                marginTop: "5px",
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "center",
                                                paddingLeft: "50px",
                                            }}
                                        >
                                            {/* Standard Civil Status Options */}
                                            {["Single", "Married", "Widowed", "Separated", "Annulled"].map((status) => (
                                                <label
                                                    key={status}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        width: "50%",

                                                        fontSize: "15px",
                                                        fontFamily: "Times new roman",
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={person.civilStatus === status}
                                                        readOnly
                                                        style={{
                                                            width: "20px",
                                                            height: "20px",
                                                            border: "1px solid black",
                                                            backgroundColor: "white",
                                                            appearance: "none",
                                                            WebkitAppearance: "none",
                                                            MozAppearance: "none",
                                                            display: "inline-block",
                                                            position: "relative",
                                                            marginRight: "5px",
                                                        }}
                                                        className="custom-checkbox"
                                                    />
                                                    {status}
                                                </label>
                                            ))}

                                            {/* Others, specify */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    width: "100%",
                                                    fontSize: "15px",
                                                    fontFamily: "Times new Roman",


                                                }}
                                            >
                                                <label style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            person.civilStatus &&
                                                            !["Single", "Married", "Widowed", "Separated", "Annulled"].includes(person.civilStatus)
                                                        }
                                                        readOnly
                                                        style={{
                                                            width: "20px",

                                                            height: "20px",

                                                            border: "1px solid black",
                                                            backgroundColor: "white",
                                                            appearance: "none",
                                                            WebkitAppearance: "none",
                                                            MozAppearance: "none",
                                                            display: "inline-block",
                                                            position: "relative",
                                                            marginRight: "5px",
                                                        }}
                                                        className="custom-checkbox"
                                                    />
                                                    Others, specify:
                                                </label>
                                                <span
                                                    style={{
                                                        borderBottom: "1px solid black",
                                                        width: "100px",
                                                        display: "inline-block",
                                                        marginTop: "10px",
                                                    }}
                                                >
                                                    {person.civilStatus &&
                                                        !["Single", "Married", "Widowed", "Separated", "Annulled"].includes(person.civilStatus)
                                                        ? person.civilStatus
                                                        : ""}
                                                </span>
                                            </div>
                                        </div>


                                        <style>
                                            {`
      .custom-checkbox:checked::after {
        content: '✓';
        position: absolute;
        top: -2px;
        left: 4px;
        font-size: 16px;
        color: black;
      }
    `}
                                        </style>
                                    </td>




                                    {/* PERMANENT / HOME ADDRESS */}
                                    <td
                                        colSpan={16}
                                        style={{
                                            border: "1px solid black",
                                            verticalAlign: "top",
                                            fontSize: "14px",
                                            fontFamily: "Times New Roman",
                                            textAlign: "left",
                                        }}
                                    >
                                        <div style={{ fontWeight: "bold" }}>PERMANENT / HOME ADDRESS</div>

                                        <input
                                            type="text"
                                            value={
                                                person.presentStreet || person.presentBarangay || person.presentMunicipality
                                                    ? `${person.presentStreet || ""} ${person.presentBarangay || ""}, ${person.presentMunicipality || ""}`
                                                    : ""
                                            }
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                border: "none",
                                                width: "100%",
                                                fontSize: "15px",
                                                fontFamily: "times new roman",
                                                outline: "none",
                                                padding: "2px 4px",
                                            }}
                                        />



                                        <div
                                            style={{
                                                marginTop: "10px",
                                                borderTop: "1px solid black",
                                                paddingTop: "8px",

                                                fontSize: "14px",
                                            }}
                                        >
                                            <div style={{ fontWeight: "bold" }}>HOUSEHOLD</div>
                                            <input
                                                readOnly
                                                type="text"
                                                value={person.presentDswdHouseholdNumber || ""}

                                                style={{
                                                    width: "100%",
                                                    marginTop: "5px",
                                                    border: "none",

                                                    fontSize: "15px",
                                                    fontFamily: "Times new roman",
                                                    outline: "none",
                                                    padding: "2px 4px",
                                                }}
                                            />

                                        </div>
                                    </td>


                                    {/* ZIP CODE */}
                                    <td colSpan={6} style={{
                                        border: "1px solid black",
                                        verticalAlign: "top",
                                        fontSize: "14px",


                                        fontFamily: "Times new Roman"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>ZIP CODE</div>
                                        <input
                                            readOnly
                                            type="text"
                                            value={person.presentZipCode || ""}
                                            style={{
                                                width: "100%",
                                                marginTop: "5px",
                                                border: "none",

                                                fontSize: "15px",

                                                fontFamily: "Times new Roman",
                                                outline: "none",
                                                padding: "2px 4px",
                                            }}
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    {/* CITIZENSHIP */}
                                    <td colSpan={8} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new roman",

                                        fontSize: "14px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>CITIZENSHIP</div>
                                        <input
                                            readOnly
                                            type="text"
                                            value={person.citizenship || ""}
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new roman",
                                            }}
                                        />
                                    </td>

                                    {/* HEIGHT (m) */}
                                    <td colSpan={6} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        fontFamily: "Times new roman",
                                        fontSize: "14px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>HEIGHT (m)</div>
                                        <input
                                            readOnly
                                            type="text"
                                            value={person.height || ""}
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new roman",
                                            }}
                                        />
                                    </td>

                                    {/* WEIGHT (kg) */}
                                    <td colSpan={6} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        fontFamily: "Times new roman",
                                        fontSize: "14px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>WEIGHT (kg)</div>
                                        <input
                                            readOnly
                                            type="text"
                                            value={person.weight || ""}
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new roman",
                                            }}
                                        />
                                    </td>

                                    {/* BLOOD TYPE */}
                                    <td colSpan={6} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new roman",
                                        fontSize: "14px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>BLOOD TYPE</div>
                                        <input
                                            type="text"

                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new roman",
                                            }}
                                        />
                                    </td>

                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={14} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        fontFamily: "Times new roman",

                                        fontSize: "14px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}> PERMANENT CONTACT NUMBER</div>

                                        <input
                                            type="text"
                                            value={person.cellphoneNumber || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new roman",
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td
                                        colSpan={40}
                                        style={{
                                            height: "0.2in",
                                            fontSize: "72.5%",

                                            color: "white",
                                        }}
                                    >
                                        <b>
                                            <b style={{
                                                color: "black",
                                                fontFamily: "Times new Roman",
                                                fontSize: '15px',
                                                textAlign: "left",
                                                display: "block",
                                                fontStyle: 'italic'
                                            }}>
                                                {"\u00A0\u00A0"}II. FAMILY BACKGROUND
                                            </b>

                                        </b>
                                    </td>
                                </tr>

                                <tr>

                                    <td colSpan={10}
                                        style={{
                                            border: "1px solid black",
                                            textAlign: "left",
                                            paddingLeft: "10px",
                                            fontWeight: "bold",
                                            fontFamily: "Times new roman",
                                            fontSize: "14px"
                                        }}>
                                        FATHER'S NAME

                                    </td>

                                    {/* GIVEN NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new roman",
                                        fontSize: "13px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>SURNAME / FAMILY NAME</div>

                                        <input
                                            type="text"
                                            value={person.father_family_name || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new roman",
                                            }}
                                        />
                                    </td>

                                    {/* MIDDLE NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new roman",
                                        fontSize: "13px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>GIVEN NAME</div>
                                        <input
                                            type="text"
                                            value={person.father_given_name || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new roman",
                                            }}
                                        />
                                    </td>

                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new roman",
                                        fontSize: "13px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>MIDDLE NAME</div>
                                        <input
                                            type="text"
                                            value={person.father_middle_name || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new roman",
                                            }}
                                        />
                                    </td>
                                </tr>










                                <tr>

                                    <td colSpan={10}
                                        style={{
                                            border: "1px solid black",
                                            textAlign: "left",
                                            paddingLeft: "10px",
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                            fontFamily: "Times new Roman",
                                        }}>
                                        MOTHER`S NAME

                                    </td>

                                    {/* GIVEN NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new Roman",
                                        fontSize: "13px"
                                    }}>
                                        <div style={{ fontWeight: "bold", fontFamily: "Times new Roman", }}>SURNAME (Not Yet Married)</div>

                                        <input
                                            type="text"
                                            value={person.mother_family_name || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>

                                    {/* MIDDLE NAME (Not yet married) */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new Roman",

                                        fontSize: "13px"
                                    }}>
                                        <div style={{ fontWeight: "bold" }}>GIVEN NAME</div>
                                        <input
                                            type="text"
                                            value={person.mother_given_name || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>
                                    {/* MIDDLE NAME (Not yet married) */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",

                                        fontFamily: "Times new Roman",
                                        fontSize: "13px"
                                    }}>
                                        <div style={{ fontWeight: "bold", fontFamily: "Times new Roman", }}>   MIDDLE NAME (Not yet married)</div>

                                        <input
                                            type="text"
                                            value={person.mother_middle_name || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td
                                        colSpan={40}
                                        style={{
                                            height: "0.2in",
                                            fontSize: "72.5%",

                                            color: "white",
                                        }}
                                    >
                                        <b>
                                            <b style={{
                                                color: "black",
                                                fontFamily: "Times new Roman",
                                                fontSize: '15px',
                                                textAlign: "left",
                                                display: "block",
                                                fontStyle: 'italic'
                                            }}>
                                                {"\u00A0\u00A0"}FAMILY PER CAPITA INCOME
                                            </b>

                                        </b>
                                    </td>
                                </tr>

                                {/* STUDENT ID NUMBER */}
                                <tr>
                                    {/* STUDENT ID NUMBER */}
                                    <td colSpan={20} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "8px",
                                        fontWeight: "bold",
                                        fontFamily: "Times new Roman",
                                        fontSize: "12px",
                                        verticalAlign: "top"
                                    }}>
                                        NAME OF FAMILY MEMBER

                                    </td>

                                    {/* LEARNER’S REFERENCE NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "8px",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        verticalAlign: "top",
                                        fontFamily: "Times new Roman",
                                    }}>
                                        OCCUPATION

                                    </td>

                                    {/* DISABILITY */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "8px",
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                        verticalAlign: "top",
                                        fontFamily: "Times new Roman",
                                    }}>
                                        MONTHLY INCOME

                                    </td>
                                </tr>

                                <tr style={{ height: "5px" }}>

                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        textAlign: "center",
                                        padding: "2px",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        fontFamily: "Times new roman"
                                    }}>
                                        Father

                                    </td>


                                    <td colSpan={13}

                                        style={{
                                            border: "1px solid black",
                                            textAlign: "left",
                                            padding: "2px",
                                            fontFamily: "Times new Roman",
                                            fontSize: "12px"
                                        }}>
                                        <input
                                            type="text"
                                            value={`${person.father_given_name || ""} ${person.father_middle_name || ""} ${person.father_family_name || ""}`}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />


                                    </td>


                                    <td colSpan={10}
                                        style={{
                                            border: "1px solid black",
                                            textAlign: "left",
                                            padding: "2px",
                                            fontFamily: "Times new Roman",
                                            fontSize: "14px"
                                        }}>
                                        <input
                                            type="text"
                                            value={person.father_occupation || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />


                                    </td>

                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",
                                        fontFamily: "Times new Roman",
                                        fontSize: "14px"
                                    }}>
                                        <input
                                            type="text"
                                            value={person.father_income || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />



                                    </td>
                                </tr>

                                <tr style={{ height: "5px" }}>
                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        textAlign: "center",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontFamily: "Times new Roman",
                                        fontSize: "14px"
                                    }}>
                                        Mother

                                    </td>

                                    {/* GIVEN NAME */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontFamily: "Times new Roman",
                                        fontSize: "12px"
                                    }}>
                                        <input
                                            type="text"
                                            value={`${person.mother_given_name || ""} ${person.mother_middle_name || ""} ${person.mother_family_name || ""}`}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />



                                    </td>

                                    {/* MIDDLE NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontFamily: "Times new Roman",
                                        fontSize: "14px"
                                    }}>
                                        <input
                                            type="text"
                                            value={person.mother_occupation || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />



                                    </td>

                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontFamily: "Times new Roman",
                                        fontSize: "14px"
                                    }}>
                                        <input
                                            type="text"
                                            value={person.mother_income || ""}
                                            readOnly
                                            style={{
                                                marginTop: "5px",
                                                width: "100%",
                                                border: "none",
                                                outline: "none",
                                                fontSize: "15px",
                                                fontFamily: "Times new Roman",
                                            }}
                                        />


                                    </td>
                                </tr>



                                <tr style={{ height: "5px" }}>

                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        textAlign: "center",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                        fontFamily: "Times new Roman",
                                    }}>
                                        Siblings

                                    </td>

                                    {/* GIVEN NAME */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "15px"
                                    }}>


                                    </td>

                                    {/* MIDDLE NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "15px"
                                    }}>


                                    </td>

                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "15px"
                                    }}>


                                    </td>
                                </tr>



                                <tr style={{ height: "5px" }}>

                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        textAlign: "right",
                                        fontFamily: "Times new Roman",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "15px"
                                    }}>
                                        1.

                                    </td>

                                    {/* GIVEN NAME */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* MIDDLE NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>
                                </tr>



                                <tr style={{ height: "5px" }}>

                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        textAlign: "right",
                                        fontFamily: "Times new Roman",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "15px"
                                    }}>
                                        2.

                                    </td>


                                    {/* GIVEN NAME */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* MIDDLE NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>
                                </tr>



                                <tr style={{ height: "5px" }}>

                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        textAlign: "right",
                                        fontFamily: "Times new Roman",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "15px"
                                    }}>
                                        3.

                                    </td>

                                    {/* GIVEN NAME */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* MIDDLE NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>
                                </tr>



                                <tr style={{ height: "5px" }}>

                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        textAlign: "right",
                                        fontFamily: "Times new Roman",
                                        padding: "2px",
                                        fontWeight: "bold",
                                        fontSize: "15px"
                                    }}>
                                        4.

                                    </td>


                                    {/* GIVEN NAME */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* MIDDLE NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>
                                </tr>


                                <tr style={{ height: "5px" }}>

                                    <td colSpan={7} style={{
                                        border: "1px solid black",
                                        textAlign: "right",
                                        fontFamily: "Times new Roman",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "15px"
                                    }}>
                                        5.

                                    </td>


                                    {/* GIVEN NAME */}
                                    <td colSpan={13} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>

                                    {/* MIDDLE NAME */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",  // Reduced padding to fit in 10px height
                                        fontWeight: "bold",
                                        fontSize: "12px"
                                    }}>


                                    </td>


                                    {/* PERMANENT CONTACT NUMBER */}
                                    <td colSpan={10} style={{
                                        border: "1px solid black",
                                        textAlign: "left",
                                        padding: "2px",

                                        fontSize: "15px",
                                        fontFamily: "Times new Roman",
                                    }}>
                                        Total: ₱{(Number(person.father_income || 0) + Number(person.mother_income || 0)).toLocaleString("en-PH", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                        })}
                                    </td>
                                </tr>







                            </tbody>
                        </table>

                        <table
                            style={{
                                marginTop: "-50px",
                                borderCollapse: "collapse",
                                fontFamily: "Arial, Helvetica, sans-serif",
                                width: "8in",
                                margin: "0 auto",
                                textAlign: "center",
                                tableLayout: "fixed",
                            }}
                        >
                            <tbody>
                                {/* Other table rows here... */}

                                <tr>
                                    <td colSpan={40} style={{ paddingTop: '5px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <div
                                                style={{
                                                    display: 'inline-block',
                                                    width: '250px',
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        borderBottom: '1px solid black',
                                                        height: '40px',
                                                        marginBottom: '5px',
                                                    }}
                                                ></div>
                                                <div
                                                    style={{
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        fontFamily: "Times new Roman",
                                                    }}
                                                >
                                                    Signature
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                {/* Additional rows if needed... */}
                            </tbody>
                        </table>

                    </form>
                </div>

            </Container>


        </Box >

    );
};

export default PersonalDataForm;
