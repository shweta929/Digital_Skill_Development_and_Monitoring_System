import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentSection.css';
import DashboardCard from '../components/DashboardCard';
import AskAIButton from '../components/AskAI/AskAIButton';
import ReviewSection from '../components/ReviewSection';

const StudentSection = () => {
    const navigate = useNavigate();
    const [showWelcome, setShowWelcome] = useState(false);
    const student = JSON.parse(localStorage.getItem("student"));

    useEffect(() => {
        const shouldShow = sessionStorage.getItem("showWelcome");
        if (shouldShow === "true") {
            setShowWelcome(true);
            const timer = setTimeout(() => {
                setShowWelcome(false);
                sessionStorage.removeItem("showWelcome");
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleCardClick = (title) => {
        if (title === '1 on 1 Meeting') {
            navigate('/one-on-one');
        } else if (title === 'Give Test') {
            navigate('/test');
        } else if (title === 'Give Feedback') {
            navigate('/feedback');
        } else if (title === 'Other Sessions') {
            navigate('/sessions');
        } else if (title === 'Recorded Sessions') {
            navigate('/topic-sessions');
        } else if (title === 'Books') {
            navigate('/books');
        } else if (title === 'Resume Maker') {
            const student = JSON.parse(localStorage.getItem("student"));
            // Track resume created count
            if (student && student.id) {
                const key = `resumesCreated_${student.id}`;
                const currentCount = parseInt(localStorage.getItem(key) || "0");
                localStorage.setItem(key, currentCount + 1);
            }
            const studentName = encodeURIComponent(student?.fullName || "");
            const studentEmail = encodeURIComponent(student?.email || "");
            window.location.href = `http://localhost:5002?name=${studentName}&email=${studentEmail}`;
        } else if (title === 'Placement CRM') {
            navigate('/crm');
        } else if (title === 'Student CRM') {
            navigate('/student-crm');
        }
    };

    const row1 = [
        { title: 'Give Test', icon: '📝' },
        { title: '1 on 1 Meeting', icon: '🤝' },
        { title: 'Give Feedback', icon: '💬' },
        { title: 'Other Sessions', icon: '🎬' }
    ];

    const row2 = [
        { title: 'Recorded Sessions', icon: '📼' },
        { title: 'Books', icon: '📖' },
        { title: 'Resume Maker', icon: '📄' },
        { title: 'Student CRM', icon: '📊' },
        { title: 'Placement CRM', icon: '💼' }
    ].filter(item => {
        if (item.title === 'Placement CRM') {
            return student?.role === 'ADMIN';
        }
        return true;
    });

    return (
        <div className="student-section-page">
            {showWelcome && (
                <div className="welcome-popup-overlay">
                    <div className="welcome-popup-content">
                        <h2>Welcome, {student?.fullName || "Student"}! 👋</h2>
                        <p>Let's continue your Career Journey Dashboard.</p>
                    </div>
                </div>
            )}

            <div className="bg-decor-orb orb-1"></div>
            <div className="bg-decor-orb orb-2"></div>
            <div className="bg-decor-orb orb-3"></div>

            <main className="student-dashboard full-width" style={{ paddingTop: '100px' }}>
                <div className="container-fluid">
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1a202c', marginBottom: '10px' }}>
                            {student?.fullName ? `Welcome, ${student.fullName}` : "Student Dashboard"}
                        </h1>
                        <p style={{ fontSize: '20px', color: '#718096', fontWeight: '500' }}>Your Personalized Career Roadmap & Learning Hub</p>
                    </div>

                    <section className="dashboard-grid-section">
                        <h2 className="grid-title">Core Activities</h2>
                        <div className="dashboard-grid">
                            {row1.map((item, index) => (
                                <DashboardCard
                                    key={index}
                                    title={item.title}
                                    icon={item.icon}
                                    delay={index * 0.1}
                                    onClick={() => handleCardClick(item.title)}
                                />
                            ))}
                        </div>
                    </section>

                    <section className="dashboard-grid-section" style={{ marginTop: '50px' }}>
                        <h2 className="grid-title">Learning & Career Tools</h2>
                        <div className="dashboard-grid">
                            {row2.map((item, index) => (
                                <DashboardCard
                                    key={index}
                                    title={item.title}
                                    icon={item.icon}
                                    delay={(index + 4) * 0.1}
                                    onClick={() => handleCardClick(item.title)}
                                />
                            ))}
                        </div>
                    </section>
                </div>

                <div style={{ marginTop: '100px', borderTop: '1px solid #edf2f7', paddingTop: '50px' }}>
                    <ReviewSection />
                </div>
            </main>

            <AskAIButton />
        </div>
    );
};

export default StudentSection;
