import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../PROJECT_styles.css";

/**
 * TrainerLogin - Login page for Trainers
 * Separates trainer authentication from admin/student
 */
const TrainerLogin = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:8081/api/trainer/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });

            const data = await res.json();

            if (res.ok && data.trainer) {
                localStorage.setItem("trainer", JSON.stringify(data.trainer));
                localStorage.setItem("userRole", "TRAINER");
                navigate("/trainer-dashboard");
            } else {
                setError(data.message || "Invalid credentials");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="auth-logo" style={{ position: 'absolute', top: '30px', left: '40px' }}>
                <img src="/logo.png" alt="Career Credentials" />
            </div>

            <div className="auth-container" style={{ maxWidth: '450px', width: '100%', padding: '0 20px' }}>
                <div className="auth-card" style={{ padding: '50px 40px', borderRadius: '24px', background: 'white' }}>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', textAlign: 'center', marginBottom: '10px', color: '#1a202c' }}>
                        👨‍🏫 Trainer Login
                    </h1>
                    <p style={{ textAlign: 'center', color: '#718096', marginBottom: '35px' }}>
                        Access your trainer dashboard
                    </p>

                    {error && (
                        <div style={{ background: '#fed7d7', color: '#c53030', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="trainer@example.com"
                                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '16px' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4a5568' }}>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                                placeholder="••••••••"
                                style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1.5px solid #e2e8f0', fontSize: '16px' }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ width: '100%', height: '52px', borderRadius: '14px', fontSize: '16px', fontWeight: '700' }}
                        >
                            {loading ? "Logging in..." : "Login as Trainer"}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '25px' }}>
                        <span style={{ color: '#718096' }}>Not a trainer? </span>
                        <a href="/login" style={{ color: '#3182ce', fontWeight: '600', textDecoration: 'none' }}>
                            Student Login
                        </a>
                    </div>
                </div>
            </div>

            <p className="auth-footer" style={{ position: 'absolute', bottom: '30px' }}>© 2025 Career Credentials</p>
        </div>
    );
};

export default TrainerLogin;
