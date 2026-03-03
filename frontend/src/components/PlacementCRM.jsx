import React from "react";
import { useNavigate } from "react-router-dom";
import "../PROJECT_styles.css";

const PlacementCRM = () => {
    const navigate = useNavigate();
    const student = JSON.parse(localStorage.getItem("student"));

    return (
        <div className="auth-page">
            {/* Logo */}
            <div className="auth-logo">
                <img
                    src="/logo.png"
                    alt="Career Credentials"
                />
            </div>

            {/* CRM Card */}
            <div className="auth-container">
                <div
                    className="colorful-card auth-card register-card"
                    style={{ maxWidth: "600px", textAlign: "center" }}
                >
                    {/* Welcome Icon */}
                    <div
                        style={{
                            width: "100px",
                            height: "100px",
                            background: "linear-gradient(135deg, #667eea, #764ba2)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                            fontSize: "48px",
                        }}
                    >
                        💼
                    </div>

                    <h2 style={{ marginBottom: "12px" }}>Welcome to Placement CRM</h2>

                    <p style={{ color: "#666", marginBottom: "24px" }}>
                        Hello <b>{student?.fullName || "Student"}</b>! 👋
                    </p>

                    <div
                        style={{
                            background: "rgba(255,255,255,0.7)",
                            padding: "24px",
                            borderRadius: "14px",
                            marginBottom: "24px",
                        }}
                    >
                        <h4 style={{ color: "#667eea", marginBottom: "16px" }}>
                            🚀 Your Placement Journey Starts Here
                        </h4>
                        <p style={{ color: "#555", lineHeight: "1.8" }}>
                            The Placement CRM module is designed to help you track and manage
                            your placement opportunities. Stay tuned for exciting features
                            including:
                        </p>

                        <ul
                            style={{
                                textAlign: "left",
                                marginTop: "16px",
                                paddingLeft: "20px",
                                color: "#555",
                            }}
                        >
                            <li style={{ marginBottom: "8px" }}>📊 Company Tracking Dashboard</li>
                            <li style={{ marginBottom: "8px" }}>📝 Application Status Management</li>
                            <li style={{ marginBottom: "8px" }}>📅 Interview Scheduling</li>
                            <li style={{ marginBottom: "8px" }}>💰 Offer Comparison Tools</li>
                            <li style={{ marginBottom: "8px" }}>📈 Placement Analytics</li>
                        </ul>
                    </div>

                    <div
                        style={{
                            background: "linear-gradient(135deg, #fff3cd, #ffeeba)",
                            padding: "16px",
                            borderRadius: "12px",
                            marginBottom: "24px",
                        }}
                    >
                        <span style={{ fontSize: "24px" }}>🔜</span>
                        <p style={{ margin: "8px 0 0 0", color: "#856404" }}>
                            <b>Coming Soon!</b> We're working hard to bring you the best
                            placement management experience.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="register-grid">
                        <div className="full-width">
                            <button
                                className="btn btn-primary w-100"
                                onClick={() => navigate("/welcome")}
                                style={{ padding: "14px" }}
                            >
                                ← Back to Student Dashboard
                            </button>
                        </div>
                    </div>
                </div>

                <p className="auth-footer">© 2025 Career Credentials</p>
            </div>
        </div>
    );
};

export default PlacementCRM;
