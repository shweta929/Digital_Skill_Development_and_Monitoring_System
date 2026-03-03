import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../PROJECT_styles.css";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [showAIChat, setShowAIChat] = useState(false);

  // ✅ You saved student data as "student" in Login.js
  const student = JSON.parse(localStorage.getItem("student"));

  const dashboardCards = [
    { title: "Give Test", icon: "📝", route: "/test", color: "#667eea" },
    { title: "1-on-1 Mentorship", icon: "🤝", route: "/mentorship", color: "#764ba2" },
    { title: "Give Feedback", icon: "💬", route: "/feedback", color: "#f093fb" },
    { title: "Live & Recorded Sessions", icon: "🎥", route: "/sessions", color: "#4facfe" },
    { title: "Resume Maker", icon: "📄", route: "/resume", color: "#43e97b" },
    { title: "Placement CRM", icon: "💼", route: "/crm", color: "#fa709a" },
  ];

  const handleCardClick = (route) => {
    if (route === "/resume") {
      // Open SmartResumeBuilder in new tab with student data
      const studentName = encodeURIComponent(student?.fullName || "");
      const studentEmail = encodeURIComponent(student?.email || "");
      window.open(`http://localhost:5002?name=${studentName}&email=${studentEmail}`, "_blank");
    } else {
      navigate(route);
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

      {/* Welcome Card */}
      <div className="auth-container">
        <div className="colorful-card auth-card register-card" style={{ maxWidth: "900px" }}>
          <h2 className="text-center mb-2">Welcome 🎉</h2>

          <p className="text-center subtitle" style={{ marginBottom: "20px" }}>
            Hello <b>{student?.fullName || "Student"}</b>,<br />
            Welcome to your Career Credentials Dashboard!
          </p>

          {/* Dashboard Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "20px",
            }}
          >
            {dashboardCards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => handleCardClick(card.route)}
                style={{
                  background: `linear-gradient(135deg, ${card.color}20, ${card.color}10)`,
                  border: `2px solid ${card.color}30`,
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 8px 25px ${card.color}30`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "10px" }}>{card.icon}</div>
                <h4 style={{ margin: 0, color: "#333", fontSize: "14px" }}>{card.title}</h4>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="register-grid">
            <div className="full-width">
              <div
                style={{
                  padding: "12px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.6)",
                  textAlign: "center",
                  fontSize: "14px",
                }}
              >
                ✅ Start with the Career Assessment Test to discover your ideal path!
              </div>
            </div>

            <div className="full-width">
              <button
                className="btn btn-primary w-100"
                onClick={() => navigate("/test")}
              >
                📝 Take Career Test Now
              </button>
            </div>

            <div className="full-width">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => navigate("/education")}
              >
                ✍️ Update Education Details
              </button>
            </div>

            <div className="full-width">
              <button
                className="btn btn-danger w-100"
                onClick={() => {
                  localStorage.removeItem("student");
                  localStorage.removeItem("studentId");
                  localStorage.removeItem("studentName");
                  localStorage.removeItem("studentEmail");
                  navigate("/login");
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        <p className="auth-footer">© 2025 Career Credentials</p>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div
            className="colorful-card welcome-popup-content"
            style={{
              maxWidth: '500px',
              padding: '50px',
              animation: 'slideUp 0.5s ease'
            }}
          >
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ marginBottom: '10px' }}>Welcome Back!</h2>
            <p className="subtitle">
              Hello <b>{student?.fullName || student?.name}</b>,<br />
              Your personalized career path is ready!
            </p>

            <div
              style={{
                background: 'rgba(102, 126, 234, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                margin: '25px 0',
                border: '1px dashed #667eea'
              }}
            >
              <span style={{ fontSize: '14px', color: '#718096' }}>Recommended Domain:</span>
              <h3 style={{ margin: '5px 0 0 0', color: '#667eea' }}>
                👉 {student?.domain || "In Progress"}
              </h3>
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={() => {
                setShowWelcomeModal(false);
                navigate("/sessions");
              }}
            >
              Explore Sessions 🚀
            </button>

            <button
              className="btn btn-outline-primary w-100 mt-2"
              onClick={() => setShowWelcomeModal(false)}
              style={{ border: 'none' }}
            >
              Take me to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Floating AI Assistant Button */}
      <div
        onClick={() => navigate("/ai-assistant")}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
          transition: "all 0.3s ease",
          zIndex: 1000,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        title="AI Career Assistant"
      >
        <img
          src="/chatbot.png"
          alt="AI Assistant"
          style={{ width: "35px", height: "35px" }}
        />
      </div>
    </div>
  );
};

export default WelcomePage;

