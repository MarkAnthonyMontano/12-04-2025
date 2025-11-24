import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { QRCodeSVG } from "qrcode.react";
import EaristLogo from "../assets/EaristLogo.png";
import EaristLogoBW from "../assets/earistblackandwhite.png";
import "../styles/Print.css";
import API_BASE_URL from "../apiConfig";
// ✅ Accept personId as a prop
const ApplicantProfilePermit = ({ personId }) => {
    const divToPrintRef = useRef(null);
    const [person, setPerson] = useState(null);
    const [examSchedule, setExamSchedule] = useState(null);
    const [curriculumOptions, setCurriculumOptions] = useState([]);
    const [scheduledBy, setScheduledBy] = useState(""); // ✅ added
    const [printed, setPrinted] = useState(false);

    // ✅ First data fetch
    useEffect(() => {
        const pid = personId || localStorage.getItem("person_id");
        if (!pid) return;

        const fetchData = async () => {
            try {
                // Fetch person
                const res = await axios.get(`${API_BASE_URL}/api/person/${pid}`);
                let personData = res.data;

                // Fetch applicant number separately
                const applicantRes = await axios.get(`${API_BASE_URL}/api/applicant_number/${pid}`);
                if (applicantRes.data?.applicant_number) {
                    personData.applicant_number = applicantRes.data.applicant_number;
                }

                setPerson(personData);

                // ✅ Check verification + schedule
                if (applicantRes.data?.applicant_number) {
                    const applicant_number = applicantRes.data.applicant_number;

                    // Verify documents
                    const verifyRes = await axios.get(`${API_BASE_URL}/api/verified-exam-applicants`);
                    const verified = verifyRes.data.some(a => a.applicant_id === applicant_number);

                    if (!verified) {
                        alert("❌ Your documents are not yet verified. You cannot print the Exam Permit.");
                        return;
                    }

                    // Fetch exam schedule
                    const schedRes = await axios.get(
                        `${API_BASE_URL}/api/exam-schedule/${applicant_number}`
                    );
                    setExamSchedule(schedRes.data);
                }

                // Fetch programs
                const progRes = await axios.get(`${API_BASE_URL}/api/applied_program`);
                setCurriculumOptions(progRes.data);

                // ✅ Fetch registrar (Scheduled By)
                const registrarRes = await axios.get(`${API_BASE_URL}/api/scheduled-by/registrar`);
                if (registrarRes.data?.fullName) {
                    setScheduledBy(registrarRes.data.fullName);
                }

            } catch (err) {
                console.error("Error fetching exam permit data:", err);
            }
        };

        fetchData();
    }, [personId]);

    // ✅ Secondary fetch for updates
    useEffect(() => {
        const pid = personId || localStorage.getItem("person_id");
        if (!pid) return;

        // fetch person
        axios.get(`${API_BASE_URL}/api/person/${pid}`)
            .then(async (res) => {
                let personData = res.data;

                // fetch applicant_number separately
                const applicantRes = await axios.get(`${API_BASE_URL}/api/applicant_number/${pid}`);
                if (applicantRes.data?.applicant_number) {
                    personData.applicant_number = applicantRes.data.applicant_number;
                }

                setPerson(personData);
            })
            .catch((err) => console.error(err));

        // fetch applicant number then schedule
        axios
            .get(`${API_BASE_URL}/api/applicant_number/${pid}`)
            .then((res) => {
                const applicant_number = res.data?.applicant_number;
                if (applicant_number) {
                    return axios.get(
                        `${API_BASE_URL}/api/exam-schedule/${applicant_number}`
                    );
                }
            })
            .then((res) => setExamSchedule(res?.data))
            .catch((err) => console.error(err));

        // fetch curriculum/programs
        axios
            .get(`${API_BASE_URL}/api/applied_program`)
            .then((res) => setCurriculumOptions(res.data))
            .catch((err) => console.error(err));

        // ✅ Fetch registrar name again for refresh
        axios
            .get(`${API_BASE_URL}/api/scheduled-by/registrar`)
            .then((res) => {
                if (res.data?.fullName) setScheduledBy(res.data.fullName);
            })
            .catch((err) => console.error("Error fetching registrar name:", err));

    }, [personId]);

    if (!person) return <div>Loading Exam Permit...</div>;

    return (
        <div
            ref={divToPrintRef}
            style={{
                width: "8.5in",
                minHeight: "9in",
                backgroundColor: "white",
                padding: "20px",
                margin: "0 auto",
                position: "relative",
                marginTop: "-20px",
                boxSizing: "border-box",
            }}
        >
            <style>{`
        @page {
          size: 8.5in 11in;
          margin: 0;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          button { display: none; }
        }
      `}</style>

            {/* Watermark */}
            <div
                style={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    opacity: 0.1,
                    textAlign: "center",
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            >
                <img
                    src={EaristLogoBW}
                    alt="Earist Watermark"
                    style={{ width: "350px", height: "350px", marginBottom: "10px" }}
                />
                <div
                    style={{
                        fontSize: "36px",
                        fontWeight: "bold",
                        color: "black",
                        letterSpacing: "2px",
                    }}
                >
                    VERIFIED
                </div>
            </div>

            {/* Header */}
            <table
                style={{
                    borderCollapse: "collapse",
                    width: "8in",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                <tbody>
                    <tr>
                        <td style={{ width: "20%" }}>
                            <img
                                src={EaristLogo}
                                alt="Earist Logo"
                                style={{ width: "120px", height: "120px" }}
                            />
                        </td>
                        <td style={{ width: "60%", textAlign: "center", lineHeight: "1.4" }}>
                            <div>Republic of the Philippines</div>
                            <b style={{ fontSize: "20px", letterSpacing: "1px" }}>
                                Eulogio "Amang" Rodriguez
                            </b>
                            <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                                Institute of Science and Technology
                            </div>
                            <div>Nagtahan St. Sampaloc, Manila</div>
                            <div style={{ marginTop: "20px" }}>
                                <b style={{ fontSize: "24px" }}>APPLICANT PERMIT</b>
                            </div>
                        </td>
                        <td style={{ width: "20%", textAlign: "center" }}>
                            <div
                                style={{
                                    width: "4.5cm",
                                    height: "4.5cm",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    margin: "0 auto",
                                }}
                            >
                                {person.profile_img ? (
                                    <img
                                        src={`${API_BASE_URL}/uploads/${person.profile_img}`}
                                        alt="Profile"
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                ) : (
                                    <span style={{ fontSize: "12px", color: "#888" }}>No Image</span>
                                )}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div style={{ height: "20px" }} />
            <div className="certificate-wrapper">
                {/* ✅ Watermark */}
                <div
                    style={{
                        position: "absolute",
                        top: "35%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        opacity: 0.1,
                        textAlign: "center",
                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                >
                    <img
                        src={EaristLogoBW}
                        alt="Earist Watermark"
                        style={{ width: "350px", height: "350px", marginBottom: "10px" }}
                    />
                    <div
                        style={{
                            fontSize: "36px",
                            fontWeight: "bold",
                            color: "black",
                            letterSpacing: "2px",
                        }}
                    >
                        VERIFIED
                    </div>
                </div>

                {/* ✅ Applicant Details Table */}
                <table
                    className="student-table"
                    style={{
                        borderCollapse: "collapse",
                        fontFamily: "Times New Roman",
                        fontSize: "15px",
                        width: "8in",
                        margin: "0 auto",
                        tableLayout: "fixed",
                    }}
                >
                    <tbody>
                        {/* Applicant Number */}
                        <tr>
                            <td colSpan={40}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-start",
                                        width: "100%",
                                        gap: "10px",
                                    }}
                                >
                                    <label style={{ fontWeight: "bold", whiteSpace: "nowrap" }}>
                                        Applicant No.:
                                    </label>
                                    <div
                                        style={{
                                            borderBottom: "1px solid black",
                                            fontFamily: "Arial",
                                            minWidth: "220px",
                                            height: "1.2em",
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        {person?.applicant_number}
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Name + Permit No. */}
                        <tr>
                            <td colSpan={20}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                        Name:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            fontFamily: "Arial",
                                            minWidth: "250px",
                                        }}
                                    >
                                        {person?.last_name?.toUpperCase()}, {person?.first_name?.toUpperCase()}{" "}
                                        {person?.middle_name?.toUpperCase() || ""}{" "}
                                        {person?.extension?.toUpperCase() || ""}
                                    </span>
                                </div>
                            </td>
                            <td colSpan={20}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                        Permit No.:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            minWidth: "200px",
                                            fontFamily: "Arial",
                                        }}
                                    >
                                        {person?.applicant_number}
                                    </span>
                                </div>
                            </td>
                        </tr>

                        {/* Course + Major */}
                        <tr>
                            <td colSpan={20}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                        Course Applied:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            minWidth: "220px",
                                            fontFamily: "Arial",
                                        }}
                                    >
                                        {curriculumOptions.find(
                                            (c) =>
                                                c.curriculum_id?.toString() === (person?.program ?? "").toString()
                                        )?.program_description || ""}
                                    </span>
                                </div>
                            </td>
                            <td colSpan={20}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px", marginBottom: "-20px" }}>
                                        Major:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            minWidth: "200px",
                                            fontFamily: "Arial",
                                            marginBottom: "-15px"
                                        }}
                                    >
                                        {curriculumOptions.find(
                                            (c) =>
                                                c.curriculum_id?.toString() === (person?.program ?? "").toString()
                                        )?.major || ""}
                                    </span>
                                </div>
                            </td>
                        </tr>

                        {/* Date of Exam + Time */}
                        <tr>
                            <td colSpan={20}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                        Date of Exam:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            fontFamily: "Arial",
                                        }}
                                    >
                                        {examSchedule?.date_of_exam}
                                    </span>
                                </div>
                            </td>
                            <td colSpan={20}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                        Time:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            fontFamily: "Arial",
                                        }}
                                    >
                                        {examSchedule
                                            ? new Date(`1970-01-01T${examSchedule.start_time}`).toLocaleTimeString(
                                                "en-US",
                                                { hour: "numeric", minute: "2-digit", hour12: true }
                                            )
                                            : ""}
                                    </span>
                                </div>
                            </td>
                        </tr>

                        {/* Building + Room + QR */}
                        <tr>
                            <td colSpan={20}>
                                <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "-83px" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                        Bldg.:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            fontFamily: "Arial",
                                        }}
                                    >
                                        {examSchedule?.building_description || ""}
                                    </span>
                                </div>
                            </td>
                            <td colSpan={20}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        width: "100%",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", marginTop: "-135px" }}>
                                        <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                            Room No.:
                                        </label>
                                        <span
                                            style={{
                                                flexGrow: 1,
                                                borderBottom: "1px solid black",
                                                fontFamily: "Arial",
                                                width: "150px",
                                            }}
                                        >
                                            {examSchedule?.room_description || ""}
                                        </span>
                                    </div>

                                    {person?.applicant_number && (
                                        <div
                                            style={{
                                                width: "4.5cm", // same as profile box
                                                height: "4.5cm",

                                                borderRadius: "4px",
                                                background: "#fff",       // ✅ white background
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                position: "relative",
                                                overflow: "hidden",
                                                marginLeft: "10px" // spacing from "Room No."
                                            }}
                                        >
                                            <QRCodeSVG
                                                value={`${API_BASE_URL}/applicant_profile/${person.applicant_number}`}
                                                size={150}
                                                level="H"
                                            />

                                            {/* ✅ Applicant Number Overlay in Middle */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    color: "maroon",
                                                    background: "white", // white backdrop so text doesn’t blend into QR
                                                    padding: "2px 4px",
                                                    borderRadius: "2px",
                                                }}
                                            >
                                                {person.applicant_number}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </td>
                        </tr>

                        {/* Scheduled By */}
                        <tr>
                            <td colSpan={40}>
                                <div style={{ display: "flex", alignItems: "center", width: "50%", marginTop: "-125px" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                        Scheduled by:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            fontFamily: "Arial",
                                        }}
                                    >
                                        {scheduledBy || "N/A"}
                                    </span>
                                </div>
                            </td>
                        </tr>

                        {/* Date */}
                        <tr>
                            <td colSpan={40}>
                                <div style={{ display: "flex", alignItems: "center", width: "50%", marginTop: "-150px" }}>
                                    <label style={{ fontWeight: "bold", marginRight: "10px" }}>
                                        Date:
                                    </label>
                                    <span
                                        style={{
                                            flexGrow: 1,
                                            borderBottom: "1px solid black",
                                            fontFamily: "Arial",
                                        }}
                                    >
                                        {examSchedule?.schedule_created_at
                                            ? new Date(examSchedule.schedule_created_at).toLocaleDateString(
                                                "en-US",
                                                { month: "long", day: "numeric", year: "numeric" }
                                            )
                                            : ""}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table
                    className="student-table"
                    style={{

                        borderCollapse: "collapse",
                        fontFamily: "Arial, Helvetica, sans-serif",
                        width: "8in",
                        margin: "0 auto", // Center the table inside the form
                        textAlign: "center",
                        tableLayout: "fixed",
                        border: "1px solid black"
                    }}
                >
                    <tbody>
                        <tr>
                            <td
                                colSpan={40}
                                style={{
                                    textAlign: "justify",
                                    color: "black",
                                    padding: "8px",
                                    lineHeight: "1.5",
                                    textAlign: "Center",

                                    fontSize: "14px",
                                    fontFamily: "Arial, Helvetica, sans-serif",

                                    fontWeight: "200px"
                                }}
                            >
                                <strong>
                                    <div>NOTE: Please bring this examination permit on the examination day together with</div>
                                    <div>Two short bond paper, pencil w/ erasers & ballpen. Please come on decent attire</div>
                                    <div>(no sleeveless or shorts) at least 1 hour before the examination</div>
                                </strong>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ApplicantProfilePermit;