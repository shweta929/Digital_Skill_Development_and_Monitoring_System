import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import "../PROJECT_styles.css";

const TopicSessions = () => {
    const navigate = useNavigate();
    const [topic, setTopic] = useState("");
    const [sessions, setSessions] = useState([]);
    const [activeVideo, setActiveVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const student = JSON.parse(localStorage.getItem("student"));

    // --- MASTER STATIC FALLBACK (Insurance Policy) ---
    // Updated to follow user request: If no matching videos, show the Career Success Guide
    const staticSessions = [
        {
            id: 'static-fallback',
            title: "Master Your Technical Career",
            youtubeLink: "KfNrHZUH3WU",
            description: "A comprehensive guide to mastering your domain and cracking technical interviews with expert insights from Dr. Amar Panchal."
        },
        { id: 'static-2', title: "Spring Boot & Cloud Integration", youtubeLink: "CDbQVssqGcE", description: "Deep dive into building scalable enterprise applications using Spring Boot, Microservices, and Cloud-native architectures." },
        { id: 'static-3', title: "Python for Data Science", youtubeLink: "kTYVZkY41eU", description: "Essential Python programming for data analysis, machine learning foundations, and automation scripting for technical professionals." },
        { id: 'static-4', title: "React Native App Dev", youtubeLink: "H1vW9P6GQPQ", description: "Build high-performance cross-platform mobile applications for iOS and Android using a single React codebase." },
        { id: 'static-5', title: "Ultimate Node.js Guide", youtubeLink: "-BvgaDXy_z8", description: "Comprehensive backend engineering with Node.js, Express, and database integration for high-concurrency systems." }
    ];

    useEffect(() => {
        if (!student) {
            navigate("/login");
            return;
        }
        // Set initial topic from student domain to avoid flicker
        if (student.domain) setTopic(student.domain);
        fetchStudentTopic();
    }, [student?.id, student?._id]);

    const fetchStudentTopic = async () => {
        try {
            const id = student?.id || student?._id;
            if (!id) return;

            // Fetch session data which includes the domain
            const res = await fetch(`/api/students/sessions/${id}`);
            if (res.ok) {
                const data = await res.json();
                if (data.domain) setTopic(data.domain);

                // If API returns videos (including the backend fallback), use them
                if (data.videos && data.videos.length > 0) {
                    setSessions(data.videos);
                    setActiveVideo(data.videos[0]);
                }
            } else {
                throw new Error("API responded with error");
            }
        } catch (err) {
            console.error("TopicSessions: Fetch error:", err);
            // Fallback for UI if API fails
            try {
                const fbRes = await fetch(`/api/students/sessions/fallback`);
                if (fbRes.ok) {
                    const fbData = await fbRes.json();
                    setTopic(fbData.domain || "Technical Training");
                    setSessions(fbData.videos || []);
                    if (fbData.videos && fbData.videos.length > 0) {
                        setActiveVideo(fbData.videos[0]);
                    }
                }
            } catch (e) {
                setError("Curriculum data not found. Please check back shortly.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="auth-page full-height">
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner-border text-primary" role="status"></div>
                    <p style={{ marginTop: '20px', fontSize: '18px' }}>Personalizing your learning library...</p>
                </div>
            </div>
        );
    }

    // Determine the data to display: API sessions or Static Fallback
    const effectiveVideos = (sessions && sessions.length > 0) ? sessions : staticSessions;
    const effectiveActive = activeVideo || effectiveVideos[0];

    return (
        <div className="auth-page full-height" style={{ display: 'block', padding: '40px 0', overflowY: 'auto' }}>
            <BackButton />
            <div className="auth-logo" style={{ marginBottom: '30px', textAlign: 'center' }}>
                <img src="/logo.png" alt="Career Credentials" style={{ height: '60px' }} />
            </div>

            <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>
                <div style={{ marginBottom: '50px', textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: '700', color: '#667eea', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        Curated Learning Path
                    </p>
                    <h1 style={{ fontSize: '42px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '15px', letterSpacing: '-0.02em' }}>
                        {topic || "Technical"} Training Sessions
                    </h1>
                    <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                        Master your career domain with our expert-led, high-definition video curriculum.
                    </p>
                </div>

                {effectiveActive && (
                    <div style={{ marginBottom: '60px', animation: 'fadeIn 0.6s ease' }}>
                        {/* Main Featured Player */}
                        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
                            <iframe
                                src={`https://www.youtube.com/embed/${effectiveActive.youtubeLink || effectiveActive.video_url?.split('/').pop()}?autoplay=0&rel=0`}
                                title={effectiveActive.title}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                                allowFullScreen
                                loading="lazy"
                            />
                        </div>
                        <div style={{
                            marginTop: '30px',
                            background: 'var(--card-bg)',
                            padding: '40px',
                            borderRadius: '32px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '30px'
                        }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '15px' }}>{effectiveActive.title}</h2>
                                <p style={{ fontSize: '18px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{effectiveActive.description || "In this session, we deep dive into the core concepts and advanced implementation strategies of your career domain."}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Grid Section */}
                <div>
                    <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        📑 {sessions && sessions.length > 0 ? "Your Curriculum Playlist" : "Professional Training Library"}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                        {effectiveVideos.map((video, idx) => (
                            <div
                                key={`${video.id || 'static'}-${idx}`}
                                className={`video-card ${(activeVideo?.id === video.id || (!activeVideo && idx === 0)) ? 'active' : ''}`}
                                onClick={() => { setActiveVideo(video); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                style={{
                                    cursor: 'pointer',
                                    background: 'var(--card-bg)',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    border: (activeVideo?.id === video.id || (!activeVideo && idx === 0)) ? '2px solid #667eea' : '1px solid var(--border-color)',
                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                    boxShadow: (activeVideo?.id === video.id || (!activeVideo && idx === 0)) ? '0 20px 40px rgba(102,126,234,0.15)' : '0 10px 30px rgba(0,0,0,0.05)',
                                    transform: (activeVideo?.id === video.id || (!activeVideo && idx === 0)) ? 'translateY(-5px)' : 'none'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; }}
                                onMouseOut={(e) => { if (activeVideo?.id !== video.id && !(effectiveActive.id === video.id && !activeVideo)) e.currentTarget.style.transform = 'none'; }}
                            >
                                <div style={{ position: 'relative', paddingTop: '56.25%', background: 'var(--input-bg)' }}>
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundImage: `url(https://img.youtube.com/vi/${video.youtubeLink || video.video_url?.split('/').pop()}/mqdefault.jpg)`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}
                                    />
                                    {/* YouTube Professional Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '15px',
                                        left: '15px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(0,0,0,0.7)',
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        backdropFilter: 'blur(8px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        zIndex: 10
                                    }}>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" alt="YouTube" style={{ height: '14px' }} />
                                        <span style={{ color: 'white', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Professional Training</span>
                                    </div>

                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div className="play-icon-overlay" style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            background: 'rgba(255,255,255,0.95)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingLeft: '5px',
                                            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                                            transition: 'transform 0.3s ease'
                                        }}>
                                            <div style={{ borderTop: '12px solid transparent', borderBottom: '12px solid transparent', borderLeft: '20px solid #FF0000' }}></div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>{video.title}</h4>
                                    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>Verified Technical Curriculum</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Navigation Button */}
                <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
                    <button className="btn-primary dashboard-btn" style={{ minWidth: '320px', height: '60px', fontSize: '18px' }} onClick={() => navigate("/welcome")}>
                        ← Back to Career Dashboard
                    </button>
                </div>
            </div>
            <p className="auth-footer">© 2025 Career Credentials</p>
        </div>
    );
};

export default TopicSessions;
