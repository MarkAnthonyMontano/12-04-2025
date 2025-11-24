import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  AppBar,
  Toolbar,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import axios from "axios";
import "./App.css";


// COMPONENTS FOLDER
import Unauthorized from './components/Unauthorized';
import Register from './components/Register';
import Login from './components/Login';
import LoginEnrollment from './components/LoginEnrollment';
import ApplicantForgotPassword from './components/ApplicantForgotPassword';
import RegistrarForgotPassword from './components/RegistrarForgotPassword';
import SideBar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import ApplicantProfile from './components/ApplicantProfile';
import ApplicantProfilePermit from './components/ApplicantProfile';

// PAGES FOLDER
import CourseManagement from './pages/CourseManagement';
import DepartmentManagement from './pages/DepartmentDashboard';
import AdmissionDashboardPanel from './pages/AdmissionDashboard';
import SystemDashboardPanel from './pages/SystemDashboard';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard'; //For Professors & Faculty Members
import RegistrarDashboard from './pages/RegistrarDashboard'; // For SuperAdmin & Admin
import ApplicantDashboard from './pages/ApplicantDashboard';
import AccountDashboard from './pages/AccountDashboard';
import ScheduleFilterer from './pages/SchedulePlottingFilter';
import HistoryLogs from './pages/HistoryLogs';

// FACULTY FOLDER
import GradingSheet from './faculty/GradingSheet';
import FacultyWorkload from './faculty/FacultyWorkload';
import FacultyMasterList from './faculty/FacultyMasterlist';
import ProgramEvaluation from './registrar/ProgramEvaluation';
import FacultyResetPassword from './faculty/FacultyResetPassword';
import FacultyEvaluation from './faculty/FacultyEvaluation';


// REGISTRAR FOLDER
import SearchCertificateOfRegistration from './registrar/SearchCertificateOfRegistration';
import AdminECATApplicationForm from './registrar/AdminECATApplicationForm';
import AdminPersonalDataForm from './registrar/AdminPersonalDataForm';
import AdminOfficeOfTheRegistrar from './registrar/AdminOfficeOfTheRegistrar';
import AdminAdmissionFormProcess from "./registrar/AdminAdmissionFormProcess";
import AdminDashboard1 from './registrar/AdminDashboard1';
import AdminDashboard2 from './registrar/AdminDashboard2';
import AdminDashboard3 from './registrar/AdminDashboard3';
import AdminDashboard4 from './registrar/AdminDashboard4';
import AdminDashboard5 from './registrar/AdminDashboard5';
import RegistrarDashboard1 from './registrar/RegistrarDashboard1';
import RegistrarDashboard2 from './registrar/RegistrarDashboard2';
import RegistrarDashboard3 from './registrar/RegistrarDashboard3';
import RegistrarDashboard4 from './registrar/RegistrarDashboard4';
import RegistrarDashboard5 from './registrar/RegistrarDashboard5';
import ApplicantList from './registrar/ApplicantList';
import ApplicantListAdmin from './registrar/ApplicantListAdmin';
import StudentRequirements from './registrar/StudentRequirements';
import RegistrarRequirements from './registrar/RegistrarRequirements';
import RegistrarExaminationProfile from './registrar/RegistrarExaminationProfile';
import AssignScheduleToApplicants from './registrar/AssignScheduleToApplicants';
import AssignEntranceExam from './registrar/AssignEntranceExam';
import AdmissionScheduleTile from './registrar/AdmissionScheduleTile';
import EnrollmentScheduleTile from './registrar/EnrollmentScheduleTile';
import ProctorApplicantList from './registrar/ProctorApplicantList';
import ApplicantScoring from './registrar/ApplicantScoring';
import QualifyingInterviewExamScore from './registrar/QualifyingInterviewExamScore';
import QualifyingInterviewerApplicantList from './registrar/QualifyingInterviewerApplicantList';
import AssignQualifyingInterviewExam from './registrar/AssignQualifyingInterviewExam';
import AssignScheduleToApplicantsQualifyingInterviewer from './registrar/AssignScheduleToApplicantsQualifyingInterviewer';
import ClassRoster from './registrar/ClassRoster';
import DepartmentRegistration from './registrar/DprtmntRegistration';
import DepartmentRoom from './registrar/DprtmntRoom';
import ProgramTagging from './registrar/ProgramTagging';
import CoursePanel from './registrar/CoursePanel';
import ProgramPanel from './registrar/ProgramPanel';
import CurriculumPanel from './registrar/CurriculumPanel';
import SectionPanel from './registrar/SectionPanel';
import DepartmentSection from './registrar/DepartmentSection';
import YearLevelPanel from './registrar/YearLevelPanel';
import YearPanel from './registrar/YearPanel';
import YearUpdateForm from './registrar/YearUpdateForm';
import SemesterPanel from './registrar/SemesterPanel';
import SchoolYearPanel from './registrar/SchoolYearPanel';
import SchoolYearActivatorPanel from './registrar/SchoolYearActivatorPanel';
import RequirementsForm from './registrar/RequirementsForm';
import StudentNumbering from './registrar/StudentNumbering';
import StudentNumberingPerCollege from './registrar/StudentNumberingPerCollege';
import CourseTagging from './registrar/CourseTagging';
import ChangeGradingPeriod from './registrar/ChangeYearGradPer';
import ScheduleChecker from './registrar/ScheduleChecker';
import RoomRegistration from './registrar/RoomRegistration';
import RegistrarExamPermit from './registrar/RegistrarExamPermit';
import ReportOfGrade from './registrar/ReportOfGrade';
import TranscriptOfRecords from './registrar/TranscriptOfRecords';
import TOSFCrud from './superadmin/TOSFCrud';
import EvaluationCRUD from './registrar/EvaluationCrud';

