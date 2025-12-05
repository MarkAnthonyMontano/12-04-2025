import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Typography,
  Box,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox
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
    prereq: "",
    iscomputer_lab: 0,
    isnon_computer_lab: 0,
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

  const handleCheckbox = (e) => {
    const { name, checked } = e.target;

    setCourse((prev) => ({
      ...prev,
      [name]: checked ? 1 : 0,
      ...(name === "iscomputer_lab" ? { isnon_computer_lab: 0 } : {}),
      ...(name === "isnon_computer_lab" ? { iscomputer_lab: 0 } : {}),
    }));
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
      const data = response.data.map(item => ({
        ...item,
        prerequisite: item.prereq || "",
      }));
      setCourseList(data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;
    setCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleAddingCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/adding_course`, {
        ...course,
        course_unit: Number(course.course_unit),
        lab_unit: Number(course.lab_unit),
        lec_value: Number(course.lec_value),
        lab_value: Number(course.lab_value),
        prereq: course.prereq || null,
      });

      setCourse({
        course_code: "",
        course_description: "",
        course_unit: "",
        lab_unit: "",
        lec_value: "",
        lab_value: "",
        prereq: "",
        iscomputer_lab: 0,
        isnon_computer_lab: 0,
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
      prereq: item.prereq || "",

      iscomputer_lab: item.iscomputer_lab,
      isnon_computer_lab: item.isnon_computer_lab,
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
        lec_value: Number(course.lec_value),
        lab_value: Number(course.lab_value),
        prereq: course.prereq || null,
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
        prereq: "",
        iscomputer_lab: 0,
        isnon_computer_lab: 0,
      });
    } catch (error) {
      showSnack(error.response?.data?.message || "Failed to update course.", "error");
    }
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete_course/${id}`);

      setCourseList((prevList) =>
        prevList.filter((item) => item.course_id !== id)
      );

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


  if (loading || hasAccess === null) {
   return <LoadingOverlay open={loading} message="Loading..." />;
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
      textAlign: "center",
      height: 700
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
      maxHeight: "650px",
      overflowY: "auto",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "center",

    },
    tableCell: {
      border: `2px solid ${borderColor}`,
      padding: "8px",
      textAlign: "center"
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

          {[
            { label: "Course Description", name: "course_description", placeholder: "Enter Course Description" },
            { label: "Course Code", name: "course_code", placeholder: "Enter Course Code" },
            { label: "Course Unit", name: "course_unit", placeholder: "Enter Course Unit" },
            { label: "Laboratory Unit", name: "lab_unit", placeholder: "Enter Laboratory Unit" },
            { label: "Lecture Fees", name: "lec_value", placeholder: "Enter Lecture Fees" },
            { label: "Laboratory Fees", name: "lab_value", placeholder: "Enter Laboratory Fees" },
            { label: "Prerequisite", name: "prereq", placeholder: "Enter Prerequisite (Optional)" },
          ].map((field) => (
            <div key={field.name} style={styles.inputGroup}>
              <label style={styles.label}>{field.label}:</label>
              <input
                type="text"
                name={field.name}
                value={course[field.name]}
                onChange={handleChangesForEverything}
                placeholder={field.placeholder}
                style={styles.input}
              />
            </div>
          ))}

          <div style={styles.inputGroup}>
            <FormControlLabel
              control={
                <Checkbox
                  name="iscomputer_lab"
                  checked={course.iscomputer_lab === 1}
                  disabled={course.isnon_computer_lab === 1}
                  onChange={handleCheckbox}
                  sx={{
                    padding: 0,
                    "& .MuiSvgIcon-root": { fontSize: 30, ml: "10px", },
                  }}
                />
              }
              label="Is Computer Lab"
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="isnon_computer_lab"
                  checked={course.isnon_computer_lab === 1}
                  disabled={course.iscomputer_lab === 1}
                  onChange={handleCheckbox}
                  sx={{
                    padding: 0,
                    "& .MuiSvgIcon-root": { fontSize: 30 },
                  }}
                />
              }
              label="Is Non-Computer Lab"
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
                  {[
                    "ID",
                    "Description",
                    "Code",
                    "Credit Unit",
                    "Lab Unit",
                    "Lec Fees",
                    "Lab Fees",
                    "Prerequisite",
                    "Lab",
                    "Lecture",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        border: `2px solid ${borderColor}`,
                        backgroundColor: settings?.header_color || "#1976d2",
                        color: "#fff",
                        textAlign: ["Code", "Credit Unit", "Lab Unit", "Lec Fees", "Lab Fees"].includes(header)
                          ? "center"
                          : "left",
                        padding: "8px",
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courseList.map((c) => (
                  <tr key={c.course_id}>
                    <td style={styles.tableCell}>{c.course_id}</td>
                    <td style={styles.tableCell}>{c.course_description}</td>
                    <td style={{ ...styles.tableCell, textAlign: "center" }}>{c.course_code}</td>
                    <td style={{ ...styles.tableCell, textAlign: "center" }}>{c.course_unit}</td>
                    <td style={{ ...styles.tableCell, textAlign: "center" }}>{c.lab_unit}</td>
                    <td style={{ ...styles.tableCell, textAlign: "center" }}>{c.lec_value}</td>
                    <td style={{ ...styles.tableCell, textAlign: "center" }}>{c.lab_value}</td>
                    <td style={styles.tableCell}>{c.prereq}</td>
                    <td style={{ ...styles.tableCell, textAlign: "center" }}>
                      {c.iscomputer_lab === 1 ? "YES" : "NO"}
                    </td>
                    <td style={{ ...styles.tableCell, textAlign: "center" }}>
                      {c.isnon_computer_lab === 1 ? "YES" : "NO"}
                    </td>

                    <td style={{ ...styles.tableCell, textAlign: "center" }}>
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
