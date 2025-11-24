import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  Snackbar,
  Alert,
  Box,
  Container,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import "../styles/Container.css";
import Logo from "../assets/Logo.png";
import { Email } from "@mui/icons-material";
import ReCAPTCHA from "react-google-recaptcha";
import { SettingsContext } from "../App"; // ✅ import context for bg_image and logo
import API_BASE_URL from "../apiConfig";
const RegistrarForgotPassword = () => {
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

  const [capVal, setCapVal] = useState(null);
  const [email, setEmail] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [loading, setLoading] = useState(false);
  const [currentYear, setCurrentYear] = useState(""); // ✅ year based on Manila time

  useEffect(() => {
    // ✅ Get year based on Manila (GMT+8)
    const now = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    const year = new Date(now).getFullYear();
    setCurrentYear(year);
  }, []);

  const handleReset = async () => {
    if (!email) {
      setSnack({
        open: true,
        message: "Please enter your email.",
        severity: "warning",
      });
      return;
    }

    if (!capVal) {
      setSnack({
        open: true,
        message: "Please verify you're not a robot.",
        severity: "warning",
      });
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email,
      });
      setSnack({
        open: true,
        message: res.data.message,
        severity: "success",
      });
    } catch (err) {
      setSnack({
        open: true,
        message: err.response?.data?.message || "Something went wrong.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };




  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  const isButtonDisabled = !email || !capVal || loading;

  // ✅ use dynamic background and logo from settings
  const backgroundImage = settings?.bg_image
    ? `url(${API_BASE_URL}${settings.bg_image})`
    : "url(/default-bg.jpg)";

  const logoSrc = settings?.logo_url
    ? `${API_BASE_URL}${settings.logo_url}`
    : Logo;

  return (
    <Box
      sx={{
        backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        maxWidth={false}
      >
        <div style={{ border: "5px solid black" }} className="Container">
          {/* Header */}
          <div
            className="Header"
            style={{
              backgroundColor: settings?.header_color || "#1976d2", // ✅ default blue
              padding: "1rem 0",
              borderBottom: "3px solid black",
            }}
          >

            <div className="HeaderTitle">
              <div className="CircleCon">
                <img src={logoSrc} alt="EARIST Logo" />
              </div>
            </div>
            <div className="HeaderBody">
              <strong style={{
                color: "white",
              }}>{settings?.company_name || "Company Name"}</strong>
              <p>Student Information System</p>
            </div>
          </div>

          {/* Body */}
          <div className="Body">
            <label htmlFor="email">Email Address:</label>
            <TextField
              fullWidth
              type="email"
              style={{ border: `2px solid ${borderColor}`, borderRadius: "5px" }}
              placeholder="Enter your Email Address (e.g., username@gmail.com)"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
                sx: {
                  height: "50px",
                  "& input": {
                    height: "50px",
                    padding: "0 10px",
                    boxSizing: "border-box",

                  },
                },
              }}
            />

            {/* CAPTCHA */}
            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
              <ReCAPTCHA
                sitekey="6Lfem44rAAAAAEeAexdQxvN0Lpm1V4KPu1bBxaGy"
                onChange={(val) => setCapVal(val)}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                onClick={handleReset}
                variant="contained"
                disabled={isButtonDisabled}
                sx={{
                  width: "100%",
                  py: 1.5,
                  backgroundColor: mainButtonColor,
                  border: `2px solid ${borderColor}`, 
                  color: "white",
                  height: "50px",
                  borderRadius: "10px"

                }}
              >
                {loading ? "Sending..." : "Reset Password"}
              </Button>
            </Box>

            {/* Back to login */}
            <div className="LinkContainer" style={{ marginTop: "1rem" }}>
              <p>To go to login page,</p>
              <span>
                <Link to="/" style={{ textDecoration: "underline" }}>
                  Click here
                </Link>
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="Footer">
            <div className="FooterText">
              &copy; {currentYear}{" "}
              {settings?.company_name || "EARIST"} Student Information System. All rights reserved.
            </div>
          </div>
        </div>
      </Container>

      {/* Snackbar Notification */}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={handleClose} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegistrarForgotPassword;
