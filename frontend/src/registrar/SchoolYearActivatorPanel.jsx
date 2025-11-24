import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import { Typography, Box, Snackbar, Alert } from '@mui/material';
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import API_BASE_URL from "../apiConfig";
const SchoolYearActivatorPanel = () => {
    const settings = useContext(SettingsContext);

    const [titleColor, setTitleColor] = useState("#000000");
    const [subtitleColor, setSubtitleColor] = useState("#555555");
    const [borderColor, setBorderColor] = useState("#000000");

    const [userID, setUserID] = useState("");
    const [userRole, setUserRole] = useState("");
    const [employeeID, setEmployeeID] = useState("");
    const [hasAccess, setHasAccess] = useState(null);
    const [loading, setLoading] = useState(false);

    const pageId = 54;

    const [schoolYears, setSchoolYears] = useState([]);

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
        } catch (error) {
            console.error('Error checking access:', error);
            setHasAccess(false);
            setSnackbar({ open: true, message: "Failed to check access", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const fetchSchoolYears = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/school_years`);
            setSchoolYears(res.data);
        } catch (error) {
            console.error("Error fetching school years:", error);
            setSnackbar({ open: true, message: "Failed to fetch school years", severity: "error" });
        }
    };

    useEffect(() => {
        fetchSchoolYears();
    }, []);

    const toggleActivator = async (schoolYearId, currentStatus) => {
        try {
            const updatedStatus = currentStatus === 1 ? 0 : 1;

            if (updatedStatus === 1) {
                // Deactivate all others first
                await axios.put(`${API_BASE_URL}/school_years/deactivate_all`);
            }

            // Update the selected school year
            await axios.put(`${API_BASE_URL}/school_years/${schoolYearId}`, {
                activator: updatedStatus,
            });

            fetchSchoolYears(); // Refresh after change
            setSnackbar({
                open: true,
                message: updatedStatus === 1 ? "School year activated!" : "School year deactivated!",
                severity: "success"
            });
        } catch (error) {
            console.error("Error updating activator:", error);
            setSnackbar({
                open: true,
                message: "Failed to update school year",
                severity: "error"
            });
        }
    };

    // 🔒 Disable right-click & DevTools
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            const blocked = ['F12', 'F11'];
            if (
                blocked.includes(e.key) ||
                (e.ctrlKey && e.shiftKey && ['i', 'j'].includes(e.key.toLowerCase())) ||
                (e.ctrlKey && ['u', 'p'].includes(e.key.toLowerCase()))
            ) {
                e.preventDefault();
                e.stopPropagation();
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
                    SCHOOL YEAR ACTIVATOR PANEL
                </Typography>
            </Box>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />
            <table className="w-full border border-gray-300" style={{ border: `2px solid ${borderColor}`, textAlign: "center" }} >
                <thead>
                    <tr style={{ backgroundColor: settings?.header_color || "#1976d2", color: "#ffffff" }}>
                        <th className="p-2 border" style={{ border: `2px solid ${borderColor}` }}>Year Level</th>
                        <th className="p-2 border" style={{ border: `2px solid ${borderColor}` }}>Semester</th>
                        <th className="p-2 border" style={{ border: `2px solid ${borderColor}` }}>Status</th>
                        <th className="p-2 border" style={{ border: `2px solid ${borderColor}` }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {schoolYears.map((sy) => (
                        <tr key={sy.id}>
                            <td className="p-2 border" style={{ border: `2px solid ${borderColor}` }}>{`${sy.year_description}-${parseInt(sy.year_description) + 1}`}</td>
                            <td className="p-2 border" style={{ border: `2px solid ${borderColor}` }}>{sy.semester_description}</td>
                            <td className="p-2 border" style={{ border: `2px solid ${borderColor}` }}>{sy.astatus === 1 ? "Active" : "Inactive"}</td>
                            <td className="p-2 border" style={{ border: `2px solid ${borderColor}` }}>
                                <button
                                    onClick={() => toggleActivator(sy.id, sy.astatus)}
                                    style={{
                                        width: "140px", // ✅ Adjusted width
                                        padding: "6px 12px",
                                        borderRadius: "4px",
                                        color: "white",
                                        backgroundColor: sy.astatus === 1 ? "#DC2626" : "#16A34A",
                                        cursor: "pointer",
                                    }}
                                >
                                    {sy.astatus === 1 ? "Deactivate" : "Activate"}
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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

export default SchoolYearActivatorPanel;
