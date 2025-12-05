import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import "../styles/TempStyles.css";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button,
  TextField
} from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { FcPrint } from "react-icons/fc"; 
import SearchIcon from "@mui/icons-material/Search";

const FacultyMasterList = () => {
  const navigate = useNavigate();
  const settings = useContext(SettingsContext);
  const location = useLocation();
  const { course_id, section_id, school_year_id, department_section_id } =
    location.state || {};

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff"); // ✅ NEW
  const [stepperColor, setStepperColor] = useState("#000000"); // ✅ NEW

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
    if (settings.main_button_color)
      setMainButtonColor(settings.main_button_color);
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color); // ✅ NEW
    if (settings.stepper_color) setStepperColor(settings.stepper_color); // ✅ NEW

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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [profData, setPerson] = useState({
    prof_id: "",
    fname: "",
    mname: "",
    lname: "",
  });
  const [schoolYears, setSchoolYears] = useState([]);
  const [schoolSemester, setSchoolSemester] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedSchoolSemester, setSelectedSchoolSemester] = useState("");
  const [selectedActiveSchoolYear, setSelectedActiveSchoolYear] = useState("");
  const [classListAndDetails, setClassListAndDetails] = useState([]);
  const [courseAssignedTo, setCoursesAssignedTo] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [sectionAssignedTo, setSectionAssignedTo] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("Regular");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole !== "faculty") {
        window.location.href = "/dashboard";
      } else {
        fetchPersonData(storedID);
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const fetchPersonData = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_prof_data/${id}`);
      const first = res.data[0];

      const profInfo = {
        prof_id: first.prof_id,
        fname: first.fname,
        mname: first.mname,
        lname: first.lname,
      };

      setPerson(profInfo);
    } catch (err) {
      setLoading(false);
      setMessage("Error Fetching Professor Personal Data");
    }
  };

  useEffect(() => {
    if (userID) {
      axios
        .get(`${API_BASE_URL}/course_assigned_to/${userID}`)
        .then((res) => {
          setCoursesAssignedTo(res.data);
          if (!course_id && res.data.length > 0) {
            setSelectedCourse(res.data[0].course_id);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [userID]);

  const filteredCourses = courseAssignedTo.filter((course) => {
    if (!selectedSchoolYear && !selectedSchoolSemester) return true;

    const matchesYear =
      !selectedSchoolYear || String(course.year_id) === String(selectedSchoolYear);

    const matchesSemester =
      !selectedSchoolSemester ||
      String(course.semester_id) === String(selectedSchoolSemester);

    return matchesYear && matchesSemester;
  });

  useEffect(() => {
    if (course_id) setSelectedCourse(course_id);
    if (section_id) setSelectedSection(section_id);
    if (school_year_id) setSelectedSchoolYear(school_year_id);
  }, [course_id, section_id, school_year_id]);

  useEffect(() => {
  if (!userID || !selectedCourse || !selectedSchoolYear || !selectedSchoolSemester) return;
    axios
      .get(`${API_BASE_URL}/api/section_assigned_to/${userID}/${selectedCourse}/${selectedSchoolYear}/${selectedSchoolSemester}`)
      .then((res) => {
        setSectionAssignedTo(res.data);

        if (res.data.length > 0) {
          setSelectedSection(res.data[0].department_section_id);
          handleFetchStudents(res.data[0].department_section_id);
        } else {
          setSelectedSection("");
        }
      })
      .catch((err) => console.error(err));
  }, [userID, selectedCourse, selectedSchoolYear, selectedSchoolSemester]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/get_school_year`)
      .then((res) => {
        const currentYear = new Date().getFullYear();
        const filteredYears = res.data.filter(
          (yearObj) => Number(yearObj.current_year) <= currentYear
        );

        setSchoolYears(filteredYears);
      })
      .catch((err) => console.error(err));
  }, []);


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
        .get(
          `${API_BASE_URL}/get_selecterd_year/${selectedSchoolYear}/${selectedSchoolSemester}`
        )
        .then((res) => {
          if (res.data.length > 0) {
            setSelectedActiveSchoolYear(res.data[0].school_year_id);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectedSchoolYear, selectedSchoolSemester]);

  useEffect(() => {
    if (userID) {
      axios
        .get(`${API_BASE_URL}/get_class_details/${userID}`)
        .then((res) => setClassListAndDetails(res.data))
        .catch((err) => console.error(err));
    }
  }, [userID]);

  const handleSchoolYearChange = (event) => {
    setSelectedSchoolYear(event.target.value);
  };

  const handleSchoolSemesterChange = (event) => {
    setSelectedSchoolSemester(event.target.value);
  };

  const handleSelectCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleSelectSectionChange = (event) => {
    setSelectedSection(event.target.value);
  };

  const [searchQuery, setSearchQuery] = useState("");
   const findPastClass = async () => {
    try {
      if (!userID || !selectedSchoolYear || !selectedSchoolSemester) {
        setSnack({
          open: true,
          message: "Please select School Year and Semester first!",
          severity: "warning",
        });
        return;
      }
  
      // 1️⃣ Fetch courses assigned to the professor
      const courseRes = await axios.get(
        `${API_BASE_URL}/course_assigned_to/${userID}/${selectedSchoolYear}/${selectedSchoolSemester}`
      );
      const courses = courseRes.data;
      setCoursesAssignedTo(courses);
  
      if (courses.length === 0) {
        setSectionsHandle([]);
        setStudents([]);
        setSnack({ open: true, message: "No courses found for this period.", severity: "info" });
        return;
      }
  
      // 2️⃣ Choose first course if none selected
      const courseId = selectedCourse || courses[0].course_id;
      setSelectedCourse(courseId);
  
      // 3️⃣ Fetch sections for the selected course
      const sectionRes = await axios.get(
        `${API_BASE_URL}/handle_section_of/${userID}/${courseId}/${selectedActiveSchoolYear}`
      );

      const sections = sectionRes.data;
      if (sections.length > 0) {
        setSelectedSection(selectedSection || sections[0].department_section_id);
      } else {
        setSelectedSection("");
      }
  
      if (sections.length === 0) {
        setStudents([]);
        setSnack({ open: true, message: "No sections found for this course.", severity: "info" });
        return;
      }
  
      // 4️⃣ Choose first section if none selected
      const sectionId = selectedSection || sections[0].department_section_id;
      setSelectedSection(sectionId);
  
      // 5️⃣ Fetch students for this section
      handleFetchStudents(sectionId);
  
    } catch (err) {
      console.error("Error fetching past class data:", err);
      setSnack({ open: true, message: "Failed to fetch data.", severity: "error" });
    }
  };

  const filteredStudents = classListAndDetails
    .filter((s) => {
      const q = searchQuery.toLowerCase();

      // 🔍 SEARCH (name OR student number)
      const matchesSearch =
        q === "" ||
        s.student_number?.toString().includes(q) ||
        s.first_name?.toLowerCase().includes(q) ||
        s.middle_name?.toLowerCase().includes(q) ||
        s.last_name?.toLowerCase().includes(q) ||
        `${s.first_name} ${s.last_name}`.toLowerCase().includes(q) ||
        `${s.last_name} ${s.first_name}`.toLowerCase().includes(q);

      // 📌 OTHER FILTERS
      const matchesYear =
        selectedSchoolYear === "" ||
        String(s.year_id) === String(selectedSchoolYear);

      const matchesSemester =
        selectedSchoolSemester === "" ||
        String(s.semester_id) === String(selectedSchoolSemester);

      const matchesCourse =
        selectedCourse === "" || String(s.course_id) === String(selectedCourse);

      const matchesSection =
        selectedSection === "" ||
        String(s.department_section_id) === String(selectedSection);

      const matchesStatus =
        selectedStatusFilter === "" ||
        (selectedStatusFilter === "Regular" && Number(s.status) === 1) ||
        (selectedStatusFilter === "Irregular" && Number(s.status) !== 1);

      return (
        matchesSearch &&
        matchesYear &&
        matchesSemester &&
        matchesCourse &&
        matchesSection &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
      const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();

      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });


  const groupedStudents = filteredStudents.reduce((acc, student) => {
    const key = student.student_number;

    if (!acc[key]) {
      acc[key] = {
        ...student,
        schedules: [],
      };
    }

    acc[key].schedules.push({
      day: student.day,
      start: student.school_time_start,
      end: student.school_time_end,
      room: student.room_description,
    });

    return acc;
  }, {});

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const groupedList = Object.values(groupedStudents);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const divToPrintRef = useRef();

  const printDiv = () => {
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();

    doc.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0.5in; /* 0.5 inch margins */
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
            }
            th, td {
              border: 1px solid black;
              padding: 6px;
              text-align: left;
            }
            th {
              background-color: #f0f0f0;
            }
            h2, h3, h4 {
              text-align: center;
              margin: 0;
            }
            h3 {
              margin-top: 20px;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            @media print {
              @page { margin: 0.5in; size: auto; }
            }
          </style>
        </head>
        <body>
          ${divToPrintRef.current.innerHTML}
        </body>
      </html>
    `);

    doc.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };


  // // 🔒 Disable right-click
  // document.addEventListener("contextmenu", (e) => e.preventDefault());

  // // 🔒 Block DevTools shortcuts + Ctrl+P silently
  // document.addEventListener("keydown", (e) => {
  //   const isBlockedKey =
  //     e.key === "F12" || // DevTools
  //     e.key === "F11" || // Fullscreen
  //     (e.ctrlKey &&
  //       e.shiftKey &&
  //       (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")) || // Ctrl+Shift+I/J
  //     (e.ctrlKey && e.key.toLowerCase() === "u") || // Ctrl+U (View Source)
  //     (e.ctrlKey && e.key.toLowerCase() === "p"); // Ctrl+P (Print)

  //   if (isBlockedKey) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // });

  return (
    <Box
  sx={{
    height: "calc(100vh - 150px)",
    overflowY: "auto",
    overflowX: "hidden",
    pr: 1,
    marginRight: "3rem",
  }}
>
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 2,
      width: "100%",
    }}
  >
    {/* LEFT SIDE — TITLE */}
    <Typography
      variant="h4"
      sx={{
        fontWeight: "bold",
        color: titleColor,
        fontSize: "36px",
      }}
    >
      CLASS LIST
    </Typography>

    {/* RIGHT SIDE — SEARCH + PRINT */}
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <TextField
        size="small"
        placeholder="Search Student Number / Student Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          width: 450,  // MATCHED WITH GRADING SHEET
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
          width: "308px",   // MATCHED WITH GRADING SHEET
          padding: "10px 20px",
          border: "2px solid black",
          backgroundColor: "#f0f0f0",
          color: "black",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
          marginRight: "30px",
          transition: "background-color 0.3s, transform 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#d3d3d3")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
        onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
        onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <FcPrint size={20} />
          Print Class List
        </span>
      </button>
    </Box>
  </Box>


      <hr style={{ border: "1px solid #ccc", width: "98%" }} />

      <br />

      <TableContainer component={Paper} sx={{ width: "98%" }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#6D2323", color: "white" }}>
            <TableRow>
              <TableCell
                colSpan={10}
                sx={{
                  border: `2px solid ${borderColor}`,
                  py: 0.5,
                  backgroundColor: settings?.header_color || "#1976d2",
                  color: "white",
                }}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {/* Left: Total Count */}
                  <Typography fontSize="14px" fontWeight="bold" color="white">
                    Total Students: {groupedList.length}
                  </Typography>

                  {/* Right: Pagination Controls */}
                  <Box display="flex" alignItems="center" gap={1}>
                    {/* First & Prev */}
                    <Button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 80,
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                        "&.Mui-disabled": {
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          opacity: 1,
                        },
                      }}
                    >
                      First
                    </Button>

                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 80,
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                        "&.Mui-disabled": {
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          opacity: 1,
                        },
                      }}
                    >
                      Prev
                    </Button>

                    {/* Page Dropdown */}
                    <FormControl size="small" sx={{ minWidth: 80 }}>
                      <Select
                        value={currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        displayEmpty
                        sx={{
                          fontSize: "12px",
                          height: 36,
                          color: "white",
                          border: "1px solid white",
                          backgroundColor: "transparent",
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "& svg": {
                            color: "white", // dropdown arrow icon color
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 200,
                              backgroundColor: "#fff", // dropdown background
                            },
                          },
                        }}
                      >
                        {Array.from({ length: totalPages }, (_, i) => (
                          <MenuItem key={i + 1} value={i + 1}>
                            Page {i + 1}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography fontSize="11px" color="white">
                      {totalPages} page{totalPages > 1 ? "s" : ""}
                    </Typography>

                    <Button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 80,
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                        "&.Mui-disabled": {
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          opacity: 1,
                        },
                      }}
                    >
                      Next
                    </Button>

                    <Button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 80,
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                        "&.Mui-disabled": {
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          opacity: 1,
                        },
                      }}
                    >
                      Last
                    </Button>

                    <Button
                      onClick={() =>
                        setSortOrder((prev) =>
                          prev === "asc" ? "desc" : "asc"
                        )
                      }
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 100,
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                      }}
                    >
                      Sort: {sortOrder === "asc" ? "A–Z" : "Z–A"}
                    </Button>

                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={selectedSchoolYear}
                        onChange={(e) => setSelectedSchoolYear(e.target.value)}
                        displayEmpty
                        sx={{
                          fontSize: "12px",
                          height: 36,
                          color: "white",
                          border: "1px solid white",
                          backgroundColor: "transparent",
                          ".MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "white",
                          },
                          "& svg": { color: "white" }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 200,
                              backgroundColor: "#fff",
                            },
                          },
                        }}
                      >
                        {/* Placeholder */}
                        <MenuItem value="" disabled>
                          Select School Year
                        </MenuItem>

                        {/* Loop through school years */}
                        {schoolYears.map((yearObj) => (
                          <MenuItem 
                            key={yearObj.year_id}
                            value={yearObj.year_id}
                          >
                            {yearObj.current_year} - {yearObj.next_year}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl size="small" sx={{ minWidth: 140 }}>
                      <Select
                        value={selectedSchoolSemester}
                        onChange={(e) => setSelectedSchoolSemester(e.target.value)}
                        displayEmpty
                        sx={{
                          fontSize: "12px",
                          height: 36,
                          color: "white",
                          border: "1px solid white",
                          backgroundColor: "transparent",
                          ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                          "& svg": { color: "white" }
                        }}
                          MenuProps={{
                            PaperProps: {
                              sx: { 
                                maxHeight: 200, 
                                backgroundColor: "#fff"
                              },
                            },
                          }}
                        >
                          {/* Placeholder */}
                          <MenuItem value="" disabled>
                            Select Semester
                          </MenuItem>
  
                          {/* Loop through semester list */}
                          {schoolSemester.map((sem) => (
                            <MenuItem 
                              key={sem.semester_id} 
                              value={sem.semester_id}
                            >
                              {sem.semester_description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
  
                      <Button
                        onClick={findPastClass}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 100,
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                        }}
                      >
                        FIND LAST GRADE
                      </Button>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <TableContainer
        component={Paper}
        sx={{ width: "98%", border: `2px solid ${borderColor}`, p: 2 }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            margin: "1rem 0",
            padding: "0 1rem",
          }}
          gap={5}
        >
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ minWidth: 400, 

              }}
            >
              <Typography fontSize={13} sx={{ minWidth: "100px" }}>
                Course:{" "}
              </Typography>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Course</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCourse}
                  style={{ width: "620px" }}
                  label="Course"
                  onChange={handleSelectCourseChange}
                >
                  {(!courseAssignedTo || courseAssignedTo.length === 0) ? (
                    <MenuItem disabled>No Course Assigned this Academic Year</MenuItem>
                  ) : filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <MenuItem key={course.course_id} value={course.course_id}>
                        {course.course_code} - {course.course_description}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No Course Assigned this Academic Year</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Box>
            <Box
              display="flex"
              gap={2}
              sx={{ marginTop: "1rem" }}
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ minWidth: 400 }}
              >
                <Typography fontSize={13} sx={{ minWidth: "100px" }}>
                  Section
                </Typography>
                <FormControl fullWidth style={{ width: "300px" }}>
                  <InputLabel id="section-select-label">Section</InputLabel>
                  <Select
                    labelId="section-select-label"
                    id="section-select"
                    label='Section'
                    value={selectedSection}
                    onChange={(e) => {
                      setSelectedSection(e.target.value);
                      handleFetchStudents(e.target.value);
                    }}
                  >
                    {!selectedCourse ? (
                      <MenuItem disabled>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontStyle: "italic",
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          Please select a course first
                        </Typography>
                      </MenuItem>
                    ) : sectionAssignedTo.length > 0 ? (
                      sectionAssignedTo.map((section) => (
                        <MenuItem key={section.department_section_id} value={section.department_section_id}>
                          {section.program_code}-{section.section_description}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontStyle: "italic", textAlign: "center" }}
                        >
                          No sections available for this course
                        </Typography>
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                gap={1}
                sx={{ minWidth: 200, marginRight: "1rem" }}
              >
                <Typography fontSize={13} sx={{ minWidth: "100px" }}>
                  Student Status:
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={selectedStatusFilter}
                    style={{ width: "200px" }}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Regular">Regular</MenuItem>
                    <MenuItem value="Irregular">Irregular</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ minWidth: "350px" }}
          >
            <Box sx={{
              display: "flex",
              gap: 2,
              minWidth: "100px",
            }}>

            </Box>
          </Box>
        </Box>
      </TableContainer>
      <TableContainer
        component={Paper}
        sx={{ width: "98%", marginTop: "2rem" }}
      >
        <Table size="small">
          <TableHead
            sx={{ backgroundColor: settings?.header_color || "#1976d2" }}
          >
            <TableRow>
              <TableCell
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                #
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Student Number
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Student Name
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Section
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Student Status
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Class Schedule
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  textAlign: "center",
                  fontSize: "12px",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Room
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedList.length > 0 ? (
              groupedList.map((student, index) => (
                <TableRow key={student.student_number}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      border: `2px solid ${borderColor}`,
                    }}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      border: `2px solid ${borderColor}`,
                    }}
                  >
                    {student.student_number}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: `2px solid ${borderColor}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: mainButtonColor,
                        textDecoration: "underline",
                      },
                    }}
                    onClick={() =>
                      navigate("/grading_sheet", {
                        state: {
                          course_id: selectedCourse,
                          section_id: selectedSection,
                          school_year_id: selectedSchoolYear,
                          departmentSection: department_section_id,
                        },
                      })
                    }
                  >
                    {student.last_name}, {student.first_name}{" "}
                    {student.middle_name}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      border: `2px solid ${borderColor}`,
                    }}
                  >
                    {student.program_code}-{student.section_description}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      border: `2px solid ${borderColor}`,
                    }}
                  >
                    {student.status === 1 ? "Regular" : "Irregular"}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      border: `2px solid ${borderColor}`,
                    }}
                  >
                    {student.schedules.map((sch, i) => (
                      <div key={i}>
                        {sch.day} {sch.start} - {sch.end}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      border: `2px solid ${borderColor}`,
                    }}
                  >
                    {[...new Set(student.schedules.map((sch) => sch.room))].map((room, i) => (
                      <div key={i}>{room}</div>
                    ))}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ border: `2px solid ${borderColor}` }}
                >
                  No class details available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ display: "none" }}>
        <div ref={divToPrintRef} style={{ margin: "0.5in" }}>
          <style>
            {`
              @media print {
                body {
                  margin: 0.5in;
                }
                table {
                  page-break-inside: auto;
                }
                tr {
                  page-break-inside: avoid;
                  page-break-after: auto;
                }
                  
              }
            `}
          </style>
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            {/* Logo */}
            <div>

              <img
                src={fetchedLogo}
                alt="Logo"
                style={{ width: "80px", height: "80px", objectFit: "contain", marginTop: "-10px" }}
              />

            </div>

            {/* School Info */}
            <div style={{ textAlign: "center", flex: 1, marginLeft: "10px", marginRight: "10px" }}>
              <span style={{ margin: 0, fontSize: "12px" }}>Republic of the Philippines</span>
              <h2 style={{ margin: 0, fontSize: "20px", letterSpacing: "-1px" }}>{companyName}</h2>
              <span style={{ margin: 0, fontSize: "12px" }}>{campusAddress || "Nagtahan St. Sampaloc, Manila"}</span>
            </div>

            {/* Empty space or right-aligned info */}
            <div style={{ width: "80px" }}></div>
          </div>

          {/* Document Title */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", lineSpacing: "-1px" }}>
            <span style={{ fontSize: "20px" }}><b>{groupedList[0]?.course_description.toUpperCase() || ""}</b></span>
            <span style={{ fontSize: "15px" }}>{groupedList[0]?.dprtmnt_name || ""}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", lineSpacing: "-1px", marginTop: "2rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "20px" }}><b>OFFICIAL LIST OF ENROLLED STUDENTS</b></span>
            <div style={{ display: "flex", alignItems: "end", justifyContent: "center" }}>
              <span style={{ marginRight: "0.5rem", fontSize: "15px" }}>Academic Year</span>
              <span style={{ fontSize: "15px" }}>
                {groupedList[0]?.current_year || ""}-
                {groupedList[0]?.next_year || ""},&nbsp;&nbsp;

                {groupedList[0]?.semester_description || ""}
              </span>
            </div>
          </div>

          {/* School Info Table */}
          <table style={{ borderCollapse: "collapse", fontSize: "12px", lineHeight: "1", padding: 0 }}>
            <thead>
              {/* spacer row to remove double borders */}
              <tr>
                <td colSpan={1} style={{ width: "80px", borderRight: "none", borderBottom: "none" }}></td>
                <td colSpan={5} style={{ borderRight: "none", borderBottom: "none" }}></td>
                <td colSpan={1} style={{ borderLeft: "none", borderBottom: "none" }}></td>
                <td colSpan={2} style={{ borderLeft: "none", borderBottom: "none" }}></td>
              </tr>

              {/* Subject Code + Class Section */}
              <tr>
                <td colSpan={1} style={{ width: "80px", borderTop: "none", padding: "0px 2px" }}>Subject Code:</td>
                <td colSpan={5} style={{ borderRight: "none", borderTop: "none", padding: "0px 2px" }}>
                  {groupedList[0]?.course_code || ""}
                </td>

                <td colSpan={1} style={{ borderLeft: "none", borderTop: "none", padding: "0px 2px" }}>
                  <div style={{ display: "flex", justifyContent: "end" }}>Class Section:</div>
                </td>

                <td colSpan={2} style={{ borderTop: "none", padding: "0px 2px" }}>
                  {groupedList[0]?.program_code || ""}-{groupedList[0]?.section_description || ""}
                </td>
              </tr>

              {/* Subject Title + Year Level */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Subject Title:</td>

                <td colSpan={5} style={{ borderRight: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {groupedList[0]?.course_description || ""}
                </td>

                <td colSpan={1} style={{ borderLeft: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "end" }}>Year Level:</div>
                </td>

                <td colSpan={2} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {groupedList[0]?.year_level_description || ""}
                </td>
              </tr>

              {/* Academic Units + Lab Units + Schedule */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Academic Units:</td>

                <td colSpan={1} style={{ paddingRight: "2px", textAlign: "center", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {groupedList[0]?.course_unit || "0"}
                </td>

                <td colSpan={1} style={{ width: "80px", borderLeft: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Lab Units:</td>

                <td colSpan={1} style={{ paddingRight: "2px", textAlign: "center", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {groupedList[0]?.lab_unit || "0"}
                </td>

                <td colSpan={3} style={{ borderLeft: "none", borderTop: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "end" }}>Schedule:</div>
                </td>
                <td colSpan={2} style={{ paddingRight: "2px", paddingLeft: "2px", borderBottom: "none", paddingBottom: "1px", paddingTop: "6px" }}>
                  {groupedList.length > 0 ? (
                    groupedList.map((student, index) => (
                      <div key={index}>
                        {student.schedules.map((sch, i) => (
                          <div key={i}>
                            {sch.day} {sch.start} - {sch.end}
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div>TBA</div>
                  )}
                </td>
              </tr>

              {/* Credit Units + Lab Units */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Credit Units:</td>

                <td colSpan={1} style={{ paddingRight: "2px", textAlign: "center", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {groupedList[0]?.course_unit || "0"}
                </td>

                <td colSpan={1} style={{ width: "80px", borderLeft: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Lab Units:</td>

                <td colSpan={1} style={{ paddingRight: "2px", textAlign: "center", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {groupedList[0]?.lab_unit || "0"}
                </td>

                <td colSpan={3} style={{ borderLeft: "none", borderTop: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "end" }}></div>
                </td>
                <td colSpan={2} rowSpan={4} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", borderTop: "none", paddingTop: "6px" }}>
                </td>
              </tr>

              {/* Mode */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", borderTop: "none", paddingTop: "6px" }}>Mode:</td>
                <td colSpan={6} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", borderTop: "none", paddingTop: "6px" }}></td>
              </tr>

              {/* Faculty */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", borderTop: "none", paddingTop: "6px" }}>Faculty:</td>
                <td colSpan={6} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", borderTop: "none", paddingTop: "6px" }}>{profData.fname} {profData.mname} {profData.lname}</td>
              </tr>
            </thead>
          </table>

          {/* Students Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginTop: "0.5rem" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "6px 0px", width: "30px", textAlign: "center" }}>#</th>
                <th style={{ border: "1px solid black", padding: "6px 0px", width: "80px", textAlign: "center" }}>Student No.</th>
                <th style={{ border: "1px solid black", padding: "6px", width: "280px", textAlign: "start" }}>Student Name</th>
                <th style={{ border: "1px solid black", padding: "6px 0px", width: "50px", textAlign: "center" }}>Age</th>
                <th style={{ border: "1px solid black", padding: "6px 0px", width: "50px", textAlign: "center" }}>Sex</th>
                <th style={{ border: "1px solid black", padding: "6px 0px", width: "80px", textAlign: "center" }}>Year Level</th>
                <th style={{ border: "1px solid black", padding: "6px 0px", width: "80px", textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {groupedList.length > 0 ? (
                groupedList.map((s, index) => (
                  <tr key={s.student_number}>
                    <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{s.student_number}</td>
                    <td style={{ border: "1px solid black", padding: "6px" }}>{`${s.last_name}, ${s.first_name} ${s.middle_name || ""}`}</td>
                    <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{s.age}</td>
                    <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{s.gender === 0 ? "Male" : "Female"}</td>
                    <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{s.year_level_description}</td>
                    <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{Number(s.status) === 1 ? "Regular" : "Irregular"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                    No class details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </Box>
  );
};

export default FacultyMasterList;
