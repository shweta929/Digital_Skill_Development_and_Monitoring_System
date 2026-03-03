import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../PROJECT_styles.css";

const MentorshipPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [meetingInfo, setMeetingInfo] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedback, setFeedback] = useState("");

    const student = JSON.parse(localStorage.getItem("student"));
    const studentId = localStorage.getItem("studentId");

    // Fetch existing meetings on load
    useEffect(() => {
        if (studentId) {
            fetchMeetings();
        }
    }, [studentId]);

    const fetchMeetings = async () => {
        try {
            const studentEmail = student?.email || localStorage.getItem("studentEmail");
            const res = await fetch(`/api/meetings/list?email=${studentEmail}`);
            if (res.ok) {
                const data = await res.json();
                setMeetings(data || []); // API returns array directly
            }
        } catch (error) {
            console.error("Error fetching meetings:", error);
        }
    };

    const handleSchedule = async () => {
        if (!studentId) {
            setMessage("❌ Please login first to schedule a meeting.");
            return;
        }

        setLoading(true);
        setMessage("🔄 Scheduling your meeting with our expert trainer...");

        try {
            const response = await fetch("/api/meetings/smart-auto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentId,
                    email: student?.email,
                    name: student?.fullName,
                    note: "Requested via Career Portal One-on-One Meeting feature",
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setMeetingInfo(data.meeting);
                setMessage("");
                fetchMeetings();
            } else {
                setMessage(`❌ ${data.error || "Failed to schedule meeting"}`);
            }
        } catch (error) {
            console.error("Error scheduling meeting:", error);
            setMessage("❌ Unable to connect to mentorship service. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmit = async (meetingId) => {
        if (!feedback.trim()) {
            alert("Please enter your feedback!");
            return;
        }

        try {
            // Store feedback locally for now (can be connected to feedback backend)
            const feedbackData = {
                meetingId,
                studentId,
                studentName: student?.fullName,
                feedback,
                submittedAt: new Date().toISOString(),
            };

            // Save to localStorage as backup
            const existingFeedbacks = JSON.parse(localStorage.getItem("feedbacks") || "[]");
            existingFeedbacks.push(feedbackData);
            localStorage.setItem("feedbacks", JSON.stringify(existingFeedbacks));

            alert("✅ Thank you for your feedback!");
            setShowFeedback(false);
            setFeedback("");
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("❌ Failed to submit feedback.");
        }
    };

    return (
        <div className="auth-page">
            {/* Logo */}
            <div className="auth-logo">
                <img
                    src="/logo.png"
                    alt="Career Credentials"
                />
            </div>

            {/* Mentorship Card */}
            <div className="auth-container">
                <div
                    className="colorful-card auth-card register-card"
                    style={{ maxWidth: "700px" }}
                >
                    <h3 className="text-center mb-2">🤝 1-on-1 Mentorship</h3>
                    <p className="text-center subtitle" style={{ marginBottom: "20px" }}>
                        Schedule a personalized session with our expert career mentor
                    </p>

                    {!success ? (
                        <>
                            {/* Schedule Section */}
                            <div
                                style={{
                                    background: "rgba(255,255,255,0.6)",
                                    padding: "20px",
                                    borderRadius: "14px",
                                    marginBottom: "16px",
                                    textAlign: "center",
                                }}
                            >
                                <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎯</div>
                                <h4>Ready for Career Guidance?</h4>
                                <p style={{ color: "#666", marginBottom: "16px" }}>
                                    Our expert trainers are here to help you navigate your career path.
                                    Book a one-on-one session now!
                                </p>

                                <button
                                    className={`btn btn-primary w-100 ${loading ? "disabled" : ""}`}
                                    onClick={handleSchedule}
                                    disabled={loading}
                                    style={{ padding: "14px" }}
                                >
                                    {loading ? "⏳ Scheduling..." : "📅 Schedule One-on-One Meeting"}
                                </button>

                                {message && (
                                    <p
                                        style={{
                                            marginTop: "12px",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            background: message.includes("❌") ? "#fee" : "#efe",
                                        }}
                                    >
                                        {message}
                                    </p>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success Section */}
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #d4edda, #c3e6cb)",
                                    padding: "20px",
                                    borderRadius: "14px",
                                    marginBottom: "16px",
                                    textAlign: "center",
                                }}
                            >
                                <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
                                <h4 style={{ color: "#155724" }}>Meeting Scheduled Successfully!</h4>
                                <p style={{ color: "#155724", marginBottom: "8px" }}>
                                    Your meeting is scheduled for:
                                </p>
                                <p
                                    style={{
                                        fontSize: "18px",
                                        fontWeight: "bold",
                                        color: "#155724",
                                        padding: "10px",
                                        background: "rgba(255,255,255,0.5)",
                                        borderRadius: "8px",
                                    }}
                                >
                                    {meetingInfo?.finalDate || "Check your email for details"}
                                </p>
                                {meetingInfo?.meetLink && (
                                    <div style={{ marginTop: "15px" }}>
                                        <a
                                            href={meetingInfo.meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary"
                                            style={{ background: '#28a745', border: 'none', padding: '10px 20px' }}
                                        >
                                            🚀 Join Google Meet
                                        </a>
                                    </div>
                                )}
                                <p style={{ color: "#666", marginTop: "12px", fontSize: "14px" }}>
                                    📧 A calendar invite has been sent to your email!
                                </p>
                            </div>

                            {/* Cute Alert */}
                            <div
                                style={{
                                    background: "linear-gradient(135deg, #fff3cd, #ffeeba)",
                                    padding: "16px",
                                    borderRadius: "14px",
                                    marginBottom: "16px",
                                    textAlign: "center",
                                    border: "2px dashed #ffc107",
                                }}
                            >
                                <span style={{ fontSize: "24px" }}>⏳</span>
                                <p style={{ margin: "8px 0 0 0", color: "#856404" }}>
                                    Your meeting is scheduled at <b>{meetingInfo?.finalDate || "the scheduled time"}</b>.
                                </p>
                                {meetingInfo?.meetLink && (
                                    <p style={{ marginTop: "10px" }}>
                                        <b>Link:</b> <a href={meetingInfo.meetLink} target="_blank" rel="noopener noreferrer">{meetingInfo.meetLink}</a>
                                    </p>
                                )}
                            </div>

                            <button
                                className="btn btn-success w-100"
                                onClick={() => {
                                    setSuccess(false);
                                    setMeetingInfo(null);
                                }}
                                style={{ marginBottom: "12px" }}
                            >
                                📅 Schedule Another Meeting
                            </button>
                        </>
                    )}

                    {/* Previous Meetings */}
                    {meetings.length > 0 && (
                        <div
                            style={{
                                background: "rgba(255,255,255,0.6)",
                                padding: "16px",
                                borderRadius: "14px",
                                marginBottom: "16px",
                            }}
                        >
                            <h5>📋 Your Meetings</h5>
                            {meetings.slice(0, 3).map((meeting, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: "12px",
                                        background: "white",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <div>
                                        <p style={{ margin: 0, fontWeight: "600" }}>
                                            {meeting.status === "completed" ? "✅" : "⏳"} {meeting.dateTime || meeting.finalDate}
                                        </p>
                                        <small style={{ color: "#666", display: 'block', marginBottom: '4px' }}>
                                            Status: {meeting.status || "Scheduled"}
                                        </small>
                                        {meeting.meetLink && meeting.status !== "completed" && (
                                            <a
                                                href={meeting.meetLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: '12px', color: '#007bff', fontWeight: 'bold' }}
                                            >
                                                🔗 Join Meeting
                                            </a>
                                        )}
                                    </div>
                                    {meeting.status === "completed" && (
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => setShowFeedback(meeting._id || idx)}
                                        >
                                            Give Feedback
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Feedback Modal */}
                    {showFeedback && (
                        <div
                            style={{
                                background: "rgba(255,255,255,0.95)",
                                padding: "20px",
                                borderRadius: "14px",
                                marginBottom: "16px",
                                border: "2px solid #667eea",
                            }}
                        >
                            <h5>💬 Share Your Feedback</h5>
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="How was your mentorship session? Share your experience..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                style={{ marginBottom: "12px" }}
                            />
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleFeedbackSubmit(showFeedback)}
                                >
                                    Submit Feedback
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => {
                                        setShowFeedback(false);
                                        setFeedback("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="register-grid">
                        <div className="full-width">
                            <button
                                className="btn btn-outline-primary w-100"
                                onClick={() => navigate("/welcome")}
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                <p className="auth-footer">© 2025 Career Credentials</p>
            </div>
        </div>
    );
};

export default MentorshipPage;
