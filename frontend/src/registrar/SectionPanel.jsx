import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from 'axios';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Snackbar,
  Alert,
} from '@mui/material';
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const SectionPanel = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");

  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 57;

  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([]);

  // Snackbar state
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

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/section_table`);
      setSections(response.data);
    } catch (err) {
      console.log(err);
      setSnackbar({ open: true, message: "Failed to fetch sections", severity: "error" });
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!description.trim()) {
      setSnackbar({ open: true, message: "Section description is required", severity: "warning" });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/section_table`, { description });
      setDescription('');
      fetchSections();
      setSnackbar({ open: true, message: "Section added successfully!", severity: "success" });
    } catch (err) {
      console.log(err);
      setSnackbar({ open: true, message: "Failed to add section", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // 🔒 Disable right-click & DevTools shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      const isBlockedKey =
        e.key === 'F12' ||
        e.key === 'F11' ||
        (e.ctrlKey && e.shiftKey && ['i', 'j'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && ['u', 'p'].includes(e.key.toLowerCase()));
      if (isBlockedKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (loading || hasAccess === null) return <LoadingOverlay open={loading} message="Check Access" />;
  if (!hasAccess) return <Unauthorized />;

  return (
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: titleColor, fontSize: '36px' }}>
          SECTION PANEL FORM
        </Typography>
      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Box display="flex" gap={3}>
        {/* Left Form Section */}
        <Paper elevation={3} sx={{ flex: 1, p: 3, border: `2px solid ${borderColor}`, borderRadius: 2 }}>
          <Typography style={{ color: subtitleColor }} variant="h6" gutterBottom>
            Section Description
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2}>
               <Typography fontWeight={500}>Section Description:</Typography>
              <TextField
                label="Section Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ backgroundColor: "primary", color: '#fff' }}
              >
                Insert
              </Button>
            </Box>
          </form>
        </Paper>

        {/* Right Table Display Section */}
        <Paper elevation={3} sx={{ flex: 2, p: 3, border: `2px solid ${borderColor}`, borderRadius: 2 }}>
          <Typography style={{ color: subtitleColor }} variant="h6" gutterBottom>
            Section List
          </Typography>
          <TableContainer sx={{ maxHeight: 400, overflowY: 'auto' }}>
            <Table>
              <TableHead style={{ backgroundColor: settings?.header_color || "#1976d2", }}>
                <TableRow>
                  <TableCell sx={{border: `2px solid ${borderColor}`, color: "#fff" }}><strong>ID</strong></TableCell>
                  <TableCell sx={{border: `2px solid ${borderColor}`, color: "#fff" }}><strong>Section Description</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sections.map((section) => (
                  <TableRow key={section.id}>
                    <TableCell sx={{border: `2px solid ${borderColor}`, }}>{section.id}</TableCell>
                    <TableCell sx={{border: `2px solid ${borderColor}`, }}>{section.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
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

export default SectionPanel;
