import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  CollectionsBookmark,
  EditNote,
  MenuBook,
  LibraryBooks,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import API_BASE_URL from "../apiConfig";
const CourseManagement = () => {
  const settings = useContext(SettingsContext);

  // Theme Colors
  const [titleColor, setTitleColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

  // School Info
  const [fetchedLogo, setFetchedLogo] = useState(null);

  // Access Control
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userAccessList, setUserAccessList] = useState({});

  const pageId = 93;

  useEffect(() => {
    if (!settings) return;

    setTitleColor(settings.title_color || "#000000");
    setBorderColor(settings.border_color || "#000000");
    setMainButtonColor(settings.main_button_color || "#1976d2");

    if (settings.logo_url) {
      setFetchedLogo(`${API_BASE_URL}${settings.logo_url}`);
    }
  }, [settings]);

  useEffect(() => {
    const storedUser = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    const storedID = localStorage.getItem("person_id");
    const storedEmployeeID = localStorage.getItem("employee_id");

    if (storedUser && storedRole && storedID && storedEmployeeID) {
      setUserRole(storedRole);
      setUserID(storedID);
      setEmployeeID(storedEmployeeID);

      if (storedRole === "registrar") {
        checkAccess(storedEmployeeID);
        fetchUserAccessList(storedEmployeeID);
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
      console.error("Error checking access:", error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

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
      console.error("Error loading user access list:", err);
    }
  };

  const groupedMenu = [
    {
      label: "COURSE MANAGEMENT",
      items: [
        { title: "PROGRAM TAGGING PANEL", path: "/program_tagging", icon: CollectionsBookmark, page_id: 35 },
        { title: "PROGRAM PANEL FORM", path: "/program_panel", icon: LibraryBooks, page_id: 34 },
        { title: "CREATE CURRICULUM", path: "/curriculum_panel", icon: EditNote, page_id: 18 },
        { title: "COURSE PANEL FORM", path: "/course_panel", icon: MenuBook, page_id: 16 },
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
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                borderBottom: `4px solid ${borderColor}`,
                width: "100%",
                pb: 1,
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
                  <Link key={i} to={item.path} className="relative">
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
                );
              })}
            </div>
          </Box>
        ))}
    </Box>
  );
};

export default CourseManagement;
