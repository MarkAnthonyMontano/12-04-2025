import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const YearPanel = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");

  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [yearDescription, setYearDescription] = useState("");
  const [years, setYears] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const pageId = 64;

  // 🎨 Dynamic colors
  useEffect(() => {
    if (!settings) return;
    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
    if (settings.border_color) setBorderColor(settings.border_color);
  }, [settings]);

  // 👤 Access Check
  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");
    const storedEmployeeID = localStorage.getItem("employee_id");

    if (storedUser && storedRole && storedID) {
      setUserID(storedID);
      setUserRole(storedRole);
      setEmployeeID(storedEmployeeID);
      if (storedRole === "registrar") checkAccess(storedEmployeeID);
      else window.location.href = "/login";
    } else window.location.href = "/login";
  }, []);

  const checkAccess = async (employeeID) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/page_access/${employeeID}/${pageId}`);
      setHasAccess(response.data?.page_privilege === 1);
    } catch {
      setHasAccess(false);
      setSnackbar({ open: true, message: "Failed to check access", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  // 📊 Fetch Year Data
  const fetchYears = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/year_table`);
      setYears(res.data);
    } catch {
      setSnackbar({ open: true, message: "Failed to fetch years", severity: "error" });
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  // 💾 Save Year
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!yearDescription.trim()) return;

    try {
      await axios.post(`${API_BASE_URL}/years`, {
        year_description: yearDescription,
      });
      setYearDescription("");
      fetchYears();
      setSnackbar({ open: true, message: "Year saved successfully!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to save year", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  // 🔒 Disable Right-Click & DevTools
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

  if (loading || hasAccess === null) return <LoadingOverlay open={loading} message="Check Access" />;
  if (!hasAccess) return <Unauthorized />;

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: "bold", color: titleColor, mb: 2, fontSize: "36px" }}>
        YEAR PANEL
      </Typography>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      {/* Panel Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: "flex-start",
        }}
      >
        {/* Form Card */}
        <Box
          sx={{
            flex: 1,
            border: `2px solid ${borderColor}`,
            borderRadius: "12px",
            backgroundColor: "#fff",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            p: 3,
          }}
        >
          <Typography sx={{ color: subtitleColor, fontWeight: "bold", mb: 1, fontSize: "18px" }}>
            Add New Year
          </Typography>
           <Typography fontWeight={500}>Year Panel:</Typography>
          <input
            type="text"
            placeholder="Enter year (e.g., 2026)"
            value={yearDescription}
            onChange={(e) => setYearDescription(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "15px",
              fontSize: "16px",
            }}
          />
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#1976d2",
              color: "white",
              fontSize: "16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}

          >
            Save Year
          </button>
        </Box>

        {/* Table Card */}
        <Box
          sx={{
            flex: 1,
            border: `2px solid ${borderColor}`,
            borderRadius: "12px",
            backgroundColor: "#fff",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            p: 3,
          }}
        >
          <Typography sx={{ color: subtitleColor, fontWeight: "bold", mb: 2, fontSize: "18px" }}>
            Saved Years
          </Typography>
          <table
            className="w-full border border-gray-300"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: `2px solid ${borderColor}`,
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>
                <th style={{ border: `2px solid ${borderColor}`, padding: "10px" }}>Year</th>
                <th style={{ border: `2px solid ${borderColor}`, padding: "10px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {years.length > 0 ? (
                years.map((year) => (
                  <tr key={year.year_id}>
                    <td style={{ border: `2px solid ${borderColor}`, padding: "8px" }}>
                      {year.year_description}
                    </td>
                    <td style={{ border: `2px solid ${borderColor}`, padding: "8px" }}>
                      {year.status === 1 ? (
                        <span style={{ color: "green", fontWeight: "bold" }}>Active</span>
                      ) : (
                        <span style={{ color: "gray" }}>Inactive</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" style={{ padding: "15px", color: "#777" }}>
                    No year records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

export default YearPanel;
