import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const ChangeGradingPeriod = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");

  const [gradingPeriod, setGradingPeriod] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [userID, setUserID] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const pageId = 14;

  // 🌟 Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch grading periods
  const fetchYearPeriod = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get-grading-period`);
      setGradingPeriod(response.data);
    } catch (error) {
      console.error("Error fetching grading periods", error);
      setSnackbar({ open: true, message: "Failed to fetch grading periods", severity: "error" });
    }
  };

  useEffect(() => {
    if (!settings) return;

    setTitleColor(settings.title_color || "#000000");
    setSubtitleColor(settings.subtitle_color || "#555555");
    setBorderColor(settings.border_color || "#000000");
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
    } catch (error) {
      console.error("Error checking access", error);
      setHasAccess(false);
      setSnackbar({ open: true, message: "Failed to check access", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYearPeriod();
  }, []);

  const handlePeriodActivate = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/grade_period_activate/${id}`);
      setSnackbar({ open: true, message: "Grading period activated!", severity: "success" });
      fetchYearPeriod();
    } catch (error) {
      console.error("Error activating grading period:", error);
      setSnackbar({ open: true, message: "Failed to activate grading period", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: titleColor, fontSize: "36px" }}>
          GRADING PERIOD
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      <Box sx={{ mt: 3 }}>
        {gradingPeriod.map((period) => (
          <Box
            key={period.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: `2px solid ${borderColor}`,
              padding: "15px",
              backgroundColor: "#fff",
              margin: "20px auto",
              width: "50%",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: 500, color: "#333" }}>
              {period.description}
            </Typography>
            <Box>
              {period.status === 1 ? (
                <Typography sx={{ color: "#757575", fontSize: "16px" }}>Activated</Typography>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => handlePeriodActivate(period.id)}
                  sx={{ backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#45a049" } }}
                >
                  Activate
                </Button>
              )}
            </Box>
          </Box>
        ))}
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

export default ChangeGradingPeriod;
