import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  Avatar,
  FormControl,
  InputLabel,
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Search, SortByAlpha, FileDownload } from "@mui/icons-material";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import SearchIcon from "@mui/icons-material/Search";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import API_BASE_URL from "../apiConfig";
const RegisterProf = () => {
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


  const pageId = 70;

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


  const [searchQuery, setSearchQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [professors, setProfessors] = useState([]);
  const [department, setDepartment] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);


  const [form, setForm] = useState({
    person_id: "",
    fname: "",
    mname: "",
    lname: "",
    email: "",
    password: "",
    role: "faculty",
    dprtmnt_id: "",
    profileImage: null,
    preview: "", // ✅ for image preview
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // success | error | info | warning

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  const fetchProfessors = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/professors`);

      console.log("Fetched Professors:", res.data); // 👈 check what backend returns

      if (Array.isArray(res.data)) {
        setProfessors(res.data);
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        // some backends wrap results in a `data` property
        setProfessors(res.data.data);
      } else {
        console.warn("Unexpected professors response:", res.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };


  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/get_department`);
      setDepartment(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProfessors();
    fetchDepartments();
  }, []);

  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState("");


  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [sortOrder, setSortOrder] = useState("");


  const filteredProfessors = React.useMemo(() => {
    return professors
      .filter((p) => {
        const fullText = `${p.fname || ""} ${p.mname || ""} ${p.lname || ""} ${p.email || ""}`.toLowerCase();
        const matchesSearch = fullText.includes(searchQuery);
        const matchesDepartment =
          selectedDepartmentFilter === "" || p.dprtmnt_name === selectedDepartmentFilter;
        return matchesSearch && matchesDepartment;
      })
      .sort((a, b) => {
        const nameA = `${a.fname} ${a.lname}`.toLowerCase();
        const nameB = `${b.fname} ${b.lname}`.toLowerCase();
        if (sortOrder === "asc") return nameA.localeCompare(nameB);
        if (sortOrder === "desc") return nameB.localeCompare(nameA);
        return 0;
      });
  }, [professors, searchQuery, selectedDepartmentFilter, sortOrder]);



  const totalPages = Math.ceil(filteredProfessors.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfessors = filteredProfessors.slice(indexOfFirstItem, indexOfLastItem);

  const maxButtonsToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

  if (endPage - startPage < maxButtonsToShow - 1) {
    startPage = Math.max(1, endPage - maxButtonsToShow + 1);
  }

  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }



  const handleExportCSV = () => {
    const headers = ["Person ID", "Full Name", "Email", "Role", "Status"];
    const rows = currentProfessors.map((p) => [
      p.person_id,
      `${p.fname} ${p.mname || ""} ${p.lname}`,
      p.email,
      p.role,
      p.status === 1 ? "Active" : "Inactive",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "professors.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      setForm({ ...form, profileImage: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSelect = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const requiredFields = ["fname", "lname", "email"];
    if (!editData) {
      requiredFields.push("password", "profileImage", "person_id");
    }

    const missing = requiredFields.filter((key) => !form[key]);
    if (missing.length > 0) {
      alert(`Please fill out required fields: ${missing.join(", ")}`);
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (editData) {
        await axios.put(`${API_BASE_URL}/api/update_prof/${editData.prof_id}`, formData);
        setSnackbarMessage("Professor updated successfully!");
        setSnackbarSeverity("success");
      } else {
        await axios.post(`${API_BASE_URL}/api/register_prof`, formData);
        setSnackbarMessage("Professor registered successfully!");
        setSnackbarSeverity("success");
      }

      setOpenSnackbar(true); // show snackbar
      setTimeout(() => {
        fetchProfessors();
      }, 500);

      handleCloseDialog();
    } catch (err) {
      console.error("Submit Error:", err);
      setSnackbarMessage(err.response?.data?.error || "An error occurred");
      setSnackbarSeverity("error");
      setOpenSnackbar(true); // show snackbar
    }

  };

  const handleEdit = (prof) => {
    setEditData(prof);
    setForm({
      person_id: prof.person_id || "",
      fname: prof.fname,
      mname: prof.mname || "",
      lname: prof.lname,
      email: prof.email,
      password: "",
      role: prof.role || "faculty",
      dprtmnt_id: prof.dprtmnt_id || "",
      profileImage: null,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditData(null);
    setForm({
      person_id: "",
      fname: "",
      mname: "",
      lname: "",
      email: "",
      password: "",
      role: "faculty",
      dprtmnt_id: "",
      profileImage: null,
    });
  };

  const handleToggleStatus = async (prof_id, currentStatus) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await axios.put(`${API_BASE_URL}/api/update_prof_status/${prof_id}`, {
        status: newStatus,
      });
      fetchProfessors();
    } catch (err) {
      console.error("Status toggle failed:", err);
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
    <Box sx={{ height: "calc(100vh - 150px)", overflowY: "auto", pr: 1 }}>
      <div style={{ height: "10px" }}></div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} >
        {/* Left: Header */}
        <Typography variant="h4" fontWeight="bold" style={{ color: titleColor, }}>
          PROFESSOR ACCOUNTS
        </Typography>

        {/* Right: Search */}
        <TextField
          variant="outlined"
          placeholder="Search by name or email"
          size="small"

          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value.toLowerCase());
            setCurrentPage(1); // reset to page 1 when searching
          }}
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

      <hr style={{ border: "1px solid #ccc", width: "100%" }} />


      <br />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", mb: 2 }}>


        <TableContainer component={Paper} sx={{ width: '100%' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#6D2323', color: "white" }}>
              <TableRow>
                <TableCell
                  colSpan={10}
                  sx={{
                    border: `2px solid ${borderColor}`,
                    py: 0.5,
                    backgroundColor: settings?.header_color || "#1976d2",
                    color: "white"
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" >
                    {/* Left: Applicant List Count */}
                    <Typography fontSize="14px" fontWeight="bold" color="white" >
                      Professor's List:
                    </Typography>

                    {/* Right: Pagination Controls */}
                    <Box display="flex" alignItems="center" gap={1}>
                      {/* First & Prev */}
                      <Button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 80,
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                          '&.Mui-disabled': {
                            color: "white",
                            borderColor: "white",
                            backgroundColor: "transparent",
                            opacity: 1,
                          },
                        }}
                      >
                        First
                      </Button>

                      <Button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 80,
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                          '&.Mui-disabled': {
                            color: "white",
                            borderColor: "white",
                            backgroundColor: "transparent",
                            opacity: 1,
                          },
                        }}
                      >
                        Prev
                      </Button>

                      {/* Page Dropdown */}
                      <FormControl size="small" sx={{ minWidth: 80 }}>
                        <Select
                          value={currentPage}
                          onChange={(e) => setCurrentPage(Number(e.target.value))}
                          displayEmpty
                          sx={{
                            fontSize: '12px',
                            height: 36,
                            color: 'white',
                            border: '1px solid white',
                            backgroundColor: 'transparent',
                            '.MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'white',
                            },
                            '& svg': {
                              color: 'white',
                            }
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: 200,
                                backgroundColor: '#fff',
                              }
                            }
                          }}
                        >
                          {Array.from({ length: totalPages }, (_, i) => (
                            <MenuItem key={i + 1} value={i + 1}>
                              Page {i + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Typography fontSize="11px" color="white">
                        of {totalPages} page{totalPages > 1 ? 's' : ''}
                      </Typography>

                      {/* Next & Last */}
                      <Button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 80,
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                          '&.Mui-disabled': {
                            color: "white",
                            borderColor: "white",
                            backgroundColor: "transparent",
                            opacity: 1,
                          },
                        }}
                      >
                        Next
                      </Button>

                      <Button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 80,
                          color: "white",
                          borderColor: "white",
                          backgroundColor: "transparent",
                          '&:hover': {
                            borderColor: 'white',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                          },
                          '&.Mui-disabled': {
                            color: "white",
                            borderColor: "white",
                            backgroundColor: "transparent",
                            opacity: 1,
                          },
                        }}
                      >
                        Last
                      </Button>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>

        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            border: `2px solid ${borderColor}`,
            mb: -2,
          }}
        >
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between", // left vs right
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 2,
                    }}
                  >
                    {/* Left: Add Professor */}
                    <Button
                      startIcon={<Add />}
                      variant="contained"
                      onClick={() => {
                        setEditData(null);
                        setForm((prev) => ({
                          ...prev,
                          person_id: "",
                          fname: "",
                          mname: "",
                          lname: "",
                          email: "",
                          password: "",
                          role: "faculty",
                          dprtmnt_id: "",
                          profileImage: null,
                        }));
                        setTimeout(() => setOpenDialog(true), 0);
                      }}

                      sx={{
                        backgroundColor: "default",
                        color: "white",
                        textTransform: "none",
                        fontWeight: "bold",
                        width: "350px",
                        "&:hover": { backgroundColor: "#000" },
                      }}
                    >
                      Add Professor
                    </Button>

                    {/* Right: Filter, Sort, Export */}
                    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                      {/* Department Filter */}
                      <FormControl sx={{ width: "350px" }} size="small">
                        <InputLabel id="filter-department-label">
                          Filter by Department
                        </InputLabel>
                        <Select
                          labelId="filter-department-label"
                          value={selectedDepartmentFilter}
                          onChange={(e) => setSelectedDepartmentFilter(e.target.value)}
                          label="Filter by Department"
                        >
                          <MenuItem value="">All Departments</MenuItem>
                          {department.map((dep) => (
                            <MenuItem key={dep.dprtmnt_id} value={dep.dprtmnt_name}>
                              {dep.dprtmnt_name} ({dep.dprtmnt_code})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl size="small" sx={{ width: "200px" }}>
                        <Select
                          value={sortOrder}
                          onChange={(e) => setSortOrder(e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="">Select Order</MenuItem>
                          <MenuItem value="asc">Ascending</MenuItem>
                          <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                      </FormControl>


                      {/* Export */}
                      <Button
                        variant="outlined"
                        startIcon={<FileDownload />}
                        onClick={handleExportCSV}
                        sx={{
                          borderColor: "#800000",
                          color: "#800000",
                          textTransform: "none",
                          fontWeight: "bold",
                          "&:hover": { borderColor: "#a52a2a", color: "#a52a2a" },
                        }}
                      >
                        Export CSV
                      </Button>
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>


      </Box>
      <TableContainer component={Paper} sx={{ width: "100%", border: `2px solid ${borderColor}`, }}>
        <Table>
          <TableHead sx={{
            backgroundColor: settings?.header_color || "#1976d2",

          }}>
            <TableRow>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${borderColor}`,
                  border: `2px solid ${borderColor}`,
                }}
              >
                EMPLOYEE ID
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Image
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Full Name
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Email
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Department
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Position
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${borderColor}`,
                  border: `2px solid ${borderColor}`,
                }}
              >
                Actions
              </TableCell>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                  border: `2px solid ${borderColor}`,
                }}
              >
                Status
              </TableCell>

            </TableRow>
          </TableHead>

          <TableBody>


            {currentProfessors.map((prof) => (
              <TableRow key={prof.prof_id}>
                <TableCell sx={{ border: `2px solid ${borderColor}`, border: `2px solid ${borderColor}`, }}>{prof.person_id ?? "N/A"}</TableCell>
                <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                  <Avatar
                    src={
                      prof.profile_image
                        ? `${API_BASE_URL}/uploads/${prof.profile_image}`
                        : undefined
                    }
                    alt={prof.fname}
                    sx={{ width: 60, height: 60 }}
                  >
                    {prof.fname?.[0]}
                  </Avatar>
                </TableCell>
                <TableCell sx={{ border: `2px solid ${borderColor}` }}>{`${prof.fname} ${prof.mname || ""} ${prof.lname}`}</TableCell>
                <TableCell sx={{ border: `2px solid ${borderColor}` }}>{prof.email}</TableCell>
                <TableCell sx={{ border: `2px solid ${borderColor}` }}>{prof.dprtmnt_name} ({prof.dprtmnt_code})</TableCell>
                <TableCell sx={{ border: `2px solid ${borderColor}` }}>{prof.role}</TableCell>
                <TableCell sx={{ border: `2px solid ${borderColor}`, }}>
                  <Button
                    onClick={() => handleEdit(prof)}
                    sx={{
                      backgroundColor: "green",
                      color: "white",
                      textTransform: "none",
                      fontWeight: "bold",

                    }}
                    variant="contained"
                  >
                    EDIT
                  </Button>
                </TableCell>
                <TableCell sx={{ border: `2px solid ${borderColor}` }}>
                  <Button
                    onClick={() => handleToggleStatus(prof.prof_id, prof.status)}
                    sx={{
                      backgroundColor: prof.status === 1 ? "green" : "maroon",
                      color: "white",
                      textTransform: "none",
                    }}
                    variant="contained"
                  >
                    {prof.status === 1 ? "Active" : "Inactive"}
                  </Button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ➕ / ✏️ Professor Modal */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: "maroon", fontWeight: "bold" }}>
          {editData ? "Edit Professor" : "Add New Professor"}
        </DialogTitle>
        <hr style={{ border: "1px solid #ccc", width: "100%" }} />

        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2}>
            {/* 🔹 Profile Picture Upload */}
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="flex-start">
              <Avatar
                src={
                  form.preview ||
                  (editData?.profile_image
                    ? `${API_BASE_URL}/uploads/${editData.profile_image}`
                    : "")
                }
                alt={form.fname || "Profile"}
                sx={{
                  width: 80,
                  height: 80,
                  border: `2px solid ${borderColor}`,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              />
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: "#6D2323",
                  color: "#6D2323",
                  textTransform: "none",
                  fontWeight: "bold",
                  "&:hover": { borderColor: "#800000", color: "#800000" },
                }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setForm({
                        ...form,
                        profileImage: file,
                        preview: URL.createObjectURL(file),
                      });
                    }
                  }}
                />
              </Button>
            </Stack>

            <TextField
              label="Employee ID"
              name="person_id"
              value={form.person_id}
              onChange={handleChange}
              fullWidth
              autoComplete="off"
            />
            <TextField
              label="First Name"
              name="fname"
              value={form.fname}
              onChange={handleChange}
              fullWidth
              autoComplete="off"
            />
            <TextField
              label="Middle Name"
              name="mname"
              value={form.mname}
              onChange={handleChange}
              fullWidth
              autoComplete="off"
            />
            <TextField
              label="Last Name"
              name="lname"
              value={form.lname}
              onChange={handleChange}
              fullWidth
              autoComplete="off"
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              autoComplete="off"
            />
            {!editData && (
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                autoComplete="new-password"
              />
            )}

            {/* 🔹 Department Dropdown */}
            <FormControl fullWidth>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                name="dprtmnt_id"
                value={form.dprtmnt_id || ""}
                label="Department"
                onChange={handleSelect}
              >
                {department.map((dep) => (
                  <MenuItem key={dep.dprtmnt_id} value={dep.dprtmnt_id}>
                    {dep.dprtmnt_name} ({dep.dprtmnt_code})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: mainButtonColor,
              "&:hover": { backgroundColor: "#000000" },
              fontWeight: "bold",
            }}
          >
            {editData ? "Save Changes" : "Register"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>



    </Box>

  );
};

export default RegisterProf;
