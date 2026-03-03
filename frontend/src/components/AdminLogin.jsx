import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../PROJECT_styles.css";

const AdminLogin = () => {
    const navigate = useNavigate();

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
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Admin login failed ❌");
                return;
            }

            // ✅ Save admin session
            localStorage.setItem("admin", JSON.stringify(data.admin));

            alert("Admin Login Successful ✅");
            navigate("/admin-dashboard");
        } catch (error) {
            console.error(error);
            alert("Server error ❌");
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

            {/* Card */}
            <div className="auth-container">
                <div className="colorful-card auth-card">
                    <h3 className="text-center mb-3">Admin Login</h3>
                    <p className="subtitle text-center">
                        Login to CRM Dashboard
                    </p>

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Admin Email</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="21_shruti.shimpi@ges-coengg.org"
                                name="email"
                                value={loginData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
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

                        <button type="submit" className="btn btn-primary w-100">
                            Login to CRM
                        </button>
                    </form>
                </div>

                <p className="auth-footer">© 2025 Carrier Credentials</p>
            </div>
        </div>
    );
};

export default AdminLogin;
