import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const SuperAdminFacultyResetPassword = () => {
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
  const [searchQuery, setSearchQuery] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [searchError, setSearchError] = useState("");
  const pageId = 82;

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

  // 🔍 Auto fetch faculty info (by Employee ID, Name, or Email)
  useEffect(() => {
    const fetchInfo = async () => {
      if (!searchQuery) {
        setUserInfo(null);
        setSearchError("");
        return;
      }

      setLoading(true);
      setResetMsg("");
      setSearchError("");

      try {
        const res = await axios.post(
          `${API_BASE_URL}/superadmin-get-faculty`,
          { search: searchQuery }
        );
        setUserInfo(res.data);
      } catch (err) {
        setSearchError(err.response?.data?.message || "No faculty found.");
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchInfo, 600);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // 🔁 Reset password
  const handleReset = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/superadmin-reset-faculty`,
        { email: userInfo.email }
      );
      setResetMsg(res.data.message);
    } catch (err) {
      setSearchError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Update status
  const handleStatusChange = async (e) => {
    const newStatus = parseInt(e.target.value, 10);
    setUserInfo((prev) => ({ ...prev, status: newStatus }));

    try {
      await axios.post(`${API_BASE_URL}/superadmin-update-status-faculty`, {
        email: userInfo.email,
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  // 🔒 Security
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const blocked =
      e.key === "F12" ||
      e.key === "F11" ||
      (e.ctrlKey && e.shiftKey && ["i", "j"].includes(e.key.toLowerCase())) ||
      (e.ctrlKey && ["u", "p"].includes(e.key.toLowerCase()));
    if (blocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

// ✅ Access Guards
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Checking Access..." />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }
  return (
    <Box>
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
          FACULTY RESET PASSWORD
        </Typography>

        <TextField
          size="small"
          placeholder="Search Employee ID / Name / Email Address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: 450,
            backgroundColor: "#fff",
            borderRadius: 1,
            "& .MuiOutlinedInput-root": { borderRadius: "10px" },
          }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
          }}
        />
      </Box>

      {searchError && <Typography color="error">{searchError}</Typography>}
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Paper sx={{ p: 3, border: `2px solid ${borderColor}`, }}>
        <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }} gap={2}>
          <TextField
            label="Employee ID"
            value={userInfo?.employee_id || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Email"
            value={userInfo?.email || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Full Name"
            value={userInfo?.fullName || ""}
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            select
            label="Status"
            value={userInfo?.status ?? ""}
            fullWidth
            onChange={handleStatusChange}
          >
            <MenuItem value={1}>Active</MenuItem>
            <MenuItem value={0}>Inactive</MenuItem>
          </TextField>
        </Box>

        <Box mt={3}>
          <Button
            variant="contained"
            style={{ backgroundColor: mainButtonColor, color: "white" }}
            onClick={handleReset}
            disabled={!userInfo || loading}
          >
            {loading ? "Processing..." : "Reset Password"}
          </Button>
        </Box>
      </Paper>

      {resetMsg && (
        <Typography sx={{ mt: 2 }} color="green">
          {resetMsg}
        </Typography>
      )}
    </Box>
  );
};

export default SuperAdminFacultyResetPassword;
