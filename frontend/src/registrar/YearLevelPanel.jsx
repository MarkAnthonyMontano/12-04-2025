import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Typography, Button, TextField, Snackbar, Alert } from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const YearLevelPanel = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");

  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 63;

  const [yearLevelDescription, setYearLevelDescription] = useState("");
  const [yearLevelList, setYearLevelList] = useState([]);

  // 🌟 Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!settings) return;
    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
  }, [settings]);

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");
    const storedEmployeeID = localStorage.getItem("employee_id");

    if (storedUser && storedRole && storedID) {
      setUserID(storedID);
      setUserRole(storedRole);
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
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/page_access/${employeeID}/${pageId}`);
      setHasAccess(response.data?.page_privilege === 1);
    } catch (err) {
      console.error("Error checking access:", err);
      setHasAccess(false);
      setSnackbar({ open: true, message: "Failed to check access", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchYearLevelList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_year_level`);
      setYearLevelList(res.data);
    } catch (err) {
      console.error("Failed to fetch year levels:", err);
      setSnackbar({ open: true, message: "Failed to fetch year levels", severity: "error" });
    }
  };

  useEffect(() => {
    fetchYearLevelList();
  }, []);

  const handleAddYearLevel = async () => {
    if (!yearLevelDescription.trim()) {
      setSnackbar({ open: true, message: "Year level description is required", severity: "warning" });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/years_level`, {
        year_level_description: yearLevelDescription,
      });
      setYearLevelDescription("");
      fetchYearLevelList();
      setSnackbar({ open: true, message: "Year level added successfully!", severity: "success" });
    } catch (err) {
      console.error("Error adding year level:", err);
      setSnackbar({ open: true, message: "Failed to add year level", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // 🔒 Disable right-click & DevTools
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      const isBlockedKey =
        e.key === "F12" ||
        e.key === "F11" ||
        (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && ["u", "p"].includes(e.key.toLowerCase()));
      if (isBlockedKey) {
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

  if (loading || hasAccess === null) return <LoadingOverlay open={loading} message="Check Access" />;
  if (!hasAccess) return <Unauthorized />;

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: titleColor, fontSize: '36px' }}>
          YEAR LEVEL PANEL
        </Typography>
      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mt: 4 }}>
        {/* Form Section */}
        <Box sx={{ flex: 1, p: 3, bgcolor: "#fff", border: `2px solid ${borderColor}`, boxShadow: 2, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ color: subtitleColor }}>
            Add Year Level
          </Typography>
           <Typography fontWeight={500}>Year Level Description:</Typography>
          <TextField
            fullWidth
            label="Year Level Description"
            value={yearLevelDescription}
            onChange={(e) => setYearLevelDescription(e.target.value)}
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, backgroundColor: "#1967d2", ":hover": { bgcolor: "#000000" } }}
            onClick={handleAddYearLevel}
          >
            Save
          </Button>
        </Box>

        {/* Display Section */}
        <Box sx={{ flex: 1, p: 3, bgcolor: "#fff", boxShadow: 2, borderRadius: 2, border: `2px solid ${borderColor}`, overflowY: "auto", maxHeight: 500 }}>
          <Typography variant="h6" gutterBottom sx={{ color: subtitleColor }}>
            Registered Year Levels
          </Typography>
          <Box sx={{ overflowY: "auto", maxHeight: 400 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: settings?.header_color || "#1976d2", color: "#ffffff", border: `2px solid ${borderColor}` }}>
                  <th style={styles.tableCell}>Year Level ID</th>
                  <th style={styles.tableCell}>Year Level Description</th>
                </tr>
              </thead>
              <tbody>
                {yearLevelList.map((level, index) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>{level.year_level_id}</td>
                    <td style={styles.tableCell}>{level.year_level_description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

const styles = {
  tableCell: {
    border: "1px solid #000000",
    padding: "10px",
    textAlign: "center",
  },
};

export default YearLevelPanel;
