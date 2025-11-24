import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Grid,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const API = `${API_BASE_URL}/api/email-templates`;


export default function EmailTemplateManager() {


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


  // Also put it at the very top
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");

  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);


  const pageId = 67;

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






  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ sender_name: "", is_active: true });
  const [editing, setEditing] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // ✅ Fetch templates on load
  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const res = await axios.get(API);
      setRows(res.data || []);
    } catch (err) {
      console.error("Failed to load templates:", err);
      showSnack("Failed to load templates", "error");
    }
  };

  const showSnack = (message, severity = "info") =>
    setSnack({ open: true, message, severity });

  // ✅ Add template
  const handleAdd = async () => {
    if (!form.sender_name.trim()) {
      showSnack("Sender name is required", "warning");
      return;
    }

    try {
      await axios.post(API, form);
      showSnack("Template successfully added", "success");
      setForm({ sender_name: "", is_active: true });
      loadTemplates();
    } catch (err) {
      console.error("Error adding template:", err);
      showSnack("Failed to add template", "error");
    }
  };

  // ✅ Edit template
  const handleEdit = (row) => {
    setEditing(row.template_id);
    setForm({ sender_name: row.sender_name, is_active: !!row.is_active });
  };

  // ✅ Update template
  const handleUpdate = async () => {
    if (!editing) return;

    try {
      await axios.put(`${API}/${editing}`, form);
      showSnack("Template updated successfully", "success");
      setEditing(null);
      setForm({ sender_name: "", is_active: true });
      loadTemplates();
    } catch (err) {
      console.error("Error updating template:", err);
      showSnack("Failed to update template", "error");
    }
  };

  // ✅ Delete template
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    try {
      await axios.delete(`${API}/${id}`);
      showSnack("Template deleted successfully", "success");
      loadTemplates();
    } catch (err) {
      console.error("Error deleting template:", err);
      showSnack("Failed to delete template", "error");
    }
  };

  const handleCloseSnack = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((prev) => ({ ...prev, open: false }));
  };


  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/departments`); // create this API
        setDepartments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepartments();
  }, []);


  // 🔒 Disable right-click + block dev tools
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("keydown", (e) => {
    const isBlocked =
      e.key === "F12" ||
      e.key === "F11" ||
      (e.ctrlKey &&
        e.shiftKey &&
        (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")) ||
      (e.ctrlKey && e.key.toLowerCase() === "u") ||
      (e.ctrlKey && e.key.toLowerCase() === "p");
    if (isBlocked) {
      e.preventDefault();
      e.stopPropagation();
    }
  });







  // Put this at the very bottom before the return 
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return (
      <Unauthorized />
    );
  }







  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent",
      }}
    >
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
          EMAIL TEMPLATE MANAGER
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Grid container spacing={4}>
        {/* ✅ Form Section */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{ p: 3, border: `2px solid ${borderColor}`, borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: subtitleColor, }}>
              {editing ? "Edit Email Template" : "Register New Template"}
            </Typography>

            <Typography fontWeight={500}>Sender Name:</Typography>
            <TextField
              fullWidth
              label="Sender Name"
              variant="outlined"
              value={form.sender_name}
              onChange={(e) =>
                setForm({ ...form, sender_name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <Typography fontWeight={500}>Department:</Typography>
            <TextField
              select
              fullWidth

              value={form.department_id || ""}
              onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              sx={{ mb: 2 }}
              SelectProps={{ native: true }}
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.dprtmnt_id} value={d.dprtmnt_id}>
                  {d.dprtmnt_name}
                </option>
              ))}
            </TextField>


            <FormControlLabel
              control={
                <Switch
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
              }
              label="Active"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={editing ? handleUpdate : handleAdd}
              sx={{
                backgroundColor: "#1967d2",

                "&:hover": { backgroundColor: "#000000" },
              }}
            >
              {editing ? "Update Template" : "Save"}
            </Button>
          </Paper>
        </Grid>

        {/* ✅ Table Section */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={3}
            sx={{ p: 3, border: `2px solid ${borderColor}`, borderRadius: 2 }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: subtitleColor, }}>
              Registered Templates
            </Typography>

            <Box
              sx={{
                maxHeight: 400,
                overflowY: "auto",
                backgroundColor: settings?.table_bg_color || "#ffffff", // Table container bg
                border: `2px solid ${borderColor}`, // Outer border
                borderRadius: 1, // optional: rounded corners
              }}
            >
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: settings?.header_color || "#1976d2", // Header color from settings
                    }}
                  >
                    <TableCell sx={{ fontWeight: "bold", border: `2px solid ${borderColor}`,  backgroundColor: settings?.header_color || "#1976d2", color: "#fff"}}>#</TableCell>
                    <TableCell sx={{ fontWeight: "bold", border: `2px solid ${borderColor}`,  backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Gmail Account</TableCell>
                    <TableCell sx={{ fontWeight: "bold", border: `2px solid ${borderColor}`,  backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: "bold", border: `2px solid ${borderColor}`,  backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Active</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "150px", border: `2px solid ${borderColor}`,  backgroundColor: settings?.header_color || "#1976d2", color: "#fff", textAlign: "center" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ border: `2px solid ${borderColor}` }}>
                        No templates found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r, index) => (
                      <TableRow key={r.template_id}>
                        <TableCell sx={{ border: `2px solid ${borderColor}` }}>{index + 1}</TableCell>
                        <TableCell sx={{ border: `2px solid ${borderColor}` }}>{r.sender_name}</TableCell>
                        <TableCell sx={{ border: `2px solid ${borderColor}` }}>{r.department_name || "N/A"}</TableCell>
                        <TableCell sx={{ border: `2px solid ${borderColor}` }}>{r.is_active ? "Yes" : "No"}</TableCell>
                        <TableCell sx={{ width: "150px", border: `2px solid ${borderColor}` }}>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: "green",
                                color: "white",

                              }}
                              onClick={() => handleEdit(r)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{
                                backgroundColor: "#B22222",
                                color: "white",
                              }}
                              onClick={() => handleDelete(r.template_id)}
                            >
                              Delete
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>

          </Paper>
        </Grid>
      </Grid>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={handleCloseSnack}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
