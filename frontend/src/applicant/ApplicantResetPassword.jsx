import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Button,
  TextField,
  InputLabel,
  Typography,
  Paper,
  Box,
  Divider,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Cancel,
  LockReset,
} from "@mui/icons-material";
import API_BASE_URL from "../apiConfig";

const passwordRules = [
  { label: "Minimum of 8 characters", test: (pw) => pw.length >= 8 },
  { label: "At least one lowercase letter (e.g. abc)", test: (pw) => /[a-z]/.test(pw) },
  { label: "At least one uppercase letter (e.g. ABC)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "At least one number (e.g. 123)", test: (pw) => /\d/.test(pw) },
  { label: "At least one special character (! # $ ^ * @)", test: (pw) => /[!#$^*@]/.test(pw) },
];

const ApplicantResetPassword = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");


  useEffect(() => {
    if (settings) {
      if (settings.title_color) setTitleColor(settings.title_color);
      if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
      if (settings.border_color) setBorderColor(settings.border_color);
      if (settings.main_button_color) setMainButtonColor(settings.main_button_color);

    }
  }, [settings]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validations, setValidations] = useState([]);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");

    if (!(storedUser && storedRole && storedID && storedRole === "applicant")) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const results = passwordRules.map((rule) => rule.test(newPassword));
    setValidations(results);
  }, [newPassword]);

  const isValid = validations.every(Boolean) && newPassword === confirmPassword;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const person_id = localStorage.getItem("person_id");
      const response = await axios.post(`${API_BASE_URL}/applicant-change-password`, {
        person_id,
        currentPassword,
        newPassword,
      });

      setSnack({
        open: true,
        message: response.data.message,
        severity: "success",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setSnack({
        open: true,
        message: err.response?.data?.message || "Error updating password.",
        severity: "error",
      });
    }
  };

  const toggleShowPassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };


  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        backgroundColor: "transparent",

      }}
    >
      {/* 🔝 Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
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
          APPLICANT RESET PASSWORD
        </Typography>

      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      {/* 🔒 Password Form Section */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Paper
          elevation={6}
          sx={{
            p: 3,
            width: "40%",
            maxWidth: "540px",
            borderRadius: 4,
            backgroundColor: "#fff",
            border: `2px solid ${borderColor}`,   // ✅ APPLY DYNAMIC BORDER COLOR
            boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
            mb: 12,
          }}
        >

          {/* Lock Icon Header */}
          <Box textAlign="center" mb={2}>
            <LockReset
              sx={{
                fontSize: 80,
                color: "#000000",
                backgroundColor: "#f0f0f0",
                borderRadius: "50%",
                p: 1,
              }}
            />
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                mt: 1,
                color: subtitleColor,   // ✅ apply subtitle color here
              }}
            >
              Reset Your Password
            </Typography>

            <Typography fontSize={13} color="text.secondary">
              Update your password to keep your account secure.
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Form */}
          <form onSubmit={handleUpdate}>
            <Box mb={2}>
              <InputLabel>Current Password</InputLabel>
              <TextField
                fullWidth
                type={showPassword.current ? "text" : "password"}
                size="small"
                variant="outlined"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => toggleShowPassword("current")} edge="end">
                        {showPassword.current ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <InputLabel>New Password</InputLabel>
              <TextField
                fullWidth
                type={showPassword.new ? "text" : "password"}
                size="small"
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => toggleShowPassword("new")} edge="end">
                        {showPassword.new ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box mb={2}>
              <InputLabel>Confirm Password</InputLabel>
              <TextField
                fullWidth
                type={showPassword.confirm ? "text" : "password"}
                size="small"
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={Boolean(confirmPassword && confirmPassword !== newPassword)}
                helperText={
                  confirmPassword && confirmPassword !== newPassword
                    ? "Passwords do not match"
                    : ""
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => toggleShowPassword("confirm")} edge="end">
                        {showPassword.confirm ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Your new password must include:
            </Typography>

            <List dense disablePadding>
              {passwordRules.map((rule, i) => (
                <ListItem key={i}>
                  <ListItemIcon>
                    {validations[i] ? (
                      <CheckCircle sx={{ color: "green" }} />
                    ) : (
                      <Cancel sx={{ color: "red" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={rule.label} />
                </ListItem>
              ))}
            </List>

            <Typography variant="body2" color="warning.main" sx={{ mt: 1, mb: 2 }}>
              Note: You are required to change your password to continue using the system securely.
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid}
              sx={{
                py: 1.2,
                borderRadius: 2,
                backgroundColor: mainButtonColor,   // ✅ dynamic
                border: `2px solid ${borderColor}`, 
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: mainButtonColor,  // ✅ same color (prevents mismatch)
                  opacity: 0.9,                      // ✅ subtle hover effect
                },
              }}
            >
              Update Password
            </Button>

          </form>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApplicantResetPassword;
