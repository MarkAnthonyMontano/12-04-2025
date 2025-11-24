import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import '../styles/TempStyles.css';
import { Link } from "react-router-dom";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, FormControl, Select, InputLabel, MenuItem, Button } from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
const FacultyMasterList = () => {

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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [profData, setPerson] = useState({
    prof_id: '',
    fname: '',
    mname: '',
    lname: ''
  });
  const [schoolYears, setSchoolYears] = useState([]);
  const [schoolSemester, setSchoolSemester] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [selectedSchoolSemester, setSelectedSchoolSemester] = useState('');
  const [selectedActiveSchoolYear, setSelectedActiveSchoolYear] = useState('');
  const [classListAndDetails, setClassListAndDetails] = useState([]);
  const [courseAssignedTo, setCoursesAssignedTo] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sectionAssignedTo, setSectionAssignedTo] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
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
      const res = await axios.get(`${API_BASE_URL}/get_prof_data/${id}`)
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
  }

  useEffect(() => {
    if (userID) {
      axios
        .get(`${API_BASE_URL}/course_assigned_to/${userID}`)
        .then((res) => {
          setCoursesAssignedTo(res.data);
          if (res.data.length > 0) {
            setSelectedCourse(res.data[0].course_id); // ✅ Auto-select first course
          }
        })
        .catch((err) => console.error(err));
    }
  }, [userID]);

  useEffect(() => {
    if (userID) {
      axios
        .get(`${API_BASE_URL}/api/section_assigned_to/${userID}`)
        .then((res) => {
          setSectionAssignedTo(res.data);
          if (res.data.length > 0) {
            setSelectedSection(res.data[0].section_id); // ✅ Auto-select first section
          }
        })
        .catch((err) => console.error(err));
    }
  }, [userID]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/get_school_year/`)
      .then((res) => setSchoolYears(res.data))
      .catch((err) => console.error(err));
  }, [])

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/get_school_semester/`)
      .then((res) => setSchoolSemester(res.data))
      .catch((err) => console.error(err));
  }, [])

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
        .get(`${API_BASE_URL}/get_selecterd_year/${selectedSchoolYear}/${selectedSchoolSemester}`)
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

  const filteredStudents = classListAndDetails
    .filter((s) => {
      const matchesYear =
        selectedSchoolYear === "" || String(s.year_id) === String(selectedSchoolYear);

      const matchesSemester =
        selectedSchoolSemester === "" || String(s.semester_id) === String(selectedSchoolSemester);

      const matchesCourse =
        selectedCourse === "" || String(s.course_id) === String(selectedCourse);

      const matchesSection =
        selectedSection === "" || String(s.department_section_id) === String(selectedSection);

      const matchesStatus =
        selectedStatusFilter === "" ||
        (selectedStatusFilter === "Regular" && Number(s.status) === 1) ||
        (selectedStatusFilter === "Irregular" && Number(s.status) !== 1);

      return matchesYear && matchesSemester && matchesCourse && matchesSection && matchesStatus;
    })
    .sort((a, b) => {
      const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
      const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();

      if (sortOrder === "asc") {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          CLASS LIST
        </Typography>




      </Box>
      <hr style={{ border: "1px solid #ccc", width: "95%" }} />

      <br />

      <TableContainer component={Paper} sx={{ width: '95%', }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#6D2323', color: "white" }}>
            <TableRow>
              <TableCell colSpan={10} sx={{ border: `2px solid ${borderColor}`, py: 0.5, backgroundColor: settings?.header_color || "#1976d2", color: "white" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  {/* Left: Total Count */}
                  <Typography fontSize="14px" fontWeight="bold" color="white">
                    Total Students: {filteredStudents.length}
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
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-disabled': {
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          opacity: 1,
                        }
                      }}
                    >
                      First
                    </Button>

                    <Button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 80,
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-disabled': {
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          opacity: 1,
                        }
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
                          fontSize: '12px',
                          height: 36,
                          color: 'white',
                          border: '1px solid white',
                          backgroundColor: 'transparent',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white',
                          },
                          '& svg': {
                            color: 'white', // dropdown arrow icon color
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              maxHeight: 200,
                              backgroundColor: '#fff', // dropdown background
                            }
                          }
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
                      {totalPages} page{totalPages > 1 ? 's' : ''}
                    </Typography>

                    <Button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 80,
                        color: "white",
                        borderColor: "white",
                        backgroundColor: "transparent",
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-disabled': {
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          opacity: 1,
                        }
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
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        },
                        '&.Mui-disabled': {
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          opacity: 1,
                        }
                      }}
                    >
                      Last
                    </Button>
                    <Button
                      onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
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
                      Sort: {sortOrder === "asc" ? "A–Z" : "Z–A"}
                    </Button>
                  </Box>
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <TableContainer component={Paper} sx={{ width: '95%', border: `2px solid ${borderColor}`, p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", margin: "1rem 0", padding: "0 1rem", }} gap={5}>
          <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 500, marginRight: "1rem" }}>
              <Typography fontSize={13} sx={{ minWidth: "100px" }}>Course: </Typography>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Course</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCourse}
                  style={{ width: "600px" }}
                  label="Course"
                  onChange={handleSelectCourseChange}
                >
                  {courseAssignedTo.length > 0 ? (
                    courseAssignedTo.map((course) => (
                      <MenuItem value={course.course_id} key={course.course_id}>
                        {course.course_description} ({course.course_code})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No courses assigned</MenuItem>
                  )
                  }
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" gap={2} sx={{ marginTop: "1rem", marginRight:"50px" }}>
              <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 550, }}>
                <Typography fontSize={13} sx={{ minWidth: "100px" }}>Section</Typography>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Section</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"

                    style={{ width: "300px" }}
                    value={selectedSection}
                    label="Course"
                    onChange={handleSelectSectionChange}
                  >
                    {sectionAssignedTo.length > 0 ? (
                      sectionAssignedTo.map((section) => (
                        <MenuItem value={section.section_id} key={section.section_id}>
                          {section.program_code}-{section.section_description}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No section assigned</MenuItem>
                    )
                    }
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 200, marginRight: "1rem" }}>
                <Typography fontSize={13} sx={{ minWidth: "100px" }}>Student Status:</Typography>
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
          <Box display="flex" flexDirection="column" gap={2} sx={{ minWidth: "450px" }}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontSize={13} sx={{ minWidth: "100px" }}>School Year:</Typography>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">School Years</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  style={{ width: "200px" }}
                  value={selectedSchoolYear}
                  label="School Years"
                  onChange={handleSchoolYearChange}
                >
                  {schoolYears.length > 0 ? (
                    schoolYears.map((sy) => (
                      <MenuItem value={sy.year_id} key={sy.year_id}>
                        {sy.current_year} - {sy.next_year}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>School Year is not found</MenuItem>
                  )
                  }
                </Select>
              </FormControl>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography fontSize={13} sx={{ minWidth: "100px" }}>Semester: </Typography>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">School Semester</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                    style={{width: "200px", }}
                  value={selectedSchoolSemester}
                  label="School Semester"
                  onChange={handleSchoolSemesterChange}
                >
                  {schoolSemester.length > 0 ? (
                    schoolSemester.map((sem) => (
                      <MenuItem value={sem.semester_id} key={sem.semester_id}>
                        {sem.semester_description}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>School Semester is not found</MenuItem>
                  )
                  }
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </TableContainer>
      <TableContainer component={Paper} sx={{ width: "95%", marginTop: "2rem" }}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>#</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Student Number</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Student Name</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Section</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Student Status</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Class Schedule</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Room</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student, index) => (
                <TableRow key={student.student_number}>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {student.student_number}
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    {student.last_name}, {student.first_name} {student.middle_name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {student.program_code}-{student.section_description}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {student.status === 1 ? "Regular" : "Irregular"}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {student.day} {student.school_time_start} - {student.school_time_end}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {student.room_description}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ border: `2px solid ${borderColor}` }}>
                  No class details available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default FacultyMasterList;


