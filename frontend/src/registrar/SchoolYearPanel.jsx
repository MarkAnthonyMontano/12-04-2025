import React, { useState, useEffect, useContext } from "react"; 
import { SettingsContext } from "../App";
import axios from "axios";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const SchoolYearPanel = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [subtitleColor, setSubtitleColor] = useState("#555555");
  const [borderColor, setBorderColor] = useState("#000000");

  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 55;

  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

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

  const fetchYears = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/year_table`);
      setYears(res.data);
    } catch (err) {
      console.error("Error fetching years:", err);
      setSnackbar({ open: true, message: "Failed to fetch years", severity: "error" });
    }
  };

  const fetchSemesters = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_semester`);
      setSemesters(res.data);
    } catch (err) {
      console.error("Error fetching semesters:", err);
      setSnackbar({ open: true, message: "Failed to fetch semesters", severity: "error" });
    }
  };

  const fetchSchoolYears = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/school_years`);
      setSchoolYears(res.data);
    } catch (err) {
      console.error("Error fetching school years:", err);
      setSnackbar({ open: true, message: "Failed to fetch school years", severity: "error" });
    }
  };

  useEffect(() => {
    fetchYears();
    fetchSemesters();
    fetchSchoolYears();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedYear || !selectedSemester) {
      setSnackbar({ open: true, message: "Please select both Year and Semester", severity: "warning" });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/school_years`, {
        year_id: selectedYear,
        semester_id: selectedSemester,
        activator: 0,
      });
      setSelectedYear("");
      setSelectedSemester("");
      fetchSchoolYears();
      setSnackbar({ open: true, message: "School year added successfully!", severity: "success" });
    } catch (err) {
      console.error("Error saving school year:", err);
      setSnackbar({ open: true, message: "Failed to save school year", severity: "error" });
    }
  };

  const formatYearRange = (year) => {
    const start = parseInt(year.year_description);
    return `${start}-${start + 1}`;
  };

  const getStatus = (activatorValue) => (activatorValue === 1 ? "Active" : "Inactive");

  // 🔒 Disable right-click & DevTools
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      const blocked = ['F12', 'F11'];
      if (blocked.includes(e.key) || 
          (e.ctrlKey && e.shiftKey && ['i', 'j'].includes(e.key.toLowerCase())) || 
          (e.ctrlKey && ['u', 'p'].includes(e.key.toLowerCase()))) {
        e.preventDefault(); e.stopPropagation();
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
          SCHOOL YEAR PANEL
        </Typography>
      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {/* Left Container: Form */}
        <Box sx={{ flex: 1, p: 3, bgcolor: "#fff", border: `2px solid ${borderColor}`, boxShadow: 2, width: 800, borderRadius: 2, minWidth: "300px" }}>
          <Typography variant="h6" mb={2} style={{ color: subtitleColor }}>
            Add New School Year
          </Typography>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
               <Typography fontWeight={500}>Year Level:</Typography>
              <select
                className="border p-2 w-full rounded"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">-- Select Year Level --</option>
                {years.map((year) => (
                  <option key={year.year_id} value={year.year_id}>{formatYearRange(year)}</option>
                ))}
              </select>
            </div>

            <div>
            <Typography fontWeight={500}>Semester:</Typography>
              <select
                className="border p-2 w-full rounded"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                <option value="">-- Select Semester --</option>
                {semesters.map((semester) => (
                  <option key={semester.semester_id} value={semester.semester_id}>{semester.semester_description}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded"
              style={{ backgroundColor: "#1967d2" }}
            >
              Save
            </button>
          </form>
        </Box>

        {/* Right Container: Table */}
        <Box sx={{ flex: 1, p: 3, bgcolor: "#fff", boxShadow: 2, border: `2px solid ${borderColor}`, borderRadius: 2, minWidth: "300px" }}>
          <Typography variant="h6" mb={2} style={{ color: subtitleColor }}>
            Saved School Years
          </Typography>
          <Box sx={{ maxHeight: 350, overflowY: "auto" }}>
            <table style={{ border: `2px solid ${borderColor}` }} className="w-full border border-gray-300 text-sm">
              <thead>
                <tr style={{ backgroundColor: settings?.header_color || "#1976d2", color: "#ffffff" }}>
                  <th style={{ border: `2px solid ${borderColor}` }} className="p-2 border">Year Level</th>
                  <th style={{ border: `2px solid ${borderColor}` }} className="p-2 border">Semester</th>
                  <th style={{ border: `2px solid ${borderColor}` }} className="p-2 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {schoolYears.map((sy, index) => (
                  <tr key={index}>
                    <td style={{ border: `2px solid ${borderColor}` }} className="p-2 border text-center">
                      {`${sy.year_description}-${parseInt(sy.year_description) + 1}`}
                    </td>
                    <td style={{ border: `2px solid ${borderColor}` }} className="p-2 border text-center">{sy.semester_description}</td>
                    <td style={{ border: `2px solid ${borderColor}` }} className="p-2 border text-center">{sy.astatus === 1 ? "Active" : "Inactive"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SchoolYearPanel;
