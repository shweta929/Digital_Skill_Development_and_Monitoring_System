import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import "../PROJECT_styles.css";

const FeedbackPage = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [newFeedback, setNewFeedback] = useState({
        category: "",
        rating: 5,
        comment: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(true);

    const student = JSON.parse(localStorage.getItem("student"));

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch("/api/students/feedback");
            const data = await res.json();
            if (res.ok) {
                setFeedbacks(data);
            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newFeedback.category || !newFeedback.comment.trim()) {
            alert("Please fill all fields!");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/students/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: student?._id || student?.id || localStorage.getItem("studentId"),
                    email: student?.email,
                    feedbackText: `[${newFeedback.category}] ${newFeedback.comment}`,
                    rating: newFeedback.rating
                }),
            });

            if (res.ok) {
                // Reset form
                setNewFeedback({ category: "", rating: 5, comment: "" });
                setShowForm(false);
                fetchFeedbacks();
                alert("✅ Thank you for your feedback!");
            } else {
                alert("❌ Failed to submit feedback.");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("❌ Server error.");
        } finally {
            setSubmitting(false);
        }
    };

    const categories = [
        "Course Content",
        "Mentorship Session",
        "Platform Experience",
        "Career Guidance",
        "Technical Support",
        "Other",
    ];

    return (
        <div className="auth-page">
            <BackButton />
            <div className="auth-logo">
                <img src="/logo.png" alt="Career Credentials" />
            </div>

            <div className="auth-container" style={{ maxWidth: "700px" }}>
                <div className="colorful-card auth-card">
                    <h3 className="text-center">Feedback Center</h3>
                    <p className="subtitle">Your feedback helps us evolve</p>

                    <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                        <button
                            className={showForm ? "btn-primary" : "btn-outline-primary"}
                            onClick={() => setShowForm(true)}
                            style={{ flex: 1, height: '50px' }}
                        >
                            Give Feedback
                        </button>
                        <button
                            className={!showForm ? "btn-primary" : "btn-outline-primary"}
                            onClick={() => setShowForm(false)}
                            style={{ flex: 1, height: '50px' }}
                        >
                            Recent Feedbacks ({feedbacks.length})
                        </button>
                    </div>

                    {showForm ? (
                        <form onSubmit={handleSubmit}>
                            <div className="input-wrapper">
                                <label className="form-label">Category</label>
                                <select
                                    className="form-select"
                                    value={newFeedback.category}
                                    onChange={(e) => setNewFeedback({ ...newFeedback, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map((cat, idx) => (
                                        <option key={idx} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="input-wrapper">
                                <label className="form-label">Rating</label>
                                <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: '10px 0' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span
                                            key={star}
                                            onClick={() => setNewFeedback({ ...newFeedback, rating: star })}
                                            style={{
                                                fontSize: "32px",
                                                cursor: "pointer",
                                                color: star <= newFeedback.rating ? "#fbbf24" : "#e2e8f0",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                    <span style={{ marginLeft: "10px", color: "#64748b", fontWeight: '600' }}>{newFeedback.rating} / 5</span>
                                </div>
                            </div>

                            <div className="input-wrapper">
                                <label className="form-label">Your Message</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Tell us what's on your mind..."
                                    value={newFeedback.comment}
                                    onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn-primary w-100"
                                disabled={submitting}
                                style={{ marginTop: '20px' }}
                            >
                                {submitting ? "Submitting..." : "Submit Feedback"}
                            </button>
                        </form>
                    ) : (
                        <div className="feedbacks-list" style={{ maxHeight: "450px", overflowY: "auto" }}>
                            {feedbacks.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "40px" }}>
                                    <p style={{ color: "#94a3b8" }}>No feedback submitted yet.</p>
                                </div>
                            ) : (
                                feedbacks.map((fb, idx) => (
                                    <div key={idx} style={{ background: "#f8fafc", padding: "20px", borderRadius: "16px", marginBottom: "15px", border: '1px solid #edf2f7' }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                                            <span style={{ color: "#fbbf24", fontSize: "18px" }}>{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</span>
                                            <small style={{ color: "#94a3b8" }}>{new Date(fb.createdAt).toLocaleDateString()}</small>
                                        </div>
                                        <p style={{ margin: 0, color: "#334155", lineHeight: 1.6, fontWeight: '500' }}>{fb.comment}</p>
                                        <p style={{ marginTop: '10px', fontSize: '13px', color: '#64748b' }}>— {fb.studentName}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <button className="btn-primary dashboard-btn" onClick={() => navigate("/welcome")}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
                <p className="auth-footer">© 2025 Career Credentials</p>
            </div>
        </div>
    );
};

export default FeedbackPage;
