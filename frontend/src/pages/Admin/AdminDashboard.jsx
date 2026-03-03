import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CRMLeads from '../../components/CRMLeads';
import AdminRecordedSessions from '../../components/AdminRecordedSessions';
import '../../PROJECT_styles.css';



const AdminDashboard = () => {
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard' or 'schedule'
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTests: 0,
        totalFeedbacks: 0,
        totalMeetings: 0,
        topCareerDomain: 'Loading...'
    });
    // ... existing stats state ...
    const [activeTab, setActiveTab] = useState('leads'); // 'leads', 'sessions', or 'feedbacks'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const admin = localStorage.getItem("admin");
        if (!admin) {
            navigate("/admin-login");
            return;
        }

        // Fetch real analytics from Admin backend
        const fetchAnalytics = async () => {
            try {
                // Fetch from new Dynamic API
                const res = await fetch("/api/admin/crm/analytics");
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        totalStudents: data.totalStudents || 0,
                        totalTests: data.totalTests || 0,
                        totalFeedbacks: data.totalFeedbacks || 0,
                        totalMeetings: data.totalMeetings || 0,
                        topCareerDomain: data.topCareerDomain || 'N/A'
                    });
                }
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [navigate]);


    if (viewMode === 'schedule') {
        return (
            <div className="admin-dashboard-page" style={{ padding: '20px', background: '#f8fafc', minHeight: '100vh', marginTop: '60px' }}>
                <div className="container-fluid">
                    <div style={{ marginBottom: '15px' }}>
                        <button className="btn btn-outline-primary" onClick={() => setViewMode('dashboard')}>
                            ⬅ Back to Dashboard
                        </button>
                    </div>
                    <div style={{ padding: '0' }}> {/* Removed card styling for seamless look */}
                        <iframe
                            src="http://localhost:5001/admin-meetings-view.html"
                            title="One-on-One Meetings"
                            style={{ width: '100%', height: '2500px', border: 'none' }} // Massive height to prevent inner scroll
                        />
                    </div>
                </div>
            </div>
        );
    }



    return (
        <div className="admin-dashboard-page" style={{ padding: '20px', background: '#f8fafc', minHeight: '100vh' }}>
            <div className="container-fluid">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h1>🔐 Admin Management Dashboard</h1>
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            localStorage.removeItem("admin");
                            localStorage.removeItem("userRole");
                            navigate("/login");
                        }}
                    >
                        Logout Admin
                    </button>
                </div>

                {/* CRM Analytics Section */}
                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ marginBottom: '20px', color: '#2d3748', fontWeight: '700' }}>📊 CRM Analytics Overview</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        <div className="colorful-card" style={{ padding: '25px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', borderRadius: '16px' }}>
                            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>👥 Total Students</div>
                            <div style={{ fontSize: '36px', fontWeight: '800' }}>{loading ? '...' : stats.totalStudents}</div>
                        </div>
                        <div className="colorful-card" style={{ padding: '25px', background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', borderRadius: '16px' }}>
                            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>📝 Tests Taken</div>
                            <div style={{ fontSize: '36px', fontWeight: '800' }}>{loading ? '...' : stats.totalTests}</div>
                        </div>
                        <div className="colorful-card" style={{ padding: '25px', background: 'linear-gradient(135deg, #f093fb, #f5576c)', color: 'white', borderRadius: '16px' }}>
                            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>💬 Feedbacks</div>
                            <div style={{ fontSize: '36px', fontWeight: '800' }}>{loading ? '...' : stats.totalFeedbacks}</div>
                        </div>
                        <div
                            className="colorful-card clickable-card"
                            style={{ padding: '25px', background: 'linear-gradient(135deg, #4facfe, #00f2fe)', color: 'white', borderRadius: '16px', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => setViewMode('schedule')}
                            title="Click to manage schedules"
                        >
                            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>📅 Meetings (Click to Manage)</div>
                            <div style={{ fontSize: '36px', fontWeight: '800' }}>{loading ? '...' : stats.totalMeetings}</div>
                        </div>
                        <div className="colorful-card" style={{ padding: '25px', background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)', color: '#333', borderRadius: '16px', gridColumn: 'span 2' }}>
                            <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '8px' }}>🎯 Top Career Domain</div>
                            <div style={{ fontSize: '28px', fontWeight: '800' }}>{loading ? '...' : stats.topCareerDomain}</div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>
                    <button
                        className={`btn ${activeTab === 'leads' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('leads')}
                        style={{ borderRadius: '12px', padding: '10px 25px', fontWeight: '700' }}
                    >
                        Placements & Leads
                    </button>
                    <button
                        className={`btn ${activeTab === 'sessions' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setActiveTab('sessions')}
                        style={{ borderRadius: '12px', padding: '10px 25px', fontWeight: '700' }}
                    >
                        Management: Recorded Sessions
                    </button>
                    <button
                        className={`btn ${activeTab === 'feedbacks' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => navigate('/admin-feedbacks')}
                        style={{ borderRadius: '12px', padding: '10px 25px', fontWeight: '700' }}
                    >
                        View Feedbacks 💬
                    </button>
                </div>

                <div className="row">
                    <div className="col-12">
                        {activeTab === 'leads' ? (
                            <div className="card shadow-sm" style={{ borderRadius: '16px', border: 'none', overflow: 'hidden' }}>
                                <div className="card-header bg-white py-3">
                                    <h4 className="mb-0">Placement CRM / Leads Management</h4>
                                </div>
                                <div className="card-body p-0">
                                    <CRMLeads />
                                </div>
                            </div>
                        ) : (
                            <div className="card shadow-sm" style={{ borderRadius: '16px', border: 'none', overflow: 'hidden' }}>
                                <div className="card-header bg-white py-3">
                                    <h4 className="mb-0">Recorded Sessions Curriculum (MySQL)</h4>
                                </div>
                                <div className="card-body p-0">
                                    <AdminRecordedSessions />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
