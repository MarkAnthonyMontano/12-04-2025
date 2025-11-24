import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const UserPageAccess = () => {


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




  const [userFound, setUserFound] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageAccess, setPageAccess] = useState({});
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const pageId = 91;

  const [employeeID, setEmployeeID] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");
    const storedEmployeeID = localStorage.getItem("employee_id");

    if (storedUser && storedRole && storedID) {
      // setUserID(storedID);  <-- remove this line
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


  const mainColor = "#7E0000";

  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (userID.trim() !== "") {
        setSearching(true);
        handleSearchUser().finally(() => setSearching(false));
      } else {
        setUserFound(null);
        setPages([]);
      }
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [userID]);

  const handleSearchUser = async () => {
    if (!userID) return;

    try {
      const { data: allPages } = await axios.get(`${API_BASE_URL}/api/pages`);
      const { data: accessRows } = await axios.get(`${API_BASE_URL}/api/page_access/${userID}`);

      const accessMap = accessRows.reduce((acc, curr) => {
        acc[curr.page_id] = curr.page_privilege === 1;
        return acc;
      }, {});

      allPages.forEach((page) => {
        if (accessMap[page.id] === undefined) accessMap[page.id] = false;
      });

      setUserFound({ id: userID });
      setPages(allPages);
      setPageAccess(accessMap);
      setSnackbar({ open: true, message: "User found successfully!", type: "success" });
    } catch (error) {
      console.error("Error searching user:", error);
      setUserFound(null);
      setPages([]);
      setSnackbar({ open: true, message: "User not found or error loading data", type: "error" });
    }
  };

  // 🔄 Refresh pages and access
  const fetchPages = async () => {
    try {
      const { data: allPages } = await axios.get(`${API_BASE_URL}/api/pages`);
      const { data: accessRows } = await axios.get(`${API_BASE_URL}/api/page_access/${userID}`);

      const accessMap = accessRows.reduce((acc, curr) => {
        acc[curr.page_id] = curr.page_privilege === 1;
        return acc;
      }, {});

      allPages.forEach((page) => {
        if (accessMap[page.id] === undefined) accessMap[page.id] = false;
      });

      setPages(allPages);
      setPageAccess(accessMap);
    } catch (err) {
      console.error("Error fetching pages:", err);
    }
  };

  // ✅ Toggle access privileges
  const handleToggleChange = async (pageId, hasAccess) => {
    const newAccessState = !hasAccess;
    try {
      if (newAccessState) {
        await axios.post(`${API_BASE_URL}/api/page_access/${userID}/${pageId}`);
      } else {
        await axios.delete(`${API_BASE_URL}/api/page_access/${userID}/${pageId}`);
      }
      await fetchPages();
      setSnackbar({
        open: true,
        message: `Access ${newAccessState ? "granted" : "revoked"} successfully!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating access:", error);
      setSnackbar({ open: true, message: "Error updating access", type: "error" });
    }
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
        paddingRight: 1,
        backgroundColor: "transparent",
      }}
    >
      {/* 🧾 Top Header: Title + Search (aligned) */}
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
          USER PAGE ACCESS
        </Typography>

        {/* 🔎 Right Side Search */}
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            size="small"
            placeholder="Search Employee ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            sx={{
              width: 450,
              backgroundColor: "#fff",
              borderRadius: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: "gray" }} />,
            }}
          />
        </Box>
      </Box>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      {/* ⏳ Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* 📋 Access Table */}
      {userFound && (
        <Paper
          elevation={4}
          sx={{
            border: `2px solid ${mainColor}`,
            overflow: "hidden",
            backgroundColor: "#ffffff",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2", }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold", border: `2px solid ${borderColor}`, }}>#</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", border: `2px solid ${borderColor}`, }}>Page Description</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold", border: `2px solid ${borderColor}`, }}>Page Group</TableCell>
                  <TableCell align="center" sx={{ color: "white", fontWeight: "bold", border: `2px solid ${borderColor}`, }}>
                    Access
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pages.length > 0 ? (
                  pages.map((page, index) => {
                    const hasAccess = !!pageAccess[page.id];
                    return (
                      <TableRow key={page.id} hover>
                        <TableCell style={{ border: `2px solid ${borderColor}`, }}>{index + 1}</TableCell>
                        <TableCell style={{ border: `2px solid ${borderColor}`, }}>{page.page_description}</TableCell>
                        <TableCell style={{ border: `2px solid ${borderColor}`, }}>{page.page_group}</TableCell>
                        <TableCell style={{ border: `2px solid ${borderColor}`, }} align="center">
                          <Switch
                            checked={hasAccess}
                            onChange={() => handleToggleChange(page.id, hasAccess)}
                            color="primary"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No pages found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* 🔔 Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserPageAccess;
