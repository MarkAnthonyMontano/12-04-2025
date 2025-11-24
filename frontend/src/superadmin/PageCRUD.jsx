import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import {
    Box,
    Button,
    Container,
    CssBaseline,
    TextField,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Slide,
    Tooltip,
    Snackbar,
    Alert,
} from "@mui/material";
import API_BASE_URL from "../apiConfig";
import { IoMdAddCircle } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PageCRUD = () => {

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


    const pageId = 69;

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

    const [pages, setPages] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentPageId, setCurrentPageId] = useState(null);
    const [pageDescription, setPageDescription] = useState("");
    const [pageGroup, setPageGroup] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });

    const mainColor = "#7E0000";

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/pages`);
            const sortedPages = response.data.sort((a, b) => a.id - b.id);
            setPages(sortedPages);
        } catch (error) {
            console.error("Error fetching pages:", error);
        }
    };

    const [pageIdInput, setPageIdInput] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (currentPageId) {
                // UPDATE
                await axios.put(`${API_BASE_URL}/api/pages/${currentPageId}`, {
                    page_description: pageDescription,
                    page_group: pageGroup,
                });

                setSnackbar({
                    open: true,
                    message: "Page updated successfully!",
                    type: "success",
                });

            } else {
                // ADD — detect duplicate
                await axios.post(`${API_BASE_URL}/api/pages`, {
                    id: pageIdInput,
                    page_description: pageDescription,
                    page_group: pageGroup,
                });

                setSnackbar({
                    open: true,
                    message: "Page added successfully!",
                    type: "success",
                });
            }

            fetchPages();
            handleClose();

        } catch (error) {
            if (error.response && error.response.status === 400) {
                // Duplicate ID error
                setSnackbar({
                    open: true,
                    message: "Page ID already exists!",
                    type: "error",
                });
            } else {
                setSnackbar({
                    open: true,
                    message: "Error saving page",
                    type: "error",
                });
            }
        }
    };




    const handleEdit = (page) => {
        setCurrentPageId(String(page.id));
        setPageIdInput(String(page.id));

        setPageDescription(page.page_description);
        setPageGroup(page.page_group);
        setOpen(true);
    };


    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/pages/${id}`);
            fetchPages();

            setSnackbar({
                open: true,
                message: "Page deleted successfully!",
                type: "success",
            });

        } catch (error) {
            console.error("Error deleting page:", error);

            setSnackbar({
                open: true,
                message: "Error deleting page",
                type: "error",
            });
        }
    };


    const handleOpen = () => {
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setCurrentPageId(null);
        setPageIdInput("");
        setPageDescription("");
        setPageGroup("");
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
        <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", paddingRight: 1, backgroundColor: "transparent" }}>
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
                        fontWeight: "bold",
                        color: titleColor,
                        fontSize: "36px",
                    }}
                >
                    PAGE MANAGEMENT
                </Typography>
            </Box>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />
            <br />

            <Button
                variant="contained"
                startIcon={<IoMdAddCircle size={20} />}
                onClick={handleOpen}
                sx={{
                    backgroundColor: settings?.header_color || "#1976d2",
                    borderRadius: "10px",
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    fontSize: "16px",
                }}
            >
                Add New Page
            </Button>

            <div style={{ height: "30px" }}></div>

            {/* Pages Table */}
            <Paper
                elevation={4}
                sx={{
                    border: `2px solid ${borderColor}`,
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
                                    Actions
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pages.length > 0 ? (
                                pages.map((page) => (
                                    <TableRow key={page.id} hover>
                                        <TableCell style={{ border: `2px solid ${borderColor}` }}>
                                            {page.id}
                                        </TableCell>
                                        <TableCell style={{ border: `2px solid ${borderColor}` }}>
                                            {page.page_description}
                                        </TableCell>
                                        <TableCell style={{ border: `2px solid ${borderColor}` }}>
                                            {page.page_group}
                                        </TableCell>
                                        <TableCell
                                            style={{ border: `2px solid ${borderColor}` }}
                                            align="center"
                                        >
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    backgroundColor: "green",
                                                    color: "white",
                                                    marginRight: 1,

                                                }}
                                                onClick={() => handleEdit(page)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#B22222",
                                                    color: "white",
                                                    "&:hover": { backgroundColor: "#8B0000" },
                                                }}
                                                onClick={() => handleDelete(page.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
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

            {/* Add/Edit Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
                keepMounted
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle
                    sx={{
                        bgcolor: mainColor,
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "center",
                    }}
                >
                    {currentPageId ? "Edit Page" : "Add New Page"}
                </DialogTitle>
                <DialogContent dividers sx={{ py: 4 }}>
                    <form onSubmit={handleSubmit}>

                        {/* ADD MODE - ID editable */}
                        {currentPageId === null && (
                            <TextField
                                fullWidth
                                label="Page ID"
                                variant="outlined"
                                margin="normal"
                                type="number"
                                value={pageIdInput}
                                onChange={(e) => setPageIdInput(e.target.value)}
                                required
                            />
                        )}

                        {/* EDIT MODE - ID read-only */}
                        {currentPageId !== null && (
                            <TextField
                                fullWidth
                                label="Page ID"
                                variant="outlined"
                                margin="normal"
                                value={pageIdInput}
                                InputProps={{ readOnly: true }}
                            />
                        )}

                        <TextField
                            fullWidth
                            label="Page Description"
                            variant="outlined"
                            margin="normal"
                            value={pageDescription}
                            onChange={(e) => setPageDescription(e.target.value)}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Page Group"
                            variant="outlined"
                            margin="normal"
                            value={pageGroup}
                            onChange={(e) => setPageGroup(e.target.value)}
                            required
                        />
                    </form>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
                    <Button onClick={handleClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ bgcolor: mainColor, "&:hover": { bgcolor: `${mainColor}CC` } }}
                    >
                        {currentPageId ? "Update Page" : "Add Page"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
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

export default PageCRUD;
