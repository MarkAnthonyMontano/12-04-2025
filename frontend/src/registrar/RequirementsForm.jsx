import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const RequirementsForm = () => {
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


  const pageId = 51;

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



  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Regular"); // ✅ Default category
  const [requirements, setRequirements] = useState([]);
  const [shortLabel, setShortLabel] = useState("");
  const [documentStatus, setDocumentStatus] = useState("On Process");

  // ✅ Snackbar state
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnack = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  // ✅ Fetch all requirements
  const fetchRequirements = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/requirements`);
      setRequirements(res.data);
    } catch (err) {
      console.error("Error fetching requirements:", err);
      setSnack({
        open: true,
        message: "Failed to load requirements",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  // ✅ Handle submission of a new requirement
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setSnack({
        open: true,
        message: "Please enter a requirement description.",
        severity: "warning",
      });
      return;
    }
    if (!category) {
      setSnack({
        open: true,
        message: "Please select a category.",
        severity: "warning",
      });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/requirements`, {
        requirements_description: description,
        short_label: shortLabel,
        category: category,
        document_status: documentStatus,
      });
      setDescription("");
      setShortLabel("");
      setCategory("Regular");
      fetchRequirements();
      setSnack({
        open: true,
        message: "Requirement saved successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error saving requirement:", err);
      setSnack({
        open: true,
        message: "Error saving requirement.",
        severity: "error",
      });
    }
  };

  // ✅ Handle deletion of a requirement
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/requirements/${id}`);
      fetchRequirements();
      setSnack({
        open: true,
        message: "Requirement deleted successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error deleting requirement:", err);
      setSnack({
        open: true,
        message: "Error deleting requirement.",
        severity: "error",
      });
    }
  };

  // ✅ Group requirements by category
  const groupedRequirements = requirements.reduce((acc, req) => {
    const cat = req.category || "Regular";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(req);
    return acc;
  }, {});



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
          sx={{ fontWeight: "bold", color: titleColor, fontSize: "36px" }}
        >
          MANAGE REQUIREMENTS
        </Typography>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
        {/* Left Side - Form */}
        <div
          style={{ border: `2px solid ${borderColor}`, }}
          className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <h3 style={{ color: subtitleColor, }} className="text-xl font-semibold mb-4">
            Add a New Requirement
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Typography fontWeight={500}>Requirements Description:</Typography>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter requirement description"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Typography fontWeight={500}>Short Label:</Typography>
            <input
              type="text"
              value={shortLabel}
              onChange={(e) => setShortLabel(e.target.value)}
              placeholder="Enter short label (e.g., F138)"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Typography fontWeight={500}>Category:</Typography>
            {/* ✅ Category Selector */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="Regular">Regular Requirements</MenuItem>
                <MenuItem value="Medical">Medical Requirements</MenuItem>
                <MenuItem value="Others">Other Requirements</MenuItem>
              </Select>
            </FormControl>

            <button
              type="submit"
              className="w-full py-3 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-300"
              style={{ backgroundColor: "#1976d2" }}
            >
              Save Requirement
            </button>
          </form>
        </div>

        {/* Right Side - Display Saved Requirements */}
        <div
          style={{ border: `2px solid ${borderColor}`, }}
          className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-sm max-h-100 overflow-y-auto"
        >
          <h3 style={{ color: subtitleColor, }} className="text-xl font-semibold mb-4">
            Saved Requirements
          </h3>

          {Object.keys(groupedRequirements).map((cat) => (
            <div key={cat}>
              <h4 className="font-bold text-maroon mt-3 mb-2">{cat}:</h4>
              <ul className="space-y-2">
                {groupedRequirements[cat].map((req) => (
                  <li
                    key={req.id}
                    className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center"
                  >
                    <span className="text-gray-800">{req.description}</span>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: "#9E0000",
                        color: "white",

                      }}
                      onClick={() => handleDelete(req.id)}
                    >
                      Delete
                    </Button>

                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RequirementsForm;
