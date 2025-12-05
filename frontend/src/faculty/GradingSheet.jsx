import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import '../styles/TempStyles.css';
import axios from 'axios';
import { FaFileExcel } from "react-icons/fa";
import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver"
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TextField, Button, FormControl, Select, InputLabel, MenuItem, Box, Typography, Paper, Snackbar, Alert, Autocomplete } from "@mui/material";
import API_BASE_URL from "../apiConfig";
import { useLocation } from "react-router-dom";
import { FcPrint } from "react-icons/fc";
import SearchIcon from "@mui/icons-material/Search";

const GradingSheet = () => {
  const settings = useContext(SettingsContext);
  const location = useLocation();
  const { course_id, section_id, school_year_id } = location.state || {};
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
  const itemsPerPage = 10;

  useEffect(() => {
    if (course_id) setSelectedCourse(course_id);
    if (section_id) setSelectedSectionID(section_id);
    if (section_id) handleFetchStudents(section_id);
    if (school_year_id) setSelectedActiveSchoolYear(school_year_id);
  }, [course_id, section_id, school_year_id]);

  useEffect(() => {
    if (selectedCourse && selectedSectionID && selectedActiveSchoolYear) {
      handleFetchStudents(selectedSectionID);
    }
  }, [selectedCourse, selectedSectionID, selectedActiveSchoolYear]);

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
    if (!selectedActiveSchoolYear) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/enrolled_student_list/${userID}/${selectedCourse}/${department_section_id}/${selectedActiveSchoolYear}`
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
  
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStudents = students
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();

      return (
        s.student_number?.toString().includes(q) ||
        s.first_name?.toLowerCase().includes(q) ||
        s.middle_name?.toLowerCase().includes(q) ||
        s.last_name?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (!searchQuery) return 0;
      const q = searchQuery.toLowerCase();

      const aMatch =
        a.student_number?.toString().includes(q) ||
        a.first_name?.toLowerCase().includes(q) ||
        a.middle_name?.toLowerCase().includes(q) ||
        a.last_name?.toLowerCase().includes(q);

      const bMatch =
        b.student_number?.toString().includes(q) ||
        b.first_name?.toLowerCase().includes(q) ||
        b.middle_name?.toLowerCase().includes(q) ||
        b.last_name?.toLowerCase().includes(q);

      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    })

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
    setSectionsHandle(sections);

    if (sections.length === 0) {
      setStudents([]);
      setSnack({ open: true, message: "No sections found for this course.", severity: "info" });
      return;
    }

    // 4️⃣ Choose first section if none selected
    const sectionId = selectedSectionID || sections[0].department_section_id;
    setSelectedSectionID(sectionId);

    // 5️⃣ Fetch students for this section
    handleFetchStudents(sectionId);

  } catch (err) {
    console.error("Error fetching past class data:", err);
    setSnack({ open: true, message: "Failed to fetch data.", severity: "error" });
  }
};

  const gradeStats = filteredStudents.reduce(
    (acc, student) => {
      switch (student.en_remarks) {
        case 0:
          acc.noGrade += 1;
          break;
        case 1:
          acc.passed += 1;
          break;
        case 2:
          acc.failed += 1;
          break;
        case 3:
          acc.incomplete += 1;
          break;
        case 4:
          acc.drop += 1;
          break;
        default:
          break;
      }
      return acc;
    },
    { noGrade: 0, passed: 0, failed: 0, incomplete: 0, drop: 0 }
  );

  const gradeOptions = [
    ...Array.from({ length: 41 }, (_, i) => (100 - i).toString()), // "100" -> "60"
    "INC",
    "DRP",
  ];

  const hasGrades = students?.some(s => {
    const mid = Number(s.midterm);
    const fin = Number(s.finals);

    return (
      !isNaN(mid) && mid !== 0 &&
      !isNaN(fin) && fin !== 0
    );
  });

  const exportToExcel = () => {
    if (!students || students.length === 0) {
      setSnack({
        open: true,
        message: "No Students .",
        severity: "error",
      });
      return;
    }

    // 1. Prepare Dynamic Data
    // We grab the course info from the first student record to build the Title
    const firstRecord = students[0];
    const program = firstRecord.program_code || "PROGRAM"; // e.g., BSINFOTECH
    const section = firstRecord.section_description || "SECTION"; // e.g., 1A
    const sheetTitle = `${program} - ${section} GRADING SHEET`;

    // 2. Create Workbook and Worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([]);

    // ---------------------------------------------------------
    // DEFINE STYLES
    // ---------------------------------------------------------
    const styles = {
      title: {
        font: { bold: true, sz: 14, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "333333" } }, // Dark Grey Background
        alignment: { horizontal: "center", vertical: "center" }
      },
      header: {
        font: { bold: true, sz: 11 },
        fill: { fgColor: { rgb: "F2F2F2" } }, // Light Beige/Grey
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" }, bottom: { style: "thin" },
          left: { style: "thin" }, right: { style: "thin" }
        }
      },
      cellCenter: {
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" }, bottom: { style: "thin" },
          left: { style: "thin" }, right: { style: "thin" }
        }
      },
      cellLeft: {
        alignment: { horizontal: "left", vertical: "center" },
        border: {
          top: { style: "thin" }, bottom: { style: "thin" },
          left: { style: "thin" }, right: { style: "thin" }
        }
      }
    };

    // ---------------------------------------------------------
    // BUILD ROWS
    // ---------------------------------------------------------
    
    // Row 1: Main Title
    XLSX.utils.sheet_add_aoa(ws, [[sheetTitle]], { origin: "A1" });

    // Row 2: (Empty - handled by merge below to make title taller)
    
    // Row 3: Headers
    const headers = [["#", "Student Number", "Student Name", "Midterm", "Finals"]];
    XLSX.utils.sheet_add_aoa(ws, headers, { origin: "A3" });

    // Row 4+: Student Data
    // Map your SQL data to the Excel structure
    const dataRows = students.map((s, index) => [
      index + 1,                                       // #
      s.student_number,                                // Student Number
      `${s.last_name}, ${s.first_name} ${s.middle_name || ""}`.trim(), // Name
      s.midterm || "",                                 // Midterm
      s.finals || ""                                   // Finals
    ]);

    XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: "A4" });

    // ---------------------------------------------------------
    // MERGES & COLUMNS
    // ---------------------------------------------------------
    
    // Merge A1:E2 for the big Title Bar
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: 4 } } 
    ];

    // Set Column Widths
    ws["!cols"] = [
      { wch: 5 },  // A: #
      { wch: 15 }, // B: Student Number
      { wch: 40 }, // C: Name (Wide)
      { wch: 10 }, // D: Midterm
      { wch: 10 }  // E: Finals
    ];

    // ---------------------------------------------------------
    // APPLY STYLES TO CELLS
    // ---------------------------------------------------------
    
    // 1. Apply Title Style (A1:E2)
    for (let r = 0; r <= 1; r++) {
      for (let c = 0; c <= 4; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        if (!ws[ref]) ws[ref] = { t: 's', v: '' }; // Ensure cell exists
        ws[ref].s = styles.title;
      }
    }

    // 2. Apply Header Style (Row 3, A3:E3)
    const headerRowIndex = 2; // 0-based index for Row 3
    for (let c = 0; c <= 4; c++) {
      const ref = XLSX.utils.encode_cell({ r: headerRowIndex, c });
      ws[ref].s = styles.header;
    }

    // 3. Apply Data Style (Row 4 onwards)
    const startDataRow = 3; // 0-based index for Row 4
    const endDataRow = startDataRow + dataRows.length;

    for (let r = startDataRow; r < endDataRow; r++) {
      for (let c = 0; c <= 4; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        if (!ws[ref]) continue;

        // Apply Left align for Name (Column C / index 2), Center for others
        ws[ref].s = (c === 2) ? styles.cellLeft : styles.cellCenter;
      }
    }

    // ---------------------------------------------------------
    // EXPORT
    // ---------------------------------------------------------
    XLSX.utils.book_append_sheet(wb, ws, "Grading Sheet");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "GradingSheet.xlsx");
  };


  function validateGradeInput(rawValue) {
    if (rawValue === null || rawValue === undefined) return "";

    let value = String(rawValue).trim().toUpperCase();

    // Auto-correct variations of INC
    if (/^INC/.test(value)) return "INC";

    // Auto-correct variations of DROP
    if (/^DRP/.test(value)) return "DRP";

    // If the user typed letters (gibberish)
    if (/^[A-Z]+$/.test(value)) {
      return "60"; // fallback to minimum passing grade
    }

    // Only digits allowed
    if (!/^\d{1,3}$/.test(value)) {
      return "60"; // fallback instead of resetting
    }

    let num = Number(value);
    if (isNaN(num)) return "60";

    // clamp 60–100
    if (num > 100) num = 100;
    if (num < 60) num = 60;

    return String(num);
  }

  const setRemarksFromRating = (rating) => {
    switch (rating) {
      case "1.00":
      case "1.25":
      case "1.50":
      case "1.75":
      case "2.00":
      case "2.25":
      case "2.50":
      case "2.75":
      case "3.00":
        return 1; // PASSED
      case "5.00":
        return 2; // FAILED
      default:
        return 3; // INCOMPLETE or others
    }
  };

  // ----------------- GradeSelect component -----------------
  const GradeSelect = ({ value, onChange, placeholder = "" }) => {
    const [inputValue, setInputValue] = React.useState(value ?? "");

    useEffect(() => {
      setInputValue(value ?? "");
    }, [value]);

    return (
      <Autocomplete
        freeSolo
        disableClearable
        options={gradeOptions}
        inputValue={inputValue}
        value={inputValue}
        onInputChange={(event, newInputValue, reason) => {
          if (reason === "input") {
            setInputValue(newInputValue.toUpperCase());
          }
        }}
        onChange={(event, newValue) => {
          if (newValue !== null) {
            const validated = validateGradeInput(newValue);
            setInputValue(validated);
            onChange(validated);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            size="small"
            variant="outlined"
            onBlur={() => {
              const validated = validateGradeInput(inputValue);
              setInputValue(validated);
              onChange(validated);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // prevent form submission
                const validated = validateGradeInput(inputValue);
                setInputValue(validated);
                onChange(validated); // ← this triggers selection
              }
            }}
            sx={{ textAlign: "center", width: "80px" }}
          />
        )}
        sx={{
          "& .MuiAutocomplete-inputRoot": {
            textAlign: "center",
            fontFamily: "Poppins",
          },
        }}
      />

    );
  };




  const handleChanges = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value?.toUpperCase();

    // ----------------------------
    // AUTO-SYNC DRP BETWEEN MID/FIN
    // ----------------------------
    if (value?.toUpperCase() === "DRP") {
      if (field === "midterm") {
        updatedStudents[index].finals = "DRP";   // autofill finals
      } else if (field === "finals") {
        updatedStudents[index].midterm = "DRP";   // autofill midterm
      }
    }

    // After auto-sync, re-read the values
    const midterm = updatedStudents[index].midterm;
    const finals = updatedStudents[index].finals;

    // ---------------------------------------
    // Your grading and remarks logic (unchanged)
    // ---------------------------------------

    updatedStudents[index].final_grade = finals;

    if (midterm === "DRP" || finals === "DRP") {
      updatedStudents[index].en_remarks = 4;
    } else if (midterm === "INC" || finals === "INC") {
      updatedStudents[index].en_remarks = 3;
    } else if (finals === "0.00") {
      updatedStudents[index].en_remarks = 0;
    } else {
      const rating = convertRawToRating(finals);
      updatedStudents[index].en_remarks = setRemarksFromRating(rating);
    }

    setStudents(updatedStudents);
  };


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
    if (student.en_remarks === 0) {
      return "ONGOING";
    } else if (student.en_remarks === 1) {
      return "PASSED";
    } else if (student.en_remarks === 2) {
      return "FAILED";
    } else if (student.en_remarks === 3) {
      return "INCOMPLETE";
    } else if (student.en_remarks === 4) {
      return "DROPPED";
    } else {
      console.log("Error in Remark Conversion")
    }
  };


  function convertRawToRating(value) {
    if (value === null || value === undefined || value === "") return "";

    const v = String(value).trim().toUpperCase();

    // Handle INC and DROP
    if (v === "INC") return "Incomplete";
    if (v === "DROP" || v === "DRP") return "Dropped";

    // Handle numeric values
    const num = Number(v);
    if (isNaN(num) || num === "0.00" || num === 0.00) return ""; // anything invalid

    if (num >= 97 && num <= 100) return "1.00";
    if (num >= 94 && num <= 96) return "1.25";
    if (num >= 91 && num <= 93) return "1.50";
    if (num >= 88 && num <= 90) return "1.75";
    if (num >= 85 && num <= 87) return "2.00";
    if (num >= 82 && num <= 84) return "2.25";
    if (num >= 79 && num <= 81) return "2.50";
    if (num >= 76 && num <= 78) return "2.75";
    if (num === 75) return "3.00";
    if (num < 75) return "5.00";

    return "";
  }

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

  const handleSaveAll = async () => {
    if (students.length === 0) {
      setSnack({
        open: true,
        message: "No students to save!",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    try {
      // Use Promise.all to send requests in parallel
      // We use 'students' to ensure ALL grades in the section are saved, not just filtered ones
      const promises = students.map(async (student) => {
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
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      });

      await Promise.all(promises);

      // Audit Log
      try {
          const page_name = "Grading Sheet";
          const fullName = `${profData.lname}, ${profData.fname} ${profData.mname}`;
          const type = "submit"

          await axios.post(`${API_BASE_URL}/insert-logs/faculty/${profData.prof_id}`, {
            message: `User #${profData.prof_id} - ${fullName} executed Save All in ${page_name}. Success: ${successCount}, Failed: ${failCount}`, type: type,
          });

        } catch (err) {
          console.error("Error inserting audit log");
        }

      if (failCount === 0) {
        setSnack({
          open: true,
          message: "All grades saved successfully!",
          severity: "success",
        });
      } else if (successCount === 0) {
         setSnack({
          open: true,
          message: "Failed to save grades.",
          severity: "error",
        });
      } else {
        setSnack({
          open: true,
          message: `Saved ${successCount} students. Failed ${failCount}.`,
          severity: "warning",
        });
      }

    } catch (error) {
      console.error("Error saving all grades:", error);
      setSnack({
        open: true,
        message: "An error occurred while saving grades.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
          GRADING SHEET
        </Typography>

        {/* RIGHT SIDE — SEARCH + PRINT */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search Student Number / Name"
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

          <button
            onClick={printDiv}
            style={{
              width: "308px",
              padding: "10px 20px",
              border: "2px solid black",
              backgroundColor: "#f0f0f0",
              color: "black",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background-color 0.3s, transform 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#d3d3d3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FcPrint size={20} />
              Print Grade
            </span>
          </button>
        </Box>
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
                    Total Students: {students.length}
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

                    {totalPages > 0 && (
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
                    )}
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
                          backgroundColor: 'rgba(65, 64, 64, 0.1)',
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
                    width: "230px",
                  }}
                  type="button"
                >
                  <FaFileExcel size={20} />
                  Import Excel
                </button>
              </Box>
              <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 200 }}>
                <Button variant="contained" fullWidth sx={{ height: '50px', backgroundColor: mainButtonColor }} onClick={handleImport}>
                  Upload
                </Button>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
               <button
                onClick={handleSaveAll}
                style={{
                  width: "230px",
                  padding: "10px",
                  background: "maroon",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none"
                }}
              >
                Save All
              </button>
              <button
                onClick={exportToExcel}
                style={{
                  width: "200px",
                  padding: "10px",
                  background: "#4CAF50",
                  color: "white",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none"
                }}
              >
                {hasGrades ? "Export File" : "Download Template"}
              </button>
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
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Equivalent</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Finals</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Equivalent</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Final Grade</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Remarks</TableCell>
              <TableCell sx={{ color: "white", textAlign: "center", fontSize: "12px", border: `2px solid ${borderColor}` }}>Action</TableCell>
            </TableRow>
          </TableHead>

          {/* Body */}
          <TableBody>
            {message ? (
              <TableRow>
                <TableCell colSpan={11} sx={{ textAlign: "center", padding: "1rem", border: "1px solid gray" }}>
                  {message}
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>{index + 1}</TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>{student.student_number}</TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}`, width: "350px" }}>
                    {student.last_name}, {student.first_name} {student.middle_name}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    {student.program_code}-{student.section_description}
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    <GradeSelect
                      value={student.midterm}
                      onChange={(val) => handleChanges(index, "midterm", val)}
                      placeholder="Enter grade"
                    />
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                    {convertRawToRating(student.midterm)}
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    <GradeSelect
                      value={student.finals}
                      onChange={(val) => handleChanges(index, "finals", val)}
                      placeholder="Enter grade"
                    />
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                    {convertRawToRating(student.finals)}
                  </TableCell>
                  <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                    <input
                      type="text"
                      value={convertRawToRating(student.finals)}
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
                    <span
                      className="w-full inline-block text-center"
                      style={{ width: 100 }}
                    >
                      {remarkConversion(student)}
                    </span>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", border: `2px solid ${borderColor}` }}>
                    <Button sx={{
                      height: "40px",
                      width: "100px", // ✅ matches Print
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", lineSpacing: "-1px", marginTop: "2rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "20px" }}><b>GRADE SHEET</b></span>
          </div>

          {/* School Info Table */}
          <table style={{ borderCollapse: "collapse", fontSize: "12px", lineHeight: "1", padding: 0 }}>
            <thead>
              {/* Subject Code + Class Section */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Subject Code:</td>
                <td colSpan={7} style={{ borderRight: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {filteredStudents[0]?.course_code || ""}
                </td>

                <td colSpan={1} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "end" }}>Ac. Year & Term:</div>
                </td>

                <td colSpan={1} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {filteredStudents[0]?.current_year || ""}-{filteredStudents[0]?.next_year || ""}, {filteredStudents[0]?.semester_description || ""},
                </td>
              </tr>

              {/* Subject Title + Year Level */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Subject Title:</td>

                <td colSpan={7} style={{ borderRight: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {filteredStudents[0]?.course_description || ""}
                </td>

                <td colSpan={1} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "end" }}>Section:</div>
                </td>

                <td colSpan={1} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {filteredStudents[0]?.program_code || ""}-{filteredStudents[0]?.section_description || ""}
                </td>
              </tr>

              {/* Academic Units + Lab Units + Schedule */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Lec Units:</td>

                <td colSpan={1} style={{ paddingRight: "2px", textAlign: "center", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {filteredStudents[0]?.course_unit || "0"}
                </td>

                <td colSpan={1} style={{ width: "80px", borderLeft: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Lab Units:</td>

                <td colSpan={1} style={{ paddingRight: "2px", textAlign: "center", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {filteredStudents[0]?.lab_unit || "0"}
                </td>

                <td colSpan={1} style={{ width: "80px", borderLeft: "none", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>Credit Units:</td>

                <td colSpan={1} style={{ paddingRight: "2px", textAlign: "center", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  {filteredStudents[0]?.lab_unit + filteredStudents[0]?.course_unit}
                </td>

                <td colSpan={2} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "end" }}></div>
                </td>

                <td colSpan={1} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", paddingTop: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "end" }}>Session:</div>
                </td>
                <td colSpan={1} style={{ paddingRight: "2px", paddingLeft: "2px", borderBottom: "none", paddingBottom: "1px", paddingTop: "6px", width: "60px" }}>
                  {/* {filteredStudents.length > 0 ? (
                    filteredStudents.map((student, index) => (
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
                  )} */}
                </td>
              </tr>
              {/* Faculty */}
              <tr>
                <td colSpan={1} style={{ width: "80px", paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px", borderTop: "none" }}>Faculty:</td>
                <td colSpan={7} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px" }}>{profData.fname} {profData.mname} {profData.lname}</td>
                <td colSpan={1} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px" }}><div style={{ display: "flex", justifyContent: "end" }}>Date Posted:</div></td>
                <td colSpan={1} style={{ paddingRight: "2px", paddingLeft: "2px", paddingBottom: "1px" }}></td>
              </tr>
            </thead>
          </table>

          {/* Students Table */}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", marginTop: "0.5rem" }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ border: "1px solid black", padding: "2px 0px", width: "30px", textAlign: "center" }}>#</th>
                <th rowSpan={2} style={{ border: "1px solid black", padding: "2px 0px", width: "80px", textAlign: "center" }}>Student No.</th>
                <th rowSpan={2} style={{ border: "1px solid black", padding: "2px", width: "200px", textAlign: "start" }}>Student Name</th>
                <th colSpan={5} style={{ border: "1px solid black", padding: "2px 0px", textAlign: "center" }}>GRADES</th>
              </tr>
              <tr>
                <th style={{ border: "1px solid black", padding: "2px 0px", fontSize: "10px", width: "50px", textAlign: "center" }}>Mid</th>
                <th style={{ border: "1px solid black", padding: "2px 0px", fontSize: "10px", width: "50px", textAlign: "center" }}>Final</th>
                <th style={{ border: "1px solid black", padding: "2px 0px", fontSize: "10px", width: "50px", textAlign: "center" }}>Final Grade</th>
                <th style={{ border: "1px solid black", padding: "2px 0px", fontSize: "10px", width: "50px", textAlign: "center" }}>Re exam</th>
                <th style={{ border: "1px solid black", padding: "2px 0px", fontSize: "10px", width: "50px", textAlign: "center" }}>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, index) => (
                  <tr key={s.student_number}>
                    <td style={{ border: "1px solid black", fontSize: "10px", padding: "6px", textAlign: "center" }}>{index + 1}</td>
                    <td style={{ border: "1px solid black", fontSize: "10px", padding: "6px", textAlign: "center" }}>{s.student_number}</td>
                    <td style={{ border: "1px solid black", fontSize: "10px", padding: "6px" }}>{`${s.last_name}, ${s.first_name} ${s.middle_name || ""}`}</td>
                    <td style={{ border: "1px solid black", fontSize: "10px", padding: "6px", textAlign: "center" }}>{convertRawToRating(s.midterm)}  </td>
                    <td style={{ border: "1px solid black", fontSize: "10px", padding: "6px", textAlign: "center" }}>{convertRawToRating(s.finals)}</td>
                    <td style={{ border: "1px solid black", fontSize: "10px", padding: "6px", textAlign: "center" }}>{convertRawToRating(s.final_grade)}</td>
                    <td style={{ border: "1px solid black", fontSize: "10px", padding: "6px", textAlign: "center" }}></td>
                    <td style={{ border: "1px solid black", fontSize: "10px", padding: "6px", textAlign: "center" }}>{remarkConversion(s)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                    No class details available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div style={{ marginTop: "1rem", padding: "1.7rem", fontSize: "12px", border: "1px solid black", maxWidth: "170px" }}>
              <div style={{ textDecoration: "underline", textUnderlineOffset: "2px" }}>Grade Sheet Statistic</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginLeft: "16px", width: "10rem" }}>Passed</span>
                <span>{gradeStats.passed}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginLeft: "16px", width: "10rem" }}>Failed</span>
                <span>{gradeStats.failed}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginLeft: "16px", width: "10rem" }}>Incomplete</span>
                <span>{gradeStats.incomplete}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginLeft: "16px", width: "10rem" }}>Drop</span>
                <span>{gradeStats.drop}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ marginLeft: "16px", width: "10rem" }}>No Grade</span>
                <span>{gradeStats.noGrade}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid black" }}>
                <span style={{ marginLeft: "16px", width: "10rem" }}>Total # of Students</span>
                <span>{filteredStudents.length}</span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "450px" }}>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ fontSize: "12px" }}>{profData.fname} {profData.mname[0] || ""}. {profData.lname}</div>
                  <div style={{ borderTop: "solid 1px black", fontSize: "12px" }}>Instructor</div>
                </div>

                <div style={{ textAlign: "center", width: "45%" }}>
                  <div>&nbsp;</div>
                  <div style={{ borderTop: "solid 1px black", fontSize: "12px" }}>Department Chairperson</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", width: "450px" }}>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div>&nbsp;</div>
                  <div style={{ borderTop: "solid 1px black", fontSize: "12px" }}>Dean, {filteredStudents[0]?.dprtmnt_name}</div>
                </div>

                <div style={{ textAlign: "center", width: "45%" }}>
                  <div>&nbsp;</div>
                  <div style={{ borderTop: "solid 1px black", fontSize: "12px" }}>Registrar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
