import { useState, useRef, useEffect } from 'react';
import chatbotLogo from '../assets/chatbot.png';
import './ChatbotIcon.css';

const ChatbotIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: "assistant", content: "👋 Hello! I'm your Career AI Assistant. How can I help you today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const [showEmailBtn, setShowEmailBtn] = useState(false);
    const messagesEndRef = useRef(null);

    const student = JSON.parse(localStorage.getItem("student"));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/ai/ask", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: input, studentId: student?.id }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.answer || data }]);
            setShowEmailBtn(true);
        } catch (error) {
            setMessages((prev) => [...prev, { role: "assistant", content: "❌ Error connecting to AI. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailRoadmap = async () => {
        const studentEmail = student?.email;
        if (!studentEmail) return alert("Student email not found!");

        const roadmapContent = messages
            .filter(m => m.role === "assistant")
            .map(m => m.content)
            .join("\n\n");

        setLoading(true);
        try {
            const res = await fetch("/api/ai/email-roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: studentEmail,
                    name: student?.fullName || "Student",
                    roadmap: roadmapContent
                }),
            });
            if (res.ok) alert("Roadmap emailed successfully! 📧");
            else alert("Failed to email roadmap.");
        } catch (error) {
            alert("Error sending email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <div className="chatbot-panel">
                    <div className="chatbot-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img src={chatbotLogo} alt="AI" style={{ width: '24px', height: '24px' }} />
                            <h3>Career Assistant</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)}>&times;</button>
                    </div>
                    <div className="chatbot-body">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat-msg ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        {loading && <div className="chat-msg assistant">Thinking... 🧠</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chatbot-actions" style={{ padding: '0 1rem', display: 'flex', gap: '5px' }}>
                        {showEmailBtn && (
                            <button
                                onClick={handleEmailRoadmap}
                                style={{
                                    fontSize: '10px',
                                    padding: '4px 8px',
                                    borderRadius: '8px',
                                    background: '#7edbd4',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                📧 Email My Roadmap
                            </button>
                        )}
                    </div>

                    <div className="chatbot-footer" style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                background: 'linear-gradient(90deg, #7edbd4, #a8b3e8)',
                                border: 'none',
                                borderRadius: '8px',
                                width: '40px',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
            <div
                className={`chatbot-icon ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                title="Chat with Assistant"
            >
                <img src={chatbotLogo} alt="Chatbot" className="chatbot-img" />
            </div>
        </div>
    );
};

export default ChatbotIcon;
