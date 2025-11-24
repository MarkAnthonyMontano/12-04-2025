import React, { useContext, useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { SettingsContext } from "../App";
import DefaultLogo from "../assets/EaristLogo.png";
import API_BASE_URL from "../apiConfig";
const LoadingOverlay = ({ open, message }) => {
  const settings = useContext(SettingsContext);
  const [fetchedLogo, setFetchedLogo] = useState(DefaultLogo);
  const [companyName, setCompanyName] = useState("Loading...");

  useEffect(() => {
    if (settings) {
      // ✅ Load dynamic logo from settings context
      if (settings.logo_url) {
        setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
      } else {
        setFetchedLogo(DefaultLogo);
      }

      // ✅ Load company name
      if (settings.company_name) {
        setCompanyName(settings.company_name);
      } else {
        setCompanyName("Your Institution");
      }
    }
  }, [settings]);

  if (!open) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(255, 248, 225, 0.95)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        flexDirection: "column",
      }}
    >
      {/* Circular border animation */}
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          size={120}
          thickness={3}
          sx={{
            color: "#A31D1D",
            animationDuration: "800ms",
          }}
        />

        {/* Dynamic Logo */}
        <Box
          component="img"
          src={fetchedLogo}
          alt={`${companyName} Logo`}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 70,
            height: 70,
            borderRadius: "50%",
            bgcolor: "white",
            p: 1,
            boxShadow: "0 0 15px rgba(163, 29, 29, 0.5)",
            animation: "heartbeat 1.5s ease-in-out infinite",
          }}
        />
      </Box>

      {/* Message */}
      <Typography
        variant="h6"
        sx={{
          mt: 3,
          color: "#A31D1D",
          fontWeight: "bold",
          animation: "pulse 1.5s infinite",
        }}
      >
        {message || `${companyName} is loading...`}
      </Typography>

      {/* Keyframes */}
      <style>
        {`
          @keyframes heartbeat {
            0% { transform: translate(-50%, -50%) scale(1); }
            25% { transform: translate(-50%, -50%) scale(1.1); }
            50% { transform: translate(-50%, -50%) scale(1); }
            75% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
};

export default LoadingOverlay;