import MedicalApplicantList from './registrar/MedicalApplicantList';
import MedicalRequirementsForm from './registrar/MedicalRequirementsForm';
import DentalAssessment from './registrar/DentalAssessment';
import PhysicalNeuroExam from './registrar/PhysicalNeuroExam';
import MedicalDashboard1 from './registrar/MedicalDashboard1';
import MedicalDashboard2 from './registrar/MedicalDashboard2';
import MedicalDashboard3 from './registrar/MedicalDashboard3';
import MedicalDashboard4 from './registrar/MedicalDashboard4';
import MedicalDashboard5 from './registrar/MedicalDashboard5';
import MedicalRequirements from './registrar/MedicalRequirements';
import MedicalCertificate from './registrar/MedicalCertificate';
import HealthRecord from './registrar/HealthRecord';
import ReadmissionDashboard1 from './registrar/ReadmissionDashboard1';
import ReadmissionDashboard2 from './registrar/ReadmissionDashboard2';
import ReadmissionDashboard3 from './registrar/ReadmissionDashboard3';
import ReadmissionDashboard4 from './registrar/ReadmissionDashboard4';
import ReadmissionDashboard5 from './registrar/ReadmissionDashboard5';
import AnnouncementForAdmission from './registrar/AnnouncementForAdmission';

// APPLICANT FOLDER
import Dashboard1 from './applicant/Dashboard1';
import Dashboard2 from './applicant/Dashboard2';
import Dashboard3 from './applicant/Dashboard3';
import Dashboard4 from './applicant/Dashboard4';
import Dashboard5 from './applicant/Dashboard5';
import RequirementUploader from './applicant/RequirementUploader';
import PersonalDataForm from './applicant/PersonalDataForm';
import ECATApplicationForm from './applicant/ECATApplicationForm';
import AdmissionFormProcess from './applicant/AdmissionFormProcess';
import AdmissionServices from './applicant/AdmissionServices';
import OfficeOfTheRegistrar from './applicant/OfficeOfTheRegistrar';
import ExamPermit from "./applicant/ExamPermit";
import ApplicantResetPassword from './applicant/ApplicantResetPassword';

// STUDENT FOLDER
import StudentSchedule from './student/StudentSchedule';
import StudentGradingPage from './student/StudentGrade';
import StudentFacultyEvaluation from './student/StudentFacultyEval';
import StudentDashboard1 from './student/StudentDashboard1';
import StudentDashboard2 from './student/StudentDashboard2';
import StudentDashboard3 from './student/StudentDashboard3';
import StudentDashboard4 from './student/StudentDashboard4';
import StudentDashboard5 from './student/StudentDashboard5';
import StudentResetPassword from './student/StudentResetPassword';
import CertificateOfRegistration from './student/CertificateOfRegistration';
import StudentECATApplicationForm from './student/StudentECATApplicationForm';
import StudentOfficeOfTheRegistrar from './student/StudentOfficeOfTheRegistrar';
import StudentPersonalDataForm from './student/StudentPersonalDataForm';
import StudentAdmissionServices from './student/StudentAdmissionServices';
import StudentAdmissionFormProcess from './student/StudentAdmissionFormProcess';


