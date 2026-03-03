import React, { useState, useEffect } from 'react';

const AdminScheduleView = ({ onBack }) => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [processingId, setProcessingId] = useState(null);

    // Get Admin ID (treating as trainer_id for now as per requirement)
    // In a real app, we might map Admin ID -> Trainer ID, but for now assuming 1:1 or shared ID
    const admin = JSON.parse(localStorage.getItem("admin"));
    const trainerId = admin ? admin.id : null;

    useEffect(() => {
        if (trainerId) {
            fetchSchedules();
        }
    }, [trainerId]);

    const fetchSchedules = async () => {
        try {
            const res = await fetch(`/api/meetings/trainer/${trainerId}`);
            if (res.ok) {
                const data = await res.json();
                setSchedules(data);
            } else {
                console.error("Failed to fetch schedules");
            }
        } catch (err) {
            console.error("Error fetching schedules:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, action, payload = {}) => {
        if (!confirm(`Are you sure you want to ${action} this session?`)) return;

        setProcessingId(id);
        let url = `/api/meetings/${id}/${action}`;
        let method = 'PUT';
        let body = JSON.stringify(payload);

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: action === 'reschedule' ? body : undefined
            });

            if (res.ok) {
                fetchSchedules();
                alert(`Session ${action}d successfully!`);
            } else {
                const errorData = await res.json();
                alert(`Failed to ${action} session: ${errorData.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(`Error during ${action}:`, err);
            alert(`Error connecting to server for ${action}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReschedule = (id) => {
        // Use a simple prompt for now, could be a modal
        const newDate = prompt("Enter new date/time (YYYY-MM-DD HH:MM:SS):", new Date().toISOString().slice(0, 19).replace('T', ' '));
        if (newDate) {
            handleStatusUpdate(id, 'reschedule', { new_date: newDate });
        }
    };

    const filteredSchedules = filter === 'All'
        ? schedules
        : schedules.filter(s => s.status === filter);

    return (
        <div className="colorful-card" style={{ padding: '30px', minHeight: '600px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748', marginBottom: '8px' }}>
                        📅 One-on-One Session Management
                    </h2>
                    <p style={{ color: '#718096' }}>Manage your upcoming student sessions</p>
                </div>
                <button
                    className="btn btn-outline-primary"
                    onClick={onBack}
                    style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: '600' }}
                >
                    ⬅ Back to Dashboard
                </button>
            </div>

            {/* Filter Tabs */}
            <div style={{ marginBottom: '30px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {['All', 'Booked', 'Completed', 'Canceled', 'Rescheduled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            background: filter === status ? '#4facfe' : '#edf2f7',
                            color: filter === status ? 'white' : '#4a5568',
                            transition: 'all 0.2s'
                        }}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '50px', color: '#718096' }}>
                    <div className="spinner-border text-primary" role="status"></div>
                    <p style={{ marginTop: '15px' }}>Loading your schedule...</p>
                </div>
            ) : filteredSchedules.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e0' }}>
                    <div style={{ fontSize: '48px', marginBottom: '15px' }}>📅</div>
                    <h3 style={{ fontSize: '18px', color: '#4a5568', fontWeight: 'bold' }}>No sessions found</h3>
                    <p style={{ color: '#718096' }}>You don't have any sessions with status "{filter}" yet.</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                        <thead>
                            <tr style={{ color: '#718096', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '15px', border: 'none' }}>Student Details</th>
                                <th style={{ padding: '15px', border: 'none' }}>Scheduled Date</th>
                                <th style={{ padding: '15px', border: 'none' }}>Status</th>
                                <th style={{ padding: '15px', border: 'none' }}>History</th>
                                <th style={{ padding: '15px', border: 'none' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map(session => (
                                <tr key={session.id} style={{ background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                    <td style={{ padding: '20px', borderRadius: '12px 0 0 12px', border: '1px solid #e2e8f0', borderRight: 'none' }}>
                                        <div style={{ fontWeight: 'bold', color: '#2d3748', fontSize: '15px' }}>{session.studentName}</div>
                                        <div style={{ fontSize: '13px', color: '#718096' }}>{session.studentEmail}</div>
                                        <div style={{ fontSize: '12px', color: '#a0aec0' }}>{session.studentMobile || 'No Mobile'}</div>
                                    </td>
                                    <td style={{ padding: '20px', border: '1px solid #e2e8f0', borderLeft: 'none', borderRight: 'none', verticalAlign: 'middle' }}>
                                        <div style={{ fontWeight: '600', color: '#4a5568' }}>
                                            {new Date(session.scheduled_at).toLocaleDateString()}
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#718096' }}>
                                            {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '20px', border: '1px solid #e2e8f0', borderLeft: 'none', borderRight: 'none', verticalAlign: 'middle' }}>
                                        <span style={{
                                            padding: '6px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            background:
                                                session.status === 'Booked' ? '#ebf8ff' :
                                                    session.status === 'Completed' ? '#f0fff4' :
                                                        session.status === 'Canceled' ? '#fff5f5' :
                                                            '#fffaf0', // Rescheduled
                                            color:
                                                session.status === 'Booked' ? '#3182ce' :
                                                    session.status === 'Completed' ? '#38a169' :
                                                        session.status === 'Canceled' ? '#e53e3e' :
                                                            '#dd6b20'
                                        }}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '20px', border: '1px solid #e2e8f0', borderLeft: 'none', borderRight: 'none', verticalAlign: 'middle' }}>
                                        {session.reschedule_count > 0 ? (
                                            <span style={{ fontSize: '13px', color: '#dd6b20', fontWeight: '600' }}>
                                                🔄 {session.reschedule_count}x
                                            </span>
                                        ) : (
                                            <span style={{ fontSize: '13px', color: '#cbd5e0' }}>-</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '20px', borderRadius: '0 12px 12px 0', border: '1px solid #e2e8f0', borderLeft: 'none', verticalAlign: 'middle' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {session.status !== 'Completed' && session.status !== 'Canceled' && (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-info text-white"
                                                        onClick={() => handleReschedule(session.id)}
                                                        disabled={processingId === session.id}
                                                        title="Reschedule"
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        📅
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleStatusUpdate(session.id, 'complete')}
                                                        disabled={processingId === session.id}
                                                        title="Mark Completed"
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        ✅
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleStatusUpdate(session.id, 'cancel')}
                                                        disabled={processingId === session.id}
                                                        title="Cancel Session"
                                                        style={{ borderRadius: '8px' }}
                                                    >
                                                        ❌
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminScheduleView;
