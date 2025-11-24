import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const ProgramPanel = () => {
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

  const [program, setProgram] = useState({ name: "", code: "", major: "" });

  const [programs, setPrograms] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 34;

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


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchPrograms = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_program`);
      setPrograms(res.data);
    } catch (err) {
      console.error("Error fetching programs:", err);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleChangesForEverything = (e) => {
    const { name, value } = e.target;
    setProgram((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddingProgram = async () => {
    if (!program.name || !program.code) {
      setSnackbar({
        open: true,
        message: "Please fill all fields",
        severity: "error",
      });
      return;
    }

    try {
      if (editMode) {
        await axios.put(`${API_BASE_URL}/program/${editId}`, program);
        setSnackbar({
          open: true,
          message: "Program updated successfully!",
          severity: "success",
        });
      } else {
        await axios.post(`${API_BASE_URL}/program`, program);
        setSnackbar({
          open: true,
          message: "Program added successfully!",
          severity: "success",
        });
      }

      setProgram({ name: "", code: "" });
      setEditMode(false);
      setEditId(null);
      fetchPrograms();
    } catch (err) {
      console.error("Error saving program:", err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Error saving program!",
        severity: "error",
      });
    }
  };

  const handleEdit = (prog) => {
    setProgram({
      name: prog.program_description,
      code: prog.program_code,
      major: prog.major || "",
    });
    setEditMode(true);
    setEditId(prog.program_id);
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/program/${id}`);
      fetchPrograms();
      setSnackbar({
        open: true,
        message: "Program deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error deleting program:", err);
      setSnackbar({
        open: true,
        message: "Error deleting program!",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // ✅ Move security event listeners inside useEffect
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      const blocked =
        e.key === "F12" ||
        e.key === "F11" ||
        (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && ["u", "p"].includes(e.key.toLowerCase()));
      if (blocked) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  // ✅ Styles now INSIDE the component
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-between",
      gap: "40px",
      flexWrap: "wrap",
    },
    formSection: {
      width: "48%",
      background: "#f8f8f8",
      padding: "25px",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      boxSizing: "border-box",
      border: `2px solid ${borderColor}`,
    },
    displaySection: {
      width: "48%",
      background: "#f8f8f8",
      padding: "25px",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      overflowY: "auto",
      maxHeight: "600px",
      boxSizing: "border-box",
      border: `2px solid ${borderColor}`,
    },
    formGroup: { marginBottom: "20px" },
    label: {
      display: "block",
      marginBottom: "8px",
      fontWeight: "bold",
      color: "#444",
      fontSize: "16px",
    },
    input: {
      width: "100%",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    taggedProgramsContainer: {
      overflowY: "auto",
      maxHeight: "500px",
      marginTop: "15px",
    },
    table: { width: "100%", borderCollapse: "collapse" },
    th: {

      padding: "15px",
      textAlign: "left",
      fontWeight: "bold",
      border: `2px solid ${borderColor}`,
      fontSize: "16px",
      backgroundColor: settings?.header_color || "#1976d2",
      color: "#fff"
    },
    td: {
      padding: "12px",
      textAlign: "left",
      borderBottom: "1px solid #ddd",
      fontSize: "16px",
      border: `2px solid ${borderColor}`,
    },
    editButton: {
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
    },
    deleteButton: {
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
          sx={{ fontWeight: "bold", color: titleColor, fontSize: "36px" }}
        >
          PROGRAM PANEL
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <div style={styles.container}>
        <div style={styles.formSection}>
          <div style={styles.formGroup}>
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "left", color: subtitleColor, }}
            >
              Add Program
            </Typography>
            <label htmlFor="program_name" style={styles.label}>
              Program Description:
            </label>
            <input
              type="text"
              id="program_name"
              name="name"
              value={program.name}
              onChange={handleChangesForEverything}
              placeholder="Enter Program Description"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="program_code" style={styles.label}>
              Program Code:
            </label>
            <input
              type="text"
              id="program_code"
              name="code"
              value={program.code}
              onChange={handleChangesForEverything}
              placeholder="Enter Program Code"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="program_major" style={styles.label}>
              Major:
            </label>
            <input
              type="text"
              id="program_major"
              name="major"
              value={program.major}
              onChange={handleChangesForEverything}
              placeholder="Enter Major (e.g., Marketing Management)"
              style={styles.input}
            />
          </div>


          <Button
            onClick={handleAddingProgram}
            variant="contained"
            sx={{
              backgroundColor: "primary",
              color: "white",
              mt: 3,
              width: "100%",
              "&:hover": { backgroundColor: "#000000" },
            }}
          >
            {editMode ? "Update Program" : "Insert Program"}
          </Button>
        </div>

        <div style={styles.displaySection}>
          <Typography
            variant="h6"
            sx={{ mb: 2, textAlign: "center", color: subtitleColor, }}
          >
            Program List
          </Typography>

          <div style={styles.taggedProgramsContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Major</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((prog) => (
                  <tr key={prog.program_id}>
                    <td style={styles.td}>{prog.program_id}</td>
                    <td style={styles.td}>{prog.program_description}</td>
                    <td style={styles.td}>{prog.program_code}</td>
                    <td style={styles.td}>{prog.major || "—"}</td>
                    <td style={{ ...styles.td, textAlign: "center" }}>
                      <button
                        onClick={() => handleEdit(prog)}
                        style={styles.editButton}
                      >
                        <EditIcon fontSize="small" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prog.program_id)}
                        style={styles.deleteButton}
                      >
                        <DeleteIcon fontSize="small" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
            {programs.length === 0 && <p>No programs available.</p>}
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProgramPanel;
