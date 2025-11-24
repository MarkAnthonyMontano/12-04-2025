import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const CoursePanel = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");
  const [subButtonColor, setSubButtonColor] = useState("#ffffff");
  const [stepperColor, setStepperColor] = useState("#000000");

  const [fetchedLogo, setFetchedLogo] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [shortTerm, setShortTerm] = useState("");
  const [campusAddress, setCampusAddress] = useState("");

  useEffect(() => {
    if (!settings) return;

    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    if (settings.sub_button_color) setSubButtonColor(settings.sub_button_color);
    if (settings.stepper_color) setStepperColor(settings.stepper_color);

    if (settings.logo_url) {
      setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
    }

    if (settings.company_name) setCompanyName(settings.company_name);
    if (settings.short_term) setShortTerm(settings.short_term);
    if (settings.campus_address) setCampusAddress(settings.campus_address);
  }, [settings]);

  const [course, setCourse] = useState({
    course_code: "",
    course_description: "",
    course_unit: "",
    lab_unit: "",
    lec_value: "",
    lab_value: "",
  });

  const [courseList, setCourseList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
    key: 0,
  });

  const showSnack = (message, severity) => {
    setSnack({
      open: true,
      message,
      severity,
      key: new Date().getTime(),
    });
  };

  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const pageId = 16;

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


  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course_list`);
      setCourseList(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddingCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/adding_course`, course);
      setCourse({
        course_code: "",
        course_description: "",
        course_unit: "",
        lab_unit: "",
        lec_value: "",
        lab_value: "",
      });
      showSnack("Course successfully added!", "success");
      fetchCourses();
    } catch (err) {
      showSnack(
        err.response?.data?.message || "Failed to add course.",
        "error"
      );
    }
  };

  const handleEdit = (item) => {
    setCourse({
      course_code: item.course_code,
      course_description: item.course_description,
      course_unit: item.course_unit,
      lab_unit: item.lab_unit,
      lec_value: item.lec_value,
      lab_value: item.lab_value,
    });
    setEditMode(true);
    setEditId(item.course_id);
  };

  const handleUpdateCourse = async () => {
    try {
      await axios.put(`${API_BASE_URL}/update_course/${editId}`, {
        ...course,
        course_unit: Number(course.course_unit),
        lab_unit: Number(course.lab_unit),
      });

      await fetchCourses();

      showSnack("Course updated successfully!", "success");

      setEditMode(false);
      setEditId(null);
      setCourse({
        course_code: "",
        course_description: "",
        course_unit: "",
        lab_unit: "",
        lec_value: "",
        lab_value: "",
      });
    } catch (error) {
      showSnack(error.response?.data?.message || "Failed to add course.", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete_course/${id}`);

      setCourseList((prevList) =>
        prevList.filter((item) => item.course_id !== id)
      );

      // ✅ Use "success" here for green
      showSnack("Course deleted successfully!", "success");
    } catch (err) {
      console.error(err);
      showSnack("Failed to delete course.", "error");
    }
  };


  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  // 🔒 Secure: disable right-click & devtools keys safely with cleanup
  useEffect(() => {
    const disableContext = (e) => e.preventDefault();
    const disableKeys = (e) => {
      const isBlockedKey =
        e.key === "F12" ||
        e.key === "F11" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")) ||
        (e.ctrlKey && ["u", "p"].includes(e.key.toLowerCase()));

      if (isBlockedKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("contextmenu", disableContext);
    document.addEventListener("keydown", disableKeys);
    return () => {
      document.removeEventListener("contextmenu", disableContext);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  // ✅ Move dynamic styles inside the component so borderColor works
  const styles = {
    flexContainer: {
      display: "flex",
      gap: "30px",
      alignItems: "flex-start",
    },
    leftPane: {
      flex: 1,
      padding: 10,
      border: `2px solid ${borderColor}`,
      borderRadius: 2,
    },
    rightPane: {
      flex: 2,
      padding: 10,
      border: `2px solid ${borderColor}`,
      borderRadius: 2,
    },
    inputGroup: { marginBottom: "15px" },
    label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
    input: {
      width: "100%",
      padding: "8px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      width: "90%",
      padding: "10px",
      backgroundColor: "maroon",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      display: "block",
      margin: "0 auto",
    },
    tableContainer: {
      maxHeight: "400px",
      overflowY: "auto",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
  };

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
          COURSE PANEL
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <div style={styles.flexContainer}>
        {/* ✅ FORM SECTION */}
        <div style={styles.leftPane}>
          <h3 style={{ color: "#800000", fontWeight: "bold" }}>
            {editMode ? "Edit Course" : "Add New Course"}
          </h3>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Course Description:</label>
            <input
              type="text"
              name="course_description"
              value={course.course_description}
              onChange={handleChangesForEverything}
              placeholder="Enter Course Description"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Course Code:</label>
            <input
              type="text"
              name="course_code"
              value={course.course_code}
              onChange={handleChangesForEverything}
              placeholder="Enter Course Code"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Course Unit:</label>
            <input
              type="text"
              name="course_unit"
              value={course.course_unit}
              onChange={handleChangesForEverything}
              placeholder="Enter Course Unit"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Laboratory Unit:</label>
            <input
              type="text"
              name="lab_unit"
              value={course.lab_unit}
              onChange={handleChangesForEverything}
              placeholder="Enter Laboratory Unit"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Lecture Fees:</label>
            <input
              type="text"
              name="lec_value"
              value={course.lec_value}
              onChange={handleChangesForEverything}
              placeholder="Enter Lecture Fees"
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Laboratory Fees:</label>
            <input
              type="text"
              name="lab_value"
              value={course.lab_value}
              onChange={handleChangesForEverything}
              placeholder="Enter Laboratory Fees"
              style={styles.input}
            />
          </div>

          <button
            style={{ ...styles.button, backgroundColor: "#1976d2" }}
            onClick={editMode ? handleUpdateCourse : handleAddingCourse}
          >
            {editMode ? "Update" : "Insert"}
          </button>

        </div>

        {/* ✅ TABLE SECTION */}
        <div style={styles.rightPane}>
          <h3 style={{ color: "maroon", fontWeight: "bold" }}>All Courses</h3>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>ID</th>
                  <th style={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Description</th>
                  <th style={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Code</th>
                  <th style={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Course Unit</th>
                  <th style={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Lab Unit</th>
                  <th style={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Lec Fees</th>
                  <th style={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Lab Fees</th>
                  <th style={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courseList.map((c) => (
                  <tr key={c.course_id}>
                    <td style={{ border: `2px solid ${borderColor}` }}>{c.course_id}</td>
                    <td style={{ border: `2px solid ${borderColor}` }}>{c.course_description}</td>
                    <td style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>{c.course_code}</td>
                    <td style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>{c.course_unit}</td>
                    <td style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>{c.lab_unit}</td>
                    <td style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>{c.lec_value}</td>
                    <td style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>{c.lab_value}</td>
                    <td style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(c)}
                          style={{
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            padding: "6px 0",
                            width: "80px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.course_id)}
                          style={{
                            backgroundColor: "#9E0000",
                            color: "white",
                            border: "none",
                            padding: "6px 0",
                            width: "80px",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ✅ Snackbar */}
      <Snackbar
        key={snack.key}
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={snack.severity} // ✅ Use severity: "success" | "error" | "info" | "warning"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default CoursePanel;
