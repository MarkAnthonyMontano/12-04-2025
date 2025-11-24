import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Container, Typography} from "@mui/material";
import EaristLogo from "../assets/EaristLogo.png";
import ForwardIcon from '@mui/icons-material/Forward';
import { FcPrint } from "react-icons/fc";
import { useLocation } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import API_BASE_URL from "../apiConfig";
const StudentAdmissionFormProcess = () => {
 
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
  const middleIndex = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, middleIndex).join(" ");
  const secondLine = words.slice(middleIndex).join(" ");


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

  useEffect(() => {
    const pid = localStorage.getItem("person_id");
    if (!pid) return;

    const fetchData = async () => {
      try {
        // Fetch person
        const res = await axios.get(`${API_BASE_URL}/api/person/${pid}`);
        let personData = res.data;

        // Fetch applicant number separately
        const applicantRes = await axios.get(`${API_BASE_URL}/api/applicant_number/${pid}`);
        if (applicantRes.data?.applicant_number) {
          personData.applicant_number = applicantRes.data.applicant_number;
        }

        setPerson(personData);
      } catch (err) {
        console.error("Error fetching admission form data:", err);
      }
    };

    fetchData();
  }, []);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryPersonId = queryParams.get("person_id");

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole === "applicant" || storedRole === "registrar" || storedRole === "student") {
        fetchPersonData(storedID);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);






  const divToPrintRef = useRef();

  const printDiv = () => {
    const divToPrint = divToPrintRef.current;
    if (divToPrint) {
      const newWin = window.open('', 'Print-Window');
      newWin.document.open();
      newWin.document.write(`
      <html>
        <head>
          <title>Print</title>
       <style>
  @page {
    size: Legal;
    margin: 0;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 210mm;
    height: 297mm;
    font-family: Arial, sans-serif;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

.print-container {
  width: 100%;
  height: auto;
  padding: 10px 20px;
}

  .student-table {
    margin-top: 15px !important;
  }

  button {
    display: none;
  }

  

  .dataField{
    margin-top: 2px !important;
  }

  svg.MuiSvgIcon-root {
  margin-top: -53px;
    width: 70px !important;
    height: 70px !important;
  }
</style>

        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 100);">
          <div class="print-container">
            ${divToPrint.innerHTML}
          </div>
        </body>
      </html>
    `);
      newWin.document.close();
    } else {
      console.error("divToPrintRef is not set.");
    }
  };




  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (settings && settings.address) {
      setCampusAddress(settings.address);
    }
  }, [settings]);


  const fetchPersonData = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/student-person-data/${id}`);
      setPerson(response.data);
    } catch (err) {
      console.error("Error fetching person data:", err);
    }
  }


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







  // 🔒 Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 🔒 Block DevTools shortcuts + Ctrl+P silently
  document.addEventListener('keydown', (e) => {
    const isBlockedKey =
      e.key === 'F12' || // DevTools
      e.key === 'F11' || // Fullscreen
      (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'j')) || // Ctrl+Shift+I/J
      (e.ctrlKey && e.key.toLowerCase() === 'u') || // Ctrl+U (View Source)
      (e.ctrlKey && e.key.toLowerCase() === 'p');   // Ctrl+P (Print)

    if (isBlockedKey) {
      e.preventDefault();
      e.stopPropagation();
    }
  });




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
          ADMISSION FORM (PROCESS)
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

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
          Print Admission Form
        </span>
      </button>


      <Container>



        <div ref={divToPrintRef} style={{ marginBottom: "10%" }}>

          <Container>

            <div
              className="student-table"
              style={{
                width: "8in", // matches table width assuming 8in for 40 columns
                maxWidth: "100%",
                margin: "0 auto",

                boxSizing: "border-box",
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // spread logo, text, profile+QR
                  flexWrap: "nowrap",
                }}
              >
                {/* Logo (Left Side) */}
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={fetchedLogo}
                    alt="School Logo"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      marginLeft: "10px",
                      marginTop: "-25px",
                      borderRadius: "50%", // ✅ Makes it perfectly circular

                    }}
                  />
                </div>

                {/* Text Block (Center) */}
                <div
                  style={{
                    flexGrow: 1,
                    textAlign: "center",
                    fontSize: "12px",
                    fontFamily: "Arial",
                    letterSpacing: "5",
                    lineHeight: 1.4,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                >
                  <div
                    style={{ fontFamily: "Arial", fontSize: "12px" }}
                  >
                    Republic of the Philippines
                  </div>
                  <div
                    style={{

                      letterSpacing: "2px",
                      fontWeight: "bold",
                    }}
                  >
                    {firstLine}
                  </div>
                  {secondLine && (
                    <div
                      style={{

                        letterSpacing: "2px",
                        fontWeight: "bold",
                      }}
                    >
                      {secondLine}
                    </div>
                  )}
                  {campusAddress && (
                    <div style={{ fontSize: "12px", letterSpacing: "1px", fontFamily: "Arial" }}>
                      {campusAddress}
                    </div>
                  )}

                  <div
                    style={{ fontFamily: "Arial", letterSpacing: "1px" }}
                  >
                    <b>OFFICE OF THE ADMISSION SERVICES</b>
                  </div>

                  <br />

                  <div
                    style={{
                      fontSize: "21px",
                      fontFamily: "Arial",
                      fontWeight: "bold",
                      marginBottom: "5px",
                      marginTop: "0",
                      textAlign: "center",
                    }}
                  >
                    Admission Form (Process)
                  </div>
                </div>

                {/* Profile + QR Code (Right Side) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",   // ✅ side by side
                    alignItems: "center",
                    marginRight: "10px",
                    gap: "10px",            // ✅ 10px space between them
                  }}
                >
                  {/* Profile Image (2x2) */}
                  <div
                    style={{
                      width: "1.3in",
                      height: "1.3in",
                      border: "1px solid black",
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                  >
                    {person?.profile_img ? (
                      <img
                        src={`${API_BASE_URL}/uploads/${person.profile_img}`}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "12px", color: "#888" }}>No Image</span>
                    )}
                  </div>

                  <div
                    style={{
                      width: "1.3in",
                      height: "1.3in",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid black",  // ✅ same border as profile_img
                      background: "#fff",         // ✅ same background
                      flexShrink: 0,
                      position: "relative"        // ✅ needed for overlay text
                    }}
                  >
                    {person?.qr_code ? (
                      <img
                        src={`${API_BASE_URL}/uploads/${person.qr_code}`}
                        alt="QR Code"
                        style={{ width: "110px", height: "110px" }}
                      />
                    ) : (
                      <QRCodeSVG
                        value={`http://localhost:5173/examination_profile/${person.applicant_number}`}
                        size={110}
                        level="H"
                      />
                    )}

                    {/* Overlay applicant_number in middle */}
                    <div
                      style={{
                        position: "absolute",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "maroon",
                        background: "white",
                        padding: "2px"
                      }}
                    >
                      {person.applicant_number}
                    </div>
                  </div>


                </div>

              </div>
            </div>


          </Container>
          <br />
          <br />
          <table

            style={{
              borderCollapse: "collapse",
              fontFamily: "Arial, Helvetica, sans-serif",
              width: "8in",
              margin: "0 auto",

              marginTop: "-30px",
              textAlign: "center",
              tableLayout: "fixed",
            }}
          >

            <tbody>
              {/* Name of Student Row */}
              {/* Name of Student Row */}
              <tr>
                <td
                  colSpan={40}
                  style={{

                    fontSize: "13px",
                    paddingTop: "5px",
                    marginTop: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <span
                      style={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        marginRight: "10px",
                      }}
                    >
                      Name of Student:
                    </span>
                    <div style={{ flexGrow: 1, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                        {person.last_name}
                      </span>
                      <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                        {person.first_name}
                      </span>
                      <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                        {person.middle_name}
                      </span>
                      <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                        {person.extension}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Labels Row */}
              <tr>
                <td
                  colSpan={40}
                  style={{

                    fontSize: "12px",
                    paddingTop: "2px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginLeft: "120px",
                      marginTop: "-4px"
                    }}
                  >
                    <span style={{ width: "25%", textAlign: "center" }}>Last Name</span>
                    <span style={{ width: "25%", textAlign: "center" }}>Given Name</span>
                    <span style={{ width: "25%", textAlign: "center" }}>Middle Name</span>
                    <span style={{ width: "25%", textAlign: "center" }}>Ext. Name</span>
                  </div>
                </td>
              </tr>


              {/* Email & Applicant ID */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={20}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Email:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "14px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.emailAddress}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={20}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Applicant Id No.:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "14px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.emailAddress}</div>
                    </span>
                  </div>
                </td>
              </tr>

              {/* Permanent Address */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={40}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "2px" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Permanent Address:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">
                        {person.permanentStreet}{" "}
                        {person.permanentBarangay}{" "}
                        {person.permanentMunicipality}{" "}
                        {person.permanentRegion}{" "}
                        {person.permanentZipCode}
                      </div>
                    </span>


                  </div>
                </td>
              </tr>

              {/* Cellphone No, Civil Status, Gender */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={13}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Cellphone No:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.cellphoneNumber}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={13}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Civil Status:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.civilStatus}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={14}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Gender:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">   {person.gender === 0 ? "Male" : person.gender === 1 ? "Female" : ""}</div>
                    </span>
                  </div>
                </td>
              </tr>

              {/* Date of Birth, Place of Birth, Age */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={13}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Date of Birth:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.birthOfDate}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={14}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Place of Birth:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.birthPlace}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={13}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Age:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.age}</div>
                    </span>
                  </div>
                </td>
              </tr>

              <tr style={{ fontSize: "13px" }}>
                {/* Please Check */}
                <td colSpan={10}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                      Please Check (✓):
                    </label>
                    <span
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        height: "1.3em",
                        display: "inline-block",
                      }}
                    >
                      {/* left blank intentionally */}
                    </span>
                  </div>
                </td>

                {/* Freshman */}
                <td colSpan={10}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                      Freshman:
                    </label>
                    <span
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        height: "1.3em",
                        textAlign: "center",
                        display: "inline-block",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.classifiedAs === "Freshman (First Year)" ? "✓" : ""}</div>
                    </span>
                  </div>
                </td>

                {/* Transferee */}
                <td colSpan={10}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                      Transferee:
                    </label>
                    <span
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        height: "1.3em",
                        textAlign: "center",
                        display: "inline-block",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <div style={{ marginTop: "-3px" }} className="dataField">{["Transferee", "Returnee", "Shiftee"].includes(person.classifiedAs) ? "✓" : ""}</div>
                    </span>
                  </div>
                </td>

                {/* Others */}
                <td colSpan={10}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                      Others:
                    </label>
                    <span
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        height: "1.3em",
                        textAlign: "center",
                        display: "inline-block",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.classifiedAs === "Foreign Student" ? "✓" : ""}</div>
                    </span>
                  </div>
                </td>
              </tr>


              {/* Last School Attended */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={40}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Last School Attended:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.schoolLastAttended1}</div>
                    </span>
                  </div>
                </td>
              </tr>

              {/* Degree/Program & Major */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={25} style={{ verticalAlign: "top" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                    <label
                      style={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        marginRight: "10px",
                      }}
                    >
                      DEGREE/PROGRAM APPLIED:
                    </label>
                    <div
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        minHeight: "1.2em",
                        whiteSpace: "normal",   // allow text wrapping
                        wordWrap: "break-word", // break long words
                        lineHeight: "1.4em",
                        paddingBottom: "2px",
                      }}
                    >
                      {curriculumOptions.length > 0
                        ? curriculumOptions.find(
                          (item) =>
                            item?.curriculum_id?.toString() ===
                            (person?.program ?? "").toString()
                        )?.program_description || (person?.program ?? "")
                        : "Loading..."}
                    </div>
                  </div>
                </td>

                <td colSpan={15} style={{ verticalAlign: "top" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                    <label
                      style={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        marginRight: "10px",
                      }}
                    >
                      MAJOR:
                    </label>
                    <div
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        minHeight: "1.2em",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        lineHeight: "1.4em",
                        paddingBottom: "2px",
                      }}
                    >
                      {curriculumOptions.length > 0
                        ? curriculumOptions.find(
                          (item) =>
                            item?.curriculum_id?.toString() ===
                            (person?.program ?? "").toString()
                        )?.major || ""
                        : "Loading..."}
                    </div>
                  </div>
                </td>
              </tr>




              <tr>
                <td colSpan="40" style={{ height: "0.5px" }}></td>
              </tr>

              <tr>

                <td
                  colSpan={40}
                  style={{
                    height: "0.2in",
                    fontSize: "72.5%",
                    color: "white", // This is just a fallback; overridden below
                  }}
                >
                  <div
                    style={{
                      color: "black",

                      fontSize: "13px",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    <b>{"\u00A0\u00A0"}APPLICATION PROCEDURE:</b>
                    {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}For Enrollment Officer: Please sign and put Remarks box if they done
                  </div>
                </td>

              </tr>

              <tr>
                <td colSpan={15} style={{ border: "1px solid black", textAlign: "left", padding: "8px", fontSize: "12px" }}>
                  <b> Guidance Office</b> (as per Schedule)
                  <br />
                  <b> Step 1:</b> ECAT Examination
                </td>
                <td
                  colSpan={5}
                  style={{

                    height: "50px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >

                </td>

                <td colSpan={16} style={{ fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}> <b>College Dean's Office</b>
                  <br />
                  <b>Step 2: </b>College Interview, Qualifying / Aptitude Test and College Approval

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                    height: "35px",

                  }}
                >

                </td>
              </tr>
              <tr>
                <td colSpan={15} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px" }}>

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                    height: "50px",

                  }}
                >

                  <ForwardIcon
                    sx={{
                      marginTop: "-53px",
                      fontSize: 70, // normal screen size
                      '@media print': {
                        fontSize: 14, // smaller print size
                        margin: 0,
                      }
                    }}
                  />

                </td>
                <td colSpan={5} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px" }}>

                </td>
                <td colSpan={6} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px" }}>

                </td>
                <td colSpan={5} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px" }}>

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >

                  <ForwardIcon
                    sx={{
                      marginTop: "-53px",
                      fontSize: 70, // normal screen size
                      '@media print': {
                        fontSize: 14, // smaller print size
                        margin: 0,
                      }
                    }}
                  />

                </td>

              </tr>


              <tr>
                <td colSpan="40" style={{ height: "20px" }}></td>
              </tr>


              <tr>
                <td colSpan={10} style={{ border: "1px solid black", textAlign: "left", padding: "8px", fontSize: "12px", }}>
                  <b> Medical and Dental Service Office</b><br />   <b>Step 3:</b> Medical Examination
                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",

                  }}
                >

                </td>

                <td colSpan={11} style={{ fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}> <b>Registrar's Office</b><br /><b>Step 4:</b> Submission of Original Cridentials

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",

                  }}
                >

                </td>
                <td colSpan={10} style={{ fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}> <b>College Dean's Office</b><br /><b>Step 5:</b>College Enrollment</td>
              </tr>

              <tr>
                <td colSpan={10} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px", }}>

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >

                  <ForwardIcon
                    sx={{
                      marginTop: "-53px",
                      fontSize: 70, // normal screen size
                      '@media print': {
                        fontSize: 14, // smaller print size
                        margin: 0,
                      }
                    }}
                  />

                </td>


                <td colSpan={11} style={{ height: "50px", fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}>

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >

                  <ForwardIcon
                    sx={{
                      marginTop: "-53px",
                      fontSize: 70, // normal screen size
                      '@media print': {
                        fontSize: 14, // smaller print size
                        margin: 0,
                      }
                    }}
                  />

                </td>
                <td colSpan={10} style={{ fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}> </td>
              </tr>



              <tr>
                <td colSpan={40} style={{ height: "0.2in", fontSize: "72.5%", border: "transparent", color: "white" }}>
                  <div style={{ fontWeight: "normal", fontSize: "14px", color: "black", textAlign: "right" }}>
                    Registrar's Copy
                  </div>
                </td>
              </tr>


            </tbody>

          </table>

          <hr
            style={{
              width: "100%",
              maxWidth: "770px",
              border: "none",
              borderTop: "1px dashed black",
              margin: "10px auto",
            }}
          />



          <Container>


            <div
              style={{
                width: "8in", // matches table width assuming 8in for 40 columns
                maxWidth: "100%",
                margin: "0 auto",

                boxSizing: "border-box",
                padding: "10px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between", // spread logo, text, profile+QR
                  flexWrap: "nowrap",
                }}
              >
                {/* Logo (Left Side) */}
                <div style={{ flexShrink: 0 }}>
                  <img
                    src={fetchedLogo}
                    alt="School Logo"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      marginLeft: "10px",
                      marginTop: "-25px",
                      borderRadius: "50%", // ✅ Makes it perfectly circular

                    }}
                  />
                </div>

                {/* Text Block (Center) */}
                <div
                  style={{
                    flexGrow: 1,
                    textAlign: "center",
                    fontSize: "12px",
                    fontFamily: "Arial",
                    letterSpacing: "5",
                    lineHeight: 1.4,
                    paddingTop: 0,
                    paddingBottom: 0,
                  }}
                >
                  <div
                    style={{ fontFamily: "Arial", fontSize: "12px" }}
                  >
                    Republic of the Philippines
                  </div>
                  <div
                    style={{

                      letterSpacing: "2px",
                      fontWeight: "bold",
                    }}
                  >
                    {firstLine}
                  </div>
                  {secondLine && (
                    <div
                      style={{

                        letterSpacing: "2px",
                        fontWeight: "bold",
                      }}
                    >
                      {secondLine}
                    </div>
                  )}
                  {campusAddress && (
                    <div style={{ fontSize: "12px", letterSpacing: "1px", fontFamily: "Arial" }}>
                      {campusAddress}
                    </div>
                  )}

                  <div
                    style={{ fontFamily: "Arial", letterSpacing: "1px" }}
                  >
                    <b>OFFICE OF THE ADMISSION SERVICES</b>
                  </div>

                  <br />

                  <div
                    style={{
                      fontSize: "21px",
                      fontFamily: "Arial",
                      fontWeight: "bold",
                      marginBottom: "5px",
                      marginTop: "0",
                      textAlign: "center",
                    }}
                  >
                    Admission Form (Process)
                  </div>
                </div>

                {/* Profile + QR Code (Right Side) */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",   // ✅ side by side
                    alignItems: "center",
                    marginRight: "10px",
                    gap: "10px",            // ✅ 10px space between them
                  }}
                >
               

                  <div
                    style={{
                      width: "1.3in",
                      height: "1.3in",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "1px solid black",  // ✅ same border as profile_img
                      background: "#fff",         // ✅ same background
                      flexShrink: 0,
                      position: "relative"        // ✅ needed for overlay text
                    }}
                  >
                    {person?.qr_code ? (
                      <img
                        src={`${API_BASE_URL}/uploads/${person.qr_code}`}
                        alt="QR Code"
                        style={{ width: "110px", height: "110px" }}
                      />
                    ) : (
                      <QRCodeSVG
                        value={`http://localhost:5173/examination_profile/${person.applicant_number}`}
                        size={110}
                        level="H"
                      />
                    )}

                    {/* Overlay applicant_number in middle */}
                    <div
                      style={{
                        position: "absolute",
                        fontSize: "10px",
                        fontWeight: "bold",
                        color: "maroon",
                        background: "white",
                        padding: "2px"
                      }}
                    >
                      {person.applicant_number}
                    </div>
                  </div>

                </div>

              </div>
            </div>


          </Container>
          <br />
          <br />
          <table

            style={{
              borderCollapse: "collapse",
              fontFamily: "Arial, Helvetica, sans-serif",
              width: "8in",
              margin: "0 auto",

              marginTop: "-30px",
              textAlign: "center",
              tableLayout: "fixed",
            }}
          >

            <tbody>
              {/* Name of Student Row */}
              {/* Name of Student Row */}
              <tr>
                <td
                  colSpan={40}
                  style={{

                    fontSize: "13px",
                    paddingTop: "5px",
                    marginTop: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <span
                      style={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        marginRight: "10px",
                      }}
                    >
                      Name of Student:
                    </span>
                    <div style={{ flexGrow: 1, display: "flex", justifyContent: "space-between" }}>
                      <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                        {person.last_name}
                      </span>
                      <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                        {person.first_name}
                      </span>
                      <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                        {person.middle_name}
                      </span>
                      <span style={{ width: "25%", textAlign: "center", fontSize: "14.5px", borderBottom: "1px solid black" }}>
                        {person.extension}
                      </span>
                    </div>
                  </div>
                </td>
              </tr>

              {/* Labels Row */}
              <tr>
                <td
                  colSpan={40}
                  style={{

                    fontSize: "12px",
                    paddingTop: "2px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginLeft: "120px",
                      marginTop: "-4px"
                    }}
                  >
                    <span style={{ width: "25%", textAlign: "center" }}>Last Name</span>
                    <span style={{ width: "25%", textAlign: "center" }}>Given Name</span>
                    <span style={{ width: "25%", textAlign: "center" }}>Middle Name</span>
                    <span style={{ width: "25%", textAlign: "center" }}>Ext. Name</span>
                  </div>
                </td>
              </tr>


              {/* Email & Applicant ID */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={20}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Email:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "14px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.emailAddress}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={20}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Applicant Id No.:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "14px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.emailAddress}</div>
                    </span>
                  </div>
                </td>
              </tr>

              {/* Permanent Address */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={40}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Permanent Address:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">
                        {person.permanentStreet}{" "}
                        {person.permanentBarangay}{" "}
                        {person.permanentMunicipality}{" "}
                        {person.permanentRegion}{" "}
                        {person.permanentZipCode}
                      </div>
                    </span>


                  </div>
                </td>
              </tr>

              {/* Cellphone No, Civil Status, Gender */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={13}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Cellphone No:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.cellphoneNumber}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={13}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Civil Status:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.civilStatus}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={14}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Gender:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">   {person.gender === 0 ? "Male" : person.gender === 1 ? "Female" : ""}</div>
                    </span>
                  </div>
                </td>
              </tr>

              {/* Date of Birth, Place of Birth, Age */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={13}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Date of Birth:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.birthOfDate}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={14}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Place of Birth:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.birthPlace}</div>
                    </span>
                  </div>
                </td>
                <td colSpan={13}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Age:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.age}</div>
                    </span>
                  </div>
                </td>
              </tr>

              <tr style={{ fontSize: "13px" }}>
                {/* Please Check */}
                <td colSpan={10}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                      Please Check (✓):
                    </label>
                    <span
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        height: "1.3em",
                        display: "inline-block",
                      }}
                    >
                      {/* left blank intentionally */}
                    </span>
                  </div>
                </td>

                {/* Freshman */}
                <td colSpan={10}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                      Freshman:
                    </label>
                    <span
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        height: "1.3em",
                        textAlign: "center",
                        display: "inline-block",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.classifiedAs === "Freshman (First Year)" ? "✓" : ""}</div>
                    </span>
                  </div>
                </td>

                {/* Transferee */}
                <td colSpan={10}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                      Transferee:
                    </label>
                    <span
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        height: "1.3em",
                        textAlign: "center",
                        display: "inline-block",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <div style={{ marginTop: "-3px" }} className="dataField">{["Transferee", "Returnee", "Shiftee"].includes(person.classifiedAs) ? "✓" : ""}</div>
                    </span>
                  </div>
                </td>

                {/* Others */}
                <td colSpan={10}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>
                      Others:
                    </label>
                    <span
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        height: "1.3em",
                        textAlign: "center",
                        display: "inline-block",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.classifiedAs === "Foreign Student" ? "✓" : ""}</div>
                    </span>
                  </div>
                </td>
              </tr>


              {/* Last School Attended */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={40}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap", marginRight: "10px" }}>Last School Attended:</label>
                    <span style={{ flexGrow: 1, borderBottom: "1px solid black", height: "1.3em", fontSize: "13px" }}>
                      <div style={{ marginTop: "-3px" }} className="dataField">{person.schoolLastAttended1}</div>
                    </span>
                  </div>
                </td>
              </tr>

              {/* Degree/Program & Major */}
              <tr style={{ fontSize: "13px" }}>
                <td colSpan={25} style={{ verticalAlign: "top" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                    <label
                      style={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        marginRight: "10px",
                      }}
                    >
                      DEGREE/PROGRAM APPLIED:
                    </label>
                    <div
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        minHeight: "1.2em",
                        whiteSpace: "normal",   // allow text wrapping
                        wordWrap: "break-word", // break long words
                        lineHeight: "1.4em",
                        paddingBottom: "2px",
                      }}
                    >
                      {curriculumOptions.length > 0
                        ? curriculumOptions.find(
                          (item) =>
                            item?.curriculum_id?.toString() ===
                            (person?.program ?? "").toString()
                        )?.program_description || (person?.program ?? "")
                        : "Loading..."}
                    </div>
                  </div>
                </td>

                <td colSpan={15} style={{ verticalAlign: "top" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
                    <label
                      style={{
                        fontWeight: "bold",
                        whiteSpace: "nowrap",
                        marginRight: "10px",
                      }}
                    >
                      MAJOR:
                    </label>
                    <div
                      style={{
                        flexGrow: 1,
                        borderBottom: "1px solid black",
                        minHeight: "1.2em",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        lineHeight: "1.4em",
                        paddingBottom: "2px",
                      }}
                    >
                      {curriculumOptions.length > 0
                        ? curriculumOptions.find(
                          (item) =>
                            item?.curriculum_id?.toString() ===
                            (person?.program ?? "").toString()
                        )?.major || ""
                        : "Loading..."}
                    </div>
                  </div>
                </td>
              </tr>





              <tr>
                <td colSpan="40" style={{ height: "10px" }}></td>
              </tr>

              <tr>

                <td
                  colSpan={40}
                  style={{
                    height: "0.2in",
                    fontSize: "72.5%",
                    color: "white", // This is just a fallback; overridden below
                  }}
                >
                  <div
                    style={{
                      color: "black",

                      fontSize: "13px",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    <b>{"\u00A0\u00A0"}APPLICATION PROCEDURE:</b>
                    {"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}For Enrollment Officer: Please sign and put Remarks box if they done
                  </div>
                </td>

              </tr>

              <tr>
                <td colSpan={15} style={{ border: "1px solid black", textAlign: "left", padding: "8px", fontSize: "12px" }}>
                  <b> Guidance Office</b> (as per Schedule)
                  <br />
                  <b> Step 1:</b> ECAT Examination
                </td>
                <td
                  colSpan={5}
                  style={{

                    height: "50px",
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >

                </td>

                <td colSpan={16} style={{ fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}> <b>College Dean's Office</b>
                  <br />
                  <b>Step 2: </b>College Interview, Qualifying / Aptitude Test and College Approval

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                    height: "35px",

                  }}
                >

                </td>
              </tr>
              <tr>
                <td colSpan={15} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px" }}>

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                    height: "50px",

                  }}
                >

                  <ForwardIcon
                    sx={{
                      marginTop: "-53px",
                      fontSize: 70, // normal screen size
                      '@media print': {
                        fontSize: 14, // smaller print size
                        margin: 0,
                      }
                    }}
                  />

                </td>
                <td colSpan={5} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px" }}>

                </td>
                <td colSpan={6} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px" }}>

                </td>
                <td colSpan={5} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px" }}>

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >

                  <ForwardIcon
                    sx={{
                      marginTop: "-53px",
                      fontSize: 70, // normal screen size
                      '@media print': {
                        fontSize: 14, // smaller print size
                        margin: 0,
                      }
                    }}
                  />

                </td>

              </tr>


              <tr>
                <td colSpan="40" style={{ height: "20px" }}></td>
              </tr>


              <tr>
                <td colSpan={10} style={{ border: "1px solid black", textAlign: "left", padding: "8px", fontSize: "12px", }}>
                  <b> Medical and Dental Service Office</b><br />   <b>Step 3:</b> Medical Examination
                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",

                  }}
                >

                </td>

                <td colSpan={11} style={{ fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}> <b>Registrar's Office</b><br /><b>Step 4:</b> Submission of Original Cridentials

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",

                  }}
                >

                </td>
                <td colSpan={10} style={{ fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}> <b>College Dean's Office</b><br /><b>Step 5:</b>College Enrollment</td>
              </tr>

              <tr>
                <td colSpan={10} style={{ border: "1px solid black", textAlign: "center", padding: "8px", fontSize: "12px", }}>

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >

                  <ForwardIcon
                    sx={{
                      marginTop: "-53px",
                      fontSize: 70, // normal screen size
                      '@media print': {
                        fontSize: 14, // smaller print size
                        margin: 0,
                      }
                    }}
                  />

                </td>


                <td colSpan={11} style={{ height: "50px", fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}>

                </td>
                <td
                  colSpan={5}
                  style={{

                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >

                  <ForwardIcon
                    sx={{
                      marginTop: "-53px",
                      fontSize: 70, // normal screen size
                      '@media print': {
                        fontSize: 14, // smaller print size
                        margin: 0,
                      }
                    }}
                  />

                </td>
                <td colSpan={10} style={{ fontSize: "12px", fontFamily: "Arial", border: "1px solid black", padding: "8px", textAlign: "left" }}> </td>
              </tr>



              <tr>
                <td colSpan={40} style={{ height: "0.2in", fontSize: "72.5%", border: "transparent", color: "white" }}>
                  <div style={{ fontWeight: "normal", fontSize: "14px", color: "black", textAlign: "right" }}>
                    Dean's Copy
                  </div>
                </td>
              </tr>


            </tbody>

          </table>
        </div>
      </Container>

    </Box>
  );
  };

export default StudentAdmissionFormProcess;
