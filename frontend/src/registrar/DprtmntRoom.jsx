import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Typography,
  Paper,
  Grid,
  Snackbar,
  Alert
} from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const DepartmentRoom = () => {
  const settings = useContext(SettingsContext);

  // 🎨 Theme Colors
  const [titleColor, setTitleColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

  // 🧠 Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // 🎓 Data States
  const [room, setRoom] = useState({ room_id: "", dprtmnt_id: "" });
  const [assignedRoomIds, setAssignedRoomIds] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [assignedRooms, setAssignedRooms] = useState({});

  // 🔐 Access Control
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const pageId = 22;

  useEffect(() => {
    if (!settings) return;
    if (settings.title_color) setTitleColor(settings.title_color);
    if (settings.border_color) setBorderColor(settings.border_color);
    if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
  }, [settings]);

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");
    const storedEmployeeID = localStorage.getItem("employee_id");

    if (storedUser && storedRole && storedID) {
      setUserRole(storedRole);
      setUserID(storedID);
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
      setHasAccess(response.data?.page_privilege === 1);
    } catch (error) {
      console.error("Error checking access:", error);
      setHasAccess(false);
    }
  };

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/get_department`);
      setDepartmentList(response.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchRoomList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/room_list`);
      setRoomList(response.data);
    } catch (err) {
      console.log("Error fetching room list:", err);
    }
  };

  const fetchRoomAssignments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/assignments`);
      const assignments = response.data;

      const groupedAssignments = assignments.reduce((acc, assignment) => {
        const deptId = assignment.dprtmnt_id;
        if (!acc[deptId]) acc[deptId] = [];
        acc[deptId].push({
          room_id: assignment.dprtmnt_room_id,
          room_description: assignment.room_description,
        });
        return acc;
      }, {});

      const assignedIds = assignments.map((a) => a.room_id || a.dprtmnt_room_id);
      setAssignedRoomIds(assignedIds);
      setAssignedRooms(groupedAssignments);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  useEffect(() => {
    fetchDepartment();
    fetchRoomList();
    fetchRoomAssignments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignRoom = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/assign`, room);
      fetchRoomAssignments();
      setRoom({ room_id: "", dprtmnt_id: "" });

      setSnackbar({
        open: true,
        message: "Room assigned successfully!",
        severity: "success",
      });
    } catch (err) {
      console.log("Error assigning room:", err);
      setSnackbar({
        open: true,
        message: "Failed to assign room. Please try again.",
        severity: "error",
      });
    }
  };

  const handleUnassignRoom = async (dprtmnt_room_id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/unassign/${dprtmnt_room_id}`);
      fetchRoomAssignments();

      setSnackbar({
        open: true,
        message: "Room unassigned successfully!",
        severity: "info",
      });
    } catch (err) {
      console.log("Error unassigning room:", err);
      setSnackbar({
        open: true,
        message: "Failed to unassign room.",
        severity: "error",
      });
    }
  };

  if (loading || hasAccess === null) {
    return <LoadingOverlay open={loading} message="Check Access" />;
  }

  if (!hasAccess) {
    return <Unauthorized />;
  }

  return (
    <Box sx={{ height: "calc(100vh - 100px)", overflowY: "auto", }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: titleColor, fontSize: "36px", mb: 2 }}
      >
        DEPARTMENT ROOM
      </Typography>

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />

      <Box display="flex" gap={2} alignItems="flex-start" mb={4}>
        <Box width="50%">
          <label style={{ fontWeight: "bold", color: "maroon" }}>Room Available:</label>
          <Select
            name="room_id"
            value={room.room_id}
            onChange={handleChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">Select Available Room</MenuItem>
            {roomList
              .filter((room) => !assignedRoomIds.includes(room.room_id))
              .map((room) => (
                <MenuItem key={room.room_id} value={room.room_id}>
                  {room.room_description}
                </MenuItem>
              ))}
          </Select>
        </Box>

        <Box width="50%">
          <label style={{ fontWeight: "bold", color: "maroon" }}>Choose Department:</label>
          <Select
            name="dprtmnt_id"
            value={room.dprtmnt_id}
            onChange={handleChange}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">Select Department</MenuItem>
            {departmentList.map((dept) => (
              <MenuItem key={dept.dprtmnt_id} value={dept.dprtmnt_id}>
                {dept.dprtmnt_name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Button
          variant="contained"
          style={{ backgroundColor: "#primary", color: "#fff", width: "200px" }}
          onClick={handleAssignRoom}
          disabled={!room.room_id || !room.dprtmnt_id}
          sx={{ height: 56, alignSelf: "flex-end" }}
        >
          Save
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Department Room Assignments
      </Typography>

      <Grid container spacing={1}>
        {departmentList.map((dept) => (
          <Grid item xs={12} md={4} key={dept.dprtmnt_id}>
            <Paper elevation={2} style={{ padding: "10px", border: `2px solid ${borderColor}` }}>
              <Typography variant="subtitle2" style={{ fontSize: "14px", marginBottom: "8px" }}>
                {dept.dprtmnt_name}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {assignedRooms[dept.dprtmnt_id]?.length > 0 ? (
                  assignedRooms[dept.dprtmnt_id].map((room) => (
                    <Box
                      key={room.room_id}
                      sx={{
                        backgroundColor: mainButtonColor,
                        color: "white",
                        borderRadius: "4px",
                        padding: "6px 8px",
                        fontSize: "12px",
                        position: "relative",
                      }}
                    >
                      Room {room.room_description}
                      <Button
                        onClick={() => handleUnassignRoom(room.room_id || room.dprtmnt_room_id)}
                        size="small"
                        sx={{
                          position: "absolute",
                          top: "-6px",
                          right: "-6px",
                          minWidth: "22px",
                          height: "22px",
                          padding: "0",
                          color: "white",
                          backgroundColor: "rgba(0,0,0,0.4)",
                          borderRadius: "50%",
                          fontSize: "14px",
                          "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
                        }}
                      >
                        ×
                      </Button>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" style={{ fontSize: "12px" }}>
                    No rooms assigned.
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* ✅ Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DepartmentRoom;
