import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Snackbar,
    Alert,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const AnnouncementPanel = () => {
    const settings = useContext(SettingsContext);

    const [titleColor, setTitleColor] = useState("#000");
    const [subtitleColor, setSubtitleColor] = useState("#555");
    const [borderColor, setBorderColor] = useState("#000");
    const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

    const [announcements, setAnnouncements] = useState([]);
    const [form, setForm] = useState({ title: "", content: "", valid_days: "7", target_role: "" });
    const [editingId, setEditingId] = useState(null);
    const [image, setImage] = useState(null);
    const [userRole, setUserRole] = useState("");
    const [employeeID, setEmployeeID] = useState("");
    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const pageId = 66;

    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    // Fetch settings colors
    useEffect(() => {
        if (!settings) return;
        if (settings.title_color) setTitleColor(settings.title_color);
        if (settings.subtitle_color) setSubtitleColor(settings.subtitle_color);
        if (settings.border_color) setBorderColor(settings.border_color);
        if (settings.main_button_color) setMainButtonColor(settings.main_button_color);
    }, [settings]);

    // Check access
    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        const storedEmployeeID = localStorage.getItem("employee_id");
        if (storedRole === "registrar") {
            setUserRole(storedRole);
            setEmployeeID(storedEmployeeID);
            checkAccess(storedEmployeeID);
        } else {
            window.location.href = "/login";
        }
    }, []);

    const checkAccess = async (employeeID) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/page_access/${employeeID}/${pageId}`);
            setHasAccess(res.data?.page_privilege === 1);
        } catch (err) {
            setHasAccess(false);
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/announcements`);
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("content", form.content);
            formData.append("valid_days", form.valid_days);
            formData.append("target_role", form.target_role);
            formData.append("creator_role", "faculty");
            formData.append("creator_id", employeeID);
            if (image) formData.append("image", image);

            if (editingId) {
                await axios.put(`${API_BASE_URL}/api/announcements/${editingId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setSnackbar({ open: true, message: "Announcement updated!", severity: "success" });
            } else {
                await axios.post(`${API_BASE_URL}/api/announcements`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                setSnackbar({ open: true, message: "Announcement created!", severity: "success" });
            }

            setForm({ title: "", content: "", valid_days: "7", target_role: "" });
            setEditingId(null);
            setImage(null);
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: "Error saving announcement!", severity: "error" });
        }
    };

    const handleEdit = (announcement) => {
        setForm({
            title: announcement.title,
            content: announcement.content,
            valid_days: announcement.valid_days.toString(),
            target_role: announcement.target_role,
        });
        setEditingId(announcement.id);
        setImage(null);
    };

    const handleDelete = async (id) => {
        setSnackbar({
            open: true,
            message: "⏳ Deleting announcement...",
            severity: "info",
        });

        try {
            await axios.delete(`${API_BASE_URL}/api/announcements/${id}`);

            setSnackbar({
                open: true,
                message: "🗑️ Announcement deleted successfully!",
                severity: "success",
            });

            fetchAnnouncements();
        } catch (err) {
            console.error(err);

            setSnackbar({
                open: true,
                message: "❌ Failed to delete announcement.",
                severity: "error",
            });
        }
    };


    const handleRemoveImage = () => {
        setImage(null);
    };

    if (loading || hasAccess === null) return <LoadingOverlay open={loading} message="Check Access" />;
    if (!hasAccess) return <Unauthorized />;

    return (
        <Box sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto', pr: 1, }}>
            {/* Header */}
            <Typography
                variant="h4"
                sx={{
                    fontWeight: "bold",
                    color: titleColor,
                    fontSize: "36px",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                ANNOUNCEMENT
            </Typography>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />

            <Grid container spacing={4}>
                {/* Left: Form */}
                <Grid item xs={12} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            border: `2px solid ${borderColor}`,
                            borderRadius: 2,
                            boxShadow: 2,
                        }}
                    >
                        <Typography variant="h6" mb={2} color={subtitleColor}>
                            {editingId ? "Edit Announcement" : "Create Announcement"}
                        </Typography>
                        <Typography fontWeight={500}>Title:</Typography>
                        <TextField
                            label="Title"
                            fullWidth
                            margin="normal"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            required
                        />
                        <Typography fontWeight={500}>Content:</Typography>
                        <TextField
                            label="Content"
                            fullWidth
                            multiline
                            rows={3}
                            margin="normal"
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            required
                        />
                        <Typography fontWeight={500}>Valid For:</Typography>
                        <FormControl fullWidth margin="normal">

                            <InputLabel>Valid For</InputLabel>
                            <Select
                                value={form.valid_days}
                                label="Valid For"
                                onChange={(e) => setForm({ ...form, valid_days: e.target.value })}
                            >
                                {["1", "3", "7", "14", "30", "60", "90"].map((d) => (
                                    <MenuItem key={d} value={d}>{d} Day(s)</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography fontWeight={500}>Target Role:</Typography>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Target Role</InputLabel>
                            <Select
                                value={form.target_role}
                                label="Target Role"
                                onChange={(e) => setForm({ ...form, target_role: e.target.value })}
                                required
                            >
                                <MenuItem value="student">Student</MenuItem>
                                <MenuItem value="faculty">Faculty</MenuItem>
                                <MenuItem value="applicant">Applicant</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                            fullWidth
                            sx={{ mt: 2, bgcolor: mainButtonColor }}
                        >
                            {image ? "Change Image" : "Upload Image"}
                            <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                        </Button>

                        {image && (
                            <Box
                                sx={{
                                    mt: 2,
                                    p: 1,
                                    border: `1px solid ${borderColor}`,
                                    borderRadius: 2,
                                    bgcolor: "#f5f5f5",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                {/* Thumbnail Preview */}
                                <Box
                                    component="img"
                                    src={URL.createObjectURL(image)}
                                    alt="Uploaded Preview"
                                    sx={{ width: 50, height: 50, objectFit: "cover", borderRadius: 1 }}
                                />

                                {/* File Name */}
                                <Typography noWrap sx={{ flexGrow: 1 }}>
                                    {image.name}
                                </Typography>

                                {/* Remove Button */}
                                <IconButton
                                    onClick={handleRemoveImage}
                                    sx={{
                                        width: "24px",
                                        height: "24px",
                                        backgroundColor: "rgba(255,255,255,0.8)",
                                        "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                                    }}
                                >
                                    ✕
                                </IconButton>
                            </Box>
                        )}


                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleSubmit}>
                            {editingId ? "Update Announcement" : "Create Announcement"}
                        </Button>
                    </Paper>
                </Grid>

                {/* Right: Announcement List */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            p: 2,
                            border: `2px solid ${borderColor}`,
                            borderRadius: 2,
                            height: "100%",
                            overflowY: "auto",
                        }}
                    >
                        <Typography variant="h6" mb={2} color={subtitleColor} align="center">
                            Active Announcements
                        </Typography>

                        {announcements.length === 0 ? (
                            <Typography color="text.secondary">No active announcements.</Typography>
                        ) : (
                            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th
                                            style={{
                                                border: `2px solid ${borderColor}`,
                                                padding: "12px",
                                                backgroundColor: settings?.header_color || "#1976d2",
                                                color: "#fff",
                                                textAlign: "center",
                                            }}
                                        >
                                            Title
                                        </th>
                                        <th
                                            style={{
                                                border: `2px solid ${borderColor}`,
                                                padding: "12px",
                                                backgroundColor: settings?.header_color || "#1976d2",
                                                color: "#fff",
                                                textAlign: "center",
                                            }}
                                        >
                                            Content
                                        </th>
                                        <th
                                            style={{
                                                border: `2px solid ${borderColor}`,
                                                padding: "12px",
                                                backgroundColor: settings?.header_color || "#1976d2",
                                                color: "#fff",
                                                textAlign: "center",
                                            }}
                                        >
                                            Image
                                        </th>
                                        <th
                                            style={{
                                                border: `2px solid ${borderColor}`,
                                                padding: "12px",
                                                backgroundColor: settings?.header_color || "#1976d2",
                                                color: "#fff",
                                                textAlign: "center",
                                            }}
                                        >
                                            Valid Days
                                        </th>
                                        <th
                                            style={{
                                                border: `2px solid ${borderColor}`,
                                                padding: "12px",
                                                backgroundColor: settings?.header_color || "#1976d2",
                                                color: "#fff",
                                                textAlign: "center",
                                            }}
                                        >
                                            Target Role
                                        </th>
                                        <th
                                            style={{
                                                border: `2px solid ${borderColor}`,
                                                padding: "12px",
                                                backgroundColor: settings?.header_color || "#1976d2",
                                                color: "#fff",
                                                textAlign: "center",
                                            }}
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {announcements.map((a) => (
                                        <tr key={a.id} style={{ height: "75px" }}>
                                            <td style={{ border: `2px solid ${borderColor}`, padding: "8px", textAlign: "center", width: "200px" }}>
                                                {a.title}
                                            </td>
                                            <td style={{ border: `2px solid ${borderColor}`, padding: "8px", textAlign: "center", width: "200px" }}>
                                                {a.content}
                                            </td>

                                            {/* Image Cell */}
                                            <td
                                                style={{
                                                    border: `2px solid ${borderColor}`,
                                                    padding: "8px",
                                                    width: "200px",
                                                    height: "150px",
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                {a.file_path ? (
                                                    <img
                                                        src={`${API_BASE_URL}/uploads/${a.file_path}`}
                                                        alt={a.title}
                                                        style={{
                                                            width: "200px",
                                                            height: "150px",
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                        }}
                                                    />
                                                ) : (
                                                    "No Image"
                                                )}
                                            </td>

                                            <td style={{ border: `2px solid ${borderColor}`, padding: "8px", textAlign: "center" }}>
                                                {a.valid_days}
                                            </td>
                                            <td style={{ border: `2px solid ${borderColor}`, padding: "8px", textAlign: "center" }}>
                                                {a.target_role}
                                            </td>

                                            {/* Actions Cell */}
                                            <td
                                                style={{
                                                    border: `2px solid ${borderColor}`,
                                                    padding: "8px",
                                                    textAlign: "center",
                                                    width: "150px",
                                                }}
                                            >
                                                <Box sx={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                                                    <Button
                                                        size="small"
                                                        sx={{ bgcolor: "green", color: "white" }}
                                                        onClick={() => handleEdit(a)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        sx={{ bgcolor: "maroon", color: "white" }}
                                                        onClick={() => handleDelete(a.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>


                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AnnouncementPanel;
