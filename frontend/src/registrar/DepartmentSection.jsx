import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,       // ✅ Added
  Alert           // ✅ Added
} from '@mui/material';
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";

const DepartmentSection = () => {

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

  const [dprtmntSection, setDprtmntSection] = useState({
    curriculum_id: '',
    section_id: '',
  });

  const [curriculumList, setCurriculumList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [departmentSections, setDepartmentSections] = useState([]);

  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | info | warning
  });
  const pageId = 20;

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

  useEffect(() => {
    fetchCurriculum();
    fetchSections();
    fetchDepartmentSections();
  }, []);

  const fetchCurriculum = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_curriculum`);
      setCurriculumList(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/section_table`);
      setSectionsList(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDepartmentSections = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/department_section`);
      setDepartmentSections(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDprtmntSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDepartmentSection = async () => {
    const { curriculum_id, section_id } = dprtmntSection;
    if (!curriculum_id || !section_id) {
      setSnackbar({
        open: true,
        message: "Please select both curriculum and section.",
        severity: "error",
      });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/department_section`, dprtmntSection);
      setDprtmntSection({ curriculum_id: '', section_id: '' });
      fetchDepartmentSections();
      setSnackbar({
        open: true,
        message: "Department section added successfully!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || "Failed to add department section.",
        severity: "error",
      });
    }
  };


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
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent", }}>

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
          DEPARTMENT SECTION PANEL
        </Typography>




      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      <br />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          ml: 7,
          width: "1400px",
          mt: 4,

        }}
      >
        {/* Form Section */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,

            boxShadow: 2,
            border: `2px solid ${borderColor}`,
            bgcolor: 'white',

          }}
        >
          <Typography variant="h6" gutterBottom textAlign="center" style={{ color: "maroon", fontWeight: "bold" }} >
            Department Section Assignment
          </Typography>
          <label style={{ fontWeight: 'bold', marginBottom: 4 }} htmlFor="curriculum_id">
            Curriculum:
          </label>
          <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
            <InputLabel id="curriculum-label">Curriculum</InputLabel>
            <Select
              labelId="curriculum-label"
              name="curriculum_id"
              value={dprtmntSection.curriculum_id}
              onChange={handleChange}
              label="Curriculum"
            >
              <MenuItem value="">Select Curriculum</MenuItem>
              {curriculumList.map((curr) => (
                <MenuItem key={`curr-${curr.curriculum_id}`} value={curr.curriculum_id}>
                  {curr.year_description} - {curr.program_description}  {curr.major} | {curr.curriculum_id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <label style={{ fontWeight: 'bold', marginBottom: 4 }} htmlFor="curriculum_id">
            Section:
          </label>
          <FormControl fullWidth sx={{ mb: 3 }} variant="outlined">
            <InputLabel id="section-label">Section</InputLabel>
            <Select
              labelId="section-label"
              name="section_id"
              value={dprtmntSection.section_id}
              onChange={handleChange}
              label="Section"
            >
              <MenuItem value="">Select Section</MenuItem>
              {sectionsList.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>


          <Button
            variant="contained"
            fullWidth
            onClick={handleAddDepartmentSection}
            sx={{ bgcolor: '#1967d2', ':hover': { bgcolor: '#000000' } }}
          >
            Insert
          </Button>
        </Box>

        {/* Display Section */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: 'white',
            border: `2px solid ${borderColor}`,
            overflowY: 'auto',
            maxHeight: 500,
          }}
        >
          <Typography variant="h6" gutterBottom textAlign="center" style={{ color: "maroon", fontWeight: "bold" }}>
            Department Sections
          </Typography>

          <Box sx={{ overflowY: 'auto', maxHeight: 400 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                bborder: `2px solid ${borderColor}`, // outer border
              }}
            >
              <thead style={{ backgroundColor: "#f5f5f5" }}>
                <tr>
                  <th
                    style={{
                      border: `2px solid ${borderColor}`,
                      padding: "8px",
                      backgroundColor: settings?.header_color || "#1976d2",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    Curriculum Name
                  </th>
                  <th
                    style={{
                      border: `2px solid ${borderColor}`,
                      padding: "8px",
                      backgroundColor: settings?.header_color || "#1976d2",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    Section Description
                  </th>
                  <th
                    style={{
                      border: `2px solid ${borderColor}`,
                      padding: "8px",
                      backgroundColor: settings?.header_color || "#1976d2",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {departmentSections.map((section, index) => (
                  <tr key={`dept-${section.ds_id || section.id || index}`}>
                    <td
                      style={{
                        border: `2px solid ${borderColor}`,
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {section.program_code}-{section.year_description}
                    </td>
                    <td
                      style={{
                        border: `2px solid ${borderColor}`,
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {section.section_description}
                    </td>
                    <td
                      style={{
                        border: `2px solid ${borderColor}`,
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {section.dsstat === 0 ? "Inactive" : "Active"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


            <Snackbar
              open={snackbar.open}
              autoHideDuration={3000}
              onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>


          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  tableCell: {
    border: '1px solid #ccc',
    padding: '10px',
    textAlign: 'center',
  },
};

export default DepartmentSection;
