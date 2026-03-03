import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiCalendar } from "react-icons/fi";
import BackButton from "./BackButton";
import "../PROJECT_styles.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    mobile: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    try {
      const res = await fetch("/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          gender: formData.gender,
          dob: formData.dob,
          mobile: formData.mobile,
          email: formData.email,
          address: formData.address,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Registration failed ❌");
        return;
      }

      alert("Registered successfully ✅");
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("Server error ❌");
    }
  };

  return (
    <div className="auth-page">
      <BackButton />
      <div className="auth-logo">
        <img src="/logo.png" alt="Career Credentials" />
      </div>

      <div className="auth-container" style={{ maxWidth: "700px" }}>
        <div className="colorful-card auth-card">
          <h3 className="text-center">Create Account</h3>
          <p className="subtitle">Join thousands of students on our platform</p>

          <form className="register-grid" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                placeholder="John Doe"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrapper">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="input-wrapper">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrapper">
              <label className="form-label">Mobile No</label>
              <input
                className="form-control"
                placeholder="10-digit mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrapper full-width">
              <label className="form-label">Email ID</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrapper full-width">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Building, Street, City..."
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrapper">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Create password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-wrapper">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Repeat password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="full-width mt-4">
              <button type="submit" className="btn-primary w-100">
                Create Account
              </button>
            </div>
          </form>

          <p className="auth-footer-text">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
        <p className="auth-footer">© 2025 Career Credentials</p>
      </div>
    </div>
  );
};

export default Register;
