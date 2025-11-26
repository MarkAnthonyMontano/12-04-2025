import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Button, Grid, Typography, Table, Card, TableBody, TableCell, TableHead, TableRow, Paper, TextField, MenuItem, Container } from "@mui/material";
import LinearWithValueLabel from "../components/LinearWithValueLabel";
import { Snackbar, Alert } from "@mui/material";
import { FaFileExcel } from "react-icons/fa";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PeopleIcon from '@mui/icons-material/People';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import API_BASE_URL from "../apiConfig";
import { useNavigate } from "react-router-dom";

const CourseTagging = () => {
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


  const [data, setdata] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [personID, setPersonID] = useState('');
  //////////
  const [hasAccess, setHasAccess] = useState(null);

  const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });

  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");

  ///////////
  const pageId = 17;

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


  const tabs = [
    { label: "Admission Process For College", to: "/applicant_list", icon: <SchoolIcon fontSize="large" /> },
    { label: "Applicant Form", to: "/registrar_dashboard1", icon: <AssignmentIcon fontSize="large" /> },
    { label: "Student Requirements", to: "/registrar_requirements", icon: <AssignmentTurnedInIcon fontSize="large" /> },

    { label: "Qualifying / Interview Exam Score", to: "/qualifying_interview_exam_scores", icon: <PersonSearchIcon fontSize="large" /> },
    { label: "Student Numbering", to: "/student_numbering_per_college", icon: <DashboardIcon fontSize="large" /> },
    { label: "Course Tagging", to: "/course_tagging", icon: <MenuBookIcon fontSize="large" /> },
  ];


  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(5);
  const [clickedSteps, setClickedSteps] = useState(Array(tabs.length).fill(false));


  const handleStepClick = (index, to) => {
    setActiveStep(index);
    navigate(to); // this will actually change the page
  };



  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const hours = String(now.getHours() % 12 || 12).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";

      const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes}:${seconds} ${ampm}`;
      setCurrentDate(formattedDate);
    };

    updateDate();
    const interval = setInterval(updateDate, 1000);
    return () => clearInterval(interval);
  }, []);

  const [courses, setCourses] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [studentNumber, setStudentNumber] = useState("");
  const [userId, setUserId] = useState(null); // Dynamic userId
  const [first_name, setUserFirstName] = useState(null); // Dynamic userId
  const [middle_name, setUserMiddleName] = useState(null); // Dynamic userId
  const [last_name, setUserLastName] = useState(null); // Dynamic userId
  const [currId, setCurr] = useState(null); // Dynamic userId
  const [courseCode, setCourseCode] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [sectionDescription, setSectionDescription] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [yearLevel, setYearLevel] = useState([])
  const [subjectCounts, setSubjectCounts] = useState({});
  const [isenrolled, setIsEnrolled] = useState(null);
  const [disableYearButtons, setDisableYearButtons] = useState(false);

  const fetchSubjectCounts = async (sectionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/subject-enrollment-count`, {
        params: { sectionId },
      });

      // Transform into object for easy lookup: { subject_id: enrolled_count }
      const counts = {};
      response.data.forEach((item) => {
        counts[item.course_id] = item.enrolled_count;
      });

      setSubjectCounts(counts);

    } catch (err) {
      console.error("Failed to fetch subject counts", err);

    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/get_year_level`)
      .then((res) => setYearLevel(res.data))
      .catch((err) => console.error(err));
  })

  useEffect(() => {
    if (selectedSection) {
      fetchSubjectCounts(selectedSection);
    }
  }, [selectedSection]);

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

  const handleSectionChange = async (e) => {
    const sectionId = e.target.value;
    setSelectedSection(sectionId);
    console.log("Selected section ID:", sectionId);

    const selectedSectionObj = sections.find(
      (section) => section.section_id === parseInt(sectionId)
    );
    console.log("Selected section object:", selectedSectionObj);

    try {

      const response = await axios.put(`${API_BASE_URL}/api/update-active-curriculum`, {
        studentId: studentNumber,
        departmentSectionId: sectionId,
      });


      const courseRes = await axios.get(`${API_BASE_URL}/api/search-student/${sectionId}`);
      if (courseRes.data.length > 0) {
        setCurr(courseRes.data[0].curriculum_id);
        setCourseCode(courseRes.data[0].program_code);
        setCourseDescription(courseRes.data[0].program_description);
      } else {
        console.warn("No program data found for selected section");
      }

      console.log("Curriculum updated:", response.data);

    } catch (error) {
      console.error("Error updating curriculum:", error);
    }
  };


  const isEnrolled = (course_id) => enrolled.some((item) => item.course_id === course_id);

  const addToCart = async (course) => {
    if (!selectedSection) {
      alert("Please select a department section before adding the course.");
      return;
    }

    if (!isEnrolled(course.course_id)) {
      const payload = { subject_id: course.course_id, department_section_id: selectedSection };
      try {
        await axios.post(`${API_BASE_URL}/add-to-enrolled-courses/${userId}/${currId}/`, payload);

        // Refresh enrolled courses list after adding
        const { data } = await axios.get(`${API_BASE_URL}/enrolled_courses/${userId}/${currId}`);
        setEnrolled(data);
      } catch (err) {
        console.error("Error adding course or refreshing enrolled list:", err);
      }
    }
  };

  const addAllToCart = async (yearLevelId) => {
    const newCourses = courses.filter((c) => !isEnrolled(c.course_id));
    if (!selectedSection) {
      alert("Please select a department section before adding the course.");
      return;
    }

    if (newCourses.length === 0) return;

    try {
      await Promise.all(
        newCourses.map(async (course) => {
          try {
            const res = await axios.post(`${API_BASE_URL}/add-all-to-enrolled-courses`, {
              subject_id: course.course_id,
              user_id: userId,
              curriculumID: currId,
              departmentSectionID: selectedSection,
              year_level: yearLevelId,
            });
            setDisableYearButtons(true)
          } catch (err) {
            console.error("");
          }
        })
      );

      // Refresh enrolled courses list
      const { data } = await axios.get(`${API_BASE_URL}/enrolled_courses/${userId}/${currId}`);
      setEnrolled(data);
      setCourseCode(data[0].program_code);
      setCourseDescription(data[0].program_description);
      setSectionDescription(data[0].section);

    } catch (err) {
      console.error("Unexpected error during enrollment:", err);
    }
  };

  const deleteFromCart = async (id) => {
    try {
      // Delete the specific course
      await axios.delete(`${API_BASE_URL}/courses/delete/${id}`);

      // Refresh enrolled courses list
      const { data } = await axios.get(`${API_BASE_URL}/enrolled_courses/${userId}/${currId}`);
      setEnrolled(data);

      console.log(`Course with ID ${id} deleted and enrolled list updated`);
    } catch (err) {
      console.error("Error deleting course or refreshing enrolled list:", err);
    }
  };

  const deleteAllCart = async () => {
    try {
      // Delete all user courses
      await axios.delete(`${API_BASE_URL}/courses/user/${userId}`);
      // Refresh enrolled courses list
      const { data } = await axios.get(`${API_BASE_URL}/enrolled_courses/${userId}/${currId}`);
      setEnrolled(data);
      setDisableYearButtons(false);
      console.log("Cart cleared and enrolled courses refreshed");
    } catch (err) {
      console.error("Error deleting cart or refreshing enrolled list:", err);
    }
  };

  const handleSearchStudent = async () => {
    if (!studentNumber.trim()) {
      setSnack({ open: true, message: "Please fill in the student number", severity: "warning" });

      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/student-tagging`, { studentNumber }, { headers: { "Content-Type": "application/json" } });

      const { token2, isEnrolled, person_id2, studentNumber: studentNum, section: section, activeCurriculum: active_curriculum, yearLevel, courseCode: courseCode, courseDescription: courseDescription, firstName: first_name,
        middleName: middle_name, lastName: last_name, } = response.data;

      localStorage.setItem("token2", token2);
      localStorage.setItem("person_id2", person_id2);
      localStorage.setItem("studentNumber", studentNum);
      localStorage.setItem("activeCurriculum", active_curriculum);
      localStorage.setItem("yearLevel", yearLevel);
      localStorage.setItem("courseCode", courseCode);
      localStorage.setItem("courseDescription", courseDescription);
      localStorage.setItem("firstName", first_name);
      localStorage.setItem("middleName", middle_name);
      localStorage.setItem("lastName", last_name);
      localStorage.setItem("section", section);
      localStorage.setItem("isEnrolled", isEnrolled);
      setUserId(studentNum); // Set dynamic userId
      setUserFirstName(first_name); // Set dynamic userId
      setUserMiddleName(middle_name); // Set dynamic userId
      setUserLastName(last_name); // Set dynamic userId
      setCurr(active_curriculum); // Set Program Code based on curriculum
      setCourseCode(courseCode); // Set Program Code
      setCourseDescription(courseDescription); // Set Program Description
      setPersonID(person_id2);
      setSectionDescription(section);
      setIsEnrolled(isEnrolled)

      console.log(studentNum);
      console.log(userId);
      console.log(active_curriculum);
      console.log(currId);
      setSnack({ open: true, message: "Student found and authenticated!", severity: "success" });
    } catch (error) {
      console.log("")
    }
  };

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

  const [selectedFile, setSelectedFile] = useState(null);

  const handleSelect = (departmentId) => {
    setSelectedDepartment(departmentId);
  };

  const handleImport = async () => {
    try {
      if (!selectedFile) {
        alert("Please choose a file first!");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(`${API_BASE_URL}/api/import-xlsx`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert(res.data.message || "Excel imported successfully!");
        setSelectedFile(null);

      } else {
        alert(res.data.error || "Failed to import");
      }
    } catch (err) {
      console.error("❌ Import error:", err);
      alert("Import failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  //🔒 Disable right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  //🔒 Block DevTools shortcuts + Ctrl+P silently
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
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: 'auto', overflowX: "hidden", paddingRight: 2, backgroundColor: "transparent" }}>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',

          mb: 2,
          px: 1,
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
          COURSE TAGGING PANEL
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "0.5rem",
            justifyContent: "flex-end", // ✅ push to right
          }}
        >
          <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 200 }}>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="excel-upload"
            />
            <button
              onClick={() => document.getElementById("excel-upload").click()}
              style={{
                border: "2px solid green",
                backgroundColor: "#f0fdf4",
                color: "green",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                height: "50px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                justifyContent: "center",
                userSelect: "none",
                width: "200px", // ✅ same width as Print
              }}
              type="button"
            >
              <FaFileExcel size={20} />
              Choose Excel
            </button>
          </Box>

          <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 200 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ backgroundColor: "maroon", color: "white", height: "50px", width: "200px", }}
              onClick={handleImport}
            >
              Upload
            </Button>
          </Box>
        </Box>



      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      <br />


      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "nowrap", // ❌ prevent wrapping
          width: "100%",
          mt: 2,
          paddingRight: 2,
          gap: 2,
        }}
      >
        {tabs.map((tab, index) => (
          <Card
            key={index}
            onClick={() => handleStepClick(index, tab.to)}
            sx={{
              flex: `1 1 ${100 / tabs.length}%`, // evenly divide row
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
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Box sx={{ fontSize: 40, mb: 1 }}>{tab.icon}</Box>
              <Typography sx={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}>
                {tab.label}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      <div style={{ height: "40px" }}></div>



      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ color: subtitleColor, fontSize: "42px" }}
        textAlign="center"
        gutterBottom
     
        mb={3}
      >
        Select Department
      </Typography>
      <Grid
        container
        spacing={4}
        gap={2}

        justifyContent="center"
        textAlign="center"
        style={{ backgroundColor: "white", mt: 2, padding: "1rem 0rem" }}
      >
        {departments.map((dept, index) => (
          <Grid key={dept.dprtmnt_id}>
            <Button
              fullWidth
              key={index}
              variant="contained"
              value={dept.dprtmnt_id}
              onClick={() => handleSelect(dept.dprtmnt_id)}
              sx={{
                mt: 2,
                width: 100,
                height: 45,
                fontWeight: "bold",
                backgroundColor:
                  selectedDepartment === dept.dprtmnt_id ? "maroon" : "white",
                color: selectedDepartment === dept.dprtmnt_id ? "white" : "maroon",
                border: `2px solid ${borderColor}`,
                "&:hover": {
                  backgroundColor: "maroon",
                  color: "white",

                },
              }}
              style={{ opacity: '1px' }}
            >
              {dept.dprtmnt_code}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box p={4} display="grid" gridTemplateColumns="1fr 1fr" gap={4} style={{ marginLeft: '-1rem', height: 'calc(90vh - 120px)', width: '100rem', }}>
        {/* Available Courses */}
        <Box
          component={Paper}
          backgroundColor={"#f1f1f1"}
          p={2}
          sx={{ border: `2px solid ${borderColor}` }}
        >
          {/* Search Student */}

          <Box>
            <Typography variant="h6">
              Name: &emsp;
              {first_name} {middle_name} {last_name}
              <br />
              Department/Course/Section: &emsp;
              <br />
              {courseCode || courseDescription || sectionDescription ? (
                isenrolled ? (
                  <>
                    {courseCode && `(${courseCode}) `}
                    {courseDescription && courseDescription}{" "}
                    {sectionDescription && sectionDescription}
                  </>
                ) : (
                  "Not currently enrolled"
                )
              ) : (
                ""
              )}
            </Typography>

            <TextField
              label="Student Number"
              fullWidth
              margin="normal"
              value={studentNumber}
              onChange={(e) => setStudentNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchStudent();
                }
              }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSearchStudent}
            >
              Search
            </Button>
          </Box>
          <Box display="flex" gap={2} mt={2}>
            {yearLevel.map((year_level, index) => (
              <Button
                key={index}
                variant="contained"
                color="success"
                disabled={disableYearButtons}
                onClick={() => addAllToCart(year_level.year_level_id)}
              >
                {year_level.year_level_description} Button
              </Button>
            ))}

            <Button variant="contained" color="warning" onClick={deleteAllCart}>
              Unenroll All
            </Button>
          </Box>

          <Typography variant="h6" mt={2} gutterBottom>
            Available Courses
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>Course Code</TableCell>
                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>Subject ID</TableCell>
                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>Enrolled Students</TableCell>
                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((c) => (
                <TableRow key={c.course_id}>
                  <TableCell style={{ border: `2px solid ${borderColor}`, }}>{c.course_code}</TableCell>
                  <TableCell style={{ border: `2px solid ${borderColor}`, }}>{c.course_description}</TableCell>
                  <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                    {subjectCounts[c.course_id] || 0}
                  </TableCell>
                  <TableCell style={{ border: `2px solid ${borderColor}`, }}>
                    {!isEnrolled(c.course_id) ? (
                      <Button variant="contained" size="small" onClick={() => addToCart(c)} disabled={!userId}>
                        Enroll
                      </Button>
                    ) : (
                      <Typography color="textSecondary">Enrolled</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Box
          component={Paper}
          backgroundColor={"#f1f1f1"}
          p={2}
          sx={{ border: `2px solid ${borderColor}` }}
        >
          <Box sx={{ mb: 2 }}>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: subtitleColor, }}>
                Department Section
              </Typography>
              <Button
                style={{
                  background: `${mainButtonColor}`,
                  color: "white"
                }}
                onClick={() => {
                  if (studentNumber) {
                    localStorage.setItem("studentNumberForCOR", studentNumber);
                    window.open("/search_cor", "_blank");
                  } else {
                    setSnack({
                      open: true,
                      message: "Please select or provide a student number first",
                      severity: "warning",
                    });
                  }
                }}>
                COR
              </Button>
            </Box>

            {/* Department Sections Dropdown */}
            {loading ? (
              <Box sx={{ width: '100%', mt: 2 }}>
                <LinearWithValueLabel />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <TextField
                select
                fullWidth
                value={selectedSection}
                onChange={handleSectionChange}
                variant="outlined"
                margin="normal"
                label="Select a department section"
              >
                <MenuItem value="">
                  <em>Select a department section</em>
                </MenuItem>
                {sections.map((section) => (
                  <MenuItem key={section.department_and_program_section_id} value={section.department_and_program_section_id}>
                    ( <strong>{section.program_code}</strong> ) - {section.program_description} {section.major || ""} - {section.description}
                  </MenuItem>
                ))}
              </TextField>
            )}

          </Box>

          <Typography variant="h6" gutterBottom>
            Enrolled Courses
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ display: "none", border: `2px solid ${borderColor}` }}>Enrolled Subject ID</TableCell>
                <TableCell style={{ display: "none", border: `2px solid ${borderColor}` }}>Subject ID</TableCell>
                <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>SUBJECT CODE</TableCell>
                <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>SECTION</TableCell>
                <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>DAY</TableCell>
                <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>TIME</TableCell>
                <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>ROOM</TableCell>
                <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>FACULTY</TableCell>
                <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>ENROLLED STUDENTS</TableCell>
                <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>Action</TableCell>
              </TableRow>
            </TableHead>




            <TableBody >
              {enrolled.map((e, idx) => (

                <TableRow key={idx} >
                  <TableCell style={{ display: "none", border: `2px solid ${borderColor}` }}>{e.id}</TableCell>
                  <TableCell style={{ display: "none", border: `2px solid ${borderColor}` }}>{e.course_id}</TableCell>
                  <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {e.course_code}-{e.section_description}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {e.program_code}-{e.description}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>{e.day_description}</TableCell>
                  <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>{e.school_time_start}-{e.school_time_end}</TableCell>
                  <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>{e.room_description}</TableCell>
                  <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>Prof. {e.lname}</TableCell>
                  <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}> ({e.number_of_enrolled})</TableCell>
                  <TableCell style={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    <Button style={{ textAlign: "center", }} variant="contained" color="error" size="small" onClick={() => deleteFromCart(e.id)}>
                      Unenroll
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>

        </Box>

      </Box>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default CourseTagging;
