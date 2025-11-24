import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RegistrarExamPermit from "../registrar/RegistrarExamPermit";
import {
  TextField,
  Button,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import QRScanner from "./QRScanner";
import API_BASE_URL from "../apiConfig";
const ApplicantProfile = () => {
  const { applicantNumber } = useParams();
  const navigate = useNavigate();

  const [personId, setPersonId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(applicantNumber || "");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "info" });

  const showSnackbar = (message, type = "info") => {
    setSnackbar({ open: true, message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const fetchApplicantData = async (query) => {
    if (!query) return;

    try {
      // 1️⃣ Get person_id by applicant_number
      const res = await axios.get(`${API_BASE_URL}/api/person-by-applicant/${query}`);
      if (!res.data?.person_id) {
        showSnackbar("❌ Applicant not found.", "error");
        setPersonId(null);
        return;
      }

      const pid = res.data.person_id;

      // 2️⃣ Check document verification
      const verifiedRes = await axios.get(`${API_BASE_URL}/api/document_status/check/${query}`);
      if (!verifiedRes.data.verified) {
        showSnackbar("❌ Documents not yet verified. Not qualified for exam.", "error");
        setPersonId(null);
        return;
      }

      // 3️⃣ Get applicant scores (from admission_exam + person_status_table)
      const scoreRes = await axios.get(`${API_BASE_URL}/api/applicant-scores/${query}`);

      const {
        entrance_exam_score,      // from admission_exam.final_rating
        qualifying_result,        // from person_status_table
        interview_result          // from person_status_table
      } = scoreRes.data || {};

      // 🧮 Determine current applicant status
      if (!entrance_exam_score) {
        showSnackbar(
          "📝 Documents verified. This applicant can proceed with taking the Entrance Examination.",
          "info"
        );
      }
      else if (entrance_exam_score && !qualifying_result) {
        showSnackbar(
          "✅ Applicant passed Entrance Exam. Proceed to Qualifying Examination.",
          "success"
        );
      }
      else if (qualifying_result && !interview_result) {
        showSnackbar(
          "✅ Applicant passed Qualifying Exam. Proceed to Interview.",
          "success"
        );
      }
      else if (interview_result) {
        showSnackbar(
          "🏁 Applicant has completed Entrance, Qualifying, and Interview Exams.",
          "success"
        );
      }

      // 4️⃣ Check acceptance (medical step)
      const statusRes = await axios.get(`${API_BASE_URL}/api/applicant-status/${query}`);
      if (statusRes.data?.found && statusRes.data.status === "Accepted") {
        showSnackbar("🎉 Applicant ACCEPTED! Proceed to Medical.", "success");
        setPersonId(pid);
        return;
      }

      setPersonId(pid);

    } catch (err) {
      console.error("Error fetching applicant:", err);
      showSnackbar("⚠️ Error fetching applicant data. Check console for details.", "error");
      setPersonId(null);
    }
  };


  useEffect(() => {
    if (searchQuery) fetchApplicantData(searchQuery);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/applicant_profile/${searchQuery.trim()}`);
      fetchApplicantData(searchQuery.trim());
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          mb: 2,
          px: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "maroon",
            fontSize: "36px",
          }}
        >
          APPLICANT PROFILE
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Enter Applicant Number"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CameraAltIcon />}
          onClick={() => setScannerOpen(true)}
        >
          Scan QR
        </Button>
      </Box>

      {/* 📷 QR Scanner Dialog */}
      <QRScanner
        open={scannerOpen}
        onScan={(text) => {
          let scannedNumber = String(text || "").trim();
          if (scannedNumber.includes("/")) {
            scannedNumber = scannedNumber.split("/").pop();
          }

          setScannerOpen(false);
          setSearchQuery(scannedNumber);
          showSnackbar(`📷 Scanned Applicant Number: ${scannedNumber}`, "info");

          // Delay to ensure scanner closes before search starts
          setTimeout(() => handleSearch(), 500);
        }}
        onClose={() => setScannerOpen(false)}
      />

      {/* 📝 Display Exam Permit if applicant is valid */}
      {personId ? (
        <RegistrarExamPermit personId={personId} />
      ) : (
        searchQuery && <div>Invalid Applicant Number or not found.</div>
      )}

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.type} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApplicantProfile;
