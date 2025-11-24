import React, { useState, useEffect, useContext } from "react";
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
} from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const SuperAdminRoomRegistration = () => {
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

  // 🔹 Authentication and access states
  const [userID, setUserID] = useState("");
  const [user, setUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const pageId = 85;

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


  // 🔹 Room management states
  const [roomName, setRoomName] = useState("");
  const [buildingName, setBuildingName] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // 🔹 Fetch all rooms
  const fetchRoomList = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/room_list`);
      setRoomList(res.data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      setSnack({
        open: true,
        message: "Failed to fetch rooms",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchRoomList();
  }, []);

  // 🔹 Add new room
  const handleAddRoom = async () => {
    if (!roomName.trim() || !buildingName.trim()) {
      setSnack({
        open: true,
        message: "Room name and building name are required",
        severity: "warning",
      });
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/room`, {
        room_name: roomName,
        building_name: buildingName,
      });

      setSnack({
        open: true,
        message: "Room successfully added",
        severity: "success",
      });
      setRoomName("");
      setBuildingName("");
      fetchRoomList();
    } catch (err) {
      console.error("Error adding room:", err);
      setSnack({
        open: true,
        message: "Failed to add room",
        severity: "error",
      });
    }
  };

  // 🔹 Edit room
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setBuildingName(room.building_description);
    setRoomName(room.room_description);
  };

  // 🔹 Update room
  const handleUpdateRoom = async () => {
    if (!editingRoom) return;

    try {
      await axios.put(`${API_BASE_URL}/room/${editingRoom.room_id}`, {
        building_name: buildingName,
        room_name: roomName,
      });

      setSnack({
        open: true,
        message: "Room updated successfully",
        severity: "success",
      });
      setEditingRoom(null);
      setBuildingName("");
      setRoomName("");
      fetchRoomList();
    } catch (err) {
      console.error("Error updating room:", err);
      setSnack({
        open: true,
        message: "Failed to update room",
        severity: "error",
      });
    }
  };

  // 🔹 Delete room (automatic, no confirm)
  const handleDeleteRoom = async (roomId) => {
    try {
      await axios.delete(`${API_BASE_URL}/room/${roomId}`);
      setSnack({
        open: true,
        message: "Room deleted successfully",
        severity: "success",
      });
      fetchRoomList();
    } catch (err) {
      console.error("Error deleting room:", err);
      setSnack({
        open: true,
        message: "Failed to delete room",
        severity: "error",
      });
    }
  };


  // 🔹 Close snackbar
  const handleCloseSnack = (_, reason) => {
    if (reason === "clickaway") return;
    setSnack((prev) => ({ ...prev, open: false }));
  };

  // 🔒 Security: disable right-click + devtools keys safely
  useEffect(() => {
    const disableContext = (e) => e.preventDefault();
    const disableKeys = (e) => {
      const isBlockedKey =
        e.key === "F12" ||
        e.key === "F11" ||
        (e.ctrlKey &&
          e.shiftKey &&
          (e.key.toLowerCase() === "i" || e.key.toLowerCase() === "j")) ||
        (e.ctrlKey && ["u", "p"].includes(e.key.toLowerCase()));

      if (isBlockedKey) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    document.addEventListener("contextmenu", disableContext);
    document.addEventListener("keydown", disableKeys);
    return () => {
      document.removeEventListener("contextmenu", disableContext);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  // 🔹 Loading / Unauthorized states
  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
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
          ROOM REGISTRATION
        </Typography>
      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Grid container spacing={4}>
        {/* ✅ FORM SECTION */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              border: `2px solid ${borderColor}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: subtitleColor, }}>
              {editingRoom ? "Edit Room" : "Register New Room"}
            </Typography>

            <Typography fontWeight={500}>Building Name:</Typography>
            <TextField
              fullWidth
              label="Building Name"
              variant="outlined"
              value={buildingName}
              onChange={(e) => setBuildingName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Typography fontWeight={500}>Room Name:</Typography>
            <TextField
              fullWidth
              label="Room Name"
              variant="outlined"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={editingRoom ? handleUpdateRoom : handleAddRoom}
              sx={{
                backgroundColor: "primary",
                "&:hover": { backgroundColor: "#a00000" },
              }}
            >
              {editingRoom ? "Update Room" : "Save"}
            </Button>
          </Paper>
        </Grid>

        {/* ✅ TABLE SECTION */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              border: `2px solid ${borderColor}`,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: subtitleColor }}>
              Registered Rooms
            </Typography>

            <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
              <Table stickyHeader size="small">
                <TableHead >
                  <TableRow >
                    <TableCell sx={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Room ID</TableCell>
                    <TableCell sx={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Building</TableCell>
                    <TableCell sx={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Room Name</TableCell>
                    <TableCell sx={{ border: `2px solid ${borderColor}`, backgroundColor: settings?.header_color || "#1976d2", color: "#fff" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roomList.map((room, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ border: `2px solid ${borderColor}` }}>{room.room_id}</TableCell>
                      <TableCell sx={{ border: `2px solid ${borderColor}` }}>{room.building_description || "N/A"}</TableCell>
                      <TableCell sx={{ border: `2px solid ${borderColor}` }}>{room.room_description}</TableCell>
                      <TableCell sx={{ border: `2px solid ${borderColor}`, textAlign: "center" }}>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "green",
                            color: "white",
                            mr: 1,

                          }}
                          onClick={() => handleEditRoom(room)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{
                            backgroundColor: "#9E0000",
                            color: "white",
                          }}
                          onClick={() => handleDeleteRoom(room.room_id)}
                        >
                          Delete
                        </Button>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* ✅ Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleCloseSnack}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={handleCloseSnack} sx={{ width: "100%" }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SuperAdminRoomRegistration;
