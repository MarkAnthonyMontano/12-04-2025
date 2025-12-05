import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import API_BASE_URL from "../apiConfig";
const ScheduleChecker = () => {
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
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);


  const pageId = 53;

  //Put this After putting the code of the past code
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

  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedProf, setSelectedProf] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [roomList, setRoomList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  const [schoolYearList, setSchoolYearList] = useState([]);
  const [profList, setProfList] = useState([]);
  const [dayList, setDayList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialogue, setOpenDialogue] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isDesignationMode, setIsDesignationMode] = useState(false);
  const [isHonorarium, setIsHonorarium] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { dprtmnt_id } = useParams();

  const fetchRoom = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/room_list/${dprtmnt_id}`
      );
      setRoomList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCourseList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/course_list`);
      setCourseList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDesignationList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/designation_list`);
      setCourseList(response.data); // reusing courseList but content changes
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchoolYearList = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/get_active_school_years`
      );
      setSchoolYearList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfList = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/prof_list/${dprtmnt_id}`
      );
      setProfList(res.data);
    } catch (err) {
      console.error("Error fetching professors:", err);
    }
  };

  const fetchDayList = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/schedule-plotting/day_list`
      );
      setDayList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSectionList = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/section_table/${dprtmnt_id}`
      );
      console.log("Section List Response:", response.data);
      setSectionList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/get/all_schedule/${selectedRoom}`
      );
      setSchedule(response.data);
    } catch (error) {

      if (error.response && error.response.status === 404) {
        setMessage(
          "Schedule not found. Please assign a schedule."
        );
      } else {
        setMessage("Failed to fetch schedule. Please try again later.");
      }

      setSchedule([]);
      setOpenSnackbar(true);
    }
  };

  const formatTimeTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours);
    const suffix = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${minutes} ${suffix}`;
  };

  useEffect(() => {
    fetchRoom();
    fetchCourseList();
    fetchSchoolYearList();
    fetchProfList();
    fetchDayList();
    fetchSectionList();
  }, []);

  useEffect(() => {
    if (roomList.length > 0 && !selectedRoom) {
      setSelectedRoom(roomList[0].room_id);
    }
  }, [roomList]);

  useEffect(() => {
    if (selectedRoom) {
      fetchSchedule();
    }
  }, [selectedRoom]);

  useEffect(() => {
    if (schoolYearList.length > 0) {
      setSelectedSchoolYear(schoolYearList[0].id);
    }
  }, [schoolYearList]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log(selectedSection);

    try {
      const formattedStartTime = formatTimeTo12Hour(selectedStartTime);
      const formattedEndTime = formatTimeTo12Hour(selectedEndTime);

      const subjectResponse = await axios.post(
        `${API_BASE_URL}/api/check-subject`,
        {
          section_id: selectedSection,
          school_year_id: selectedSchoolYear,
          day_of_week: selectedDay,
          subject_id: selectedSubject,
        }
      );

      if (subjectResponse.data.exists) {
        setMessage(
          "This subject in this section and school year is already assigned in the same day."
        );
        setOpenSnackbar(true);
        return;
      }

      const timeValidation = await axios.post(
        `${API_BASE_URL}/api/check-time`,
        {
          start_time: formattedStartTime,
          end_time: formattedEndTime,
        }
      );

      if (timeValidation.data.conflict) {
        setMessage(timeValidation.data.message);
        setOpenSnackbar(true);
        return;
      }

      const timeResponse = await axios.post(
        `${API_BASE_URL}/api/check-conflict`,
        {
          day: selectedDay,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          section_id: selectedSection,
          school_year_id: selectedSchoolYear,
          prof_id: selectedProf,
          room_id: selectedRoom,
          subject_id: selectedSubject,
        }
      );

      if (timeResponse.data.conflict) {
        setMessage(
          "Schedule conflict detected! Please choose a different time."
        );
        setOpenSnackbar(true);
      } else {
        setMessage("Schedule is available. You can proceed with adding it.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error checking schedule:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      setOpenSnackbar(true);
    }
  };

  const handleInsert = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formattedStartTime = formatTimeTo12Hour(selectedStartTime);
      const formattedEndTime = formatTimeTo12Hour(selectedEndTime);

      const response = await axios.post(
        `${API_BASE_URL}/api/insert-schedule`,
        {
          day: selectedDay,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          section_id: selectedSection,
          school_year_id: selectedSchoolYear,
          prof_id: selectedProf,
          room_id: selectedRoom,
          subject_id: selectedSubject,
          ishonorarium: isHonorarium ? 1 : 0,
        }
      );

      if (response.status === 200) {
        setMessage("Schedule inserted successfully.");
        setOpenSnackbar(true);
      }

      setSelectedDay("");
      setSelectedSection("");
      setSelectedRoom("");
      setSelectedSubject("");
      setSelectedProf("");
      setSelectedStartTime("");
      setSelectedEndTime("");
      fetchSchedule();
    } catch (error) {
      console.error("Error inserting schedule:", error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Failed to insert schedule.");
      } else {
        setMessage("Network error. Please try again.");
      }
      setOpenSnackbar(true);
    }
  };

  const handleSubmitDesignation = async (e) => {
    e.preventDefault();
    setMessage("");
    console.log(selectedSection);

    try {
      const formattedStartTime = formatTimeTo12Hour(selectedStartTime);
      const formattedEndTime = formatTimeTo12Hour(selectedEndTime);

      const timeValidation = await axios.post(
        `${API_BASE_URL}/api/check-time`,
        {
          start_time: formattedStartTime,
          end_time: formattedEndTime,
        }
      );

      if (timeValidation.data.conflict) {
        setMessage(timeValidation.data.message);
        setOpenSnackbar(true);
        return;
      }

      const timeResponse = await axios.post(
        `${API_BASE_URL}/api/check-conflict-designation`,
        {
          day: selectedDay,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          section_id: selectedSection,
          school_year_id: selectedSchoolYear,
          prof_id: selectedProf,
          room_id: selectedRoom,
          subject_id: selectedSubject,
        }
      );

      if (timeResponse.data.conflict) {
        setMessage(
          "Schedule conflict detected! Please choose a different time."
        );
        setOpenSnackbar(true);
      } else {
        setMessage("Schedule is available. You can proceed with adding it.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error checking schedule:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setMessage(error.response.data.message);
      } else {
        setMessage("An unexpected error occurred. Please try again.");
      }
      setOpenSnackbar(true);
    }
  };

  const handleInsertDesignation = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const formattedStartTime = formatTimeTo12Hour(selectedStartTime);
      const formattedEndTime = formatTimeTo12Hour(selectedEndTime);

      const response = await axios.post(
        `${API_BASE_URL}/api/insert-schedule-designation`,
        {
          day: selectedDay,
          start_time: formattedStartTime,
          end_time: formattedEndTime,
          section_id: selectedSection,
          school_year_id: selectedSchoolYear,
          prof_id: selectedProf,
          room_id: selectedRoom,
          subject_id: selectedSubject,
        }
      );

      if (response.status === 200) {
        setMessage("Schedule inserted successfully.");
        setOpenSnackbar(true);
      }

      setSelectedDay("");
      setSelectedSection("");
      setSelectedRoom("");
      setSelectedSubject("");
      setSelectedProf("");
      setSelectedStartTime("");
      setSelectedEndTime("");
      fetchSchedule();
    } catch (error) {
      console.error("Error inserting schedule:", error);
      if (error.response && error.response.data) {
        setMessage(error.response.data.message || "Failed to insert schedule.");
      } else {
        setMessage("Network error. Please try again.");
      }
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async (scheduleId) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/delete/schedule/${scheduleId}`
      );
      setMessage(res.data.message);
      setOpenSnackbar(true);

      if (selectedScheduleId === scheduleId) {
        setOpenDialogue(false);
        setSelectedScheduleId(null);
      }

      fetchSchedule();
      try {
        const page_name = "Schedule Plotting";
        const fullName = `${user}`;
        const type = "delete"

        await axios.post(`${API_BASE_URL}/insert-logs/${userID}`, {
          message: `Employee ID #${userID} - ${fullName} successfully delete schedule in ${page_name}`, type: type,
        });

      } catch (err) {
        console.error("Error inserting audit log");
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      setMessage("Failed to delete schedule.");
      setOpenSnackbar(true);
    }
  };


  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier) {
      if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }

    const ampm = hours >= 12 ? 'PM' : 'AM';
    let displayHours = hours % 12;
    if (displayHours === 0) displayHours = 12;

    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const getDayScheduleRange = (day) => {
    const daySchedules = schedule.filter(entry => entry.day_description.toUpperCase() === day.toUpperCase());
    if (!daySchedules.length) return "";

    const parseTime = (timeStr) => {
      if (!timeStr) return 0;
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (!match) return 0;
      let [_, h, m, mod] = match;
      let hours = Number(h);
      const minutes = Number(m);
      if (mod?.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (mod?.toUpperCase() === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const earliest = daySchedules.reduce((min, curr) => {
      return parseTime(curr.school_time_start) < parseTime(min) ? curr.school_time_start : min;
    }, daySchedules[0].school_time_start);

    const latest = daySchedules.reduce((max, curr) => {
      return parseTime(curr.school_time_end) > parseTime(max) ? curr.school_time_end : max;
    }, daySchedules[0].school_time_end);

    return `${formatTime(earliest)} - ${formatTime(latest)}`;
  };

  const isTimeInSchedule = (start, end, day) => {
    const parseTime = (timeStr) => {
      // Converts "5:00 PM" into a Date object
      return new Date(`1970-01-01 ${timeStr}`);
    };

    return schedule.some((entry) => {
      if (entry.day_description !== day) return false;

      const slotStart = parseTime(start);
      const slotEnd = parseTime(end);
      const schedStart = parseTime(entry.school_time_start);
      const schedEnd = parseTime(entry.school_time_end);

      return slotStart >= schedStart && slotEnd <= schedEnd;
    });
  };

  const [courseSearch, setCourseSearch] = useState("");
  const [profSearch, setProfSearch] = useState("");

  const filteredCourses = courseList.filter((course) => {
    const words = courseSearch.toLowerCase().split(" ").filter(Boolean);
    return words.every((word) =>
      (course.course_code?.toLowerCase() || "").includes(word) ||
      (course.course_description?.toLowerCase() || "").includes(word)
    );
  });

  const filteredProfessors = profList.filter((prof) => {
    const words = profSearch.toLowerCase().split(" ").filter(Boolean);
    return words.every((word) =>
      (prof.fname?.toLowerCase() || "").includes(word) ||
      (prof.lname?.toLowerCase() || "").includes(word)
    );
  });


  const officeDutyConversionColor = (course_code) => {
    if (!course_code) return "";

    // STEP 2: Normalize the course code
    const normalized = course_code
      .toUpperCase()
      .replace(/[^A-Z]/g, "");   // remove spaces, numbers, special characters

    // STEP 3 + 4: Match to category and return color
    if (normalized === "DESIGNATION") return "#99ccff";

    if (
      ["RESEARCH", "PRODUCTION", "EXTENSION", "ACCREDITATION",].includes(normalized)
    ) {
      return "#ccffcc";
    }

    if (normalized === "CONSULTATION") return "#fde5d6";

    if (normalized === "LESSONPREPARATION") return "#f7caac";

    return ""; // default if unmatched
  };

  const getDutyColor = (start, day) => {
    const parseTime = (t) => new Date(`1970-01-01 ${t}`);
    const slotStart = parseTime(start);

    for (const entry of schedule) {
      if (entry.day_description !== day) continue;

      const schedStart = parseTime(entry.school_time_start);
      const schedEnd = parseTime(entry.school_time_end);

      if (slotStart >= schedStart && slotStart < schedEnd) {
        if (entry.ishonorarium === 1 || entry.ishonorarium === "1") {
          return "#ccffff";
        }
        return officeDutyConversionColor(entry.course_code);
      }
    }

    return ""; // no color
  };

  const hasAdjacentSchedule = (start, end, day, direction = "top") => {
    const parseTime = (timeStr) => new Date(`1970-01-01 ${timeStr}`);

    const slotStart = parseTime(start);
    const slotEnd = parseTime(end);

    // Find the current schedule block
    const currentEntry = schedule.find((entry) => {
      if (entry.day_description !== day) return false;
      const schedStart = parseTime(entry.school_time_start);
      const schedEnd = parseTime(entry.school_time_end);
      return slotStart >= schedStart && slotEnd <= schedEnd;
    });

    if (!currentEntry) return false;

    const schedStart = parseTime(currentEntry.school_time_start);
    const schedEnd = parseTime(currentEntry.school_time_end);

    if (direction === "top") {
      // Only merge if slotStart > schedStart (inside the same block)
      return slotStart > schedStart ? "same" : "different";
    } else {
      // Only merge if slotEnd < schedEnd (inside the same block)
      return slotEnd < schedEnd ? "same" : "different";
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

      const totalHours = (schedEnd - schedStart) / (1000 * 60 * 60);
      const isTopSlot = slotStart.getTime() === schedStart.getTime();
      const showDeleteButton = isTopSlot;

      let textContent = null;
      if (totalHours === 1) {
          textContent = 
                    <>
                        <span className="block truncate text-[10px]">{entry.course_code}</span>
                        {entry.program_code && entry.section_description && (
                            <span className="block truncate text-[8px]">
                              {entry.program_code}-{entry.section_description}
                            </span>
                        )}
                        {entry.section_description && entry.section_description !== 0 && entry.section_description !== "0" && entry.room_description && (
                            <span className="block truncate text-[8px]">{entry.room_description}</span>
                        )}
                    </>;
            } else {
                const totalHours = (schedEnd - schedStart) / (1000 * 60 * 60);
                const blockHeightRem = totalHours * SLOT_HEIGHT_REM;
                const textHeightRem = 0.5;
                const marginTop = (blockHeightRem - textHeightRem) / 2;

                textContent = (
                    <span
                        className="absolute inset-0 flex flex-col items-center justify-center text-center text-[11px] leading-tight cursor-pointer"
                        style={{ top: `${marginTop}rem` }}
                    >
                        {entry.course_code} <br />
                        {(entry.program_code || entry.section_description) && (
                            <>
                                {[entry.program_code, entry.section_description].filter(Boolean).join(" - ")}
                                <br />
                            </>
                        )}
                        {entry.section_description && entry.section_description !== 0 && entry.section_description !== "0" && entry.room_description && (
                            <>({entry.room_description})</>
                        )}
                    </span>
                );
            }

            return (
                <div 
                    className="schedule-block relative w-full h-full cursor-pointer text-center" 
                >
                  {showDeleteButton && (
                    <button
                      className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center hover:bg-red-700"
                      onClick={() => {
                        setSelectedScheduleId(entry.id);
                        setOpenDialogue(true);
                      }}
                    >
                      <HighlightOffIcon />
                    </button>
                  )}
                    {isTopSlot && textContent}
                </div>
            );
        }

        return "";
    };

  const handleSubmitWrapper = (e) => {
    e.preventDefault();

    if (isDesignationMode) {
      return handleSubmitDesignation(e); // your designation check
    } else {
      return handleSubmit(e); // your regular-load check
    }
  }; 

  const handleInsertWrapper = (e) => {
    e.preventDefault();

    if (isDesignationMode) {
      return handleInsertDesignation(e); // your designation insert
    } else {
      return handleInsert(e); // your regular insert
    }
  };
  

  // Put this at the very bottom before the return 
  if (loading || hasAccess === null) {
   return <LoadingOverlay open={loading} message="Loading..." />;
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
            fontWeight: 'bold',
            color: titleColor,
            fontSize: '36px',
          }}
        >
          SCHEDULE CHECKER
        </Typography>




      </Box>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />

      <br />
      {message && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={
              message.includes("success") || message.includes("available") // covers "Schedule is available"
                ? "success"
                : "error"
            }
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}

      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Box>
          <Box sx={{ display: "flex", gap: "1rem", marginTop: "1.3rem" }}>
            <Button
              className="hover:bg-[#000000] text-white px-6 py-2 rounded"
              onClick={() => {
                const newMode = !isDesignationMode;
                setIsDesignationMode(newMode);

                if (newMode) {
                  // switched FROM regular → designation
                  fetchDesignationList();
                } else {
                  // switched FROM designation → regular
                  fetchCourseList();
                }
              }}
            >
              {isDesignationMode ? "Assign Regular Load" : "Assign Designation"}
            </Button>
          </Box>
          <form
            onSubmit={handleInsertWrapper}
            style={{
              width: "100%",
              maxWidth: "600px",
              border: `2px solid ${borderColor}`,
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
              marginTop: "1rem",
            }}
          >
            {/* Day */}
            <div className="flex mb-2">
              <div className="p-2 w-[12rem]">Day:</div>
              <select
                className="border border-gray-500 outline-none rounded w-full h-10 px-2"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                required
              >
                <option value="">Select Day</option>
                {dayList.map((day) => (
                  <option key={day.day_id} value={day.day_id}>
                    {day.day_description}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            {!isDesignationMode && (
              <div className="flex mb-2">
                <div className="p-2 w-[12rem]">Section:</div>
                <select
                  className="border border-gray-500 outline-none rounded w-full h-10 px-2"
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  required={!isDesignationMode}
                >
                  <option value="">Select Section</option>
                  {sectionList.map((section) => (
                    <option key={section.dep_section_id} value={section.dep_section_id}>
                      {section.description} {section.program_code}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Room */}
            {!isDesignationMode && (
              <div className="flex mb-2">
                <div className="p-2 w-[12rem]">Room:</div>
                <select
                  className="border border-gray-500 outline-none rounded w-full h-10 px-2"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  required
                >
                  <option value="">Select Room</option>
                  {roomList.map((room) => (
                    <option key={room.room_id} value={room.room_id}>
                      {room.room_description}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Search Course & Course Select */}
            <div className="flex flex-col mb-2 w-full">
              {/* Course Search Input */}
              <div className="flex mb-2 items-center">
                <div className="p-2 w-[12rem]">Search Course:</div>
                <input
                  type="text"
                  placeholder="Search Course"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // prevent form submit
                      // Optionally auto-select first filtered course
                      if (filteredCourses.length > 0) {
                        setSelectedSubject(filteredCourses[0].course_id);
                      }
                    }
                  }}
                  className="border border-gray-500 rounded w-full h-10 px-2"
                />
              </div>

              {/* Course Select */}
              <div className="flex mb-1 items-center">
                <div className="p-2 w-[12rem]">{isDesignationMode ? "Designation:" : "Course:"}</div>
                <select
                  className="border border-gray-500 outline-none rounded w-full h-10 px-2"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  required
                >
                  <option value="">
                    {isDesignationMode ? "Select Designation" : "Select Course"}
                  </option>
                  {filteredCourses.map((subject) => (
                    <option key={subject.course_id} value={subject.course_id}>
                      {subject.course_code} - {subject.course_description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Professor & Professor Select */}
            <div className="flex flex-col mb-2 w-full">
              {/* Professor Search Input */}
              {/* Professor Search Input */}
              <div className="flex mb-2 items-center">
                <div className="p-2 w-[12rem]">Search Professor:</div>
                <input
                  type="text"
                  placeholder="Search Professor"
                  value={profSearch}
                  onChange={(e) => setProfSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (filteredProfessors.length > 0) {
                        setSelectedProf(filteredProfessors[0].prof_id);
                      }
                    }
                  }}
                  className="border border-gray-500 rounded w-full h-10 px-2"
                />
              </div>

              {/* Professor Select */}
              <div className="flex mb-1 items-center">
                <div className="p-2 w-[12rem]">Professor:</div>
                <select
                  className="border border-gray-500 outline-none rounded w-full h-10 px-2"
                  value={selectedProf}
                  onChange={(e) => setSelectedProf(e.target.value)}
                  required
                >
                  <option value="">Select Professor</option>
                  {filteredProfessors.map((prof) => (
                    <option key={prof.prof_id} value={prof.prof_id}>
                      {prof.lname}, {prof.fname} {prof.mname}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            {/* School Year */}
            <div className="flex mb-2">
              <div className="p-2 w-[12rem]">School Year:</div>
              <div className="border border-gray-500 rounded w-full h-10 px-2 flex items-center bg-gray-100">
                {
                  schoolYearList.find((sy) => sy.id === selectedSchoolYear)
                    ?.year_description
                }{" "}
                -{" "}
                {
                  schoolYearList.find((sy) => sy.id === selectedSchoolYear)
                    ?.semester_description
                }
              </div>
            </div>

            {/* Start Time */}
            <div className="flex mb-2">
              <div className="p-2 w-[12rem]">Start Time:</div>
              <input
                className="border border-gray-500 rounded w-full h-10 px-2"
                type="time"
                value={selectedStartTime}
                onChange={(e) => setSelectedStartTime(e.target.value)}
                required
              />
            </div>

            {/* End Time */}
            <div className="flex mb-4">
              <div className="p-2 w-[12rem]">End Time:</div>
              <input
                className="border border-gray-500 rounded w-full h-10 px-2"
                type="time"
                value={selectedEndTime}
                onChange={(e) => setSelectedEndTime(e.target.value)}
                required
              />
            </div>
          {!isDesignationMode && (
            <div className="flex mb-4 items-center">
              <div className="p-2 w-[12rem]">Honorarium Load:</div>
              <input
                type="checkbox"
                checked={isHonorarium}
                onChange={(e) => {
                  if (e.target.checked) {
                    setOpenConfirmDialog(true); // open confirmation dialog
                  } else {
                    setIsHonorarium(false); // allow uncheck without dialog
                  }
                }}
                className="h-4 w-4"
              />
            </div>
          )}
            <div className="flex justify-between">
              <button
                className="bg-[#800000] hover:bg-red-900 text-white px-6 py-2 rounded"
                style={{ backgroundColor: mainButtonColor }}
                onClick={handleSubmitWrapper}
              >
                Check Schedule
              </button>
              <button
                className="bg-[#1967d2] hover:bg-[#000000] text-white px-6 py-2 rounded"
                type="submit"
              >
                Insert Schedule
              </button>
            </div>
          </form>

        </Box>
        <table className="mt-[0.7rem]">
          <thead className="bg-[#c0c0c0]">
            <tr className="flex align-center">
              <td className="min-w-[6.5rem] min-h-[2.2rem] flex items-center justify-center border border-black text-[14px] ">
                TIME
              </td>
              <td className="p-0 m-0">
                <div className="min-w-[6.6rem] text-center border border-black border-l-0 border-b-0 text-[14px]">
                  DAY
                </div>
                <p className="min-w-[6.6rem] text-center border border-black border-l-0 text-[11.5px] font-bold mt-[-3px]">
                  Official Time
                </p>
              </td>
              <td className="p-0 m-0">
                <div className="min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]">
                  MONDAY
                </div>
                <p className="h-[20px] min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]">
                  {getDayScheduleRange('MON')}
                </p>
              </td>
              <td className="p-0 m-0">
                <div className="min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]">
                  TUESDAY
                </div>
                <p className="h-[20px] min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]">
                  {getDayScheduleRange('TUE')}
                </p>
              </td>
              <td className="p-0 m-0">
                <div className="min-w-[7rem] text-center border border-black border-l-0 border-b-0 text-[14px]">
                  WEDNESDAY
                </div>
                <p className="h-[20px] min-w-[7rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]">
                  {getDayScheduleRange('WED')}
                </p>
              </td>
              <td className="p-0 m-0">
                <div className="min-w-[6.9rem] text-center border border-black border-l-0 border-b-0 text-[14px]">
                  THURSDAY
                </div>
                <p className="h-[20px] min-w-[6.9rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]">
                  {getDayScheduleRange('THU')}
                </p>
              </td>
              <td className="p-0 m-0">
                <div className="min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]">
                  FRIDAY
                </div>
                <p className="h-[20px] min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]">
                  {getDayScheduleRange('FRI')}
                </p>
              </td>
              <td className="p-0 m-0">
                <div className="min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]">
                  SATUDAY
                </div>
                <p className="h-[20px] min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]">
                  {getDayScheduleRange('SAT')}
                </p>
              </td>
              <td className="p-0 m-0">
                <div className="min-w-[6.8rem] text-center border border-black border-l-0 border-b-0 text-[14px]">
                  SUNDAY
                </div>
                <p className="h-[20px] min-w-[6.8rem] text-center border border-black border-l-0 text-[11.5px] mt-[-3px]">
                  {getDayScheduleRange('SUN')}
                </p>
              </td>
            </tr>
          </thead>
          <tbody className="flex flex-col mt-[-0.1px]">
            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="bg-[#eaeaea] h-[2.5rem] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  07:00 AM - 08:00 AM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("7:00 AM", "7:30 AM", day)
                            ? (getDutyColor("7:00 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("7:00 AM", "7:30 AM", day) &&
                            hasAdjacentSchedule("7:00 AM", "7:30 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("7:00 AM", "7:30 AM", day) &&
                            hasAdjacentSchedule("7:00 AM", "7:30 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("7:00 AM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("7:30 AM", "8:00 AM", day)
                            ? (getDutyColor("7:30 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("7:30 AM", "8:00 AM", day) &&
                            hasAdjacentSchedule("7:30 AM", "8:00 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("7:30 AM", "8:00 AM", day) &&
                            hasAdjacentSchedule("7:30 AM", "8:00 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("7:30 AM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  08:00 AM - 09:00 AM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("8:00 AM", "8:30 AM", day)
                            ? (getDutyColor("8:00 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("8:00 AM", "8:30 AM", day) &&
                            hasAdjacentSchedule("8:00 AM", "8:30 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("8:00 AM", "8:30 AM", day) &&
                            hasAdjacentSchedule("8:00 AM", "8:30 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("8:00 AM", day)}
                      </div>
                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("8:30 AM", "9:00 AM", day)
                            ? (getDutyColor("8:30 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("8:30 AM", "9:00 AM", day) &&
                            hasAdjacentSchedule("8:30 AM", "9:00 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("8:30 AM", "9:00 AM", day) &&
                            hasAdjacentSchedule("8:30 AM", "9:00 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("8:30 AM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  09:00 AM - 10:00 AM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("9:00 AM", "9:30 AM", day)
                            ? (getDutyColor("9:00 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("9:00 AM", "9:30 AM", day) &&
                            hasAdjacentSchedule("9:00 AM", "9:30 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("9:00 AM", "9:30 AM", day) &&
                            hasAdjacentSchedule("9:00 AM", "9:30 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("9:00 AM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("9:30 AM", "10:00 AM", day)
                            ? (getDutyColor("9:30 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("9:30 AM", "10:00 AM", day) &&
                            hasAdjacentSchedule("9:30 AM", "10:00 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("9:30 AM", "10:00 AM", day) &&
                            hasAdjacentSchedule("9:30 AM", "10:00 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("9:30 AM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  10:00 AM - 11:00 AM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("10:00 AM", "10:30 AM", day)
                            ? (getDutyColor("10:00 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("10:00 AM", "10:30 AM", day) &&
                            hasAdjacentSchedule("10:00 AM", "10:30 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("10:00 AM", "10:30 AM", day) &&
                            hasAdjacentSchedule("10:00 AM", "10:30 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("10:00 AM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("10:30 AM", "11:00 AM", day)
                            ? (getDutyColor("10:30 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("10:30 AM", "11:00 AM", day) &&
                            hasAdjacentSchedule("10:30 AM", "11:00 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("10:30 AM", "11:00 AM", day) &&
                            hasAdjacentSchedule("10:30 AM", "11:00 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("10:30 AM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  11:00 AM - 12:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("11:00 AM", "11:30 AM", day)
                            ? (getDutyColor("11:00 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("11:00 AM", "11:30 AM", day) &&
                            hasAdjacentSchedule("11:00 AM", "11:30 AM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("11:00 AM", "11:30 AM", day) &&
                            hasAdjacentSchedule("11:00 AM", "11:30 AM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("11:00 AM", day)}
                      </div>
                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("11:30 AM", "12:00 PM", day)
                            ? (getDutyColor("11:30 AM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("11:30 AM", "12:00 PM", day) &&
                            hasAdjacentSchedule("11:30 AM", "12:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("11:30 AM", "12:00 PM", day) &&
                            hasAdjacentSchedule("11:30 AM", "12:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("11:30 AM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  12:00 PM - 01:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("12:00 PM", "12:30 PM", day)
                            ? (getDutyColor("12:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("12:00 PM", "12:30 PM", day) &&
                            hasAdjacentSchedule("12:00 PM", "12:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("12:00 PM", "12:30 PM", day) &&
                            hasAdjacentSchedule("12:00 PM", "12:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("12:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("12:30 PM", "1:00 PM", day)
                            ? (getDutyColor("12:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("12:30 PM", "1:00 PM", day) &&
                            hasAdjacentSchedule("12:30 PM", "1:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("12:30 PM", "1:00 PM", day) &&
                            hasAdjacentSchedule("12:30 PM", "1:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("12:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] border bg-[#eaeaea] border-black border-t-0 text-[14px] flex items-center justify-center">
                  01:00 PM - 02:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("1:00 PM", "1:30 PM", day)
                            ? (getDutyColor("1:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("1:00 PM", "1:30 PM", day) &&
                            hasAdjacentSchedule("1:00 PM", "1:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("1:00 PM", "1:30 PM", day) &&
                            hasAdjacentSchedule("1:00 PM", "1:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("1:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("1:30 PM", "2:00 PM", day)
                            ? (getDutyColor("1:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("1:30 PM", "2:00 PM", day) &&
                            hasAdjacentSchedule("1:30 PM", "2:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("1:30 PM", "2:00 PM", day) &&
                            hasAdjacentSchedule("1:30 PM", "2:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("1:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  02:00 PM - 03:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("2:00 PM", "2:30 PM", day)
                            ? (getDutyColor("2:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("2:00 PM", "2:30 PM", day) &&
                            hasAdjacentSchedule("2:00 PM", "2:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("2:00 PM", "2:30 PM", day) &&
                            hasAdjacentSchedule("2:00 PM", "2:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("2:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("2:30 PM", "3:00 PM", day)
                            ? (getDutyColor("2:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("2:30 PM", "3:00 PM", day) &&
                            hasAdjacentSchedule("2:30 PM", "3:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("2:30 PM", "3:00 PM", day) &&
                            hasAdjacentSchedule("2:30 PM", "3:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("2:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  03:00 PM - 04:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("3:00 PM", "3:30 PM", day)
                            ? (getDutyColor("3:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("3:00 PM", "3:30 PM", day) &&
                            hasAdjacentSchedule("3:00 PM", "3:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("3:00 PM", "3:30 PM", day) &&
                            hasAdjacentSchedule("3:00 PM", "3:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("3:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("3:30 PM", "4:00 PM", day)
                            ? (getDutyColor("3:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("3:30 PM", "4:00 PM", day) &&
                            hasAdjacentSchedule("3:30 PM", "4:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("3:30 PM", "4:00 PM", day) &&
                            hasAdjacentSchedule("3:30 PM", "4:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("3:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  04:00 PM - 05:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("4:00 PM", "4:30 PM", day)
                            ? (getDutyColor("4:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("4:00 PM", "4:30 PM", day) &&
                            hasAdjacentSchedule("4:00 PM", "4:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("4:00 PM", "4:30 PM", day) &&
                            hasAdjacentSchedule("4:00 PM", "4:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("4:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("4:30 PM", "5:00 PM", day)
                            ? (getDutyColor("4:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("4:30 PM", "5:00 PM", day) &&
                            hasAdjacentSchedule("4:30 PM", "5:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("4:30 PM", "5:00 PM", day) &&
                            hasAdjacentSchedule("4:30 PM", "5:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("4:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  05:00 PM - 06:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("5:00 PM", "5:30 PM", day)
                            ? (getDutyColor("5:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("5:00 PM", "5:30 PM", day) &&
                            hasAdjacentSchedule("5:00 PM", "5:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("5:00 PM", "5:30 PM", day) &&
                            hasAdjacentSchedule("5:00 PM", "5:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("5:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("5:30 PM", "6:00 PM", day)
                            ? (getDutyColor("5:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("5:30 PM", "6:00 PM", day) &&
                            hasAdjacentSchedule("5:30 PM", "6:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("5:30 PM", "6:00 PM", day) &&
                            hasAdjacentSchedule("5:30 PM", "6:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("5:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  06:00 PM - 07:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("6:00 PM", "6:30 PM", day)
                            ? (getDutyColor("6:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("6:00 PM", "6:30 PM", day) &&
                            hasAdjacentSchedule("6:00 PM", "6:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("6:00 PM", "6:30 PM", day) &&
                            hasAdjacentSchedule("6:00 PM", "6:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("6:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("6:30 PM", "7:00 PM", day)
                            ? (getDutyColor("6:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("6:30 PM", "7:00 PM", day) &&
                            hasAdjacentSchedule("6:30 PM", "7:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("6:30 PM", "7:00 PM", day) &&
                            hasAdjacentSchedule("6:30 PM", "7:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("6:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] bg-[#eaeaea] border border-black border-t-0 text-[14px] flex items-center justify-center">
                  07:00 PM - 08:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("7:00 PM", "7:30 PM", day)
                            ? (getDutyColor("7:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("7:00 PM", "7:30 PM", day) &&
                            hasAdjacentSchedule("7:00 PM", "7:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("7:00 PM", "7:30 PM", day) &&
                            hasAdjacentSchedule("7:00 PM", "7:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("7:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("7:30 PM", "8:00 PM", day)
                            ? (getDutyColor("7:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                            ${isTimeInSchedule("7:30 PM", "8:00 PM", day) &&
                            hasAdjacentSchedule("7:30 PM", "8:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                            ${isTimeInSchedule("7:30 PM", "8:00 PM", day) &&
                            hasAdjacentSchedule("7:30 PM", "8:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                            `}
                      >
                        {getCenterText("7:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>

            <tr className="flex w-full">
              <td className="m-0 p-0 min-w-[13.1rem]">
                <div className="h-[2.5rem] border bg-[#eaeaea] border-black border-t-0 text-[14px] flex items-center justify-center">
                  08:00 PM - 09:00 PM
                </div>
              </td>

              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                (day, i) => (
                  <td
                    key={day}
                    className={`m-0 p-0 ${day === "WED"
                      ? "min-w-[7rem]"
                      : day === "THU"
                        ? "min-w-[6.9rem]"
                        : "min-w-[6.8rem]"
                      }`}
                  >
                    <div className="h-[2.5rem] p-0 m-0">
                      <div
                        style={{
                          backgroundColor: isTimeInSchedule("8:00 PM", "8:30 PM", day)
                            ? (getDutyColor("8:00 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-t-0 border-l-0 flex items-center justify-center
                                                ${isTimeInSchedule("8:00 PM", "8:30 PM", day) &&
                            hasAdjacentSchedule("8:00 PM", "8:30 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                                ${isTimeInSchedule("8:00 PM", "8:30 PM", day) &&
                            hasAdjacentSchedule("8:00 PM", "8:30 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                                `}
                      >
                        {getCenterText("8:00 PM", day)}
                      </div>

                      <div
                        style={{
                          borderTop: "none",
                          backgroundColor: isTimeInSchedule("8:30 PM", "9:00 PM", day)
                            ? (getDutyColor("8:30 PM", day) || "rgb(253 224 71)")
                            : undefined
                        }}
                        className={`h-[1.25rem] border border-black border-l-0 flex items-center justify-center
                                                ${isTimeInSchedule("8:30 PM", "9:00 PM", day) &&
                            hasAdjacentSchedule("8:30 PM", "9:00 PM", day, "top") === "same"
                            ? "border-t-0"
                            : ""
                          }
                                                ${isTimeInSchedule("8:30 PM", "9:00 PM", day) &&
                            hasAdjacentSchedule("8:30 PM", "9:00 PM", day, "bottom") === "same"
                            ? "border-b-0"
                            : ""
                          }
                                                `}
                      >
                        {getCenterText("8:30 PM", day)}
                      </div>
                    </div>
                  </td>
                )
              )}
            </tr>
          </tbody>
        </table>
      </Box>

      <Dialog
        open={openDialogue}
        onClose={() => {
          setOpenDialogue(false);
          setSelectedScheduleId(null);
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this schedule?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialogue(false);
              setSelectedScheduleId(null);
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (selectedScheduleId) {
                await handleDelete(selectedScheduleId);
              }
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
  open={openConfirmDialog}
  onClose={() => setOpenConfirmDialog(false)}
>
  <DialogTitle>Confirm Honorarium Load</DialogTitle>
  <DialogContent>
    Are you sure you want to assign this schedule as Honorarium Load?
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">
      Cancel
    </Button>
    <Button
      onClick={() => {
        setIsHonorarium(true);
        setOpenConfirmDialog(false);
      }}
      color="primary"
    >
      Yes
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default ScheduleChecker;
