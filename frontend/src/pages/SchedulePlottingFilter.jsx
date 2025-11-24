import React, { useState, useEffect, useContext, useRef } from "react";
import { SettingsContext } from "../App";


import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Grid,
  Button,
  Typography,
  Box
} from '@mui/material';
import API_BASE_URL from "../apiConfig";
const ScheduleFilterer = () => {
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

  const [departmentList, setDepartmentsList] = useState([]);
  const [filterDepId, setFilterDepId] = useState(null);
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/departments`);
      setDepartmentsList(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleFilterID = (id) => {
    setFilterDepId(id);
    navigate(`/schedule_checker/${id}`);
  };

  return (
    <Box p={3}>
      <Typography
        variant="h3"
        fontWeight="bold"
        sx={{ color: titleColor, fontSize: "42px" }}
        textAlign="center"
        gutterBottom
        mb={3}
      >
        Select a Department
      </Typography>
      <hr style={{ border: "1px solid #ccc", width: "100%" }} />
      <br />
      <Grid
        container
        spacing={4}
        gap={2}
        justifyContent="center"
        textAlign="center"
        style={{ backgroundColor: "white", padding: "1rem 0rem" }}
      >
        {departmentList.map((department, index) => (
          <Grid key={department.dprtmnt_id}>
            <Button
              fullWidth
              key={index}
              variant="contained"
              value={department.dprtmnt_id}
              onClick={() => handleFilterID(department.dprtmnt_id)}
              sx={{
                border: `2px solid ${borderColor}`,
                width: 100,
                height: 45,
                backgroundColor:
                  filterDepId === department.dprtmnt_id ? settings?.header_color || "#1976d2" : "white",
                color: filterDepId === department.dprtmnt_id ? "white" : "maroon",

                "&:hover": {
                  backgroundColor: mainButtonColor,
                  color: "white",
                },
              }}
            >
              {department.dprtmnt_code}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ScheduleFilterer;
