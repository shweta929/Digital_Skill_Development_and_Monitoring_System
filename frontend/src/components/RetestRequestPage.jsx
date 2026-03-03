import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import "../PROJECT_styles.css";

/**
 * RetestRequestPage - Student can request a retest after taking the initial test
 */
const RetestRequestPage = () => {
    const navigate = useNavigate();
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'pending', 'approved', 'rejected'
    const [canTakeTest, setCanTakeTest] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    const student = JSON.parse(localStorage.getItem("student"));

    useEffect(() => {
        if (!student) {
            navigate("/login");
            return;
        }

        checkRetestStatus();
    }, [student, navigate]);

    const checkRetestStatus = async () => {
        try {
            // Check if student can take test
            const canTakeRes = await fetch(`/api/students/can-take/${student.id}`);
            if (canTakeRes.ok) {
                const data = await canTakeRes.json();
                setCanTakeTest(data.canTakeTest);
            }
        } catch (err) {
            console.error("Error checking status:", err);
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert("Please provide a reason for retest");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/students/retest/request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: student.id,
                    reason: reason
                })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                alert("✅ Retest request submitted! A trainer will review your request.");
                setStatus("pending");
            } else {
                alert(data.message || "Failed to submit request");
            }
        } catch (err) {
            console.error("Error submitting request:", err);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <div className="auth-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Checking your test status...</p>
            </div>
        );
    }

    return (
        <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
            <BackButton />

            <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
                <div className="auth-logo" style={{ marginBottom: '30px' }}>
                    <img src="/logo.png" alt="Career Credentials" />
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a202c', marginBottom: '15px' }}>
                    🔄 Request Retest
                </h1>

                {canTakeTest ? (
                    <div className="colorful-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ color: '#2d3748', marginBottom: '15px' }}>You Can Take the Test!</h2>
                        <p style={{ color: '#718096', marginBottom: '25px' }}>
                            You are approved to take the career assessment.
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => navigate("/test")}
                            style={{ padding: '14px 40px', borderRadius: '12px' }}
                        >
                            Start Assessment →
                        </button>
                    </div>
                ) : status === "pending" ? (
                    <div className="colorful-card" style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                        <h2 style={{ color: '#2d3748', marginBottom: '15px' }}>Request Pending</h2>
                        <p style={{ color: '#718096' }}>
                            Your retest request is being reviewed by a trainer.
                            You will be notified once it's approved.
                        </p>
                    </div>
                ) : (
                    <div className="colorful-card" style={{ padding: '40px' }}>
                        <p style={{ color: '#718096', marginBottom: '30px' }}>
                            You have already taken the career assessment. If you want to retake it,
                            please submit a request explaining why.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontWeight: '600', marginBottom: '10px', color: '#4a5568' }}>
                                    Reason for Retest
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Explain why you need to retake the assessment..."
                                    rows={4}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: '12px',
                                        border: '1.5px solid #e2e8f0',
                                        fontSize: '16px',
                                        resize: 'vertical'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={loading}
                                style={{ width: '100%', height: '50px', borderRadius: '14px' }}
                            >
                                {loading ? "Submitting..." : "Submit Retest Request"}
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <p className="auth-footer" style={{ marginTop: '60px' }}>© 2025 Career Credentials</p>
        </div>
    );
};

export default RetestRequestPage;