// SUPERADMIN FOLDER
import EmailTemplateManager from './superadmin/EmailTemplateManager';
import Announcement from './superadmin/Announcement';
import SuperAdminApplicantList from './superadmin/SuperAdminApplicantList';
import SuperAdminApplicantDashboard1 from './superadmin/SuperAdminApplicantDashboard1';
import SuperAdminApplicantDashboard2 from './superadmin/SuperAdminApplicantDashboard2';
import SuperAdminApplicantDashboard3 from './superadmin/SuperAdminApplicantDashboard3';
import SuperAdminApplicantDashboard4 from './superadmin/SuperAdminApplicantDashboard4';
import SuperAdminApplicantDashboard5 from './superadmin/SuperAdminApplicantDashboard5';
import SuperAdminRequirementsUploader from './superadmin/SuperAdminRequirementsUploader';

import SuperAdminStudentDashboard1 from './superadmin/SuperAdminStudentDashboard1';
import SuperAdminStudentDashboard2 from './superadmin/SuperAdminStudentDashboard2';
import SuperAdminStudentDashboard3 from './superadmin/SuperAdminStudentDashboard3';
import SuperAdminStudentDashboard4 from './superadmin/SuperAdminStudentDashboard4';
import SuperAdminStudentDashboard5 from './superadmin/SuperAdminStudentDashboard5';
import SuperAdminApplicantResetPassword from './superadmin/SuperAdminApplicantResetPassword';
import SuperAdminStudentResetPassword from './superadmin/SuperAdminStudentResetPassword';
import SuperAdminFacultyResetPassword from './superadmin/SuperAdminFacultyResetPassword';
import SuperAdminRegistrarPassword from './superadmin/SuperAdminRegistrarResetPassword';
import Notifications from './superadmin/Notifications';
import RegistrarResetPassword from './superadmin/RegistrarResetPassword';
import RegisterProf from './superadmin/RegisterProf';
import RegisterRegistrar from './superadmin/RegisterRegistrar';
import RegisterStudent from './superadmin/RegisterStudent';
import PageCRUD from './superadmin/PageCRUD';
import UserPageAccess from './superadmin/UserPageAccess';
import Settings from './superadmin/Settings';
import SuperAdminRoomRegistration from './superadmin/SuperAdminRoomRegistration';
import API_BASE_URL from "./apiConfig";




