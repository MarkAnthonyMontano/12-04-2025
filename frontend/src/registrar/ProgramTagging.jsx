import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const ProgramTagging = () => {
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
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const pageId = 35;

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

  const [progTag, setProgTag] = useState({
    curriculum_id: "",
    year_level_id: "",
    semester_id: "",
    course_id: "",
  });
  const [courseList, setCourseList] = useState([]);
  const [yearLevelList, setYearlevelList] = useState([]);
  const [semesterList, setSemesterList] = useState([]);
  const [curriculumList, setCurriculumList] = useState([]);
  const [taggedPrograms, setTaggedPrograms] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchYearLevel();
    fetchSemester();
    fetchCurriculum();
    fetchTaggedPrograms();
  }, []);

  const fetchYearLevel = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_year_level`);
      setYearlevelList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSemester = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_semester`);
      setSemesterList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCurriculum = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_curriculum`);
      setCurriculumList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/course_list`);
      setCourseList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTaggedPrograms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/prgram_tagging_list`);
      setTaggedPrograms(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;
    setProgTag((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInsertingProgTag = async () => {
    const { curriculum_id, year_level_id, semester_id, course_id } = progTag;
    if (!curriculum_id || !year_level_id || !semester_id || !course_id) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "error",
      });
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/program_tagging/${editingId}`,
          progTag
        );
        setSnackbar({
          open: true,
          message: "Program tag updated successfully!",
          severity: "success",
        });
      } else {
        await axios.post(`${API_BASE_URL}/program_tagging`, progTag);
        setSnackbar({
          open: true,
          message: "Program tag inserted successfully!",
          severity: "success",
        });
      }

      fetchTaggedPrograms();
      setProgTag({
        curriculum_id: "",
        year_level_id: "",
        semester_id: "",
        course_id: "",
      });
      setEditingId(null);
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.error || "Error saving data.",
        severity: "error",
      });
    }
  };

  const handleEdit = (program) => {
    setEditingId(program.program_tagging_id);
    setProgTag({
      curriculum_id: program.curriculum_id,
      year_level_id: program.year_level_id,
      semester_id: program.semester_id,
      course_id: program.course_id,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/program_tagging/${id}`);
      setSnackbar({
        open: true,
        message: "Program tag deleted successfully!",
        severity: "success",
      });
      fetchTaggedPrograms();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error deleting program tag.",
        severity: "error",
      });
    }
  };




  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: titleColor, fontSize: "36px" }}
        >
          PROGRAM AND COURSE MANAGEMENT
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <div style={styles.container}>
        {/* Left: Form Section */}
        <div style={{ ...styles.formSection, border: `2px solid ${borderColor}` }}>

          <div style={styles.formGroup}>
            <label style={styles.label}>Curriculum:</label>
            <select
              name="curriculum_id"
              value={progTag.curriculum_id}
              onChange={handleChangesForEverything}
              style={styles.select}
            >
              <option value="">Choose Curriculum</option>
              {curriculumList.map((curriculum) => (
                <option key={curriculum.curriculum_id} value={curriculum.curriculum_id}>
                  {curriculum.year_description} - {curriculum.program_description} {curriculum.major}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Course:</label>
            <select
              name="course_id"
              value={progTag.course_id}
              onChange={handleChangesForEverything}
              style={styles.select}
            >
              <option value="">Choose Course</option>
              {courseList.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_code} - {course.course_description}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Year Level:</label>
            <select
              name="year_level_id"
              value={progTag.year_level_id}
              onChange={handleChangesForEverything}
              style={styles.select}
            >
              <option value="">Choose Year Level</option>
              {yearLevelList.map((year) => (
                <option key={year.year_level_id} value={year.year_level_id}>
                  {year.year_level_description}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Semester:</label>
            <select
              name="semester_id"
              value={progTag.semester_id}
              onChange={handleChangesForEverything}
              style={styles.select}
            >
              <option value="">Choose Semester</option>
              {semesterList.map((semester) => (
                <option key={semester.semester_id} value={semester.semester_id}>
                  {semester.semester_description}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={handleInsertingProgTag}
            variant="contained"
            sx={{
              backgroundColor: "primary",
              color: "white",
              mt: 3,
              width: "100%",
              "&:hover": { backgroundColor: "#000" },
            }}
          >
            {editingId ? "Update Program Tag" : "Insert Program Tag"}
          </Button>
        </div>

        {/* Right: Tagged Programs */}
        <div style={{ ...styles.displaySection, border: `2px solid ${borderColor}` }}>

          <h3 style={{ color: "maroon" }}>Tagged Programs</h3>
          <div style={styles.taggedProgramsContainer}>
            {taggedPrograms.length > 0 ? (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th
                      style={{
                        ...styles.th,
                        backgroundColor: settings?.header_color || "#1976d2",
                        border: `2px solid ${borderColor}`,
                        color: "white",
                      }}
                    >
                      Curriculum
                    </th>
                    <th
                      style={{
                        ...styles.th,
                        backgroundColor: settings?.header_color || "#1976d2",
                        border: `2px solid ${borderColor}`,
                        color: "white",
                      }}
                    >
                      Course
                    </th>
                    <th
                      style={{
                        ...styles.th,
                        backgroundColor: settings?.header_color || "#1976d2",
                        border: `2px solid ${borderColor}`,
                        color: "white",
                      }}
                    >
                      Year Level
                    </th>
                    <th
                      style={{
                        ...styles.th,
                        backgroundColor: settings?.header_color || "#1976d2",
                        border: `2px solid ${borderColor}`,
                        color: "white",
                      }}
                    >
                      Semester
                    </th>
                    <th
                      style={{
                        ...styles.th,
                        backgroundColor: settings?.header_color || "#1976d2",
                        border: `2px solid ${borderColor}`,
                        color: "white",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {taggedPrograms.map((program) => (
                    <tr key={program.program_tagging_id}>
                      <td style={{ ...styles.td, border: `2px solid ${borderColor}` }}>
             {program.curriculum_description}     ({program.program_code})        {program.major}
                      </td>

                      <td style={{ ...styles.td, border: `2px solid ${borderColor}` }}>
                        {program.course_description}
                      </td>
                      <td style={{ ...styles.td, border: `2px solid ${borderColor}` }}>
                        {program.year_level_description}
                      </td>
                      <td style={{ ...styles.td, border: `2px solid ${borderColor}` }}>
                        {program.semester_description}
                      </td>
                      <td
                        style={{
                          ...styles.td,
                          whiteSpace: "nowrap",
                          border: `2px solid ${borderColor}`,
                        }}
                      >
                        <button
                          onClick={() => handleEdit(program)}
                          style={{
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "8px 14px",
                            marginRight: "6px",
                            cursor: "pointer",
                            width: "100px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <EditIcon fontSize="small" /> Edit
                        </button>

                        <button
                          onClick={() => handleDelete(program.program_tagging_id)}
                          style={{
                            backgroundColor: "#9E0000",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            padding: "8px 14px",
                            cursor: "pointer",
                            width: "100px",
                            height: "40px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "5px",
                          }}
                        >
                          <DeleteIcon fontSize="small" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            ) : (
              <p>No tagged programs available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
    width: "95%",
    margin: "30px auto",
    maxHeight: "600px",
  },
  formSection: {
    flex: "1",
    background: "#f8f8f8",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    maxHeight: "600px",
    minWidth: "48%",
  },
  displaySection: {
    flex: "1",
    background: "#f8f8f8",
    padding: "25px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    maxHeight: "600px",
    minWidth: "48%",
    overflowY: "auto",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginBottom: "8px",
  },
  select: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  taggedProgramsContainer: {
    overflowY: "auto",
    maxHeight: "500px",
    marginTop: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  th: {
    padding: "12px",
    borderBottom: "2px solid #ccc",
    backgroundColor: "#f1f1f1",
    fontWeight: "bold",
    fontSize: "15px",
    color: "#333",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    color: "#333",
  },
};

export default ProgramTagging;