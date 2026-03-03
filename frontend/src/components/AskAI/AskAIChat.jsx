import { useState, useEffect } from "react";
import api from "../../api/ai_api";
import "./AskAIChat.css";
import { FaTimes, FaPaperPlane } from "react-icons/fa";

export default function AskAIChat({ onClose, initialData }) {
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: "Hi 👋 I’m your Career AI.\n\nHow can I help you today?",
            options: ["Roadmap", "Technical Support"]
        }
    ]);
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState("INIT"); // INIT, ROADMAP_TECH, ROADMAP_DURATION, ROADMAP_CONFIRM, COLLECT_NAME, COLLECT_EMAIL, CHAT
    const [roadmapData, setRoadmapData] = useState({ tech: "", duration: "", content: "", name: "", email: "" });

    useEffect(() => {
        if (initialData && initialData.tech) {
            setRoadmapData(prev => ({
                ...prev,
                tech: initialData.tech,
                name: initialData.studentName || ""
            }));
            setStep("ROADMAP_DURATION");
            setMessages([
                {
                    sender: "ai",
                    text: `Hello ${initialData.studentName || "there"}! I've analyzed your assessment results. You have a strong potential in **${initialData.domain}** (${initialData.tech}). \n\nI can generate a personalized career roadmap to help you master this path. Please select a duration:`
                },
                {
                    sender: "ai",
                    text: "Select a duration for your roadmap:",
                    options: ["1 Month", "3 Months", "6 Months", "12 Months", "2 Years"]
                }
            ]);
        }
    }, [initialData]);

    const handleOptionClick = (option) => {
        const userMsg = { sender: "user", text: option };
        setMessages((prev) => [...prev, userMsg]);

        if (step === "INIT") {
            if (option === "Roadmap") {
                setStep("ROADMAP_TECH");
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: "ai",
                            text: "Great! Which technology path are you interested in?",
                            options: [
                                "Full Stack Java",
                                "Data Science & AI",
                                "Cloud Computing (AWS/Azure)",
                                "DevOps Engineering",
                                "Cybersecurity"
                            ]
                        }
                    ]);
                }, 500);
            } else {
                setStep("CHAT");
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        { sender: "ai", text: "Sure! Ask me anything about technology or coding." }
                    ]);
                }, 500);
            }
        } else if (step === "ROADMAP_TECH") {
            setRoadmapData(prev => ({ ...prev, tech: option }));
            setStep("ROADMAP_DURATION");
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "ai",
                        text: "Select a duration for your roadmap:",
                        options: ["1 Month", "3 Months", "6 Months", "12 Months", "2 Years"]
                    }
                ]);
            }, 500);
        } else if (step === "ROADMAP_DURATION") {
            setRoadmapData(prev => ({ ...prev, duration: option }));
            generateRoadmap(roadmapData.tech, option);
        } else if (step === "ROADMAP_CONFIRM") {
            if (option === "Yes, Email PDF") {
                setStep("COLLECT_NAME");
                setTimeout(() => {
                    setMessages(prev => [...prev, { sender: "ai", text: "Please enter your Name:" }]);
                }, 500);
            } else {
                setStep("CHAT");
                setMessages(prev => [...prev, { sender: "ai", text: "Okay! Let me know if you have any other questions." }]);
            }
        }
    };

    const send = async () => {
        if (!text.trim()) return;
        const input = text.trim();

        setMessages(prev => [...prev, { sender: "user", text: input }]);
        setText("");

        if (step === "ROADMAP_TECH") {
            setRoadmapData(prev => ({ ...prev, tech: input }));
            setStep("ROADMAP_DURATION");
            setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        sender: "ai",
                        text: "Select a duration for your roadmap:",
                        options: ["1 Month", "3 Months", "6 Months", "12 Months", "2 Years"]
                    }
                ]);
            }, 500);
            return;
        }

        if (step === "ROADMAP_DURATION") {
            setRoadmapData(prev => ({ ...prev, duration: input }));
            generateRoadmap(roadmapData.tech, input);
            return;
        }

        if (step === "COLLECT_NAME") {
            setRoadmapData(prev => ({ ...prev, name: input }));
            setStep("COLLECT_EMAIL");
            setTimeout(() => {
                setMessages(prev => [...prev, { sender: "ai", text: "Thanks! Now, please enter your Email ID:" }]);
            }, 500);
            return;
        }

        if (step === "COLLECT_EMAIL") {
            const email = input;
            setRoadmapData(prev => ({ ...prev, email: email }));
            sendEmail(roadmapData.name, email, roadmapData.content);
            return;
        }

        setLoading(true);
        setMessages(prev => [...prev, { sender: "ai", text: "⏳ Thinking..." }]);

        try {
            const res = await api.post("/ask", { question: input });
            let answer = res.data.answer;
            answer = answer.replace(/\*\*/g, "").replace(/\*/g, "").replace(/__/g, "").replace(/_/g, "");

            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { sender: "ai", text: answer };
                return updated;
            });
        } catch (err) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { sender: "ai", text: "⚠️ Sorry, AI service is temporarily unavailable." };
                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    const generateRoadmap = async (tech, duration) => {
        setLoading(true);
        setMessages(prev => [...prev, { sender: "ai", text: `⏳ Generating ${duration} ${tech} roadmap...` }]);

        const prompt = `Generate a high-quality, corporate-ready ${duration} career roadmap for ${tech}. 

IMPORTANT: Structure the roadmap MONTH BY MONTH and break down each month into 4 SPECIFIC WEEKS with detailed TOPICS. 

Ensure the formatting is "RTF-friendly" for easy copy-pasting into Word/Docs.

Follow this EXACT structure:

📅 MONTH 1: [Strategic Focus]
──────────────────────────────
🗓️ WEEK 1: [Topic/Focus Name]
• [Specific Detail/Topic 1]
• [Specific Detail/Topic 2]

🗓️ WEEK 2: [Topic/Focus Name]
• [Specific Detail/Topic 1]
• [Specific Detail/Topic 2]

🗓️ WEEK 3: [Topic/Focus Name]
• [Specific Detail/Topic 1]
• [Specific Detail/Topic 2]

🗓️ WEEK 4: [Topic/Focus Name]
• [Specific Detail/Topic 1]
• [Specific Detail/Topic 2]

📌 CORE SKILLS COVERED:
• [Skill 1]
• [Skill 2]

📚 RECOMMENDED RESOURCES:
• [Resource 1]

🎯 HANDS-ON PROJECTS:
• [Project 1]

⏰ INTENSITY: [X hours/week]

💡 MONTHLY TIP: [A creative, professional tip for this month with emojis]

(Repeat the above structure for EACH month)

──────────────────────────────
🏆 TARGET OUTCOME: [Goal description]

🔥 MOTIVATION: [A powerful single-line motivational message to cheer the student]

🙏 Thank you from Career Credentials.

──────────────────────────────
Formatting Rules:
- Use clear Unicode bullets (•).
- Use thin horizontal lines (──────────────────────────────).
- Do NOT use markdown bold stars (**). Use PLAIN TEXT for headings.
- Keep descriptions concise, specific, and execution-oriented.`;

        try {
            const res = await api.post("/ask", { question: prompt });
            let answer = res.data.answer;
            answer = answer.replace(/\*\*/g, "").replace(/\*/g, "").replace(/__/g, "").replace(/_/g, "");

            setRoadmapData(prev => ({ ...prev, content: answer }));
            setStep("ROADMAP_CONFIRM");

            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { sender: "ai", text: answer };
                return [
                    ...updated,
                    {
                        sender: "ai",
                        text: "Are you happy with this roadmap? Would you like a professional PDF sent to your email?",
                        options: ["Yes, Email PDF", "No, thanks"]
                    }
                ];
            });

        } catch (err) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { sender: "ai", text: "⚠️ Failed to generate roadmap." };
                return updated;
            });
            setStep("CHAT");
        } finally {
            setLoading(false);
        }
    };

    const sendEmail = async (name, email, content) => {
        setLoading(true);
        setMessages(prev => [...prev, { sender: "ai", text: "⏳ Generating PDF and sending email..." }]);

        try {
            await api.post("/email-roadmap", {
                name: name,
                email: email,
                roadmap: content
            });

            setStep("CHAT");
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    sender: "ai",
                    text: `Thank you, ${name}! The PDF of your roadmap has been shared with you on ${email}. Good luck! 🚀`
                };
                return updated;
            });

        } catch (err) {
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { sender: "ai", text: "⚠️ Failed to send email. Please check the backend logs." };
                return updated;
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chat-wrapper">
            <div className="chat-header">
                <span>🤖 Ask Career AI</span>
                <FaTimes onClick={onClose} />
            </div>

            <div className="chat-body">
                {messages.map((m, i) => (
                    <div key={i} className={`chat-msg ${m.sender} chat-msg-enter`}>
                        {m.text}
                        {m.options && (
                            <div className="chat-options">
                                {m.options.map((opt) => (
                                    <button key={opt} onClick={() => handleOptionClick(opt)} className="option-btn">
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input
                    placeholder="Type here..."
                    value={text}
                    disabled={loading}
                    onChange={e => setText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                />
                <FaPaperPlane onClick={send} />
            </div>
        </div>
    );
}