// ✅ Create a Context so all components can access settings
export const SettingsContext = createContext(null);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [settings, setSettings] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  console.log(import.meta.env.VITE_API_BASE_URL_LOCAL)
  // ✅ Fetch settings from backend
  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Auto-refresh when settings change in Settings.jsx
    const handleStorageChange = () => fetchSettings();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // ✅ Check authentication
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  // ✅ Listen for custom 'settingsUpdated' event
  useEffect(() => {
    const handleSettingsUpdate = () => fetchSettings();
    window.addEventListener("settingsUpdated", handleSettingsUpdate);

    return () => window.removeEventListener("settingsUpdated", handleSettingsUpdate);
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: "Poppins, sans-serif",
    },
  });

  const keys = JSON.parse(localStorage.getItem("dashboardKeys") || "{}");

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* ✅ Wrap entire app with SettingsContext.Provider */}
      <SettingsContext.Provider value={settings}>
        <Router>
          {/* ✅ Layout container */}
          <div className="flex flex-col min-h-screen">

            {/* ✅ Top section (Sidebar + AppBar + Content) */}
            <div className="flex flex-1">
              {/* Sidebar */}
              {isAuthenticated && (
                <aside className="min-w-[21rem] min-h-full">
                  <SideBar setIsAuthenticated={setIsAuthenticated} profileImage={profileImage} setProfileImage={setProfileImage} />
                </aside>
              )}

              {/* Main area */}
              <div className="flex-1 flex flex-col">
                {/* Navbar */}
                <AppBar
                  position="fixed"
                  sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    bgcolor: settings?.header_color || "#1976d2",


                  }}
                >
                  <Toolbar>
                    {settings?.logo_url && (
                      <img
                        src={`${API_BASE_URL}${settings.logo_url}`}
                        alt="Logo"
                        style={{
                          height: "55px",
                          width: "55px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginRight: "12px",
                          cursor: "pointer",
                          border: "2px solid white",
                        }}
                        onClick={() => window.location.reload()}
                      />
                    )}
                    <Typography
                      style={{ fontWeight: "bold" }}
                      variant="h5"
                    >
                      {settings?.company_name || "SCHOOL NAME"}
                    </Typography>
                  </Toolbar>
                </AppBar>

                {/* ✅ Main content area */}
                <main className="flex-1 w-full mt-[64px] pb-[40px]" style={{ marginTop: "5rem" }}>
                  {/* Add your routes here later */}


                  <Routes>


                    <Route path="/" element={<LoginEnrollment setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/login_applicant" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/login" element={<LoginEnrollment setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/applicant_forgot_password" element={<ApplicantForgotPassword />} />
                    <Route path="/applicant_reset_password" element={<ProtectedRoute><ApplicantResetPassword /></ProtectedRoute>} />

                    <Route path="/forgot_password" element={<RegistrarForgotPassword />} />
                    <Route path="/registrar_reset_password" element={<ProtectedRoute><RegistrarResetPassword /></ProtectedRoute>} />

                    <Route path="/student_reset_password" element={<ProtectedRoute><StudentResetPassword /></ProtectedRoute>} />
                    <Route path="/faculty_reset_password" element={<ProtectedRoute><FacultyResetPassword /></ProtectedRoute>} />
                    <Route path="/superadmin_applicant_reset_password" element={<ProtectedRoute><SuperAdminApplicantResetPassword /></ProtectedRoute>} />
                    <Route path="/superadmin_student_reset_password" element={<ProtectedRoute><SuperAdminStudentResetPassword /></ProtectedRoute>} />
                    <Route path="/superadmin_faculty_reset_password" element={<ProtectedRoute><SuperAdminFacultyResetPassword /></ProtectedRoute>} />
                    <Route path="/superadmin_registrar_reset_password" element={<ProtectedRoute><SuperAdminRegistrarPassword /></ProtectedRoute>} />


                    <Route path="/registrar_dashboard" element={<ProtectedRoute><RegistrarDashboard profileImage={profileImage} setProfileImage={setProfileImage} /></ProtectedRoute>} />
                    <Route path="/faculty_dashboard" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyDashboard profileImage={profileImage} setProfileImage={setProfileImage} /></ProtectedRoute>} />
                    <Route path="/applicant_dashboard" element={<ProtectedRoute><ApplicantDashboard profileImage={profileImage} setProfileImage={setProfileImage} /></ProtectedRoute>} />
                    <Route path="/register_prof" element={<ProtectedRoute><RegisterProf /></ProtectedRoute>} />
                    <Route path="/register_registrar" element={<ProtectedRoute><RegisterRegistrar /></ProtectedRoute>} />
                    <Route path="/register_student" element={<ProtectedRoute><RegisterStudent /></ProtectedRoute>} />


                    <Route path="/room_registration" element={<ProtectedRoute><RoomRegistration /></ProtectedRoute>} />
                    <Route path="/course_management" element={<ProtectedRoute><CourseManagement /></ProtectedRoute>} />
                    <Route path="/program_tagging" element={<ProtectedRoute><ProgramTagging /></ProtectedRoute>} />
                    <Route path="/course_panel" element={<ProtectedRoute><CoursePanel /></ProtectedRoute>} />
                    <Route path="/program_panel" element={<ProtectedRoute><ProgramPanel /></ProtectedRoute>} />
                    <Route path="/department_section_panel" element={<ProtectedRoute><DepartmentSection /></ProtectedRoute>} />
                    <Route path="/curriculum_panel" element={<ProtectedRoute><CurriculumPanel /></ProtectedRoute>} />
                    <Route path="/department_registration" element={<ProtectedRoute><DepartmentRegistration /></ProtectedRoute>} />
                    <Route path="/section_panel" element={<ProtectedRoute><SectionPanel /></ProtectedRoute>} />

                    <Route path="/year_level_panel" element={<ProtectedRoute><YearLevelPanel /></ProtectedRoute>} />
                    <Route path="/year_panel" element={<ProtectedRoute><YearPanel /></ProtectedRoute>} />
                    <Route path="/year_update_panel" element={<ProtectedRoute><YearUpdateForm /></ProtectedRoute>} />
                    <Route path="/semester_panel" element={<ProtectedRoute><SemesterPanel /></ProtectedRoute>} />
                    <Route path="/school_year_panel" element={<ProtectedRoute><SchoolYearPanel /></ProtectedRoute>} />
                    <Route path="/school_year_activator_panel" element={<ProtectedRoute><SchoolYearActivatorPanel /></ProtectedRoute>} />
                    <Route path="/history_logs" element={<ProtectedRoute><HistoryLogs /></ProtectedRoute>} />
                    <Route path="/requirements_form" element={<ProtectedRoute><RequirementsForm /></ProtectedRoute>} />
                    <Route path="/admission_dashboard" element={<ProtectedRoute><AdmissionDashboardPanel /></ProtectedRoute>} />
                    <Route path="/department_dashboard" element={<ProtectedRoute><DepartmentManagement /></ProtectedRoute>} />
                    <Route path="/system_dashboard" element={<ProtectedRoute><SystemDashboardPanel /></ProtectedRoute>} />
                    <Route path="/account_dashboard" element={<ProtectedRoute><AccountDashboard /></ProtectedRoute>} />
                    <Route path="/student_numbering" element={<ProtectedRoute><StudentNumbering /></ProtectedRoute>} />
                    <Route path="/student_numbering_per_college" element={<ProtectedRoute><StudentNumberingPerCollege /></ProtectedRoute>} />
                    <Route path="/course_tagging" element={<ProtectedRoute><CourseTagging /></ProtectedRoute>} />
                    <Route path="/schedule_checker/:dprtmnt_id" element={<ProtectedRoute><ScheduleChecker /></ProtectedRoute>} />
                    <Route path="/change_grade_period" element={<ProtectedRoute><ChangeGradingPeriod /></ProtectedRoute>} />
                    <Route path="/department_room" element={<ProtectedRoute><DepartmentRoom /></ProtectedRoute>} />
                    <Route path="/search_cor" element={<ProtectedRoute><SearchCertificateOfRegistration /></ProtectedRoute>} />
                    <Route path="/cor" element={<ProtectedRoute><CertificateOfRegistration /></ProtectedRoute>} />
                    <Route path="/select_college" element={<ProtectedRoute><ScheduleFilterer /></ProtectedRoute>} />

                    <Route path="/assign_entrance_exam" element={<ProtectedRoute><AssignEntranceExam /></ProtectedRoute>} />
                    <Route path="/assign_schedule_applicant" element={<ProtectedRoute><AssignScheduleToApplicants /></ProtectedRoute>} />
                    <Route path="/admission_schedule_room_list" element={<ProtectedRoute><AdmissionScheduleTile /></ProtectedRoute>} />
                    <Route path="/enrollment_schedule_room_list" element={<ProtectedRoute><EnrollmentScheduleTile /></ProtectedRoute>} />
                    <Route path="/applicant_scoring" element={<ProtectedRoute><ApplicantScoring /></ProtectedRoute>} />

                    <Route path="/assign_qualifying_interview_exam" element={<ProtectedRoute><AssignQualifyingInterviewExam /></ProtectedRoute>} />
                    <Route path="/assign_schedule_applicants_qualifying_interview" element={<ProtectedRoute><AssignScheduleToApplicantsQualifyingInterviewer /></ProtectedRoute>} />
                    <Route path="/qualifying_interviewer_applicant_list" element={<ProtectedRoute><QualifyingInterviewerApplicantList /></ProtectedRoute>} />


                    <Route path="/grading_sheet" element={<ProtectedRoute><GradingSheet /></ProtectedRoute>} />
                    <Route path="/faculty_workload" element={<ProtectedRoute><FacultyWorkload /></ProtectedRoute>} />
                    <Route path="/faculty_evaluation" element={<ProtectedRoute><FacultyEvaluation /></ProtectedRoute>} />
                    <Route path="/faculty_masterlist" element={<ProtectedRoute><FacultyMasterList /></ProtectedRoute>} />
                    <Route path="/program_evaluation" element={<ProtectedRoute><ProgramEvaluation /></ProtectedRoute>} />
                    <Route path="/student_dashboard" element={<ProtectedRoute allowedRoles={'student'}><StudentDashboard profileImage={profileImage} setProfileImage={setProfileImage} /></ProtectedRoute>} />
                    <Route path="/student_schedule" element={<ProtectedRoute allowedRoles={'student'}><StudentSchedule /></ProtectedRoute>} />
                    <Route path="/grades_page" element={<ProtectedRoute><StudentGradingPage allowedRoles={'student'} /></ProtectedRoute>} />
                    <Route path="/student_faculty_evaluation" element={<ProtectedRoute allowedRoles={'student'}><StudentFacultyEvaluation /></ProtectedRoute>} />

                    <Route path="/unauthorized" element={<Unauthorized />} />

                    <Route path="/applicant_list" element={<ProtectedRoute><ApplicantList /></ProtectedRoute>} />
                    <Route path="/medical_applicant_list" element={<ProtectedRoute><MedicalApplicantList /></ProtectedRoute>} />
                    <Route path="/applicant_list_admin" element={<ProtectedRoute><ApplicantListAdmin /></ProtectedRoute>} />
                    <Route path="/super_admin_applicant_list" element={<ProtectedRoute><SuperAdminApplicantList /></ProtectedRoute>} />
                    <Route path="/proctor_applicant_list" element={<ProtectedRoute><ProctorApplicantList /></ProtectedRoute>} />


                    <Route path="/evaluation_crud" element={<ProtectedRoute><EvaluationCRUD /></ProtectedRoute>} />

                    <Route path="/qualifying_interview_exam_scores" element={<ProtectedRoute><QualifyingInterviewExamScore /></ProtectedRoute>} />

                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings onUpdate={fetchSettings} />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

                    <Route path="/admin_dashboard1" element={<ProtectedRoute><AdminDashboard1 /></ProtectedRoute>} />
                    <Route path="/admin_dashboard2" element={<ProtectedRoute><AdminDashboard2 /></ProtectedRoute>} />
                    <Route path="/admin_dashboard3" element={<ProtectedRoute><AdminDashboard3 /></ProtectedRoute>} />
                    <Route path="/admin_dashboard4" element={<ProtectedRoute><AdminDashboard4 /></ProtectedRoute>} />
                    <Route path="/admin_dashboard5" element={<ProtectedRoute><AdminDashboard5 /></ProtectedRoute>} />


                    <Route path="/student_dashboard1" element={<ProtectedRoute><StudentDashboard1 allowedRoles={'student'} /></ProtectedRoute>} />
                    <Route path="/student_dashboard2" element={<ProtectedRoute><StudentDashboard2 allowedRoles={'student'} /></ProtectedRoute>} />
                    <Route path="/student_dashboard3" element={<ProtectedRoute><StudentDashboard3 allowedRoles={'student'} /></ProtectedRoute>} />
                    <Route path="/student_dashboard4" element={<ProtectedRoute><StudentDashboard4 allowedRoles={'student'} /></ProtectedRoute>} />
                    <Route path="/student_dashboard5" element={<ProtectedRoute><StudentDashboard5 allowedRoles={'student'} /></ProtectedRoute>} />

                    <Route path="/registrar_dashboard1" element={<ProtectedRoute><RegistrarDashboard1 /></ProtectedRoute>} />
                    <Route path="/registrar_dashboard2" element={<ProtectedRoute><RegistrarDashboard2 /></ProtectedRoute>} />
                    <Route path="/registrar_dashboard3" element={<ProtectedRoute><RegistrarDashboard3 /></ProtectedRoute>} />
                    <Route path="/registrar_dashboard4" element={<ProtectedRoute><RegistrarDashboard4 /></ProtectedRoute>} />
                    <Route path="/registrar_dashboard5" element={<ProtectedRoute><RegistrarDashboard5 /></ProtectedRoute>} />

                    <Route path="/medical_dashboard1" element={<ProtectedRoute><MedicalDashboard1 /></ProtectedRoute>} />
                    <Route path="/medical_dashboard2" element={<ProtectedRoute><MedicalDashboard2 /></ProtectedRoute>} />
                    <Route path="/medical_dashboard3" element={<ProtectedRoute><MedicalDashboard3 /></ProtectedRoute>} />
                    <Route path="/medical_dashboard4" element={<ProtectedRoute><MedicalDashboard4 /></ProtectedRoute>} />
                    <Route path="/medical_dashboard5" element={<ProtectedRoute><MedicalDashboard5 /></ProtectedRoute>} />
                    <Route path="/medical_requirements" element={<ProtectedRoute><MedicalRequirements /></ProtectedRoute>} />
                    <Route path="/medical_certificate" element={<ProtectedRoute><MedicalCertificate /></ProtectedRoute>} />
                    <Route path="/health_record" element={<ProtectedRoute><HealthRecord /></ProtectedRoute>} />


                    <Route path="/medical_requirements_form" element={<ProtectedRoute><MedicalRequirementsForm /></ProtectedRoute>} />
                    <Route path="/dental_assessment" element={<ProtectedRoute><DentalAssessment /></ProtectedRoute>} />
                    <Route path="/physical_neuro_exam" element={<ProtectedRoute><PhysicalNeuroExam /></ProtectedRoute>} />

                    <Route path="/readmission_dashboard1" element={<ProtectedRoute><ReadmissionDashboard1 /></ProtectedRoute>} />
                    <Route path="/readmission_dashboard2" element={<ProtectedRoute><ReadmissionDashboard2 /></ProtectedRoute>} />
                    <Route path="/readmission_dashboard3" element={<ProtectedRoute><ReadmissionDashboard3 /></ProtectedRoute>} />
                    <Route path="/readmission_dashboard4" element={<ProtectedRoute><ReadmissionDashboard4 /></ProtectedRoute>} />
                    <Route path="/readmission_dashboard5" element={<ProtectedRoute><ReadmissionDashboard5 /></ProtectedRoute>} />



                    <Route path="/super_admin_applicant_dashboard1" element={<ProtectedRoute><SuperAdminApplicantDashboard1 /></ProtectedRoute>} />
                    <Route path="/super_admin_applicant_dashboard2" element={<ProtectedRoute><SuperAdminApplicantDashboard2 /></ProtectedRoute>} />
                    <Route path="/super_admin_applicant_dashboard3" element={<ProtectedRoute><SuperAdminApplicantDashboard3 /></ProtectedRoute>} />
                    <Route path="/super_admin_applicant_dashboard4" element={<ProtectedRoute><SuperAdminApplicantDashboard4 /></ProtectedRoute>} />
                    <Route path="/super_admin_applicant_dashboard5" element={<ProtectedRoute><SuperAdminApplicantDashboard5 /></ProtectedRoute>} />
                    <Route path="/super_admin_requirements_uploader" element={<ProtectedRoute><SuperAdminRequirementsUploader /></ProtectedRoute>} />


                    <Route path="/super_admin_student_dashboard1" element={<ProtectedRoute><SuperAdminStudentDashboard1 /></ProtectedRoute>} />
                    <Route path="/super_admin_student_dashboard2" element={<ProtectedRoute><SuperAdminStudentDashboard2 /></ProtectedRoute>} />
                    <Route path="/super_admin_student_dashboard3" element={<ProtectedRoute><SuperAdminStudentDashboard3 /></ProtectedRoute>} />
                    <Route path="/super_admin_student_dashboard4" element={<ProtectedRoute><SuperAdminStudentDashboard4 /></ProtectedRoute>} />
                    <Route path="/super_admin_student_dashboard5" element={<ProtectedRoute><SuperAdminStudentDashboard5 /></ProtectedRoute>} />

                    <Route path="/super_admin_room_registration" element={<ProtectedRoute><SuperAdminRoomRegistration /></ProtectedRoute>} />


                    <Route path="/applicant_dashboard" element={<ProtectedRoute allowedRoles={['applicant']}><ApplicantDashboard /></ProtectedRoute>} />

                    {keys.step1 && <Route path={`/dashboard/${keys.step1}`} element={<ProtectedRoute allowedRoles={['applicant']}><Dashboard1 /></ProtectedRoute>} />}
                    {keys.step2 && <Route path={`/dashboard/${keys.step2}`} element={<ProtectedRoute allowedRoles={['applicant']}><Dashboard2 /></ProtectedRoute>} />}
                    {keys.step3 && <Route path={`/dashboard/${keys.step3}`} element={<ProtectedRoute allowedRoles={['applicant']}><Dashboard3 /></ProtectedRoute>} />}
                    {keys.step4 && <Route path={`/dashboard/${keys.step4}`} element={<ProtectedRoute allowedRoles={['applicant']}><Dashboard4 /></ProtectedRoute>} />}
                    {keys.step5 && <Route path={`/dashboard/${keys.step5}`} element={<ProtectedRoute allowedRoles={['applicant']}><Dashboard5 /></ProtectedRoute>} />}

                    <Route path="/requirements_uploader" element={<ProtectedRoute allowedRoles={['applicant']}><RequirementUploader /></ProtectedRoute>} />
                    <Route path="/student_requirements" element={<ProtectedRoute><StudentRequirements /></ProtectedRoute>} />
                    <Route path="/registrar_requirements" element={<ProtectedRoute><RegistrarRequirements /></ProtectedRoute>} />
                    <Route path="/admin_ecat_application_form" element={<ProtectedRoute allowedRoles={['registrar']}><AdminECATApplicationForm /></ProtectedRoute>} />
                    <Route path="/admin_personal_data_form" element={<ProtectedRoute allowedRoles={['registrar']}><AdminPersonalDataForm /></ProtectedRoute>} />
                    <Route path="/admin_admission_form_process" element={<ProtectedRoute allowedRoles={['registrar']}><AdminAdmissionFormProcess /></ProtectedRoute>} />
                    <Route path="/admin_office_of_the_registrar" element={<ProtectedRoute allowedRoles={['registrar']}><AdminOfficeOfTheRegistrar /></ProtectedRoute>} />
                    <Route path="/personal_data_form" element={<ProtectedRoute allowedRoles={['applicant']}><PersonalDataForm /></ProtectedRoute>} />
                    <Route path="/ecat_application_form" element={<ProtectedRoute allowedRoles={['applicant']}><ECATApplicationForm /></ProtectedRoute>} />
                    <Route path="/admission_form_process" element={<ProtectedRoute allowedRoles={['applicant', 'registrar', 'student']}><AdmissionFormProcess /></ProtectedRoute>} />
                    <Route path="/admission_services" element={<ProtectedRoute allowedRoles={['applicant', 'registrar']}><AdmissionServices /></ProtectedRoute>} />
                    <Route path="/office_of_the_registrar" element={<ProtectedRoute allowedRoles={['applicant']}><OfficeOfTheRegistrar /></ProtectedRoute>} />


                    <Route path="/class_roster" element={<ProtectedRoute ><ClassRoster /></ProtectedRoute>} />
                    <Route path="/transcript_of_records" element={<ProtectedRoute ><TranscriptOfRecords /></ProtectedRoute>} />
                    <Route path="/tosf_crud" element={<ProtectedRoute ><TOSFCrud /></ProtectedRoute>} />

                    <Route path="/email_template_manager" element={<ProtectedRoute><EmailTemplateManager /></ProtectedRoute>} />
                    <Route path="/announcement" element={<ProtectedRoute><Announcement /></ProtectedRoute>} />
                    <Route path="/announcement_for_admission" element={<ProtectedRoute><AnnouncementForAdmission /></ProtectedRoute>} />
                    <Route path="/exam-permit/:applicant_number" element={<ExamPermit />} />
                    <Route path="/applicant-permit/:applicant_number" element={<ApplicantProfilePermit />} />

                    <Route path="/student_ecat_application_form" element={<ProtectedRoute allowedRoles={['student',]}><StudentECATApplicationForm /></ProtectedRoute>} />
                    <Route path="/student_personal_data_form" element={<ProtectedRoute allowedRoles={['student']} ><StudentPersonalDataForm /></ProtectedRoute>} />
                    <Route path="/student_office_of_the_registrar" element={<ProtectedRoute allowedRoles={['student']}><StudentOfficeOfTheRegistrar /></ProtectedRoute>} />
                    <Route path="/student_admission_services" element={<ProtectedRoute allowedRoles={['student']} ><StudentAdmissionServices /></ProtectedRoute>} />
                    <Route path="/student_form_process" element={<ProtectedRoute allowedRoles={['student', 'registrar', 'applicant']}><StudentAdmissionFormProcess /></ProtectedRoute>} />


                    {/*Public Examination Profile */}
                    <Route path="/applicant_profile" element={<ApplicantProfile />} />
                    <Route path="/applicant_profile/:applicantNumber" element={<ApplicantProfile />} />

                    {/* ADMIN - Admission Examination Profile */}
                    <Route path="/registrar_exam_permit" element={<ProtectedRoute><RegistrarExamPermit /></ProtectedRoute>} />
                    <Route path="/registrar_examination_profile" element={<ProtectedRoute><RegistrarExaminationProfile /></ProtectedRoute>} />
                    <Route path="/registrar_examination_profile/:personId" element={<ApplicantProfile />} />

                    <Route path="/page_crud" element={<ProtectedRoute><PageCRUD /></ProtectedRoute>} />
                    <Route path="/report_of_grades" element={<ProtectedRoute><ReportOfGrade /></ProtectedRoute>} />
                    <Route path="/user_page_access" element={<ProtectedRoute><UserPageAccess /></ProtectedRoute>} />

                  </Routes>

                </main>
              </div>
            </div>

            {/* Footer */}
            <Box
              component="footer"
              sx={{
                width: "100%",
                position: "fixed",
                bottom: 0,
                left: 0,
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: settings?.footer_color || "#ffffff",
                color: "white",
                textAlign: "center",
                padding: "5px"
              }}
            >
              <Typography
                style={{ fontSize: "20px" }}
              >
                {settings?.footer_text || "EARIST MANILA"}
              </Typography>
            </Box>

          </div>
        </Router>
      </SettingsContext.Provider>
    </ThemeProvider>
  );
}

export default App;
