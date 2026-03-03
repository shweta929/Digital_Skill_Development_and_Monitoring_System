import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiUsers, FiFileText, FiBookOpen, FiMessageSquare } from 'react-icons/fi';
import BackButton from './BackButton';
import '../PROJECT_styles.css';

const StudentCRM = () => {
    const navigate = useNavigate();
    const student = JSON.parse(localStorage.getItem("student"));

    const [testData, setTestData] = useState(null);
    const [meetingCount, setMeetingCount] = useState(0);
    const [feedbackCount, setFeedbackCount] = useState(0);
    const [resumesCount, setResumesCount] = useState(0);
    const [booksCount, setBooksCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCRMData = async () => {
            if (!student?.email) {
                setLoading(false);
                return;
            }

            try {
                // Fetch Integrated Counts (Domain, Books, Meetings, Feedback, Resumes)
                const countRes = await fetch(`/api/students/counts/${encodeURIComponent(student.email)}`);
                if (countRes.ok) {
                    const counts = await countRes.json();
                    setBooksCount(counts.bookReadCount || 0);
                    setFeedbackCount(counts.feedbackCount || 0);
                    setMeetingCount(counts.meetingCount || 0);
                    setResumesCount(counts.resumeCreatedCount || 0);

                    if (counts.domain) {
                        setTestData({
                            primary_language: "Curated Path",
                            recommended_career: counts.domain,
                            strongest_domain: counts.domain,
                            testCompleted: counts.testCompleted
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching CRM data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCRMData();
    }, [student?.email]);

    const StatCard = ({ icon, title, value, color }) => (
        <div className="colorful-card" style={{
            padding: '30px',
            textAlign: 'center',
            background: 'var(--card-bg)',
            borderLeft: `4px solid ${color}`,
            border: '1px solid var(--border-color)'
        }}>
            <div style={{ fontSize: '36px', marginBottom: '10px' }}>{icon}</div>
            <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '600' }}>{title}</h3>
            <p style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</p>
        </div>
    );

    return (
        <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
            <BackButton />

            <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#1a202c', marginBottom: '15px' }}>
                        Welcome to Student CRM
                    </h1>
                    <p style={{ fontSize: '18px', color: '#718096', maxWidth: '700px', margin: '0 auto' }}>
                        This CRM shows your learning and career progress based on your activity in Career Credentials.
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <p style={{ fontSize: '18px', color: '#718096' }}>Loading your progress...</p>
                    </div>
                ) : (
                    <>
                        {/* Career Track Section */}
                        <section className="colorful-card" style={{ padding: '30px', marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1a202c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FiCheckCircle style={{ color: '#48bb78' }} /> Test & Career Track
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                <div>
                                    <p style={{ color: '#718096', fontSize: '14px', marginBottom: '5px' }}>Test Given</p>
                                    <p style={{ fontSize: '20px', fontWeight: '700', color: (testData?.testCompleted || testData) ? '#48bb78' : '#e53e3e' }}>
                                        {(testData?.testCompleted || testData) ? 'Yes ✅' : 'No ❌'}
                                    </p>
                                </div>
                                {testData && (
                                    <>
                                        <div>
                                            <p style={{ color: '#718096', fontSize: '14px', marginBottom: '5px' }}>Primary Language</p>
                                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#5a67d8' }}>{testData.primary_language || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: '#718096', fontSize: '14px', marginBottom: '5px' }}>Recommended Career</p>
                                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#ed8936' }}>{testData.recommended_career || '-'}</p>
                                        </div>
                                        <div>
                                            <p style={{ color: '#718096', fontSize: '14px', marginBottom: '5px' }}>Strongest Domain</p>
                                            <p style={{ fontSize: '20px', fontWeight: '700', color: '#38b2ac' }}>{testData.strongest_domain || '-'}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', marginBottom: '40px' }}>
                            <StatCard icon={<FiUsers />} title="One-on-One Meetings" value={meetingCount} color="#5a67d8" />
                            <StatCard icon={<FiFileText />} title="Resumes Created" value={resumesCount} color="#ed8936" />
                            <StatCard icon={<FiBookOpen />} title="Books Read" value={booksCount} color="#48bb78" />
                            <StatCard icon={<FiMessageSquare />} title="Feedback Given" value={feedbackCount} color="#e53e3e" />
                        </div>

                        {/* Footer */}
                        <div style={{ textAlign: 'center', marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--border-color)' }}>
                            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '25px' }}>
                                Thank you for connecting with us through Student CRM.
                            </p>
                            <button
                                className="btn-primary dashboard-btn"
                                onClick={() => navigate('/welcome')}
                            >
                                ← Back to Dashboard
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default StudentCRM;
