import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import '../styles/TempStyles.css';
import axios from 'axios';
import { FaFileExcel } from "react-icons/fa";
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TextField, Button, FormControl, Select, InputLabel, MenuItem, Box, Typography, Paper, Snackbar, Alert} from "@mui/material";
import API_BASE_URL from "../apiConfig";
const GradingSheet = () => {

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
  const [message, setMessage] = useState("No Student Found");
  const [students, setStudents] = useState([]);
  const [activeButton, setActiveButton] = useState(null);
  const [profData, setPerson] = useState({
    prof_id: "",
    fname: "",
    mname: "",
    lname: "",
  });
  const [sectionsHandle, setSectionsHandle] = useState([]);
  const [courseAssignedTo, setCoursesAssignedTo] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
  const [schoolSemester, setSchoolSemester] = useState([]);
  const [selectedSchoolSemester, setSelectedSchoolSemester] = useState('');
  const [selectedActiveSchoolYear, setSelectedActiveSchoolYear] = useState('');
  const [selectedSectionID, setSelectedSectionID] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc");
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'info' });
  const filteredStudents = students;
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
        .then((res) => setCoursesAssignedTo(res.data))
        .catch((err) => console.error(err));
    }
  }, [userID]);

  useEffect(() => {
    if (userID && selectedCourse && selectedActiveSchoolYear) {
      axios
        .get(`${API_BASE_URL}/handle_section_of/${userID}/${selectedCourse}/${selectedActiveSchoolYear}`)
        .then((res) => setSectionsHandle(res.data))
        .catch((err) => console.error(err));
    }
  }, [userID, selectedCourse, selectedActiveSchoolYear]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/get_school_year/`)
      .then((res) => setSchoolYears(res.data))
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
        .get(`${API_BASE_URL}/get_selecterd_year/${selectedSchoolYear}/${selectedSchoolSemester}`)
        .then((res) => {
          if (res.data.length > 0) {
            setSelectedActiveSchoolYear(res.data[0].school_year_id);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectedSchoolYear, selectedSchoolSemester]);

  const handleFetchStudents = async (department_section_id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/enrolled_student_list/${userID}/${selectedCourse}/${department_section_id}`
      );
      const data = await response.json();

      if (response.ok) {
        if (data.length === 0) {
          setStudents([]);
          setMessage("There are no currently enrolled students in this subject and section");
        } else {
          const studentsWithSubject = data.map((student) => ({
            ...student,
            selectedCourse,
            department_section_id,
          }));

          setStudents(studentsWithSubject);
          setMessage("");
        }
      } else {
        // 🚨 Use backend error message if available
        setStudents([]);
        setMessage(data.message || "Failed to fetch students.");
      }
    } catch (error) {
      setLoading(false);
      setMessage("Fetch error");
    }
  };

  const handleChanges = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;

    console.log(updatedStudents);
    if (field === "midterm" || field === "finals") {
      let midterm = parseFloat(updatedStudents[index].midterm);
      let finals = parseFloat(updatedStudents[index].finals);

      if (!isNaN(midterm)) midterm = parseFloat(midterm.toFixed(2));
      if (!isNaN(finals)) finals = parseFloat(finals.toFixed(2));

      const finalGrade = finalGradeCalc(updatedStudents[index].midterm, updatedStudents[index].finals);
      console.log(midterm, finals, finalGrade)
      updatedStudents[index].final_grade = finalGrade;

      if (midterm === 5.00 || finals === 5.00) {
        updatedStudents[index].en_remarks = 2; 
      } else if (String(midterm).toLowerCase() === "inc" || String(finals).toLowerCase() === "inc") {
        updatedStudents[index].en_remarks = 3;
      } else if (finalGrade === 0.00 || finals < 1.00 || midterm < 1.00 || isNaN(midterm) || isNaN(finals)) {
        updatedStudents[index].en_remarks = 0;
      } else if (finalGrade >= 1.00 && finalGrade <= 3.00) {
        updatedStudents[index].en_remarks = 1;
      } else if (finalGrade >= 3.25) {
        updatedStudents[index].en_remarks = 2;
      } else {
        updatedStudents[index].en_remarks = 3;
      }
    }

    setStudents(updatedStudents);
  }

  const addStudentInfo = async (student) => {
    try {
      const response = await fetch(`${API_BASE_URL}/add_grades`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          midterm: student.midterm,
          finals: student.finals,
          final_grade: student.final_grade,
          en_remarks: student.en_remarks,
          student_number: student.student_number,
          subject_id: selectedCourse,
        })
      });

      if (response.ok) {
        setLoading(false);
        try {
          const page_name = "Grading Sheet";
          const fullName = `${profData.lname}, ${profData.fname} ${profData.mname}`;
          const type = "submit"
    
          await axios.post(`${API_BASE_URL}/insert-logs/faculty/${profData.prof_id}`, {
            message: `User #${profData.prof_id} - ${fullName} successfully submit the student grades in ${page_name}`, type: type,
          });
    
        } catch (err) {
          console.error("Error inserting audit log");
        }

        setSnack({
          open: true,
          message: "Grades saved successfully!",
          severity: "success",
        });
      } else {
        setLoading(false);
        setSnack({
          open: true,
          message: "Failed to saved grades!",
          severity: "error",
        });
      }
    } catch (error) {
      setLoading(false);
    }
  }

  const remarkConversion = (student) => {
    if (student.en_remarks == 0) {
      return "ONGOING";
    } else if (student.en_remarks == 1) {
      return "PASSED";
    } else if (student.en_remarks == 2) {
      return "FAILED";
    } else if (student.en_remarks == 3) {
      return "INCOMPLETE";
    } else if (student.en_remarks == 4) {
      return "DROP";
    } else {
      console.log("Error in Remark Conversion")
    }
  };

  const finalGradeCalc = (midterm, finals) => {
    if ( String(midterm).toLowerCase() === "inc" || String(finals).toLowerCase() === "inc") {
      return "INC";
    }

    const midtermScore = parseFloat(midterm);
    const finalScore = parseFloat(finals);

    if (isNaN(midtermScore) || isNaN(finalScore)) {
      return "Invalid input";
    } 
    
    const finalGrade = (midtermScore + finalScore) / 2;
    return finalGrade.toFixed(2);
  };

  const handleSelectCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleSchoolYearChange = (event) => {
    setSelectedSchoolYear(event.target.value);
  };

  const handleSchoolSemesterChange = (event) => {
    setSelectedSchoolSemester(event.target.value);
  };

  const handleSnackClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setSnack(prev => ({ ...prev, open: false }));
  };


  const handleImport = async () => {
    try {
      if (!selectedFile) {
        setSnack({
          open: true,
          message: "Please choose a file first!",
          severity: "warning",
        });
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("course_id", selectedCourse);
      formData.append("active_school_year_id", selectedActiveSchoolYear);
      formData.append("department_section_id", selectedSectionID);


      const res = await axios.post(`${API_BASE_URL}/api/grades/import`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        try {
          const page_name = "Grading Sheet";
          const fullName = `${profData.lname}, ${profData.fname} ${profData.mname}`;
          const type = "upload"
    
          await axios.post(`${API_BASE_URL}/insert-logs/faculty/${profData.prof_id}`, {
            message: `User #${profData.prof_id} - ${fullName} successfully upload file in ${page_name}`, type: type,
          });
    
        } catch (err) {
          console.error("Error inserting audit log");
        }

        setSnack({
          open: true,
          message: res.data.message || "Excel imported successfully!",
          severity: "success",
        });
        setSelectedFile(null);

        // ✅ refresh enrolled student list
        if (sectionsHandle.length > 0) {
          handleFetchStudents(sectionsHandle[0].department_section_id);
        }
      } else {
        try {
          const page_name = "Grading Sheet";
          const fullName = `${profData.lname}, ${profData.fname} ${profData.mname}`;
          const type = "upload"
    
          await axios.post(`${API_BASE_URL}/insert-logs/faculty/${profData.prof_id}`, {
            message: `User #${profData.prof_id} - ${fullName} tried to upload file in ${page_name}`, type: type,
          });
    
        } catch (err) {
          console.error("Error inserting audit log");
        }
        setSnack({
          open: true,
          message: res.data.error || "Failed to import",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Import Error");
      try {
        const page_name = "Grading Sheet";
        const fullName = `${profData.lname}, ${profData.fname} ${profData.mname}`;
        const type = "upload"
  
        await axios.post(`${API_BASE_URL}/insert-logs/faculty/${profData.prof_id}`, {
          message: `User #${profData.prof_id} - ${fullName} failed to upload file in ${page_name}`, type: type,
        });
  
      } catch (err) {
        console.error("Error inserting audit log");
      }
      setSnack({
        open: true,
        message: "Import failed: " + (err.response?.data?.error || err.message),
        severity: "error",
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const totalPages = Math.ceil(students.length / itemsPerPage);

  const paginatedStudents = students.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sorted = [...students].sort((a, b) => {
      const nameA = a.last_name.toLowerCase();
      const nameB = b.last_name.toLowerCase();

      return newOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });

    setStudents(sorted);
  };

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
    <Box sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto', overflowX: 'hidden', pr: 1, marginRight: "3rem" }}>

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
         GRADING SHEET
        </Typography>




      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      <br />

      <TableContainer component={Paper} sx={{ width: '100%', }}>
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
                      onClick={handleSort}
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

      <TableContainer component={Paper} sx={{ width: '100%', border: `2px solid ${borderColor}`, p: 2, marginRight: "4rem" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "2rem", alignItems: "center", justifyContent: 'space-between' }}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 500 }}>
              <Typography fontSize={13} sx={{ minWidth: "100px" }}>Course: </Typography>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Course</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCourse}
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
            <Box display="flex" alignItems="center">
              <Typography fontSize={13} sx={{ minWidth: "109px" }}>Section: </Typography>
              {!selectedCourse ? (
                <Typography variant="body1" color="text.secondary" sx={{ width: "100%", fontStyle: "italic", border: "rgba(0,0,0,0.2) 1px solid", marginTop: "1rem", padding: "2rem", textAlign: "center", borderRadius: '5px' }}>
                  Please select a course first
                </Typography>
              ) : (
                <div className="temp-container" style={{ marginTop: "2rem" }}>
                  {sectionsHandle.length > 0 ? (
                    sectionsHandle.map((section) => (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: mainButtonColor,
                          mb: 2,
                          mr: 2,
                          height: "45px",
                          width: "180px",
                          "&:hover": { backgroundColor: "#800000" },
                        }}
                        onClick={() => {
                          setSelectedSectionID(section.department_section_id);
                          handleFetchStudents(section.department_section_id);
                        }}
                        key={section.department_section_id}
                      >
                        {section.program_code}-{section.section_description}
                      </Button>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", border: "rgba(0,0,0,0.2) 1px solid", marginTop: "1rem", padding: "2rem", textAlign: "center", borderRadius: '5px' }}>
                      No sections available for this course
                    </Typography>
                  )}
                </div>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", flexWrap: "wrap", gap: "1rem" }}>

            <Typography fontSize={13} sx={{ minWidth: "100%", border: "maroon 1px solid", padding: "3px", color: "maroon", textAlign: "center" }}>
              {selectedFile ? `SELECTED FILE: ${selectedFile.name}` : "Choose Excel File to Upload"}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "0.5rem" }}>
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
                    width: "230px", // ✅ same width as Print
                  }}
                  type="button"
                >
                  <FaFileExcel size={20} />
                  Choose Excel
                </button>
              </Box>
              <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 200 }}>
                <Button variant="contained" fullWidth sx={{ height: '50px', backgroundColor: mainButtonColor }} onClick={handleImport}>
                  Upload
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <Box display="flex" alignItems="center" gap={1} >
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">School Years</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedSchoolYear}
                    label="School Years"
                    sx={{ minWidth: '230px' }}
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
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">School Semester</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedSchoolSemester}
                    label="School Semester"
                    sx={{ minWidth: '200px' }}
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
        </Box>
      </TableContainer>

      <TableContainer component={Paper} sx={{ width: "100%", marginTop: "2rem" }}>
        <Table size="small">
          {/* Header */}
          <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>#</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Student Number</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Name</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Section</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Midterm</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Finals</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Final Grade</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Remarks</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Action</TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {message ? (
              <TableRow>
                <TableCell colSpan={9} sx={{ textAlign: "center", padding: "1rem", border: "1px solid gray" }}>
                  {message}
                </TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>{student.student_number}</TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    {student.last_name}, {student.first_name} {student.middle_name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {student.program_code}-{student.section_description}
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    <input
                      type="text"
                      value={student.midterm}
                      onChange={(e) => handleChanges(index, "midterm", e.target.value)}
                      style={{
                        border: "none",
                        textAlign: "center",
                        background: "none",
                        outline: "none",
                        width: "100%",
                        fontFamily: "Poppins",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    <input
                      type="text"
                      value={student.finals}
                      onChange={(e) => handleChanges(index, "finals", e.target.value)}
                      style={{
                        border: "none",
                        textAlign: "center",
                        background: "none",
                        outline: "none",
                        width: "100%",
                        fontFamily: "Poppins",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    <input
                      type="text"
                      value={finalGradeCalc(student.midterm, student.finals)}
                      readOnly
                      style={{
                        border: "none",
                        textAlign: "center",
                        background: "none",
                        outline: "none",
                        width: "100%",
                        fontFamily: "Poppins",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    <select
                      name="en_remarks"
                      value={student.en_remarks}
                      onChange={(e) => handleChanges(index, "en_remarks", parseInt(e.target.value))}
                      className="w-full outline-none"
                    >
                      <option value="">{remarkConversion(student)}</option>
                      <option value="0">ONGOING</option>
                      <option value="4">DROP</option>
                      <option value="1">PASSED</option>
                      <option value="2">FAILED</option>
                      <option value="3">INCOMPLETE</option>
                    </select>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    <Button sx={{
                      height: "40px",
                      width: "200px", // ✅ matches Print
                      backgroundColor: mainButtonColor,
                      "&:hover": { backgroundColor: "" },
                      color: "white"
                    }}
                      onClick={() => addStudentInfo(student)}>
                      Save
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} onClose={handleSnackClose} sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GradingSheet;
