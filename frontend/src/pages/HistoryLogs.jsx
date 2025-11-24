import React, { useState, useEffect, useContext } from "react";
import { SettingsContext } from "../App";
import axios from "axios";
import Unauthorized from "../components/Unauthorized";
import LoadingOverlay from "../components/LoadingOverlay";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import API_BASE_URL from "../apiConfig";
const HistoryLogs = () => {
  const settings = useContext(SettingsContext);

  // Theme
  const [titleColor, setTitleColor] = useState("#000000");
  const [borderColor, setBorderColor] = useState("#000000");
  const [mainButtonColor, setMainButtonColor] = useState("#1976d2");

  // Access Control
  const [userID, setUserID] = useState("");
  const [userRole, setUserRole] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Access list map
  const [userAccessList, setUserAccessList] = useState({});

  const pageId = 97; // HISTORY LOGS

  // Apply settings
  useEffect(() => {
    if (!settings) return;
    setTitleColor(settings.title_color || "#000000");
    setBorderColor(settings.border_color || "#000000");
    setMainButtonColor(settings.main_button_color || "#1976d2");
  }, [settings]);

  // Load user & access
  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("person_id");
    const emp = localStorage.getItem("employee_id");

    if (email && role && id && emp) {
      setUserID(id);
      setUserRole(role);
      setEmployeeID(emp);

      if (role === "registrar") {
        checkAccess(emp);
        fetchUserAccessList(emp);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }, []);

  const checkAccess = async (emp) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/api/page_access/${emp}/${pageId}`
      );
      setHasAccess(res.data?.page_privilege === 1);
    } catch (err) {
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SAME as other modules
  const fetchUserAccessList = async (emp) => {
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/api/page_access/${emp}`
      );

      const map = data.reduce((acc, row) => {
        acc[row.page_id] = row.page_privilege === 1;
        return acc;
      }, {});

      setUserAccessList(map);
    } catch (err) {
      console.error("Error loading access list:", err);
    }
  };

  // ✅ REAL PAGE_ID
  const groupedMenu = [
    {
      label: "HISTORY LOGS",
      items: [
        { title: "NOTIFICATIONS", link: "/notifications", icon: NotificationsIcon, page_id: 68 },
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
          items: group.items.filter((item) => userAccessList[item.page_id]), // ✅ filter by access
        }))
        .filter((group) => group.items.length > 0) // ✅ hide header if empty
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

export default HistoryLogs;
