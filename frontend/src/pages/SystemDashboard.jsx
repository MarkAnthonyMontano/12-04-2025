import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";

import {
  Assignment,        // Requirements
  MeetingRoom,       // Room
  Class,             // Section
  Timeline,          // Semester
  ChangeCircle,      // Change Grade Period
  Update,            // Year Update
  EventAvailable,    // School Year Activator
  Layers,            // Year Level
  CalendarToday,     // Year Panel
  DateRange,         // School Year Panel
  Email,             // Email Template Manager
  Settings,
  Campaign,          // Announcement
} from "@mui/icons-material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import API_BASE_URL from "../apiConfig";
const SystemDashboardPanel = () => {
  const settings = useContext(SettingsContext);

  const [titleColor, setTitleColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

  // School data
  const [fetchedLogo, setFetchedLogo] = useState(null);

  // Access Control
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ NEW access map
  const [userAccessList, setUserAccessList] = useState({});

  const pageId = 95; // SYSTEM MANAGEMENT

  // Load theme
  useEffect(() => {
    if (!settings) return;

    setTitleColor(settings.title_color || "#000000");
    setBorderColor(settings.border_color || "#000000");
    setMainButtonColor(settings.main_button_color || "#1976d2");

    if (settings.logo_url) {
      setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
    }
  }, [settings]);

  // Load user & access
  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("person_id");
    const empID = localStorage.getItem("employee_id");

    if (email && role && id && empID) {
      setUserRole(role);
      setUserID(id);
      setEmployeeID(empID);

      if (role === "registrar") {
        checkAccess(empID);
        fetchUserAccessList(empID);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const checkAccess = async (employeeID) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/api/page_access/${employeeID}/${pageId}`
      );
      setHasAccess(response.data?.page_privilege === 1);
    } catch (error) {
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAME access list logic as Admission
  const fetchUserAccessList = async (employeeID) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/page_access/${employeeID}`
      );

      const accessMap = data.reduce((acc, item) => {
        acc[item.page_id] = item.page_privilege === 1;
        return acc;
      }, {});

      setUserAccessList(accessMap);
    } catch (err) {
      console.error("Access list failed:", err);
    }
  };

  // ✅ REAL SYSTEM MANAGEMENT MENU
  const groupedMenu = [
    {
      label: "ROOM & REQUIREMENTS MANAGEMENT",
      items: [
        { title: "ROOM FORM", link: "/super_admin_room_registration", icon: MeetingRoom, page_id: 85 },
        { title: "REQUIREMENTS PANEL", link: "/requirements_form", icon: Assignment, page_id: 51 },
      ],
    },
    {
      label: "SETTINGS & COMMUNICATION",
      items: [
        { title: "SETTINGS", link: "/settings", icon: Settings, page_id: 74 },
        { title: "EMAIL SENDER", link: "/email_template_manager", icon: Email, page_id: 67 },
        { title: "ANNOUNCEMENT", link: "/announcement", icon: Campaign, page_id: 66 },
      ],
    },
    {
      label: "SECTION & SEMESTER MANAGEMENT",
      items: [
        { title: "SECTION PANEL FORM", link: "/section_panel", icon: Class, page_id: 57 },
        { title: "SEMESTER PANEL FORM", link: "/semester_panel", icon: Timeline, page_id: 58 },
        { title: "CHANGE GRADING PERIOD", link: "/change_grade_period", icon: ChangeCircle, page_id: 14 },
   
      ],
    },
      {
      label: "PAYMENT MODULE / EVALUATION CRUD",
      items: [
      
        { title: "EVALUATION MANAGEMENT", link: "/evaluation_crud", icon: HelpOutlineIcon, page_id: 23 },
        { title: "TOSF CRUD", link: "/tosf_crud", icon: HelpOutlineIcon, page_id: 99 },
      ],
    },
    {
      label: "YEAR & SCHOOL MANAGEMENT",
      items: [
        { title: "YEAR UPDATE PANEL", link: "/year_update_panel", icon: Update, page_id: 65 },
        { title: "YEAR LEVEL PANEL FORM", link: "/year_level_panel", icon: Layers, page_id: 63 },
        { title: "YEAR PANEL FORM", link: "/year_panel", icon: CalendarToday, page_id: 64 },
        { title: "SCHOOL YEAR ACTIVATOR PANEL", link: "/school_year_activator_panel", icon: EventAvailable, page_id: 54 },
        { title: "SCHOOL YEAR PANEL", link: "/school_year_panel", icon: DateRange, page_id: 55 },
      ],
    },


  ];


  if (loading || hasAccess === null)
    return <LoadingOverlay open={loading} message="Checking Access..." />;

  if (!hasAccess) return <Unauthorized />;

  return (
    <Box
      sx={{
        height: "calc(100vh - 150px)",
        overflowY: "auto",
        paddingRight: 1,
        backgroundColor: "transparent",
      }}
    >
      {groupedMenu
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => userAccessList[item.page_id]),
        }))
        .filter((group) => group.items.length > 0)
        .map((group, idx) => (
          <Box key={idx} sx={{ mb: 5 }}>
            {/* HEADER */}
            <Box
              sx={{
                borderBottom: `4px solid ${borderColor}`,
                pb: 1,
                mb: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: titleColor,
                  textTransform: "uppercase",
                  fontSize: "34px",
                }}
              >
                {group.label}
              </Typography>
            </Box>

            <div className="p-2 px-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {group.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div className="relative" key={i}>
                    <Link to={item.link}>
                      {/* ICON BOX */}
                      <div
                        className="bg-white p-4 rounded-lg absolute left-16 top-12"
                        style={{
                          border: `5px solid ${borderColor}`,
                          color: titleColor,
                          transition: "0.2s ease-in-out",
                        }}
                      >
                        <Icon sx={{ fontSize: 36, color: titleColor }} />
                      </div>

                      {/* HOVERABLE BUTTON */}
                      <button
                        className="bg-white rounded-lg p-4 w-80 h-36 font-medium mt-20 ml-8 flex items-end justify-center"
                        style={{
                          border: `5px solid ${borderColor}`,
                          color: titleColor,
                          transition: "0.2s ease-in-out",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = mainButtonColor;
                          e.currentTarget.style.color = "#ffffff";
                          e.currentTarget.style.border = `5px solid ${borderColor}`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                          e.currentTarget.style.color = titleColor;
                          e.currentTarget.style.border = `5px solid ${borderColor}`;
                        }}
                      >
                        {item.title}
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </Box>
        ))}
    </Box>
  );
};

export default SystemDashboardPanel;
