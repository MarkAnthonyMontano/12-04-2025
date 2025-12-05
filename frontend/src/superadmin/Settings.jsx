import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    Input,
    InputLabel,
    Typography,
    Paper,
    Divider,
    Snackbar,
    Alert,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
function Settings({ onUpdate }) {
    const settings = useContext(SettingsContext);

    // Left side: School info
    const [companyName, setCompanyName] = useState("");
    const [shortTerm, setShortTerm] = useState("");
    const [address, setAddress] = useState("");
    const [logo, setLogo] = useState(null);
    const [previewLogo, setPreviewLogo] = useState(null);
    const [bgImage, setBgImage] = useState(null);
    const [previewBg, setPreviewBg] = useState(null);
    const [footerText, setFooterText] = useState("");

    // Right side: Colors
    const [headerColor, setHeaderColor] = useState("#ffffff");
    const [footerColor, setFooterColor] = useState("#ffffff");
    const [mainButtonColor, setMainButtonColor] = useState("#ffffff");
    const [subButtonColor, setSubButtonColor] = useState("#ffffff");
    const [borderColor, setBorderColor] = useState("#000000");
    const [titleColor, setTitleColor] = useState("#000000");
    const [subtitleColor, setSubtitleColor] = useState("#555555");

    const [snack, setSnack] = useState({ open: false, message: "", severity: "info" });
    const handleCloseSnack = (_, reason) => { if (reason !== "clickaway") setSnack(prev => ({ ...prev, open: false })); };

    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const pageId = 74;

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        const storedEmployeeID = localStorage.getItem("employee_id");

        if (storedRole === "registrar") {
            checkAccess(storedEmployeeID);
        } else {
            window.location.href = "/login";
        }
    }, []);

    const checkAccess = async (employeeID) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/page_access/${employeeID}/${pageId}`);
            setHasAccess(response.data?.page_privilege === 1);
        } catch {
            setHasAccess(false);
        }
    };

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/settings`)
            .then(({ data }) => {
                setCompanyName(data.company_name || "");
                setShortTerm(data.short_term || "");
                setAddress(data.address || "");
                setPreviewLogo(data.logo_url ? `${API_BASE_URL}${data.logo_url}` : null);
                setPreviewBg(data.bg_image ? `${API_BASE_URL}${data.bg_image}` : null);
                setHeaderColor(data.header_color || "#ffffff");
                setFooterText(data.footer_text || "");
                setFooterColor(data.footer_color || "#ffffff");
                setMainButtonColor(data.main_button_color || "#ffffff");
                setSubButtonColor(data.sub_button_color || "#ffffff");
                setBorderColor(data.border_color || "#000000");
                setTitleColor(data.title_color || "#000000");
                setSubtitleColor(data.subtitle_color || "#555555");
            })
            .catch(() => setSnack({ open: true, message: "Failed to fetch settings", severity: "error" }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("company_name", companyName);
        formData.append("short_term", shortTerm);
        formData.append("address", address);
        if (logo) formData.append("logo", logo);
        if (bgImage) formData.append("bg_image", bgImage);
        formData.append("header_color", headerColor);
        formData.append("footer_text", footerText);
        formData.append("footer_color", footerColor);
        formData.append("main_button_color", mainButtonColor);
        formData.append("sub_button_color", subButtonColor);
        formData.append("border_color", borderColor);
        formData.append("title_color", titleColor);
        formData.append("subtitle_color", subtitleColor);

        try {
            await axios.post(`${API_BASE_URL}/api/settings`, formData, { headers: { "Content-Type": "multipart/form-data" } });
            onUpdate?.();
            setSnack({ open: true, message: "Settings updated successfully!", severity: "success" });
        } catch {
            setSnack({ open: true, message: "Error updating settings", severity: "error" });
        }
    };

    if (loading || hasAccess === null) return <LoadingOverlay open={loading} message="Loading..." />;
    if (!hasAccess) return <Unauthorized />;

    return (
        <Box
            sx={{
                height: "calc(100vh - 150px)",
                overflowY: "auto",
                backgroundColor: "transparent",
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
                    SETTINGS
                </Typography>
            </Box>

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />


            <Paper
                sx={{
                    p: 3,
                    borderRadius: 3,
                    display: "flex",
                    gap: 5,
                    border: `2px solid ${borderColor}`,
                    flexDirection: { xs: "column", md: "row" },
                }}
            >

                {/* Left side: School info */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: subtitleColor }}>
                        Customize your Settings
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography sx={{ width: "150px", fontWeight: "500" }}>School Name:</Typography>
                            <TextField
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography sx={{ width: "150px", fontWeight: "500" }}>Short Term:</Typography>
                            <TextField
                                value={shortTerm}
                                onChange={e => setShortTerm(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography sx={{ width: "150px", fontWeight: "500" }}>Address:</Typography>
                            <TextField
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Typography sx={{ width: "150px", fontWeight: "500" }}>Footer Text:</Typography>
                            <TextField
                                value={footerText}
                                onChange={e => setFooterText(e.target.value)}
                                fullWidth
                                size="small"
                                sx={{ color: subtitleColor }}
                            />
                        </Box>
                    </Box>


                    <Box style={{ marginTop: "-5px" }}>
                        <Typography sx={{ width: "150px", fontWeight: "500" }}>School Logo:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }} />
                        <Button
                            variant="contained" // changed to contained for primary color
                            component="label"
                            sx={{ mb: 1, backgroundColor: "#primary", color: "#fff", "&:hover": { backgroundColor: "#000" } }}
                        >
                            Choose Logo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={e => {
                                    setLogo(e.target.files[0]);
                                    setPreviewLogo(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                        </Button>

                        {/* Centered preview */}
                        {previewLogo && (
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Box
                                    component="img"
                                    src={previewLogo}
                                    sx={{
                                        width: "100px",
                                        height: "100px",
                                        marginTop: "-15px",
                                        border: `2px solid ${mainButtonColor}`,
                                        borderRadius: 2,
                                        objectFit: "cover",
                                    }}
                                />
                            </Box>
                        )}
                    </Box>

                    {/* Background upload */}
                    <Box style={{ marginTop: "-5px" }}>
                        <Typography sx={{ width: "350px", fontWeight: "500" }}>Background School Image:</Typography>
                        <hr style={{ border: "1px solid #ccc", width: "100%", marginBottom: "10px" }} />
                        <Button
                            variant="contained" // changed to contained for primary color
                            component="label"
                            sx={{ mb: 3, backgroundColor: "#primary", color: "#fff", "&:hover": { backgroundColor: "#000" } }}
                        >
                            Choose Background
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={e => {
                                    setBgImage(e.target.files[0]);
                                    setPreviewBg(URL.createObjectURL(e.target.files[0]));
                                }}
                            />
                        </Button>
                        {previewBg && (
                            <Box
                                component="img"
                                src={previewBg}
                                sx={{
                                    width: "100%",
                                    height: "400px",
                                    border: `2px solid ${borderColor}`,
                                    borderRadius: 2,
                                    objectFit: "cover",
                                }}
                            />
                        )}
                    </Box>
                </Box>

                {/* Right side: Colors + Save Button */}
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: subtitleColor }}>
                        Theme Colors
                    </Typography>
                    {[
                        { label: "Header Color", value: headerColor, setter: setHeaderColor },
                        { label: "Footer Color", value: footerColor, setter: setFooterColor },
                        { label: "Main Button Color / Sidebar Background Color", value: mainButtonColor, setter: setMainButtonColor },
                        { label: "Sub Button Color", value: subButtonColor, setter: setSubButtonColor },
                        { label: "Border Color", value: borderColor, setter: setBorderColor },
                        { label: "Title Color / Icons Color", value: titleColor, setter: setTitleColor },
                        { label: "Subtitle Color", value: subtitleColor, setter: setSubtitleColor },
                    ].map(c => (
                        <Box key={c.label} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {/* Label with colon and bold */}
                            <InputLabel sx={{ mb: 1, fontWeight: "500" }}>
                                {c.label}:
                            </InputLabel>

                            <Box
                                sx={{
                                    height: "50px",
                                    borderRadius: 3,
                                    overflow: "hidden",
                                    border: "2px solid #ccc",
                                    cursor: "pointer",
                                    display: "flex",
                                }}
                                onClick={() => document.getElementById(c.label).click()}
                            >
                                <Box sx={{ flex: 1, backgroundColor: c.value }} />
                                <Input
                                    type="color"
                                    id={c.label}
                                    value={c.value}
                                    onChange={e => c.setter(e.target.value)}
                                    sx={{ opacity: 0, width: 0, height: 0 }}
                                />
                            </Box>

                            {/* Horizontal line below each color picker */}
                            <hr style={{ border: "1px solid #ccc", width: "100%", marginTop: "10px" }} />
                        </Box>
                    ))}

                    {/* Save Button under right column */}
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 4,
                            py: 1.5,
                            border: `2px solid ${borderColor}`,
                            width: "250px",
                            marginRight: "190px",
                            fontWeight: "bold",
                            alignSelf: "flex-end", // pushes it to the right side of the column
                            backgroundColor: "#primary"

                        }}
                        onClick={handleSubmit}
                    >
                        Save Settings
                    </Button>
                </Box>
            </Paper >



            <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleCloseSnack} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert severity={snack.severity} onClose={handleCloseSnack} sx={{ width: "100%" }}>{snack.message}</Alert>
            </Snackbar>
        </Box >
    );
}

export default Settings;
