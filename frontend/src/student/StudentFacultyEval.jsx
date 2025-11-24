import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  Button,
  Paper,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import axios from "axios";
import API_BASE_URL from "../apiConfig";
const StudentFacultyEvaluation = () => {

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

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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
  const [studentCourses, setStudentCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [studentNumber, setStudentNumber] = useState("");

  // ✅ On page load: check user session and fetch student data
  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (storedUser && storedRole && storedID) {
      setUser(storedUser);
      setUserRole(storedRole);
      setUserID(storedID);

      if (storedRole !== "student") {
        window.location.href = "/faculty_dashboard";
      } else {
        fetchCourseData(storedID);
        fetchQuestions();
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  // ✅ Fetch questions
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/get_questions_for_evaluation`
      );
      setQuestions(response.data);
    } catch (err) {
      showSnackbar("Failed to fetch questions", "error");
    }
  };

  // ✅ Fetch student courses
  const fetchCourseData = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/student_course/${id}`);
      setStudentCourses(res.data);
      if (res.data.length > 0) {
        setStudentNumber(res.data[0].student_number);
      }
    } catch (err) {
      console.log("There are no courses to be evaluated")
    }
  };

  // ✅ Handle course selection
  const handleSelectedCourse = (event) => {
    const selected = event.target.value;
    setSelectedCourse(selected);
  };

  // ✅ Handle answer change
  const handleAnswerChange = (question_id, value) => {
    setAnswers((prev) => ({
      ...prev,
      [question_id]: value,
    }));
  };

  // ✅ Get selected professor for display
  const selectedProfessor = studentCourses.find(
    (prof) => prof.course_id === selectedCourse
  );

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // ✅ Save evaluation for all questions
  const SaveEvaluation = async () => {
    if (!selectedProfessor) {
      showSnackbar("Please select a course before submitting.", "warning");
      return;
    }

    try {
      for (const [question_id, answer] of Object.entries(answers)) {
        await axios.post(`${API_BASE_URL}/api/student_evaluation`, {
          student_number: studentNumber,
          school_year_id: selectedProfessor.active_school_year_id,
          prof_id: selectedProfessor.prof_id,
          course_id: selectedProfessor.course_id,
          question_id,
          answer,
        });
      }

      showSnackbar("Evaluation submitted successfully!", "success");
      setAnswers({});
      setSelectedCourse("");
      fetchCourseData(userID);
    } catch (err) {
      showSnackbar("Failed to save evaluation.", "error");
    }
  };

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

  return (
    <Box
      sx={{

        ml: "-2rem",
        paddingRight: 8,
        height: "calc(100vh - 150px)",
        overflowY: "auto",
      }}
    >
      {/* Header */}
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
          FACULTY EVALUATION FORM
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Typography fontWeight={500} mb={0.5}>
        Choose Courses:
      </Typography>

      <FormControl fullWidth sx={{ maxWidth: "600px" }}>
        <InputLabel id="course-label">Select Course</InputLabel>

        <Select
          labelId="course-label"
          label="Select Course"
          value={selectedCourse}
          onChange={handleSelectedCourse}
        >
          {studentCourses.map((prof) => (
            <MenuItem key={prof.course_id} value={prof.course_id}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  sx={{
                    minWidth: "100px",
                    borderRight: "1px solid rgba(0,0,0,0.1)",
                    pr: 2, // spacing right
                    fontWeight: 500,
                  }}
                >
                  {prof.course_code}
                </Typography>

                <Typography sx={{ fontSize: "0.95rem" }}>
                  {prof.course_description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>


      {/* Show professor info */}
      {selectedProfessor && (
        <TextField
          disabled
          sx={{ mt: 3, ml: 2, minWidth: "500px" }}
          value={`Professor: ${selectedProfessor.fname} ${selectedProfessor.mname} ${selectedProfessor.lname}`}
        />
      )}

      {/* Show questions only if professor selected */}
      {selectedProfessor && (
        <Paper sx={{ mt: 4, p: 3, border: "2px solid maroon" }}>
          <Typography variant="h6" gutterBottom>
            Evaluation Questions
          </Typography>

          {/* Questions */}
          {questions.map((q) => (
            <Box key={q.question_id} sx={{ mt: 2 }}>
              <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                {q.question_description}
              </Typography>
              <RadioGroup
                row
                value={answers[q.question_id] || ""}
                onChange={(e) => handleAnswerChange(q.question_id, e.target.value)}
              >
                {[q.first_choice, q.second_choice, q.third_choice, q.fourth_choice, q.fifth_choice]
                  .filter(Boolean)
                  .map((choice, i) => (
                    <FormControlLabel
                      key={i}
                      value={choice}
                      control={<Radio />}
                      label={choice}
                    />
                  ))}
              </RadioGroup>
            </Box>
          ))}

          {/* Submit Button */}
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={SaveEvaluation}
          >
            Submit Evaluation
          </Button>
        </Paper>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentFacultyEvaluation;
