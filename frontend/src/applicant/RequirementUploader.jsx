import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Container,
  TableHead,
  TableRow,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import ErrorIcon from "@mui/icons-material/Error";
import API_BASE_URL from "../apiConfig";


const RequirementUploader = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

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

  const [requirements, setRequirements] = useState([]); // ✅ dynamic requirements

  const [uploads, setUploads] = useState([]);
  const [userID, setUserID] = useState('');
  const [selectedFiles, setSelectedFiles] = useState({});
  const [allRequirementsCompleted, setAllRequirementsCompleted] = useState(
    localStorage.getItem("requirementsCompleted") === "1"
  );
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const id = localStorage.getItem('person_id');
    if (id) {
      setUserID(id);
      fetchUploads(id);
    }

    // ✅ Fetch all requirements dynamically from backend
    axios.get(`${API_BASE_URL}/requirements`)
      .then((res) => setRequirements(res.data))
      .catch((err) => console.error("Error loading requirements:", err));
  }, []);

  const fetchUploads = async (personId) => {
    try {
      // ✅ Fetch user's uploaded files
      const res = await axios.get(`${API_BASE_URL}/uploads`, {
        headers: { "x-person-id": personId },
      });
      const uploadsData = res.data;
      setUploads(uploadsData);

      // ✅ Map uploaded files to their requirement IDs
      const rebuiltSelectedFiles = {};
      uploadsData.forEach((upload) => {
        rebuiltSelectedFiles[upload.requirements_id] = upload.original_name;
      });
      setSelectedFiles(rebuiltSelectedFiles);

      // ✅ Get all verifiable requirements from DB
      const reqRes = await axios.get(`${API_BASE_URL}/requirements`);
      const verifiableRequirements = reqRes.data.filter((r) => r.is_verifiable === 1);

      // ✅ Compare uploaded vs required
      const uploadedIds = new Set(uploadsData.map((u) => u.requirements_id));
      const allRequiredUploaded =
        verifiableRequirements.every((r) => uploadedIds.has(r.id)) &&
        verifiableRequirements.length > 0;

      // ✅ Only show Congratulations if all required are uploaded (not every upload)
      if (!allRequirementsCompleted && allRequiredUploaded) {
        setSnack({
          open: true,
          message: `🎉 Congratulations! You have successfully submitted your Application at ${companyName}.`,
          severity: "success",
        });
      }

      // ✅ Update completion state
      setAllRequirementsCompleted(allRequiredUploaded);
      localStorage.setItem("requirementsCompleted", allRequiredUploaded ? "1" : "0");
    } catch (err) {
      console.error("❌ Fetch uploads failed:", err);
    }
  };


  const [totalRequirements, setTotalRequirements] = useState(0);


  useEffect(() => {
    const fetchTotalRequirements = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/total-requirements`);
        setTotalRequirements(res.data.total);
      } catch (err) {
        console.error("Error fetching total requirements:", err);
      }
    };

    fetchTotalRequirements();
  }, []);



  const handleUpload = async (key, file) => {
    if (!file) return;

    setSelectedFiles((prev) => ({ ...prev, [key]: file.name }));

    const requirementId = key;
    if (!requirementId) return alert('Requirement not found.');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('requirements_id', key); // ✅ key is already the doc.id
    formData.append('person_id', userID);

    try {
      await axios.post(`${API_BASE_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchUploads(userID);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload. Please try again.');
    }
  };



  const handleDelete = async (uploadId) => {
    try {
      await axios.delete(`${API_BASE_URL}/uploads/${uploadId}`, {
        headers: { 'x-person-id': userID }
      });

      fetchUploads(userID);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete. Please try again.');
    }
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack(prev => ({ ...prev, open: false }));
  };

  const renderRow = (doc) => {
    const uploaded = uploads.find((u) =>
      u.description && u.description.toLowerCase().includes(doc.label.toLowerCase())

    );

 


    return (
      <TableRow key={doc.id}>
        <TableCell sx={{ fontWeight: 'bold', width: '25%', border: `2px solid ${borderColor}` }}>{doc.label}</TableCell>
        <TableCell sx={{ width: '25%', border: `2px solid ${borderColor}`, textAlign: "Center" }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <Box sx={{ width: '220px', flexShrink: 0, textAlign: "center" }}>
              {selectedFiles[doc.id] ? (
                <Box
                  sx={{
                    backgroundColor: '#e0e0e0',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={selectedFiles[doc.id]}
                >
                  {selectedFiles[doc.id]}
                </Box>
              ) : (
                <Box sx={{ height: '40px' }} />
              )}
            </Box>

            <Box sx={{ flexShrink: 0 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: '#F0C03F',
                  color: 'white',
                  fontWeight: 'bold',
                  height: '40px',
                  textTransform: 'none',
                  minWidth: '140px',
                }}
              >
                Browse File
                <input
                  key={selectedFiles[doc.key] || Date.now()}
                  hidden
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => handleUpload(doc.id, e.target.files[0])}

                />
              </Button>
            </Box>
          </Box>
        </TableCell>

        <TableCell sx={{ width: "25%", border: `2px solid ${borderColor}` }}>
          <Typography
            sx={{
              fontStyle: uploaded?.remarks ? "normal" : "italic",
              color: uploaded?.remarks ? "inherit" : "#888",
            }}
          >
            {uploaded?.remarks || ""}
          </Typography>

          {uploaded?.status == 1 || uploaded?.status == 2 ? (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: "14px",
                color: uploaded?.status == 1 ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {uploaded?.status == 1 ? "Verified" : "Rejected"}
            </Typography>
          ) : null}
        </TableCell>

        <TableCell sx={{ width: '10%', border: `2px solid ${borderColor}` }}>
          {uploaded && (
            <Button
              variant="contained"
              color="primary"
              href={`${API_BASE_URL}/uploads/${uploaded.file_path}`}
              target="_blank"
              startIcon={<VisibilityIcon />}
              sx={{
                height: '40px',
                textTransform: 'none',
                minWidth: '100px',
                width: '100%',
              }}
            >
              Preview
            </Button>

          )}
        </TableCell>

        <TableCell sx={{ width: '10%', border: `2px solid ${borderColor}` }}>
          {uploaded && (
            <Button
              onClick={() => handleDelete(uploaded.upload_id)}
              startIcon={<DeleteIcon />}
              sx={{
                backgroundColor: 'maroon',
                color: 'white',
                '&:hover': { backgroundColor: '#600000' },
                fontWeight: 'bold',
                height: '40px',
                textTransform: 'none',
                minWidth: '100px',
                width: '100%',
              }}
            >
              Delete
            </Button>
          )}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>
      {/* ✅ Snackbar */}
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',


          mb: 2,

        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: titleColor,
            fontSize: '36px',
          }}
        >
          UPLOAD REQUIREMENTS
        </Typography>




      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      <br />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // ✅ Center horizontally
          width: "100%",
          mt: 2,
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // ✅ Center content inside full-width box
            gap: 2,
            width: "100%", // ✅ Still takes full width
            textAlign: "center",
            p: 2,
            borderRadius: "10px",
            backgroundColor: "#fffaf5",
            border: "1px solid #6D2323",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            whiteSpace: "nowrap",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#6D2323",
              borderRadius: "8px",
              width: 50,
              height: 50,
              flexShrink: 0,
            }}
          >
            <ErrorIcon sx={{ color: "white", fontSize: 40 }} />
          </Box>

          {/* Text */}
          <Typography
            sx={{
              fontSize: "20px",
              fontFamily: "Arial",
              color: "#3e3e3e",
              textAlign: "center",
              letterSpacing: "2px"
            }}
          >
            <strong style={{ color: "maroon" }}>Notice:</strong> &nbsp;
            <strong>
              PLEASE NOTE: ONLY JPG, JPEG, PNG or PDF WITH MAXIMUM OF FILE SIZE OF 4MB ARE ALLOWED
            </strong>
          </Typography>
        </Box>
      </Box>


      <Box sx={{ px: 2, marginLeft: "-10px" }}>
        {Object.entries(
          requirements.reduce((acc, r) => {
            const cat = r.category || "Regular";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(r);
            return acc;
          }, {})
        ).map(([category, docs]) => (
          <Box key={category} sx={{ mt: 4 }}>
            <Container>
              <h1
                style={{
                  fontSize: "45px",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: subtitleColor,
                  marginTop: "25px",
                }}
              >
                {category === "Medical"
                  ? "UPLOAD MEDICAL DOCUMENTS"
                  : category === "Others"
                    ? "OTHER REQUIREMENTS"
                    : "UPLOAD DOCUMENTS"}
              </h1>

              {/* 📝 Show message only below UPLOAD DOCUMENTS title */}
              {category !== "Medical" && category !== "Others" && (
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    marginTop: "10px",
                    marginBottom: "30px",
                    color: "#333",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    Complete the applicant form to secure your place for the upcoming academic year at{" "}
                    {shortTerm ? (
                      <>
                        <strong>{shortTerm.toUpperCase()}</strong> <br />
                        {companyName || ""}
                      </>
                    ) : (
                      companyName || ""
                    )}
                    .
                  </div>
                </div>
              )}
            </Container>

            <TableContainer
              component={Paper}
              sx={{ width: "95%", mt: 2, border: `2px solid ${borderColor}` }}
            >
              <Table>
                <TableHead sx={{  backgroundColor: settings?.header_color || "#1976d2", border: `2px solid ${borderColor}` }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", border: `2px solid ${borderColor}` }}>Document</TableCell>
                    <TableCell sx={{ color: "white", border: `2px solid ${borderColor}` }}>Upload</TableCell>
                    <TableCell sx={{ color: "white", border: `2px solid ${borderColor}`  }}>Remarks</TableCell>
                    <TableCell sx={{ color: "white", border: `2px solid ${borderColor}`  }}>Preview</TableCell>
                    <TableCell sx={{ color: "white", border: `2px solid ${borderColor}` }}>Delete</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {docs.map((doc) =>
                    renderRow({
                      id: doc.id,
                      label: doc.description,
                    })
                  )}

                </TableBody>

              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>

    </Box>
  );
};

export default RequirementUploader;
