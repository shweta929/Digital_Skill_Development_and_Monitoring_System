import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
import '../PROJECT_styles.css';

/**
 * TrainerDashboard - Trainer-specific panel for:
 * - Viewing retest requests
 * - Approving/rejecting retests
 * - Managing feedback
 */
const TrainerDashboard = () => {
    const navigate = useNavigate();
    const [retestRequests, setRetestRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const trainer = JSON.parse(localStorage.getItem("trainer"));

    useEffect(() => {
        // Redirect if not logged in as trainer
        if (!trainer) {
            navigate("/trainer-login");
            return;
        }

        fetchRetestRequests();
    }, [trainer, navigate]);

    const fetchRetestRequests = async () => {
        try {
            const res = await fetch("http://localhost:8081/api/test/retest/pending");
            if (res.ok) {
                const data = await res.json();
                setRetestRequests(data);
            }
        } catch (err) {
            console.error("Failed to fetch retest requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        setProcessingId(requestId);
        try {
            const res = await fetch(
                `http://localhost:8081/api/test/retest/${requestId}/approve?trainerId=${trainer.id}`,
                { method: 'PUT' }
            );
            if (res.ok) {
                alert("✅ Retest approved!");
                fetchRetestRequests();
            }
        } catch (err) {
            alert("Failed to approve retest");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId) => {
        setProcessingId(requestId);
        try {
            const res = await fetch(
                `http://localhost:8081/api/test/retest/${requestId}/reject?trainerId=${trainer.id}`,
                { method: 'PUT' }
            );
            if (res.ok) {
                alert("❌ Retest rejected");
                fetchRetestRequests();
            }
        } catch (err) {
            alert("Failed to reject retest");
        } finally {
            setProcessingId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("trainer");
        localStorage.removeItem("userRole");
        navigate("/login");
    };

    return (
        <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
            <BackButton />

            <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#1a202c', marginBottom: '8px' }}>
                            👨‍🏫 Trainer Dashboard
                        </h1>
                        <p style={{ color: '#718096' }}>Welcome, {trainer?.fullName || 'Trainer'}</p>
                    </div>
                    <button
                        className="btn btn-danger"
                        onClick={handleLogout}
                        style={{ height: '44px', borderRadius: '12px' }}
                    >
                        Logout
                    </button>
                </div>

                {/* Retest Requests Section */}
                <div className="colorful-card" style={{ padding: '30px', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '25px', color: '#2d3748' }}>
                        📋 Pending Retest Requests
                    </h2>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                    ) : retestRequests.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
                            ✅ No pending retest requests
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                                        <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568' }}>ID</th>
                                        <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568' }}>Student ID</th>
                                        <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568' }}>Reason</th>
                                        <th style={{ padding: '15px', textAlign: 'left', color: '#4a5568' }}>Requested</th>
                                        <th style={{ padding: '15px', textAlign: 'center', color: '#4a5568' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {retestRequests.map((request) => (
                                        <tr key={request.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                            <td style={{ padding: '15px' }}>#{request.id}</td>
                                            <td style={{ padding: '15px' }}>{request.studentId}</td>
                                            <td style={{ padding: '15px' }}>{request.reason || 'No reason provided'}</td>
                                            <td style={{ padding: '15px' }}>
                                                {new Date(request.requestedAt).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '15px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => handleApprove(request.id)}
                                                        disabled={processingId === request.id}
                                                        style={{ padding: '8px 16px', borderRadius: '8px' }}
                                                    >
                                                        ✅ Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleReject(request.id)}
                                                        disabled={processingId === request.id}
                                                        style={{ padding: '8px 16px', borderRadius: '8px' }}
                                                    >
                                                        ❌ Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <div className="colorful-card" style={{ padding: '25px', background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', borderRadius: '16px' }}>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>📋 Pending Requests</div>
                        <div style={{ fontSize: '36px', fontWeight: '800' }}>{retestRequests.length}</div>
                    </div>
                    <div className="colorful-card" style={{ padding: '25px', background: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white', borderRadius: '16px' }}>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>👨‍🏫 Role</div>
                        <div style={{ fontSize: '28px', fontWeight: '800' }}>Trainer</div>
                    </div>
                </div>
            </div>

            <p className="auth-footer" style={{ marginTop: '60px' }}>© 2025 Career Credentials</p>
        </div>
    );
};

export default TrainerDashboard;
