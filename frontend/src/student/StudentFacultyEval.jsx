import React, { useState, useEffect, useContext } from "react";
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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
  Button,
  Paper,
  Snackbar,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  Grid,
  DialogContent,
  DialogActions,
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


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [studentCourses, setStudentCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [studentNumber, setStudentNumber] = useState("");

  useEffect(() => {
    if (!settings) return;

    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);
    if (settings.logo_url) setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);

    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);
  }, [settings]);

  // Check user session
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

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_questions_for_evaluation`);
      setQuestions(response.data);
    } catch {
      showSnackbar("Failed to fetch questions", "error");
    }
  };

  const fetchCourseData = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/student_course/${id}`);
      setStudentCourses(res.data);
      if (res.data.length > 0) setStudentNumber(res.data[0].student_number);
    } catch {
      console.log("No courses found");
    }
  };

  const handleSelectedCourse = (event) => setSelectedCourse(event.target.value);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const handleAnswerChange = (question_id, value) =>
    setAnswers((prev) => ({ ...prev, [question_id]: value }));

  const selectedProfessor = studentCourses.find((prof) => prof.course_id === selectedCourse);

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

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
    } catch {
      showSnackbar("Failed to save evaluation.", "error");
    }
  };

  const groupedQuestions = questions.reduce((groups, question) => {
    const { category } = question;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(question);
    return groups;
  }, {});

  // Disable right-click & dev tools
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    if (
      e.key === "F12" ||
      e.key === "F11" ||
      (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key)) ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        backgroundColor: "transparent",
        paddingRight: 3
      }}
    >
      {/* Page Title */}
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: titleColor }}>
        Faculty Evaluation Form
      </Typography>

      {/* Choose Course Panel */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* CHOOSE COURSE PANEL */}
        <Grid item xs={12} md={6}>
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${borderColor}`,
        boxShadow: 1,
        height: "100%",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: titleColor, mb: 2 }}>
        CHOOSE COURSE
      </Typography>

      {/* Select Course */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            onChange={handleSelectedCourse}
            label="Select Course"
          >
            {studentCourses.map((c) => (
              <MenuItem key={c.course_id} value={c.course_id}>
                {c.course_code} - {c.course_description}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* INFORMATION DISPLAY */}
      {selectedProfessor && (
        <Box sx={{ mt: 1 }}>
          {[
            {
              label: "Name of Faculty being Evaluated",
              value: `${selectedProfessor.fname || ""} ${selectedProfessor.mname || ""} ${selectedProfessor.lname || ""}`.trim(),
            },
            {
              label: "College/Department",
              value: selectedProfessor.department || "",
            },
            {
              label: "Course Code",
              value: selectedProfessor.course_code || "",
            },
            {
              label: "Program Code",
              value: `${selectedProfessor.curriculum_year}-${selectedProfessor.program_code}` || "",
            },
            {
              label: "Semester or Term/Academic Year",
              value: `${selectedProfessor.current_year} - ${selectedProfessor.next_year}, ${selectedProfessor.semester_description}`|| "",
            },
          ].map((row, index) => (
            <Grid
              container
              key={index}
              sx={{ mb: 1.2 }}
            >
              {/* LABEL */}
              <Grid item xs={7}>
                <Typography sx={{ fontSize: 14 }}>{row.label}</Typography>
              </Grid>

              {/* COLON */}
              <Grid item xs={1}>
                <Typography sx={{ fontSize: 14 }}>:</Typography>
              </Grid>

              {/* VALUE */}
              <Grid item xs={4}>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                  {row.value}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      )}
    </Paper>
  </Grid>

        {/* RATING CRITERIA */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${borderColor}`,
              boxShadow: 1,
              height: "100%",  // 🔥 Same height as left card
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: titleColor, mb: 2 }}
            >
              Rating Criteria
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ boxShadow: "none", borderRadius: 2, flexGrow: 1 }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Scale</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Qualitative Description</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Operational Definition</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>5</TableCell>
                    <TableCell>Always manifested</TableCell>
                    <TableCell>Evident in nearly all relevant situations (91–100%).</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>4</TableCell>
                    <TableCell>Often manifested</TableCell>
                    <TableCell>Evident most of the time (61–90%).</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>3</TableCell>
                    <TableCell>Sometimes manifested</TableCell>
                    <TableCell>Evident about half the time (31–60%).</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>2</TableCell>
                    <TableCell>Seldom manifested</TableCell>
                    <TableCell>Rarely evident (11–30%).</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>1</TableCell>
                    <TableCell>Never manifested</TableCell>
                    <TableCell>Almost never evident (0–10%).</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* CATEGORY SECTIONS */}
      {selectedProfessor &&
        Object.entries(groupedQuestions).map(([category, items]) => {
          const isInteraction = category.toLowerCase().includes("interaction");
          const headerBg = isInteraction ? "#eef8ee" : "#e9f4ff";

          return (
            <Box key={category} mb={4}>
              {/* Section Header */}
              <Box
                sx={{
                  background: headerBg,
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${borderColor}`,
                  mb: 2,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "40px", color: titleColor }}>
                  {items[0].title}
                </Typography>

                <Typography variant="body2" sx={{ fontStyle: "italic", fontSize: "15px",color: subtitleColor }}>
                  {items[0].meaning}
                </Typography>
              </Box>

              {/* Questions */}
              {items.map((q) => (
                <Paper
                  key={q.question_id}
                  sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
                    border: `1px solid ${borderColor}`,
                    boxShadow: 0,
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                    {q.question_description}
                  </Typography>

                  {/* Choices = Equal Width */}
                  <Grid container spacing={1}>
                    {[q.first_choice, q.second_choice, q.third_choice, q.fourth_choice, q.fifth_choice]
                      .filter(Boolean)
                      .map((choice, index, arr) => (
                        <Grid item xs={12 / arr.length} key={index}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 0.5,
                              borderRadius: 1,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <FormControlLabel
                              sx={{ m: 0 }}
                              control={<Radio size="small" />}
                              value={choice}
                              checked={answers[q.question_id] === choice}
                              onChange={() => handleAnswerChange(q.question_id, choice)}
                              label={<Typography sx={{ fontSize: 14 }}>{choice}</Typography>}
                            />
                          </Paper>
                        </Grid>
                      ))}
                  </Grid>
                </Paper>
              ))}
            </Box>
          );
        })}

      {/* Buttons Centered */}
      {selectedProfessor && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3, mb: 10 }}>
          <Button variant="outlined" color="error" onClick={() => setResetDialogOpen(true)}>
            Reset Answers
          </Button>

          <Button
            variant="contained"
            sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#155fa0" } }}
            onClick={() => setSaveDialogOpen(true)}
          >
            Save Evaluation
          </Button>
        </Box>
      )}

      {/* DIALOGS + SNACKBAR (unchanged) */}
      {/* RESET DIALOG */}
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset Your Answers</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all answers? This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button
            color="error"
            onClick={() => {
              setAnswers({});
              setResetDialogOpen(false);
            }}
          >
            Confirm Reset
          </Button>
        </DialogActions>
      </Dialog>

      {/* SAVE DIALOG */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
        <DialogTitle>Submit Evaluation</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to submit your evaluation? Make sure everything is answered.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setSaveDialogOpen(false);
              SaveEvaluation();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );

};

export default StudentFacultyEvaluation;