import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    Paper,
    TextField,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Card,
    CardContent,
    Grid
} from "@mui/material";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import LoadingOverlay from '../components/LoadingOverlay';
import { Message } from "@mui/icons-material";
import { FcPrint } from "react-icons/fc";
import EaristLogo from '../assets/EaristLogo.png';
import API_BASE_URL from "../apiConfig";
const FacultyEvaluation = () => {

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


    const [userID, setUserID] = useState("");
    const [user, setUser] = useState("");
    const [userRole, setUserRole] = useState("");
    const [studentCourses, setStudentCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [studentNumber, setStudentNumber] = useState("");
    const [chartData, setChartData] = useState([]); // ✅ added
    const [loading, setLoading] = useState(true);
    const [schoolYears, setSchoolYears] = useState([]);
    const [schoolSemester, setSchoolSemester] = useState([]);
    const [selectedSchoolYear, setSelectedSchoolYear] = useState('');
    const [selectedSchoolSemester, setSelectedSchoolSemester] = useState('');
    const [selectedActiveSchoolYear, setSelectedActiveSchoolYear] = useState('');
    const [profData, setPerson] = useState({
        prof_id: "",
        fname: "",
        mname: "",
        lname: "",
        profile_image: "",
    });

    // Add a ref for the print content
    const divToPrintRef = useRef();

    // ✅ On page load: check user session and fetch student data
    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const storedID = localStorage.getItem("person_id");

        if (storedUser && storedRole && storedID) {
            setUser(storedUser);
            setUserRole(storedRole);
            setUserID(storedID);

            if (storedRole !== "faculty") {
                window.location.href = "/login";
            } else {
                fetchPersonData(storedID);
            }
        } else {
            window.location.href = "/login";
        }
    }, []);

    const fetchPersonData = async (id) => {
        try {
            const res = await axios.get(`${API_BASE_URL}/get_prof_data/${id}`)
            const first = res.data[0];
            const profInfo = {
                prof_id: first.prof_id,
                fname: first.fname,
                mname: first.mname,
                lname: first.lname,
                profile_image: first.profile_image,
            };
            setPerson(profInfo);
        } catch (err) {
            console.error("Error Fetching Professor Personal Data");
        }
    }

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/get_school_year/`)
            .then((res) => setSchoolYears(res.data))
            .catch((err) => console.error(err));
    }, [])

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/get_school_semester/`)
            .then((res) => setSchoolSemester(res.data))
            .catch((err) => console.error(err));
    }, [])

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/active_school_year`)
            .then((res) => {
                if (res.data.length > 0) {
                    setSelectedSchoolYear(res.data[0].year_id);
                    setSelectedSchoolSemester(res.data[0].semester_id);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        if (selectedSchoolYear && selectedSchoolSemester) {
            axios
                .get(`${API_BASE_URL}/get_selecterd_year/${selectedSchoolYear}/${selectedSchoolSemester}`)
                .then((res) => {
                    if (res.data.length > 0) {
                        setSelectedActiveSchoolYear(res.data[0].school_year_id);
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [selectedSchoolYear, selectedSchoolSemester]);

    useEffect(() => {
        if (selectedSchoolYear && selectedSchoolSemester) {
            fetchFacultyData();
        }
    }, [selectedSchoolYear, selectedSchoolSemester]);

    const fetchFacultyData = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/faculty_evaluation`, {
                params: {
                    prof_id: profData.prof_id,
                    year_id: selectedSchoolYear,
                    semester_id: selectedSchoolSemester,
                },
            });
            const data = res.data;

            const formatted = data.map(course => ({
                courseID: course.course_id,
                course_code: course.course_code,
                chartData: [
                    { name: "Rating 1", total: course.answered_one_count },
                    { name: "Rating 2", total: course.answered_two_count },
                    { name: "Rating 3", total: course.answered_three_count },
                    { name: "Rating 4", total: course.answered_four_count },
                    { name: "Rating 5", total: course.answered_five_count },
                ]
            }));

            setChartData(formatted);
        } catch (err) {
            setChartData([]);

        } finally {
            setLoading(false);
        }
    };

    const handleSchoolYearChange = (event) => {
        setSelectedSchoolYear(event.target.value);
    };

    const handleSchoolSemesterChange = (event) => {
        setSelectedSchoolSemester(event.target.value);
    };

    const AuditLog = async () => {

        try {
            const page_name = "Faculty Evaluation Report";
            const fullName = `${profData.lname}, ${profData.fname} ${profData.mname}`;
            const type = "Printing"

            await axios.post(`${API_BASE_URL}/insert-logs/faculty/${profData.prof_id}`, {
                message: `User #${profData.prof_id} - ${fullName} printed ${page_name}`, type: type,
            });

          
        } catch (err) {
            console.error("Error inserting audit log:", err);
            alert("Failed to insert audit log.");
        }
    };

    // Create a combined print function that logs and prints
       // Create a combined print function that logs and prints
    const printDiv = async () => {
        // First log the action
        await AuditLog();
        
        // ✅ Determine dynamic campus address
        let campusAddress = "";
        if (settings?.campus_address && settings.campus_address.trim() !== "") {
            campusAddress = settings.campus_address;
        } else if (settings?.address && settings.address.trim() !== "") {
            campusAddress = settings.address;
        } else {
            campusAddress = "No address set in Settings";
        }

        // ✅ Dynamic logo and company name
        const logoSrc = fetchedLogo || EaristLogo;
        const name = companyName?.trim() || "";

        // ✅ Split company name into two balanced lines
        const words = name.split(" ");
        const middleIndex = Math.ceil(words.length / 2);
        const firstLine = words.slice(0, middleIndex).join(" ");
        const secondLine = words.slice(middleIndex).join(" ");
        
        // Get current school year and semester for header
        const currentSchoolYear = schoolYears.find(sy => sy.year_id === selectedSchoolYear);
        const currentSemester = schoolSemester.find(sem => sem.semester_id === selectedSchoolSemester);
        
        // Calculate total responses for each course
        const calculateTotal = (chartData) => {
            return chartData.reduce((sum, item) => sum + item.total, 0);
        };
        
        // Open new print window
        const newWin = window.open("", "Print-Window");
        newWin.document.open();
        newWin.document.write(`
            <html>
                <head>
                    <title>Faculty Evaluation Report</title>
                    <style>
                        @page { size: A4; margin: 10mm; }
                        body {
                            font-family: Arial, sans-serif;
                            margin-top: 50px;
                            padding: 0;
                        }
                        .print-container {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            text-align: center;
                        }
                        .print-header {
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            width: 100%;
                            margin-bottom: 2px;
                        }
                        .print-header img {
                            position: absolute;
                            left: 0;
                            margin-left: 50px;
                            width: 120px;
                            height: 120px;
                            border-radius: 50%;
                            object-fit: cover;
                        }
                        .evaluation-header {
                            margin-top: 20px;
                            margin-bottom: 20px;
                        }
                        .evaluation-title {
                            font-size: 20px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                        .evaluation-subtitle {
                            font-size: 16px;
                            margin-bottom: 5px;
                        }
                        .chart-container {
                            margin-top: 0rem;
                            width: 100%;
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: center;
                            gap: 20px;
                            transform: scale(1);
                            margin-bottom: 10px;
                        }
                        .chart-card {
                            width: 45%;
                            border: 2px solid black;
                            padding: 10px;
                            margin-bottom: 20px;    
                            page-break-inside: avoid;
                            border-radius: 12px;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .chart-title {
                            text-align: center;
                            font-weight: bold;
                            margin-bottom: 10px;
                            color: maroon;
                            padding-top: 8px;
                        }
                        .chart-wrapper {
                            height: 300px;
                            position: relative;
                        }
                        .total-label {
                            position: absolute;
                            bottom: 10px;
                            right: 10px;
                            font-size: 12px;
                            font-weight: bold;
                            background: rgba(255,255,255,0.9);
                            padding: 2px 5px;
                            border-radius: 3px;
                        }
                        .no-data {
                            text-align: center;
                            padding: 20px;
                            border: 2px solid black;
                            width: 95%;
                            margin: 0 auto;
                        }
                    </style>
                </head>
                <body onload="window.print(); setTimeout(() => window.close(), 100);">
                    <div class="print-container">
                        <!-- ✅ HEADER -->
                        <div class="print-header">
                            <img src="${logoSrc}" alt="School Logo" />
                            <div>
                                <div>Republic of the Philippines</div>
                                ${name
                ? `
                                    <b style="letter-spacing: 1px; font-size: 20px; font-family: 'Times New Roman', serif;">
                                        ${firstLine}
                                    </b>
                                    ${secondLine
                    ? `<div style="letter-spacing: 1px; font-size: 20px; font-family: 'Times New Roman', serif;"><b>${secondLine}</b></div>`
                    : ""
                }
                                `
                : ""
            }
                                <div style="font-size: 12px;">${campusAddress}</div>
                                <div style="margin-top: 10px;">
                                    <b style="font-size: 20px; letter-spacing: 1px;">FACULTY EVALUATION REPORT</b>
                                </div>
                                <div class="evaluation-header">
                                    <div class="evaluation-subtitle">Faculty: ${profData.lname}, ${profData.fname} ${profData.mname}</div>
                                    <div class="evaluation-subtitle">
                                        ${currentSchoolYear ? `${currentSchoolYear.current_year} - ${currentSchoolYear.next_year}` : 'School Year Not Selected'}
                                        ${currentSemester ? `, ${currentSemester.semester_description}` : ', Semester Not Selected'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- ✅ CHARTS -->
                        <div class="chart-container">
                            ${chartData.length > 0 ? (
                    chartData.map((entry, index) => {
                        const total = calculateTotal(entry.chartData);
                        return `
                                <div class="chart-card">
                                    <div class="chart-title">EVALUATION FOR COURSE ${entry.course_code}</div>
                                    <div class="chart-wrapper">
                                        <svg width="100%" height="100%" viewBox="0 0 550 300" preserveAspectRatio="xMidYMid meet">
                                            <!-- Grid lines (CartesianGrid) -->
                                            <g stroke="#e0e0e0" stroke-dasharray="3 3">
                                                ${[10, 20, 30, 40, 50].map(y => 
                                                    `<line x1="60" y1="${200 - (y * 3.33)}" x2="500" y2="${200 - (y * 3.33)}" />`
                                                ).join('')}
                                            </g>
                                            
                                            <!-- Axes -->
                                            <line x1="60" y1="20" x2="60" y2="200" stroke="black" />
                                            <line x1="60" y1="200" x2="500" y2="200" stroke="black" />
                                            
                                            <!-- Y-axis labels -->
                                            <g font-size="11" text-anchor="end" fill="#666">
                                                <text x="50" y="205">0</text>
                                                <text x="50" y="172">10</text>
                                                <text x="50" y="138">20</text>
                                                <text x="50" y="105">30</text>
                                                <text x="50" y="72">40</text>
                                                <text x="50" y="38">50</text>
                                                <text x="50" y="5">60</text>
                                            </g>
                                            
                                            <!-- Y-axis title -->
                                            <text x="15" y="110" font-size="12" text-anchor="middle" transform="rotate(-90 15 110)">Number of Responses</text>
                                            
                                            <!-- Bars with exact colors from FacultyEvaluation -->
                                            ${entry.chartData.map((item, i) => {
                                                const barHeight = (item.total / 60) * 180; // Scale based on max value of 60
                                                const x = 60 + (i * 88);
                                                const colors = ["#FF0000", "#00C853", "#2196F3", "#FFD600", "#FF6D00"];
                                                return `
                                                    <rect x="${x}" y="${200 - barHeight}" width="70" height="${barHeight}" 
                                                          fill="${colors[i]}" rx="2" />
                                                    <text x="${x + 35}" y="220" text-anchor="middle" font-size="11">${item.name}</text>
                                                    <text x="${x + 35}" y="${195 - barHeight}" text-anchor="middle" font-size="10" font-weight="bold">${item.total}</text>
                                                `;
                                            }).join('')}
                                            
                                            <!-- Tooltip style hover areas (optional, for visual reference) -->
                                            ${entry.chartData.map((item, i) => {
                                                const x = 60 + (i * 88);
                                                return `
                                                    <rect x="${x}" y="20" width="70" height="180" 
                                                          fill="transparent" style="cursor: pointer;">
                                                        <title>${item.name}: ${item.total} responses</title>
                                                    </rect>
                                                `;
                                            }).join('')}
                                        </svg>
                                       
                                    </div>
                                </div>
                            `;
                    }).join('')
                ) : `
                                <div class="no-data">
                                    There's no evaluation in this term.
                                </div>
                            `
            }
                        </div>
                    </div>
                </body>
            </html>
        `);
        newWin.document.close();
    };

    // 🔒 Disable right-click
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 🔒 Block DevTools shortcuts silently
    document.addEventListener('keydown', (e) => {
        const isBlockedKey =
            e.key === 'F12' ||
            e.key === 'F11' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && e.key === 'U');

        if (isBlockedKey) {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    return (
        <Box className="body" sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto', pr: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" fontWeight="bold" style={{ color: titleColor }}>
                    FACULTY EVALUATION
                </Typography>
            </Box>
            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            <br />

            <TableContainer component={Paper} sx={{ width: '99%', }}>
                <Table size="small">
                    <TableHead sx={{ backgroundColor: settings?.header_color || "#1976d2", color: "white" }}>
                        <TableRow>
                            <TableCell colSpan={10} sx={{ border: `2px solid ${borderColor}`, py: 0.5, height: "40px", backgroundColor: settings?.header_color || "#1976d2", color: "white" }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">

                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
            <TableContainer component={Paper} sx={{ width: '99%', border: `2px solid ${borderColor}`, p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "1rem 0", padding: "0 1rem", }} gap={5}>
                    <Box
                        style={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: "500px",
                        }}
                    >
                        <Typography fontSize={13} sx={{ minWidth: "100px" }}>
                            Print:
                        </Typography>

                        <button
                            onClick={printDiv}
                            style={{
                                width: "300px",
                                padding: "10px 20px",
                                border: "2px solid black",
                                backgroundColor: "#f0f0f0",
                                color: "black",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "bold",
                                transition: "background-color 0.3s, transform 0.2s",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#d3d3d3")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
                            onMouseDown={(e) => (e.target.style.transform = "scale(0.95)")}
                            onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <FcPrint size={20} />
                                Print Evaluation
                            </span>
                        </button>
                    </Box>

                    <Box display="flex" gap={2} sx={{ minWidth: "450px" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={13} sx={{ minWidth: "100px" }}>School Year:</Typography>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">School Years</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    style={{ width: "200px" }}
                                    value={selectedSchoolYear}
                                    label="School Years"
                                    onChange={handleSchoolYearChange}
                                >
                                    {schoolYears.length > 0 ? (
                                        schoolYears.map((sy) => (
                                            <MenuItem value={sy.year_id} key={sy.year_id}>
                                                {sy.current_year} - {sy.next_year}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>School Year is not found</MenuItem>
                                    )
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography fontSize={13} sx={{ minWidth: "100px" }}>Semester: </Typography>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">School Semester</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    style={{ width: "200px", }}
                                    value={selectedSchoolSemester}
                                    label="School Semester"
                                    onChange={handleSchoolSemesterChange}
                                >
                                    {schoolSemester.length > 0 ? (
                                        schoolSemester.map((sem) => (
                                            <MenuItem value={sem.semester_id} key={sem.semester_id}>
                                                {sem.semester_description}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>School Semester is not found</MenuItem>
                                    )
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </TableContainer>
            
            <div className='print-container' ref={divToPrintRef}>
                <Grid container spacing={3} sx={{ mt: 3, gap: "2rem", justifyContent: "center", display: "flex", flexWrap: "wrap", }}>
                    {chartData.length > 0 ? (
                        chartData.map((entry, index) => (
                            <Grid item xs={12} md={12} lg={5} key={index}>
                                <Card
                                    sx={{
                                        p: 2,
                                        marginLeft: "10px",
                                        marginTop: "-20px",
                                        borderRadius: 3,
                                        width: 550,
                                        height: 400,
                                        border: `2px solid ${borderColor}`,
                                        transition: "transform 0.2s ease",
                                        boxShadow: 3,
                                        "&:hover": { transform: "scale(1.03)" },
                                        boxShadow: 3,
                                    }}
                                >
                                    <CardContent sx={{ height: "100%", p: 0 }}>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            mb={1}
                                            sx={{ color: "maroon", textAlign: "center", pl: 2, pt: 2 }}
                                        >
                                            EVALUATION FOR COURSE {entry.course_code}
                                        </Typography>
                                        {/* Chart takes the rest of card height */}
                                        <Box sx={{ height: "calc(100% - 40px)", px: 2, pb: 2 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={entry.chartData}
                                                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="name"
                                                        interval={0}
                                                    />
                                                    <YAxis
                                                        allowDecimals={false}
                                                        ticks={[0, 10, 20, 30, 40, 50, 60]}
                                                        domain={[0, 60]}
                                                        label={{
                                                            value: 'Number of Responses',
                                                            angle: -90,
                                                            position: 'insideLeft',
                                                            dy: 90,
                                                            dx: 10
                                                        }}
                                                    />
                                                    <Tooltip />
                                                    <Bar dataKey="total">
                                                        {entry.chartData.map((_, i) => (
                                                            <Cell
                                                                key={`cell-${i}`}
                                                                fill={[
                                                                    "#FF0000",
                                                                    "#00C853",
                                                                    "#2196F3",
                                                                    "#FFD600",
                                                                    "#FF6D00",
                                                                ][i % 5]}
                                                            />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))) : (
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, ml: 1, width: '97%', border: `2px solid ${borderColor}`, p: 10, textAlign: "center" }}>
                            There's no evaluation in this term.
                        </Typography>
                    )}
                </Grid>
            </div>

            <style>
                {`
                @media print {
                    @page {
                        margin: 0; 
                    }
                
                    body * {
                        visibility: hidden;
                    }

                    .print-container, .print-container * {
                        visibility: visible;
                    }
                    .print-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    button {
                        display: none !important; /* hide buttons */
                    }
                }
                `}
            </style>
        </Box>

    )
}

export default FacultyEvaluation;