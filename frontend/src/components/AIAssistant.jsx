import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../PROJECT_styles.css";

const AIAssistant = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "👋 Hello! I'm your Career AI Assistant. How can I help you today? Ask me about career paths, skills, or get a personalized roadmap!",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const messagesEndRef = useRef(null);

    const location = useLocation();
    const contextStudent = location.state?.student;
    const student = contextStudent || JSON.parse(localStorage.getItem("student"));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: input }),
            });

            const data = await res.json();
            const aiResponse = {
                role: "assistant",
                content: data.answer || "Sorry, I couldn't process that. Please try again.",
            };
            setMessages((prev) => [...prev, aiResponse]);

            // Check if response looks like a roadmap
            if (
                input.toLowerCase().includes("roadmap") ||
                input.toLowerCase().includes("career path") ||
                input.toLowerCase().includes("how to become")
            ) {
                setRoadmap(data.answer);
            }
        } catch (error) {
            console.error("AI Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "❌ Unable to connect to AI service. Please ensure the AI backend is running.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailRoadmap = async () => {
        if (!roadmap || !student?.email) {
            alert("No roadmap to send or student email not found!");
            return;
        }

        try {
            const res = await fetch("/api/ai/email-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: student.email,
                    name: student.fullName || "Student",
                    roadmap: roadmap,
                }),
            });

            const data = await res.json();
            if (data.message) {
                alert("✅ Roadmap sent to your email successfully!");
            } else {
                alert("❌ Failed to send email: " + (data.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Email Error:", error);
            alert("❌ Failed to send email. Please try again.");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
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

            {/* AI Chat Card */}
            <div className="auth-container">
                <div
                    className="colorful-card auth-card"
                    style={{ maxWidth: "800px", minHeight: "500px" }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                        <img
                            src="/chatbot.png"
                            alt="AI"
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                        />
                        <h3 style={{ margin: 0 }}>🤖 Career AI Assistant</h3>
                    </div>

                    {/* Messages Container */}
                    <div
                        style={{
                            background: "var(--input-bg)",
                            borderRadius: "14px",
                            padding: "16px",
                            height: "300px",
                            overflowY: "auto",
                            marginBottom: "16px",
                        }}
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: "flex",
                                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                    marginBottom: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        maxWidth: "75%",
                                        padding: "10px 14px",
                                        borderRadius: "12px",
                                        background:
                                            msg.role === "user"
                                                ? "linear-gradient(135deg, #667eea, #764ba2)"
                                                : "var(--card-bg)",
                                        color: msg.role === "user" ? "white" : "var(--text-primary)",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                        whiteSpace: "pre-wrap",
                                        border: msg.role === "user" ? "none" : "1px solid var(--border-color)"
                                    }}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ display: "flex", justifyContent: "flex-start" }}>
                                <div
                                    style={{
                                        padding: "10px 14px",
                                        borderRadius: "12px",
                                        background: "var(--card-bg)",
                                        color: "var(--text-secondary)",
                                        border: "1px solid var(--border-color)"
                                    }}
                                >
                                    ⏳ Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ask about careers, skills, roadmaps..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={loading}
                            style={{ flex: 1 }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                        >
                            Send 🚀
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="register-grid">
                        {roadmap && (
                            <div className="full-width">
                                <button
                                    className="btn btn-success w-100"
                                    onClick={handleEmailRoadmap}
                                >
                                    📧 Email Roadmap to Me
                                </button>
                            </div>
                        )}

                        <div className="full-width">
                            <button
                                className="btn btn-outline-primary w-100"
                                onClick={() => navigate("/welcome")}
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </div>

                    {/* Quick Prompts */}
                    <div style={{ marginTop: "16px" }}>
                        <p style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                            Quick prompts:
                        </p>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {[
                                "Give me a roadmap for Data Science",
                                "How to become a Full Stack Developer?",
                                "What skills do I need for DevOps?",
                            ].map((prompt, idx) => (
                                <span
                                    key={idx}
                                    onClick={() => setInput(prompt)}
                                    style={{
                                        padding: "6px 12px",
                                        background: "rgba(102, 126, 234, 0.1)",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {prompt}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="auth-footer">© 2025 Career Credentials</p>
            </div>
        </div>
    );
};

export default AIAssistant;
