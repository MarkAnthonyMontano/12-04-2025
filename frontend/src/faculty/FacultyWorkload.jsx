import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import axios from 'axios';
import EaristLogo from '../assets/EaristLogo.png';
import { Avatar, Box, Typography } from "@mui/material";
import { Padding } from '@mui/icons-material';
import { FcPrint } from "react-icons/fc";
import API_BASE_URL from "../apiConfig";
const FacultyWorkload = () => {

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
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [schedule, setSchedule] = useState([]);
    const [profData, setPerson] = useState({
        prof_id: "",
        fname: "",
        mname: "",
        lname: "",
        profile_image: "",
    });

    useEffect(() => {
        const storedUser = localStorage.getItem("email");
        const storedRole = localStorage.getItem("role");
        const storedID = localStorage.getItem("person_id");

        if (storedUser && storedRole && storedID) {
            setUser(storedUser);
            setUserRole(storedRole);
            setUserID(storedID);

            if (storedRole !== "faculty") {
                window.location.href = "/dashboard";
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
            setLoading(false);
            setMessage("Error Fetching Professor Personal Data");
        }
    }


    useEffect(() => {
        if (!profData.prof_id) return;

        const fetchSchedule = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/professor-schedule/${profData.prof_id}`);
                setSchedule(response.data);
            } catch (err) {
                console.error('Error fetching professor schedule:', err);
            }
        };

        fetchSchedule();
    }, [profData.prof_id]);

    const isTimeInSchedule = (start, end, day) => {
        const parseTime = (timeStr) => {
            return new Date(`1970-01-01 ${timeStr}`)
        };

        return schedule.some(entry => {
            if (entry.day_description !== day) return false;

            const slotStart = parseTime(start);
            const slotEnd = parseTime(end);
            const schedStart = parseTime(entry.school_time_start);
            const schedEnd = parseTime(entry.school_time_end);

            return slotStart >= schedStart && slotEnd <= schedEnd;
        });
    };

    const hasAdjacentSchedule = (start, end, day, direction = "top") => {
        const parseTime = (timeStr) => new Date(`1970-01-01 ${timeStr}`);
        const minutesOffset = direction === "top" ? -60 : 60;

        const newStart = new Date(parseTime(start).getTime() + minutesOffset * 60000);
        const newEnd = new Date(parseTime(end).getTime() + minutesOffset * 60000);

        const currentEntry = schedule.find(entry => {
            if (entry.day_description !== day) return false;

            const schedStart = parseTime(entry.school_time_start);
            const schedEnd = parseTime(entry.school_time_end);

            return parseTime(start) >= schedStart && parseTime(end) <= schedEnd;
        });

        const adjacentEntry = schedule.find(entry => {
            if (entry.day_description !== day) return false;

            const schedStart = parseTime(entry.school_time_start);
            const schedEnd = parseTime(entry.school_time_end);

            return newStart >= schedStart && newEnd <= schedEnd;
        });

        if (!adjacentEntry) return false;

        // compare if same program/section instead of course_code
        if (currentEntry && adjacentEntry.course_code === currentEntry.course_code) {
            return "same";
        } else {
            return "different";
        }
    };

    const getCenterText = (start, day) => {
        const parseTime = (t) => new Date(`1970-01-01 ${t}`);
        const SLOT_HEIGHT_REM = 2.5;

        const slotStart = parseTime(start);

        for (const entry of schedule) {
            if (entry.day_description !== day) continue;

            const schedStart = parseTime(entry.school_time_start);
            const schedEnd = parseTime(entry.school_time_end);

            if (!(slotStart >= schedStart && slotStart < schedEnd)) continue;

            const totalHours = Math.round((schedEnd - schedStart) / (1000 * 60 * 60));
            const idxInBlock = Math.round((slotStart - schedStart) / (1000 * 60 * 60));

            const isOdd = totalHours % 2 === 1;
            const centerIndex = isOdd ? (totalHours - 1) / 2 : totalHours / 2;
            const isCenter = idxInBlock === centerIndex;

            if (!isCenter) return "";

            let marginTop = isOdd ? 0 : -(SLOT_HEIGHT_REM / 2);
            if (!isOdd) marginTop = `calc(${marginTop}rem - 1rem)`;

            let text;
            if (totalHours === 1) {
                text = (
                    <>
                        <span className="block truncate text-[10px]">{entry.course_code}</span>
                        <span className="block truncate text-[8px]">{entry.program_code}-{entry.section_description}</span>
                        <span className="block truncate text-[8px]">{entry.room_description}</span>
                    </>
                );
            } else {
                text = (
                    <>
                        {entry.course_code} <br />
                        {entry.program_code} - {entry.section_description} <br />
                        ({entry.room_description})
                    </>
                );
            }

            return (
                <span
                    className={`relative inline-block text-center ${totalHours === 1 ? "text-[10px]" : "text-[11px]"
                        }`}
                    style={{ marginTop }}
                >
                    {text}
                </span>
            );
        }

        return "";
    };

    const divToPrintRef = useRef();

    const printDiv = async () => {
        window.print();
    };


    return (
        <Box className="body" sx={{ height: 'calc(100vh - 150px)', overflowY: 'auto', overflowX: 'hidden', pr: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    width: "100%",
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
                    FACULTY WORKLOAD
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

            <hr style={{ border: "1px solid #ccc", width: "100%" }} />

            <br />



            <style>
                {`
                @media print {
                    @page {
                        margin: 0; 
                    }
                
                    body * {
                        visibility: hidden;
                        
                    }

                    .body{
                        margin-top: -22rem;
                        margin-left: -27rem;
                        overflow: visible !important;  /* show all content */
                        height: auto !important;       /* expand height */
                        max-height: none !important;   /* no max height limit */
                        
                    }
                    .print-container, .print-container * {
                        visibility: visible;
                    }
                    .print-container {
                        scale: 0.9;
                        position: absolute;
                        left:2%;
                        top: 0rem;
                        transform: translateX(-50%)
                        width: 100%;
                        font-family: "Poppins", sans-serif;
                        margin-top: -4.5rem;
                        padding: 0;
                    }
                    button {
                        display: none !important; /* hide buttons */
                    }
                    .signature-container, .signature-content{
                        margin-left: 1rem;
                    }
                    .conforme{
                        font-size: 12.5px;
                        
                    }
                    .information{
                        width: 160rem;
                    }
                    .designation{
                        width: 160rem;
                    }

                    .conforme-title{
                        font-size: 11.65px;
                        margin-left: 3px;
                    }
                    .conforme-cont{
                        width: 29rem;
                    }
                    
                    @page {
                        size: A4;
                        margin: 0;
                    }

                    .line{
                        min-width: 61rem;
                    }

                    .image {
                        width: 13rem !important;
                        height: 8rem !important;
                        margin-top: -2rem !important;
                        margin-left: -4rem !important;
                    }
                }
                `}
            </style>
            <Box style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                <Box style={{ paddingTop: "1rem", paddingLeft: "2rem", border: `2px solid ${borderColor}` }}>
                    <div className='min-h-[10rem] mb-[16rem] print-container' ref={divToPrintRef}>
                        <div className='mt-[2rem]'>
                            <div>
                                <div className='flex align-center information'>
                                    <div className='w-[8rem] '>
                                        <img src={EaristLogo} alt="" srcSet="" className='max-w-[5rem] earist-logo' />
                                    </div>
                                    <div className='w-[48rem] prof-details mt-[0.8rem]'>
                                        <p className='text-[11px] employee-number'>Employee No: 2013-4507</p> {/* EmployeeNumber */}
                                        <p className='text-[18px] bold employee-name'>{profData.fname} {profData.mname} {profData.lname}</p>
                                        <p className='text-[11px] employee-status'>Status Rank: Insdivuctor I</p>
                                    </div>
                                    <div className='img'>
                                        {!profData?.profile_image ? (
                                            <Avatar
                                                variant="square"
                                                sx={{
                                                    marginTop: "0.3rem",
                                                    width: 66,
                                                    height: 66,
                                                    border: "3px solid maroon",
                                                    color: "maroon",
                                                    bgcolor: "transparent",
                                                }}
                                            />
                                        ) : (
                                            <img src={`${API_BASE_URL}/uploads/${profData.profile_image}`} className="image" style={{ width: '5rem', height: '5rem' }} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-[1rem]'>
                            <div>
                                <div className='flex designation'>
                                    <div className='bg-gray-300 border border-black min-w-[13rem] border-r-0 h-[3rem] flex items-center justify-center designation-title' >
                                        <p className='text-[14px] font-bold tracking-[-1px]'>DESIGNATION</p>
                                    </div>
                                    <div className='w-[48rem] border border-black flex items-center justify-center designation-details'>
                                        <p className='text-[11px]'>Chief, INFORMATION SYSTEM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-[1rem]'>
                            <div className='flex educ-con'>
                                <div>
                                    <div className='education-bg bg-gray-300 border border-black w-[13rem] h-full flex items-center justify-center'>
                                        <p className='text-[14px] font-bold tracking-[-1px]'>EDUCATIONAL BACKGROUND</p>
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='border border-black border-b-0 border-l-0 w-[48rem] h-[2rem] p-0 flex  educ-details'>
                                        <div className='educ-title text-[12px] tracking-[-1px] border border-black m-0 px-1 border-b-0 border-l-0 border-t-0 min-w-[8rem] h-full flex items-center'>BACHELOR'S DEGREE</div>
                                        <p className='educ-content text-[12px] h-full flex items-center ml-1' >BACHELOR OF SCIENCE IN INFORMATION TECHNOLOGY</p>
                                    </div>
                                    <div className='border border-black border-b-0 border-l-0 w-[48rem] h-[2rem] p-0 flex  educ-details'>
                                        <div className='educ-title text-[12px] tracking-[-1px] border border-black m-0 px-1 border-b-0 border-l-0 border-t-0 min-w-[8rem] h-full flex items-center'>MASTER'S DEGREE</div>
                                        <p className='educ-content text-[12px] h-full flex items-center ml-1' >MASTER OF INFORMATION TECHNOLOGY (CITY OF MALABON)</p>
                                    </div>
                                    <div className='border border-black border-b-0 border-l-0 w-[48rem] h-[2rem] p-0 flex  educ-details'>
                                        <div className='educ-title text-[12px] tracking-[-1px] border border-black m-0 px-1 border-b-0 border-l-0 border-t-0 min-w-[8rem] h-full flex items-center'>DOCTORAL'S DEGREE</div>
                                        <p className='educ-content text-[12px]  h-full flex items-center ml-1 MIN-' >DOCTOR OF INFORMATION TECHNOLOGY (AMA, ongoing)</p>
                                    </div>
                                    <div className='border border-black border-l-0 w-[48rem] h-[2rem] p-0 flex educ-details'>
                                        <div className='educ-title text-[12px] tracking-[-1px] border border-black m-0 px-1 border-b-0 border-l-0 border-t-0 min-w-[8rem] h-full flex items-center'>SPECIAL TRAINING</div>
                                        <p className='educ-content text-[12px] h-full flex items-center ml-1' ></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='mt-[0.7rem]'>
                            <div>
                                <div className=''>
                                    <div className='flex justify-center w-[63rem] text-[20px] font-bold'>FACULTY ASSIGNMENT</div>
                                    <div className='flex justify-center w-[63rem] text-[14px] tracking-[-0.5px] mt-[-0.4rem]'>Second Semester: <p className='ml-2'>SY, 2024-2025</p></div>
                                </div>
                            </div>
                        </div>
                        <table className='mt-[0.7rem]'>
                            <thead className="">
                                <tr className='flex align-center'>
                                    <td className='min-w-[6.5rem] min-h-[2.2rem] flex items-center justify-center border border-black text-[14px] '>TIME</td>
                                    <td className='p-0 m-0'>
                                        <div className='min-w-[6.6rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>DAY</div>
                                        <p className='min-w-[6.6rem] text-center border border-black border-l-0 text-[11.5px] font-bold mt-[-3px]'>Official Time</p>
                                    </td>
                                    <td className='p-0 m-0'>
                                        <div className='min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>MONDAY</div>
                                        <p className='min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00PM</p>
                                    </td>
                                    <td className='p-0 m-0'>
                                        <div className='min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>TUESDAY</div>
                                        <p className='min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00PM</p>
                                    </td>
                                    <td className='p-0 m-0'>
                                        <div className='min-w-[7rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>WEDNESDAY</div>
                                        <p className='min-w-[7rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00PM</p>
                                    </td>
                                    <td className='p-0 m-0'>
                                        <div className='min-w-[6.9rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>THURSDAY</div>
                                        <p className='min-w-[6.9rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00PM</p>
                                    </td>
                                    <td className='p-0 m-0'>
                                        <div className='min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>FRIDAY</div>
                                        <p className='min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00PM</p>
                                    </td>
                                    <td className='p-0 m-0'>
                                        <div className='min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>SATUDAY</div>
                                        <p className='min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00PM</p>
                                    </td>
                                    <td className='p-0 m-0'>
                                        <div className='min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]'>SUNDAY</div>
                                        <p className='min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]'>7:00AM - 9:00PM</p>
                                    </td>
                                </tr>
                            </thead>
                            <tbody className='flex flex-col mt-[-0.1px]'>
                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            07:00 AM - 08:00 AM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("7:00 AM", "8:00 AM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("7:00 AM", "8:00 AM", day) && hasAdjacentSchedule("7:00 AM", "8:00 AM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("7:00 AM", "8:00 AM", day) && hasAdjacentSchedule("7:00 AM", "8:00 AM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >
                                                {getCenterText("7:00 AM", day)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            08:00 AM - 09:00 AM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("8:00 AM", "9:00 AM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("8:00 AM", "9:00 AM", day) && hasAdjacentSchedule("8:00 AM", "9:00 AM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("8:00 AM", "9:00 AM", day) && hasAdjacentSchedule("8:00 AM", "9:00 AM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >
                                                {getCenterText("8:00 AM", day)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            09:00 AM - 10:00 AM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("9:00 AM", "10:00 AM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("9:00 AM", "10:00 AM", day) && hasAdjacentSchedule("9:00 AM", "10:00 AM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("9:00 AM", "10:00 AM", day) && hasAdjacentSchedule("9:00 AM", "10:00 AM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >
                                                {getCenterText("9:00 AM", day)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            10:00 AM - 11:00 AM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("10:00 AM", "11:00 AM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("10:00 AM", "11:00 AM", day) && hasAdjacentSchedule("10:00 AM", "11:00 AM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("10:00 AM", "11:00 AM", day) && hasAdjacentSchedule("10:00 AM", "11:00 AM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >
                                                {getCenterText("10:00 AM", day)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            11:00 AM - 12:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("11:00 AM", "12:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("11:00 AM", "12:00 PM", day) && hasAdjacentSchedule("11:00 AM", "12:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("11:00 AM", "12:00 PM", day) && hasAdjacentSchedule("11:00 AM", "12:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >
                                                {getCenterText("11:00 AM", day)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            12:00 PM - 01:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("12:00 PM", "1:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("12:00 PM", "1:00 PM", day) && hasAdjacentSchedule("12:00 PM", "1:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("12:00 PM", "1:00 PM", day) && hasAdjacentSchedule("12:00 PM", "1:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >
                                                {getCenterText("12:00 PM", day)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            01:00 PM - 02:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("1:00 PM", "2:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("1:00 PM", "2:00 PM", day) && hasAdjacentSchedule("1:00 PM", "2:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("1:00 PM", "2:00 PM", day) && hasAdjacentSchedule("1:00 PM", "2:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >
                                                {getCenterText("1:00 PM", day)}
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            02:00 PM - 03:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("2:00 PM", "3:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("2:00 PM", "3:00 PM", day) && hasAdjacentSchedule("2:00 PM", "3:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("2:00 PM", "3:00 PM", day) && hasAdjacentSchedule("2:00 PM", "3:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >{getCenterText("2:00 PM", day)}</div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            03:00 PM - 04:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("3:00 PM", "4:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("3:00 PM", "4:00 PM", day) && hasAdjacentSchedule("3:00 PM", "4:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("3:00 PM", "4:00 PM", day) && hasAdjacentSchedule("3:00 PM", "4:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >{getCenterText("3:00 PM", day)}</div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            04:00 PM - 05:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("4:00 PM", "5:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("4:00 PM", "5:00 PM", day) && hasAdjacentSchedule("4:00 PM", "5:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("4:00 PM", "5:00 PM", day) && hasAdjacentSchedule("4:00 PM", "5:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >{getCenterText("4:00 PM", day)}</div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            05:00 PM - 06:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("5:00 PM", "6:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("5:00 PM", "6:00 PM", day) && hasAdjacentSchedule("5:00 PM", "6:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("5:00 PM", "6:00 PM", day) && hasAdjacentSchedule("5:00 PM", "6:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >{getCenterText("5:00 PM", day)}</div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            06:00 PM - 07:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("6:00 PM", "7:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("6:00 PM", "7:00 PM", day) && hasAdjacentSchedule("6:00 PM", "7:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("6:00 PM", "7:00 PM", day) && hasAdjacentSchedule("6:00 PM", "7:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >{getCenterText("6:00 PM", day)}</div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            07:00 PM - 08:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("7:00 PM", "8:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("7:00 PM", "8:00 PM", day) && hasAdjacentSchedule("7:00 PM", "8:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("7:00 PM", "8:00 PM", day) && hasAdjacentSchedule("7:00 PM", "8:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >{getCenterText("7:00 PM", day)}</div>
                                        </td>
                                    ))}
                                </tr>

                                <tr className='flex w-full'>
                                    <td className='m-0 p-0 min-w-[13.1rem]'>
                                        <div className='h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center'>
                                            08:00 PM - 09:00 PM
                                        </div>
                                    </td>

                                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day, i) => (
                                        <td key={day} className={`m-0 p-0 ${day === "WED" ? "min-w-[7rem]" : day === "THU" ? "min-w-[6.9rem]" : "min-w-[6.8rem]"}`}>
                                            <div className={`h-[2.5rem] border border-black border-t-0 border-l-0 text-[14px] flex items-center justify-center  
                            ${isTimeInSchedule("8:00 PM", "9:00 PM", day) ? 'bg-yellow-300' : ''} 
                            ${isTimeInSchedule("8:00 PM", "9:00 PM", day) && hasAdjacentSchedule("8:00 PM", "9:00 PM", day, "top") === "same" ? "border-t-0" : ''} 
                            ${isTimeInSchedule("8:00 PM", "9:00 PM", day) && hasAdjacentSchedule("8:00 PM", "9:00 PM", day, "bottom") === "same" ? "border-b-0" : ''}`}
                                            >{getCenterText("8:00 PM", day)}</div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>

                        <div className='mt-[1rem]'>
                            <div>
                                <div className='max-w-[61rem]'>
                                    <div className='bg-black text-white text-[12px] font-[500] tracking-[0.5px] h-[1.8rem] min-w-[61rem] text-center'>SUMMARY</div>
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='border border-black max-w-[37rem]'>
                                    <div className='flex flex-col'>
                                        <div className='mmin-w-[37rem] text-center text-[11px] font-[500]'>DAILY WORKLOAD DISTRIBUTION</div>
                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[11px] text-center'>DAY</div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'>MON</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'>TUE</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'>WED</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'>THU</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'>FRI</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'>SAT</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'>SUN</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'>TOTAL</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[10px]'>REGULAR TEACHING LOAD</div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[10px]'>OVERLOAD (OL)</div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[10px]'>EMERGENCY LOAD (EL)</div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[9.5px]'>TEMPORARY SUBSTITUTION (TS)</div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[10px]'>DESIGNATION</div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex'>
                                        <div className='max-w-[4.3rem]'>
                                            <div className='min-w-[4.3rem] border border-black border-l-0 border-b-0 text-[10px] text-center flex items-center h-full px-[0.4rem]'>OTHER <br /> FUNCTIONS</div>
                                        </div>
                                        <div>
                                            <div className='flex'>
                                                <div className='border border border-black border-l-0 border-b-0 min-w-[6.7rem] text-[9px] text-center font-[600] min-h-[1rem]'><i>Research</i></div>
                                                <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                            </div>
                                            <div className='flex'>
                                                <div className='border border border-black border-l-0 border-b-0 min-w-[6.7rem] text-[9px] text-center font-[600] min-h-[1rem]'><i>Extension</i></div>
                                                <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                            </div>
                                            <div className='flex'>
                                                <div className='border border border-black border-l-0 border-b-0 min-w-[6.7rem] text-[9px] text-center font-[600] min-h-[1rem]'><i>Production</i></div>
                                                <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                            </div>
                                            <div className='flex'>
                                                <div className='border border border-black border-l-0 border-b-0 min-w-[6.7rem] text-[9px] text-center min-h-[1rem] font-[600]'><i>Accreditation</i></div>
                                                <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                                <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[9px] flex items-center justify-center min-h-[1rem] font-[600]'><i className='mt-[0.2px]'>Consultation</i></div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[8px] flex items-center justify-center min-h-[1rem] font-[400]'><i className='mt-[2px]'>Lesson Preparation ( Off-Campus )</i></div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[11rem] text-[8px] flex items-center justify-center min-h-[1rem] font-[400]'><i className='mt-[2px]'>Total</i></div>
                                            <div className='border border border-black border-l-0 border-b-0  text-[11px] px-[0.7rem] min-w-[3.2rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.1rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px]  px-[0.9rem] min-w-[3.08rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[2.8rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.20rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] px-[0.9rem] min-w-[3.3rem]'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[11px] border-r-0 px-[0.9rem] min-w-[3.9rem]'></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='border border-black border-l-0 max-w-[24rem]'>
                                    <div>
                                        <div className='min-w-[27rem] text-center text-[11px] font-[500]'>EXTRA TEACHING LOADS FOR HONORARIUM</div>
                                    </div>
                                    <div className='flex max-h-[2.15rem]'>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Teaching Assignment</span>
                                        </div>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Units</span>
                                        </div>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Load Type</span>
                                        </div>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Class</span>
                                        </div>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Class Type</span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div className='border border border-black border-l-0 border-t-0  border-b-0 max-w-[8.97rem] text-[10px] text-center'>TOTAL</div>
                                            <div className='border border border-black border-l-0 border-b-0  border-t-0 text-[10px] min-w-[2rem] text-center'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className='bg-black min-h-[1.2rem] max-w-[61rem] line'></div>
                                </div>
                            </div>
                            <div className='flex'>
                                <div className='border border-black'>
                                    <div className='flex flex-col'>
                                        <div className='w-[37rem] text-center text-[11px] font-[500]'>FTE CALCULATOR</div>
                                        <div className='flex min-h-[1.05rem]'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[19.5rem] text-[10px] text-center'>Regular Teaching Assignments</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] text-center'>Units</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] text-center'>Class</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] text-center'>Class Type</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] w-[3rem] flex items-center'>No. of Students</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center w-[3.1rem]'>FTE</div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3.0rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>

                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] w-[3.8rem] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[8px] tracking-[-1px] h-[1rem] w-[3rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>

                                        <div className='flex'>
                                            <div className='border border border-black border-l-0 border-b-0 min-w-[19.5rem] text-[10px] h-[1rem] text-center'></div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] min-w-[14.4rem] h-[1rem] text-center'>Total FTE</div>
                                            <div className='border border border-black border-l-0 border-b-0 text-[10px] border-r-0 text-center h-[1rem] w-[3.1rem]'></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='border border-black border-l-0 max-w-[23.9rem]'>
                                    <div>
                                        <div className='min-w-[27rem] text-center text-[11px] font-[500]'>EXTRA TEACHING LOADS FOR SERVICE CREDIT</div>
                                    </div>
                                    <div className='flex max-h-[2.15rem]'>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Teaching Assignment</span>
                                        </div>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Units</span>
                                        </div>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Load Type</span>
                                        </div>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Class</span>
                                        </div>
                                        <div className='border border-black border-l-0 min-h-[2.15rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'>Class Type</span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div className='flex max-h-[2rem]'>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[9rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[2rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center justify-center w-[6rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                        <div className='border border-black border-t-0 border-l-0 min-h-[2rem] flex items-center border-r-0 justify-center w-[3.5rem]'>
                                            <span className='text-[10px] tracking-[-1px]'></span>
                                        </div>
                                    </div>
                                    <div>
                                        <div>
                                            <div className='border border border-black border-l-0 border-t-0  border-b-0 max-w-[8.97rem] text-[10px] text-center'>TOTAL</div>
                                            <div className='border border border-black border-l-0 border-b-0  border-t-0 text-[10px] min-w-[2rem] text-center'></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <div className='bg-black min-h-[1.2rem] max-w-[61rem] line'></div>
                                </div>
                            </div>
                        </div>

                        <div className='mt-[1rem]'>
                            <div className='flex'>
                                <div className='border border-black flex flex-col'>
                                    <div className='w-[27rem] text-[11px] p-[0.2rem] font-[600] conforme-cont'>CONFORME:</div>
                                    <div className='mt-[0.6rem]'></div>
                                    <div className='text-[10.5px] tracking-[-1px] font-[600] conforme-title'>
                                        I fully understand the extent of my roles and responsibilities in relationto my assignment as a <br />
                                        faculty member and therefore COMMIT myself to:
                                    </div>
                                    <div className='text-[10.5px] tracking-[-1px] font-[600] conforme'>
                                        (A) be punctual and be available in the institute during official working hours; <br />
                                        (B) conduct assigned classes and other functions at the scheduled times; <br />
                                        (C) evaluate and record students performance in an objective and fair manner; and, <br />
                                        (D) submit all required reports on time.
                                    </div>
                                    <div className='mt-[0.6rem]'></div>
                                    <div className='flex p-0 m-0'>
                                        <div className='bg-black text-white p-[0.2rem] flex items-center justify-center w-[13.5rem]'>
                                            <span className='text-[14px] font-[500]'>EARIST-QSF-INST-015</span>
                                        </div>
                                        <div className='flex flex-col items-center w-[13.5rem]'>
                                            <span className='text-[11px] font-[500] underline'>Mr. DHANI SAN JOSE</span>
                                            <span className='mt-[-2px]  text-[10px]'>Faculty Member</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className='flex signature-container'>
                                        <div className='w-[13.5rem] h-[6rem] '>
                                            <div><i className='text-[11.5px] font-[500] ml-[3px]'>Prepared By:</i></div>
                                            <div className='flex flex-col mt-[2rem] w-full items-center'>
                                                <span className='text-[12px] '>Prof. HAZEL F. ANUNCIO</span><br />
                                                <span className='text-[11px] mt-[-1.7rem] font-[500] tracking-[-1px]'>Information Technology Department Head</span>
                                            </div>
                                        </div>
                                        <div className='w-[19.5rem] h-[6rem] signature-content' >
                                            <div><i className='text-[11.5px] font-[500] ml-[3px]'>Certified Corrected By:</i></div>
                                            <div className='flex flex-col mt-[2rem] w-full items-center'>
                                                <span className='text-[12px] '>DR. JESUS PANGUIGAN</span><br />
                                                <span className='text-[11px] mt-[-1.7rem] font-[500] tracking-[-1px]'>Dean, CCS</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex signature-container'>
                                        <div className='w-[13.5rem] h-[6rem] '>
                                            <div><i className='text-[11.5px] font-[500] ml-[3px]'>Recommending Approval:</i></div>
                                            <div className='flex flex-col mt-[2rem] w-full items-center'>
                                                <span className='text-[12px] '>DR. ERIC C. MENDOZA</span><br />
                                                <span className='text-[11px] mt-[-1.7rem] font-[500] tracking-[-1px]'>VPAA</span>
                                            </div>
                                        </div>
                                        <div className='w-[19.5rem] h-[6rem] signature-content'>
                                            <div><i className='text-[11.5px] font-[500] ml-[3px]'>Approved:</i></div>
                                            <div className='flex flex-col mt-[2rem] w-full items-center'>
                                                <span className='text-[12px] '>Engr. ROGELIO T. MAMARADLO, Edb</span><br />
                                                <span className='text-[11px] mt-[-1.7rem] font-[500] tracking-[-1px]'>President</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
            </Box>
        </Box>
    )
}

export default FacultyWorkload;
