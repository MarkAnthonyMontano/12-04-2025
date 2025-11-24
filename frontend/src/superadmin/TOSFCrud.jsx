import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";

const TOSF = () => {
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
  const [loading, setLoading] = useState(false);
  const pageId = 99;

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

  const [tosfData, setTosfData] = useState([]);
  const [formData, setFormData] = useState({
    athletic_fee: "",
    cultural_fee: "",
    developmental_fee: "",
    guidance_fee: "",
    library_fee: "",
    medical_and_dental_fee: "",
    registration_fee: "",
    computer_fee: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch all TOSF data
  const fetchTosf = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/tosf`);
      setTosfData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Error fetching data", "error");
    }
  };

  useEffect(() => {
    fetchTosf();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Show snackbar
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle submit for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_BASE_URL}/update_tosf/${editingId}`, formData);
        showSnackbar("Data successfully updated!");
      } else {
        await axios.post(`${API_BASE_URL}/insert_tosf`, formData);
        showSnackbar("Data successfully inserted!");
      }
      setFormData({
        athletic_fee: "",
        cultural_fee: "",
        developmental_fee: "",
        guidance_fee: "",
        library_fee: "",
        medical_and_dental_fee: "",
        registration_fee: "",
        computer_fee: "",
      });
      setEditingId(null);
      fetchTosf();
    } catch (error) {
      console.error("Error submitting data:", error);
      showSnackbar("Error while saving data", "error");
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item.tosf_id);
  };

  // Open delete dialog
  const handleDeleteDialog = (tosf_id) => {
    setSelectedId(tosf_id);
    setDialogOpen(true);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/delete_tosf/${selectedId}`);
      showSnackbar("Data successfully deleted!");
      fetchTosf();
    } catch (error) {
      console.error("Error deleting data:", error);
      showSnackbar("Error while deleting data", "error");
    } finally {
      setDialogOpen(false);
      setSelectedId(null);
    }
  };

  // Cancel delete
  const handleDeleteCancel = () => {
    setDialogOpen(false);
    setSelectedId(null);
  };

  // ✅ Access Guards
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Checking Access..." />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }


  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        backgroundColor: "transparent",
        paddingRight: "20px",   // only right spacing
        boxSizing: "border-box",
      }}
    >

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
          TOSF MANAGEMENT
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />


      {/* TITLE */}
      <TableContainer component={Paper} sx={{ width: "100%", border: `2px solid ${borderColor}` }}>
        <Table>
          <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
                TOSF MANAGEMENT
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>

      {/* FORM CONTAINER */}
      <Paper sx={{ padding: 2, mb: 3, border: `2px solid ${borderColor}` }}>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 2,
            }}
          >
            {Object.keys(formData).map((key) => (
              <Box key={key} sx={{ display: "flex", flexDirection: "column" }}>
                <Typography sx={{ fontWeight: "500", mb: 0.5 }}>
                  {key.replace(/_/g, " ").toUpperCase()}
                </Typography>
                <TextField
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  variant="outlined"
                  size="small"
                  required
                />
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button
              type="submit"
              variant="contained"
              color={editingId ? "warning" : "primary"}
            >
              {editingId ? "Update Record" : "Add Record"}
            </Button>

            {editingId && (
              <Button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    athletic_fee: "",
                    cultural_fee: "",
                    developmental_fee: "",
                    guidance_fee: "",
                    library_fee: "",
                    medical_and_dental_fee: "",
                    registration_fee: "",
                    computer_fee: "",
                  });
                }}
                variant="outlined"
                color="secondary"
                sx={{ ml: 2 }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* TABLE SECTION */}
      <TableContainer component={Paper} sx={{ border: `2px solid ${borderColor}` }}>
        <Table>
          <TableHead
            style={{
              border: `2px solid ${borderColor}`,
              backgroundColor: settings?.header_color || "#1976d2",
            }}
          >
            <TableRow>
              {[
                "ID",
                "Athletic Fee",
                "Cultural Fee",
                "Developmental Fee",
                "Guidance Fee",
                "Library Fee",
                "Medical & Dental",
                "Registration Fee",
                "Computer Fee",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  style={{
                    border: `2px solid ${borderColor}`,
                    color: "white",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tosfData.map((item) => (
              <TableRow key={item.tosf_id}>
                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.tosf_id}
                </TableCell>

                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.athletic_fee}
                </TableCell>

                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.cultural_fee}
                </TableCell>

                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.developmental_fee}
                </TableCell>

                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.guidance_fee}
                </TableCell>

                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.library_fee}
                </TableCell>

                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.medical_and_dental_fee}
                </TableCell>

                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.registration_fee}
                </TableCell>

                <TableCell style={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                  {item.computer_fee}
                </TableCell>

                {/* ACTIONS SIDE BY SIDE */}
                <TableCell
                  style={{
                    border: `2px solid ${borderColor}`,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Button
                    onClick={() => handleEdit(item)}
                    size="small"
                    sx={{
                      backgroundColor: "green",
                      color: "white",
                      borderRadius: "5px",
                      marginRight: "6px",
                      width: "85px",
                      height: "35px",
                    }}
                  >
                    Edit
                  </Button>

                  <Button
                    onClick={() => handleDeleteDialog(item.tosf_id)}
                    size="small"
                    sx={{
                      backgroundColor: "#9E0000",
                      color: "white",
                      borderRadius: "5px",
                      width: "85px",
                      height: "35px",
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TOSF;
