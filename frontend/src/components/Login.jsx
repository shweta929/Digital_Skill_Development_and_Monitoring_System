import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";
import BackButton from "./BackButton";
import "../PROJECT_styles.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Determine endpoint based on selected role
      const isAdmin = role === "admin";
      const endpoint = isAdmin
        ? "/api/admin/login"
        : "/api/students/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || (isAdmin ? "Admin login failed ❌" : "Login failed ❌"));
        return;
      }

      if (isAdmin) {
        // ✅ Admin Login Success
        alert("Admin Login Successful ✅");
        const adminWithRole = { ...data.admin, role: "ADMIN" };
        localStorage.setItem("admin", JSON.stringify(adminWithRole));
        localStorage.setItem("userRole", "ADMIN");
        navigate("/admin-dashboard");
      } else {
        // ✅ Student Login Success  
        alert("Login Successful ✅");
        localStorage.setItem("studentId", data.student.id);
        localStorage.setItem("studentName", data.student.fullName);
        localStorage.setItem("studentEmail", data.student.email);
        const studentWithRole = { ...data.student, role: "STUDENT" };
        localStorage.setItem("student", JSON.stringify(studentWithRole));
        localStorage.setItem("userRole", "STUDENT");

        // For one-time welcome popup
        sessionStorage.setItem("showWelcome", "true");
        navigate("/welcome");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="auth-page">
      <BackButton />
      <div className="auth-logo">
        <img src="/logo.png" alt="Career Credentials" />
      </div>

      <div className="auth-container">
        <div className="colorful-card auth-card">
          <h3>{role === 'admin' ? '🔐 Admin Login' : 'Login'}</h3>
          <p className="subtitle">
            {role === 'admin'
              ? 'Sign in to the Admin Dashboard'
              : 'Sign in to your Career Credentials account'}
          </p>

          <form onSubmit={handleLogin}>
            <div className="input-wrapper">
              <label className="form-label">Email ID</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrapper">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-options">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" name="remember" />
                <span style={{ color: '#666' }}>Remember me</span>
              </label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <button type="submit" className="btn-primary w-100">
              Login
            </button>

            <p className="auth-footer-text">
              Don’t have an account? <Link to="/register">Register</Link>
            </p>

            <div className="text-center mt-3">
              <button
                type="button"
                style={{ border: 'none', background: 'none', color: '#718096', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setRole(role === 'student' ? 'admin' : 'student')}
              >
                Switch to {role === 'student' ? 'Admin' : 'Student'} Login
              </button>
            </div>
          </form>
        </div>
        <p className="auth-footer">© 2025 Career Credentials</p>
      </div>
    </div>
  );
};

export default Login;
