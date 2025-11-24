import React, { useState, useEffect, useContext, useRef, forwardRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, TextField, Container, Typography } from "@mui/material";
import FreeTuitionImage from "../assets/FREETUITION.png";
import EaristLogo from "../assets/EaristLogo.png";
import '../styles/Print.css'
import { Search } from "@mui/icons-material";
import { FcPrint } from "react-icons/fc";
import { useLocation } from "react-router-dom";
import API_BASE_URL from "../apiConfig";
const CertificateOfRegistration = forwardRef(({ student_number }, divToPrintRef) => {
  const settings = useContext(SettingsContext);
  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    if (settings) {
      // ✅ load dynamic logo
      if (settings.logo_url) {
        setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
      } else {
        setFetchedLogo(EaristLogo);
      }

      // ✅ load dynamic name + address
      if (settings.company_name) setCompanyName(settings.company_name);
      if (settings.campus_address) setCampusAddress(settings.campus_address);
    }
  }, [settings]);

  const words = companyName.trim().split(" ");
  const middle = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, middle).join(" ");
  const secondLine = words.slice(middle).join(" ");

  const [data, setData] = useState([]);

  const [profilePicture, setProfilePicture] = useState(null);
  const [personID, setPersonID] = useState('');
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
    cellphoneNumber: "",
    emailAddress: "",
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
    father_family_name: "", father_given_name: "", father_middle_name: "", father_ext: "", father_contact: "", father_occupation: "",
    father_income: "", father_email: "", mother_family_name: "", mother_given_name: "", mother_middle_name: "",
    mother_contact: "", mother_occupation: "", mother_income: "", guardian: "", guardian_family_name: "", guardian_given_name: "",
    guardian_middle_name: "", guardian_ext: "", guardian_nickname: "", guardian_address: "", guardian_contact: "", guardian_email: "", generalAverage1: "",
  });

  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");




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

  // do not alter
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

    // Allow Applicant, Admin, SuperAdmin to view ECAT
    const allowedRoles = ["registrar", "applicant", "student"];
    if (allowedRoles.includes(storedRole)) {
      const targetId = searchedPersonId || queryPersonId || loggedInPersonId;
      setUserID(targetId);
      fetchPersonData(targetId);
      return;
    }

    window.location.href = "/login";
  }, [queryPersonId]);


  const [studentNumber, setStudentNumber] = useState("");

  const fetchProfilePicture = async (person_id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/${person_id}`);
      if (res.data && res.data.profile_img) {
        console.log(res.data.profile_img);
        setProfilePicture(`${API_BASE_URL}/uploads/${res.data.profile_img}`);
      }
    } catch (error) {
      console.error("Error fetching profile picture:", error);
      setProfilePicture(null);
    }
  };

  useEffect(() => {
    if (personID) {
      fetchProfilePicture(personID);
    }
  }, [personID]);

  useEffect(() => {
    if (personID) {
      console.log("Fetched Data:", data); // SEE what's actually returned
    }
  }, [data]);

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

  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);

  const [userId, setUserId] = useState(null); // Dynamic userId
  const [first_name, setUserFirstName] = useState(null); // Dynamic userId
  const [middle_name, setUserMiddleName] = useState(null); // Dynamic userId

  const [last_name, setUserLastName] = useState(null); // Dynamic userId
  const [currId, setCurr] = useState(null); // Dynamic userId
  const [courseCode, setCourseCode] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [subjectCounts, setSubjectCounts] = useState({});
  const [year_Level_Description, setYearLevelDescription] = useState(null);
  const [major, setMajor] = useState(null);

  useEffect(() => {
    if (selectedSection) {
      fetchSubjectCounts(selectedSection);
    }
  }, [selectedSection]);

  const fetchSubjectCounts = async (sectionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subject-enrollment-count`, {
        params: { sectionId },
      });

      // Transform into object for easy lookup: { subject_id: enrolled_count }
      const counts = {};
      response.data.forEach((item) => {
        counts[item.subject_id] = item.enrolled_count;
      });

      setSubjectCounts(counts);
    } catch (err) {
      console.error("Failed to fetch subject counts", err);
    }
  };

  useEffect(() => {
    if (currId) {
      axios
        .get(`${API_BASE_URL}/courses/${currId}`)
        .then((res) => setCourses(res.data))
        .catch((err) => console.error(err));
    }
  }, [currId]);

  useEffect(() => {
    if (userId && currId) {
      axios
        .get(`${API_BASE_URL}/enrolled_courses/${userId}/${currId}`)
        .then((res) => setEnrolled(res.data))
        .catch((err) => console.error(err));
    }
  }, [userId, currId]);

  // Fetch department sections when component mounts
  useEffect(() => {
    fetchDepartmentSections();
  }, []);

  // Fetch sections whenever selectedDepartment changes
  useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentSections();
    }
  }, [selectedDepartment]);

  // Fetch department sections based on selected department
  const fetchDepartmentSections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/department-sections`, {
        params: { departmentId: selectedDepartment },
      });
      // Artificial delay
      setTimeout(() => {
        setSections(response.data);
        setLoading(false);
      }, 700); // 3 seconds delay
    } catch (err) {
      console.error("Error fetching department sections:", err);
      setError("Failed to load department sections");
      setLoading(false);
    }
  };

  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);
  const [email, setEmail] = useState(null);
  const [program, setProgram] = useState(null);
  const [course_unit, setCourseUnit] = useState(null);
  const [lab_unit, setLabUnit] = useState(null);
  const [year_desc, setYearDescription] = useState(null);

  useEffect(() => {
    if (!student_number || !student_number.trim()) return; // don't run if empty

    const fetchStudent = async () => {
      try {
        // 1. Authenticate and tag student
        const response = await axios.post(`${API_BASE_URL}/student-tagging`, { studentNumber: student_number }, {
          headers: { "Content-Type": "application/json" }
        });

        const {
          token2,
          person_id2,
          studentNumber: studentNum,
          activeCurriculum: active_curriculum,
          major,
          yearLevel,
          yearLevelDescription: yearLevelDescription,
          yearDesc: yearDesc,
          courseCode: course_code,
          courseDescription: course_desc,
          departmentName: dprtmnt_name,
          courseUnit: course_unit,
          labUnit: lab_unit,
          firstName: first_name,
          middleName: middle_name,
          lastName: last_name
        } = response.data;

        console.log(course_unit);

        // Save to localStorage
        localStorage.setItem("token2", token2);
        localStorage.setItem("person_id2", person_id2);
        localStorage.setItem("studentNumber", studentNum);
        localStorage.setItem("activeCurriculum", active_curriculum);
        localStorage.setItem("major", major);
        localStorage.setItem("yearLevel", yearLevel);
        localStorage.setItem("departmentName", dprtmnt_name);
        localStorage.setItem("courseCode", course_code);
        localStorage.setItem("courseDescription", course_desc);
        localStorage.setItem("courseUnit", course_unit);
        localStorage.setItem("labUnit", lab_unit);
        localStorage.setItem("firstName", first_name);
        localStorage.setItem("middleName", middle_name);
        localStorage.setItem("lastName", last_name);
        localStorage.setItem("yearLevelDescription", yearLevelDescription);
        localStorage.setItem("yearDesc", yearDesc);

        // Update state variables
        setUserId(studentNum);
        setUserFirstName(first_name);
        setUserMiddleName(middle_name);
        setUserLastName(last_name);
        setCurr(active_curriculum);
        setMajor(major || "");
        setDepartments(dprtmnt_name);
        setCourseCode(course_code);
        setCourseDescription(course_desc);
        setCourseUnit(course_unit);
        setLabUnit(lab_unit);
        setPersonID(person_id2);
        setYearLevelDescription(yearLevelDescription);
        setYearDescription(yearDesc);

        console.log(yearLevelDescription);

        // 2. Fetch full student data (COR info)
        const corResponse = await axios.get(`${API_BASE_URL}/student-data/${studentNum}`);
        const fullData = corResponse.data;
        setData([fullData]); // Wrap in array for data[0] compatibility

        // 3. Set additional fields: gender, age, email, program
        setGender(fullData.gender || null);
        setAge(fullData.age || null);
        console.log(age);
        console.log(major);
        console.log("person.program:", data[0]?.program);
        setEmail(fullData.email || null);
        setProgram(active_curriculum);

      } catch (error) {
        console.error("Student search failed:", error);
      }
    };

    fetchStudent();
  }, [student_number]); // 🔑 runs automatically when prop changes

  // Fetch all departments when component mounts
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/departments`);
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };

    fetchDepartments();
  }, []);

  const totalCourseUnits = enrolled.reduce((sum, item) => sum + (parseFloat(item.course_unit) || 0), 0);
  const totalLabUnits = enrolled.reduce((sum, item) => sum + (parseFloat(item.lab_unit) || 0), 0);
  const totalCombined = totalCourseUnits + totalLabUnits;

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

    <Container className="mb-[4rem]">

      <div className="flex-container">
        <div className="section">



          <Box>


          </Box>

          <div ref={divToPrintRef} className="certificate-wrapper">
            {/* Watermark across the page */}
            <div className="certificate-watermark">STUDENT COPY</div>

            <style>{`
    .certificate-wrapper {
      position: relative;
    }

    .certificate-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
   
      transform: translate(-50%, -50%) rotate(-45deg); /* diagonal */
      font-size: 7rem; /* adjust to fit your page */
      font-weight: 900;
      color: rgba(0, 0, 0, 0.08); /* light grey, adjust opacity */
      text-transform: uppercase;
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
      z-index: 9999;
    }

    @media print {
      .certificate-watermark {
        color: rgba(0, 0, 0, 0.15); /* a bit darker so it prints */
      }
      button {
        display: none;
      }
    }
  `}</style>


            <div className="section">

              <table
                className="student-table"
                style={{

                  borderCollapse: "collapse",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  width: "8in",
                  marginTop: "-20px",
                  margin: "0 auto", // Center the table inside the form
                  textAlign: "center",
                  tableLayout: "fixed",
                }}
              >
                <style>
                  {`
                  @media print {
                    .Box {
                      display: none;
                    }

                  }
                `}
                </style>


                <tbody>
                  <tr>
                    <td colSpan={2} style={{ height: "0.1in", fontSize: "72.5%" }}>
                      <b>

                      </b>
                    </td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                    <td colSpan={1} style={{ height: "0.1in", fontSize: "72.5%" }}></td>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ height: "0.1in", fontSize: "62.5%" }}>

                    </td>
                  </tr>
                  <tr>

                    <td colSpan={40} style={{ height: "0.5in", textAlign: "center" }}>
                      <table width="100%" style={{ borderCollapse: "collapse" }}>
                        <tbody>
                          <tr>


                            <td style={{ width: "20%", textAlign: "center" }}>
                              <img
                                src={fetchedLogo || EaristLogo}
                                alt="School Logo"
                                style={{
                                  marginLeft: "10px",
                                  width: "140px",
                                  height: "140px",
                                  borderRadius: "50%", // ✅ makes it circular
                                  objectFit: "cover",

                                }}
                              />
                            </td>

                            {/* Center Column - School Information */}
                            <td style={{ width: "60%", textAlign: "center", lineHeight: "1" }}>
                              <div>Republic of the Philippines</div>
                              <div
                                style={{
                                  fontWeight: "bold",
                                  fontFamily: "Times new roman",
                                }}
                              >
                                {firstLine}
                              </div>
                              {secondLine && (
                                <div
                                  style={{
                                    fontWeight: "bold",
                                    fontFamily: "Times new roman",
                                  }}
                                >
                                  {secondLine}
                                </div>
                              )}
                              <div>{campusAddress}</div>

                              {/* Add spacing here */}
                              <div style={{ marginTop: "30px" }}>
                                <b style={{ fontSize: "20px", letterSpacing: '2px' }}>
                                  CERTIFICATE OF REGISTRATION
                                </b>
                              </div>
                            </td>

                            <td
                              colSpan={4}
                              rowSpan={6}
                              style={{
                                textAlign: "center",
                                position: "relative",
                                width: "4.5cm",
                                height: "4.5cm",
                              }}
                            >
                              <div
                                style={{
                                  width: "3.80cm",
                                  height: "3.80cm",
                                  marginRight: "30px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "relative",
                                  border: "1px solid #ccc",

                                }}
                              >
                                {profilePicture ? (
                                  <img
                                    src={profilePicture}
                                    alt="Profile"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                  />
                                ) : (
                                  <span style={{ fontSize: "12px", color: "#666" }}>
                                    No Profile Picture Found
                                  </span>
                                )}

                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>

                  </tr>

                  <tr>

                    <td colSpan={10} style={{ height: "0.1in", fontSize: "55%", textAlign: 'start', }}>
                      <b style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: "black", textAlign: 'start', marginLeft: "25px" }}>
                        Registration No:&nbsp;
                        <span style={{ color: "red" }}>

                        </span>
                      </b>
                    </td>



                    <td
                      colSpan={30}
                      style={{
                        height: "0.1in",
                        fontSize: "50%",
                        textAlign: "right",

                      }}
                    >
                      <b style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', color: "black" }}>
                        Academic Year/Term : <span style={{ color: "red" }}></span>
                      </b>

                    </td>
                  </tr>

                </tbody>
              </table>

              <table

                style={{
                  borderLeft: "1px solid black",
                  borderTop: "1px solid black",
                  borderRight: "1px solid black",
                  borderCollapse: "collapse",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  width: "8in",
                  margin: "0 auto", // Center the table inside the form
                  textAlign: "center",
                  tableLayout: "fixed",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      colSpan={42}
                      style={{
                        height: "0.2in",
                        fontSize: "72.5%",
                        backgroundColor: "gray",
                        color: "white",
                      }}
                    >
                      <b>
                        <b style={{
                          border: "1px solid black",
                          color: "black", fontFamily: 'Arial, sans-serif',
                          fontSize: '12px', textAlign: "center", display: "block"
                        }}>
                          STUDENT GENERAL INFORMATION
                        </b>
                      </b>
                    </td>
                  </tr>


                  <tr>
                    <td colSpan={4} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value="Student No:"
                        readOnly
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>

                    <td colSpan={11} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value={data[0]?.student_number || ""}
                        readOnly
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "black",
                          width: "98%",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>

                    <td colSpan={4} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value="College:"
                        readOnly
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>

                    {/* College Display */}
                    <td colSpan={16} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value={data[0]?.college || 'Hello'}
                        readOnly
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "black",
                          width: "98%",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                      {
                        curriculumOptions.length > 0
                          ? curriculumOptions.find(
                            (item) =>
                              item?.curriculum_id?.toString() ===
                              (person?.program ?? "").toString()
                          )?.program_description?.toUpperCase() ||
                          (person?.program?.toString()?.toUpperCase() ?? "")
                          : "LOADING..."
                      }
                    </td>
                  </tr>

                  <tr>
                    {/* Name Label */}
                    <td colSpan={4} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value="Name:"
                        readOnly
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>
                    {/* Name Value */}
                    <td colSpan={11} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value={`${data[0]?.last_name || ''}, ${data[0]?.first_name || ''} ${data[0]?.middle_name || ''} ${data[0]?.extension || ''}`.trim()}
                        readOnly
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "black",
                          width: "98%",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>


                    {/* Program Label */}
                    <td colSpan={4} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value="Program:"
                        readOnly
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>

                    <td colSpan={23} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value={
                          (() => {
                            const match = curriculumOptions.find(
                              (item) =>
                                item?.curriculum_id?.toString() ===
                                (data[0]?.program ?? "").toString()
                            );
                            return match ? match.program_description : (data[0]?.program ?? "");
                          })()
                        }

                        readOnly
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "black",
                          width: "98%",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>


                  </tr>

                  <tr>
                    {/* Gender Label */}
                    <td colSpan={4} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value="Gender:"
                        readOnly
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>

                    {/* Gender Value */}
                    <td colSpan={11} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value={
                          data[0]?.gender === 0
                            ? "Male"
                            : data[0]?.gender === 1
                              ? "Female"
                              : ""
                        }
                        readOnly
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "black",
                          width: "98%",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>


                    {/* Major Label */}
                    <td colSpan={4} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value="Major:"
                        readOnly
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>
                    <td colSpan={9} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        readOnly
                        value={major ? major.charAt(0).toUpperCase() + major.slice(1).toLowerCase() : ""}

                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "black",
                          width: "98%",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>


                    {/* Curriculum Label */}
                    <td colSpan={5} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value="Curriculum:"
                        readOnly
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>

                    {/* Curriculum Value */}
                    <td colSpan={9} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value={`${year_desc || ""}-${year_desc || ""}`}
                        readOnly
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "black",
                          width: "98%",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={4} style={{ fontSize: "50%" }}>
                      <input readOnly type="text" value={"Age:"} style={{ fontWeight: "bold", color: "black", fontFamily: 'Arial, sans-serif', fontSize: '12px', width: "98%", border: "none", outline: "none", background: "none" }} />
                    </td>
                    <td colSpan={11} style={{ fontSize: "62.5%" }}>
                      <input type="text" value={data[0]?.age || ""} readOnly style={{ fontFamily: "Arial, sans-serif", color: "black", width: "98%", fontSize: "12px", border: "none", outline: "none", background: "none" }} />
                    </td>
                    <td colSpan={4} style={{ fontSize: "50%" }}>
                      <input readOnly type="text" value={"Year Level:"} style={{ fontWeight: "bold", color: "black", fontFamily: 'Arial, sans-serif', fontSize: '12px', width: "98%", border: "none", outline: "none", background: "none" }} />
                    </td>
                    <td colSpan={9} style={{ fontSize: "62.5%", }}>
                      <input type="text" value={year_Level_Description || ''} readOnly style={{ fontFamily: "Arial, sans-serif", color: "black", width: "98%", fontSize: "12px", border: "none", outline: "none", background: "none" }} />
                    </td>
                    <td colSpan={8} style={{ fontSize: "50%" }}>
                      <input type="text" value={"Scholarship/Discount:"} readOnly style={{ fontWeight: "bold", color: "black", fontFamily: 'Arial, sans-serif', fontSize: '12px', width: "98%", border: "none", outline: "none", background: "none" }} />
                    </td>
                    <td colSpan={6} style={{ fontSize: "62.5%" }}>
                      <input type="text" readOnly style={{ fontFamily: "Arial, sans-serif", color: "black", width: "98%", fontSize: "12px", border: "none", outline: "none", background: "none" }} />
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={5} style={{ fontSize: "50%" }}>
                      <input
                        type="text"
                        value={"Email Address:"}
                        readOnly
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td colSpan={12} style={{ fontSize: "62.5%" }}>
                      <input
                        type="text"
                        value={data[0]?.email || ""}
                        readOnly
                        style={{
                          fontFamily: "Arial, sans-serif",
                          color: "black",
                          width: "98%",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>
                  </tr>




                  {/*----------------------------------------------------------------------------------------------------------------------------------*/}




                  <tr>

                    <td
                      colSpan={6}
                      rowSpan={2}
                      style={{
                        color: "black",
                        height: "0.3in",
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '12px',
                        fontWeight: "bold",

                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1px' }}>CODE</div>
                    </td>
                    <td
                      colSpan={10}
                      rowSpan={2}
                      style={{
                        color: "black",
                        height: "0.3in",
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '12px',
                        fontWeight: "bold",
                        backgroundColor: "gray",
                        border: "1px solid black",
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1px' }}>SUBJECT TITLE</div>
                    </td>

                    <td
                      colSpan={6}
                      style={{
                        color: "black",
                        height: "0.2in",
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '12px',
                        fontWeight: "bold",

                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1px' }}>UNIT</div>
                    </td>

                    <td
                      colSpan={4}
                      rowSpan={2}
                      style={{
                        color: "black",
                        height: "0.3in",
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '12px',
                        fontWeight: "bold",

                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1px' }}>SECTION</div>
                    </td>
                    <td
                      colSpan={8}
                      rowSpan={2}
                      style={{
                        color: "black",
                        height: "0.3in",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1px' }}>SCHEDULE ROOM</div>

                    </td>
                    <td
                      colSpan={8}
                      rowSpan={2}
                      style={{
                        color: "black",
                        height: "0.3in",
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '12px',
                        fontWeight: "bold",
                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1px' }}>FACULTY</div>
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={1}
                      style={{
                        color: "black",
                        height: "0.1in",
                        fontSize: "50%",
                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      Lec
                    </td>
                    <td
                      colSpan={1}
                      style={{
                        color: "black",
                        height: "0.1in",
                        fontSize: "50%",
                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      Lab
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        color: "black",
                        height: "0.1in",
                        fontSize: "50%",
                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      Credit
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        color: "black",
                        height: "0.1in",
                        fontSize: "50%",
                        backgroundColor: "gray",
                        border: "1px solid black",
                        textAlign: "center",
                      }}
                    >
                      Tuition
                    </td>
                  </tr>
                  {enrolled.map((item, index) => (
                    <tr key={index}>
                      <td colSpan={6} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={item.course_code || ""}
                          readOnly
                          style={{
                            width: "98%",
                            border: "none",
                            textAlign: "center",
                            background: "none",
                            fontSize: "12px",
                          }}
                        />
                      </td>
                      <td colSpan={10} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={item.course_description || ""}
                          readOnly
                          style={{
                            width: "98%",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            fontSize: "8px",
                          }}
                        />
                      </td>
                      <td colSpan={1} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={item.course_unit ?? ""}
                          readOnly
                          style={{
                            width: "98%",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                        />
                      </td>
                      <td colSpan={1} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={item.lab_unit ?? ""}
                          readOnly
                          style={{
                            width: "98%",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                        />
                      </td>
                      <td colSpan={2} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={
                            (parseFloat(item.course_unit ?? 0) || 0) + (parseFloat(item.lab_unit ?? 0) || 0)
                          }
                          style={{
                            width: "98%",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                          readOnly
                        />
                      </td>

                      <td colSpan={2} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={
                            (parseFloat(item.course_unit ?? 0) || 0) + (parseFloat(item.lab_unit ?? 0) || 0)
                          }
                          style={{
                            width: "98%",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                          readOnly
                        />
                      </td>
                      <td colSpan={4} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={item.description || ""}
                          readOnly
                          style={{
                            width: "98%",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            fontSize: "12px",
                          }}
                        />
                      </td>
                      <td colSpan={8} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={`${item.day_description} ${item.school_time_start}-${item.school_time_end}`}
                          readOnly
                          style={{
                            width: "98%",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            fontSize: "8px",
                          }}
                        />
                      </td>
                      <td colSpan={8} style={{ border: "1px solid black" }}>
                        <input
                          type="text"
                          value={`Prof. ${item.lname}`}
                          readOnly
                          style={{
                            width: "98%",
                            border: "none",
                            background: "none",
                            textAlign: "center",
                            fontSize: "8px",
                          }}
                        />
                      </td>
                    </tr>
                  ))}




                  {/*----------------------------------------------------------------------------------------------------------------------------------*/}

                  <tr>
                    <td
                      colSpan={10}
                      style={{
                        height: "0.1in",
                        fontSize: "45%",
                        color: "black",
                        textAlign: "left",
                      }}
                    >
                      <b>Note: Subject marked with "*" is Special Subject</b>
                    </td>
                    <td
                      colSpan={6}
                      style={{
                        fontSize: "50%",
                        color: "black",
                        textAlign: "CENTER",
                      }}
                    >
                      <b>
                        Total Unit(s)</b>
                    </td>
                    <td
                      colSpan={1}
                      style={{
                        fontSize: "12px",
                        color: "black",
                        fontFamily: "Arial",
                        textAlign: "center",
                      }}
                    >

                      {totalCourseUnits}
                    </td>
                    <td
                      colSpan={1}
                      style={{
                        fontSize: "12px",
                        color: "black",
                        fontFamily: "Arial",
                        textAlign: "center",

                      }}
                    >
                      {totalLabUnits}
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        fontSize: "12px",
                        color: "black",
                        fontFamily: "Arial",
                        textAlign: "center",

                      }}
                    >
                      {totalCourseUnits + totalLabUnits}
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        fontSize: "12px",
                        color: "black",
                        fontFamily: "Arial",
                        textAlign: "center",

                      }}
                    >
                      {totalCombined}
                    </td>

                    <td
                      colSpan={2}
                      style={{
                        height: "0.1in",
                        fontSize: "55%",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                    </td>
                    <td
                      colSpan={3}
                      style={{
                        height: "0.1in",
                        fontSize: "55%",
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                    </td>
                  </tr>
                  <tr
                    colSpan={12}

                    style={{
                      color: "white",

                      height: "0.1in",
                      fontSize: "62.5%",
                      backgroundColor: "gray",
                      textAlign: "center",
                    }}
                  >

                  </tr>
                  <tr>
                    <td
                      colSpan={20}
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "63.5%",
                        border: "1px solid black",
                        backgroundColor: "gray",
                        height: "auto",
                      }}
                    >
                      <input
                        type="text"
                        value={"A S S E S S E D  F E E S"}
                        readOnly
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          margin: "0px",
                          padding: "0px",
                          textAlign: "center",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none",
                          height: "auto",
                          lineHeight: "1"
                        }}
                      />
                    </td>
                    <td
                      colSpan={8}

                      style={{
                        color: "white",
                        fontSize: "62.5%",
                        color: "black",
                        border: "1px 0px 1px 1px solid black",
                        textAlign: "center",
                      }}
                    >
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={15} style={{ padding: 0 }}>
                      <input
                        type="text"
                        value={"Tuition (21 unit(s)) "}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{
                        fontSize: "60.5%",
                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          color: "black",
                          width: "100%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>

                    <td
                      colSpan={15}
                      style={{
                        fontSize: "62.5%",
                      }}
                    >
                      <input
                        type="text"
                        value={"RULES OF REFUND"}
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          marginLeft: "40px",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '10px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>

                  </tr>
                  <tr>
                    <td
                      colSpan={15}
                      style={{
                        fontSize: "62.5%",
                      }}
                    >
                      <input
                        type="text"
                        value={"Athletic Fee"}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{
                        fontSize: "62.5%",
                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={15}
                      style={{
                        fontSize: "62.5%",
                      }}
                    >
                      <input
                        type="text"
                        value={"1. Full refund of tuition fee - Before the start of classes."}
                        readOnly
                        style={{
                          textAlign: "left",
                          color: "black",
                          marginLeft: "40px",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '10px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none",
                          fontStyle: "italic"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Cultural Fee"}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",

                        borderRight: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={20}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >

                      <input
                        type="text"
                        value={"2. 80% refund of tuition fee - within 1 week from the start of classes."}
                        readOnly
                        style={{
                          textAlign: "left",
                          color: "black",
                          marginLeft: "40px",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '10px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none",
                          fontStyle: "italic"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Developmental Fee"}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",

                        borderRight: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >

                      <input
                        type="text"
                        value={"3. 50% refund - within 2 weeks from the start of classes."}
                        readOnly
                        style={{
                          textAlign: "left",
                          color: "black",
                          marginLeft: "40px",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '10px',
                          fontWeight: "bold",
                          outline: "none",
                          fontStyle: "italic",
                          background: "none"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Guidance Fee"}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",

                        borderRight: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          color: "black",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >

                      <input
                        type="text"
                        value={"4. No refund - after the 2nd week of classes."}
                        readOnly
                        style={{
                          textAlign: "left",
                          color: "black",
                          marginLeft: "40px",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '10px',
                          fontWeight: "bold",
                          outline: "none",
                          fontStyle: "italic",
                          background: "none"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Library Fee"}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",

                        borderRight: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>

                  </tr>
                  <tr>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Medical and Dental Fee"}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",

                        borderRight: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={20}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >

                      <input
                        type="text"
                        value={"PLEDGE UPON ADMISSION"}
                        readOnly
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Registration Fee"}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",

                        borderRight: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={20}
                      style={{

                        textAlign: "center",
                        fontWeight: "bold",
                        color: "black",
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '10px',
                      }}
                    >
                      <i> "As a student of EARIST, I do solemnly promise that I will </i>
                    </td>

                  </tr>
                  <tr>
                    <td
                      colSpan={15}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Computer Fee"}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",

                        borderRight: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={20}
                      style={{

                        textAlign: "center",
                        fontWeight: "bold",
                        color: "black",
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '10px',
                      }}
                    >
                      <i>comply with the rules and regulations of the Institution."</i>
                    </td>

                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{

                          color: "black",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={13}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",


                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{

                          color: "black",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",

                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly

                        style={{
                          textAlign: "left",
                          color: "black",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>

                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{


                        marginRight: "20px",

                      }}
                    >

                    </td>
                    <td
                      colSpan={13}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Total Assessment : "}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",

                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>

                  </tr>

                  <tr>
                    <td
                      colSpan={2}
                      style={{


                        marginRight: "20px",

                      }}
                    >

                    </td>
                    <td
                      colSpan={13}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Less Financial Aid : "}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",

                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>


                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{


                        marginRight: "20px",

                      }}
                    >

                    </td>
                    <td
                      colSpan={13}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Net Assessed : "}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",

                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly

                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>


                    <td
                      colSpan={20}

                    >
                      <input
                        type="text"
                        value={"_________________________________"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          textDecoration: "underline",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{


                        marginRight: "20px",

                      }}
                    >

                    </td>
                    <td
                      colSpan={13}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Credit Memo : "}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",

                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>




                    <td
                      colSpan={20}

                    >
                      <input
                        type="text"
                        value={"Student's Signature"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{


                        marginRight: "20px",

                      }}
                    >

                    </td>
                    <td
                      colSpan={13}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Total Discount : "}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",

                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>

                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{


                        marginRight: "20px",

                      }}
                    >

                    </td>
                    <td
                      colSpan={13}
                      style={{

                        fontSize: "62.5%",

                      }}
                    >
                      <input
                        type="text"
                        value={"Total Payment : "}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={5}
                      style={{

                        fontSize: "62.5%",
                        marginRight: "20px",

                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        readOnly

                        style={{
                          textAlign: "center",
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>

                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      style={{


                        marginRight: "20px",

                      }}
                    >

                    </td>
                    <td
                      colSpan={18}
                      style={{

                        fontSize: "62.5%",
                        borderRight: "1px solid black",
                      }}
                    >
                      <input
                        type="text"
                        value={"Outstanding Balance : "}
                        readOnly
                        style={{
                          color: "black",
                          width: "98%",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={7}
                      style={{

                        fontSize: "62.5%",


                      }}
                    >
                      <input
                        type="text"
                        value={"APPROVED BY : "}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "left",
                          marginLeft: "20px",
                          fontWeight: "bold",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>

                  </tr>
                  <tr>
                    <td
                      colSpan={20}
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "63.5%",
                        border: "1px solid black",
                        backgroundColor: "gray",
                        height: "auto",
                      }}
                    >
                      <input
                        type="text"
                        value={"A S S E S S E D  F E E S"}
                        readOnly
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          margin: "0px",
                          padding: "0px",
                          textAlign: "center",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none",
                          lineHeight: "1"
                        }}
                      />
                    </td>




                  </tr>

                  <tr>
                    <td
                      colSpan={7}
                      style={{

                        fontSize: "62.5%",
                        border: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        value={"1st Payment/Due"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          fontWeight: "bold",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={6}
                      style={{


                        border: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        value={"2nd Payment/Due"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={7}
                      style={{


                        border: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        value={"3rd Payment/Due"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={20}
                      style={{

                        fontSize: "62.5%",


                      }}
                    >
                      <input
                        type="text"
                        value={"_________________________________"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          textDecoration: "underline",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                  </tr>


                  <tr>
                    <td
                      colSpan={7}
                      style={{

                        fontSize: "62.5%",
                        border: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          color: "black",
                          fontWeight: "bold",
                          textAlign: "center",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={6}
                      style={{

                        fontSize: "62.5%",
                        border: "1px solid black",

                      }}
                    >
                      <input
                        type="text"
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          fontWeight: "bold",
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={7}
                      style={{

                        fontSize: "62.5%",
                        border: "1px solid black",

                      }}
                    >
                      <input
                        type="text" readOnly

                        style={{
                          color: "black",
                          textAlign: "center",
                          width: "98%",
                          fontWeight: "bold",
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={20}
                      style={{

                        fontSize: "12px",


                      }}
                    >
                      <input
                        type="text"
                        value={"Registrar"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          width: "98%",
                          fontWeight: "bold",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          border: "none",
                          fontWeight: "bold",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>

                  </tr>

                  <tr>
                    <td
                      colSpan={12}
                      style={{

                        fontSize: "62.5%",


                      }}
                    >
                      <input
                        type="text"
                        value={"Payment/Validation Date : "}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          width: "98%",
                          fontWeight: "bold",
                          textDecorationThickness: "2px", // <-- Thicker underline

                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          border: "none",
                          outline: "none",
                          background: "none"
                        }}
                      />
                    </td>
                    <td
                      colSpan={8}
                      style={{
                        height: "0.25in",
                        fontSize: "12px",
                        fontFamily: "Arial",
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <input
                        type="text"
                        value={shortDate}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          width: "100%", // ensures full-width underline
                          border: "none",
                          outline: "none",

                          fontWeight: "bold",
                          background: "none",
                          borderBottom: "1px solid black", // thicker, longer underline
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        fontSize: "62.5%",
                      }}
                    >
                      <input
                        type="text"
                        value={"Official Receipt :"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          width: "98%",
                          fontWeight: "bold",
                          border: "none",
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '12px',
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>
                    <td
                      colSpan={10}
                      style={{
                        fontSize: "62.5%",
                        textAlign: "center",
                        fontWeight: "Bold"
                      }}
                    >
                      <input
                        type="text"
                        value={"Scholar"}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "center",
                          width: "95%",
                          fontWeight: "bold",
                          fontFamily: "Arial, sans-serif",
                          fontSize: "12px",
                          border: "none",
                          outline: "none",
                          background: "none",
                          borderBottom: "1px solid black", // underlines the field like a line
                        }}
                      />
                    </td>
                  </tr>

                </tbody>
              </table>


              <table
                style={{
                  borderCollapse: "collapse",
                  fontFamily: "Arial, Helvetica, sans-serif",
                  width: "8in",
                  margin: "0 auto", // Center the table inside the form
                  textAlign: "center",
                  tableLayout: "fixed",
                  borderLeft: "1px solid black",
                  borderBottom: "1px solid black",
                  borderRight: "1px solid black",
                }}
              >
                <tbody>
                  <tr>
                    <td style={{ width: "50%", textAlign: "center" }}>
                      <img
                        src={FreeTuitionImage}
                        alt="EARIST MIS FEE"
                        style={{
                          marginLeft: "75px",
                          width: "200px", // Corrected unit
                          height: "150px",
                        }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={40}
                      style={{
                        height: "0.25in",
                        fontSize: "15px",
                        textAlign: "right",
                        textAlign: "right",
                        verticalAlign: "middle", // Centers vertically
                      }}
                    >
                      <input
                        type="text"
                        value={longDate}
                        readOnly
                        style={{
                          color: "black",
                          textAlign: "right", // Centers text inside the input
                          width: "98%",
                          border: "none",
                          outline: "none",
                          background: "none",
                        }}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={42}
                      style={{
                        height: "0.2in",
                        fontSize: "72.5%",
                        backgroundColor: "gray",
                        color: "white",
                      }}
                    >
                      <b>
                        <i style={{ color: "black", textAlign: "center", display: "block" }}>
                          KEEP THIS CERTIFICATE. YOU WILL BE REQUIRED TO PRESENT THIS IN ALL YOUR DEALINGS WITH THE COLLEGE.
                        </i>
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>


            </div>

          </div>


        </div>


      </div>

    </Container>
  );
});

export default CertificateOfRegistration;
