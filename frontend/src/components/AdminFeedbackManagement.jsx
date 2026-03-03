import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiX, FiAlertTriangle } from 'react-icons/fi';
import BackButton from './BackButton';
import '../PROJECT_styles.css';

// Avatar SVG components (same as ReviewSection)
const MaleAvatar = ({ size = 40 }) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="#e3f2fd" />
        <circle cx="50" cy="38" r="18" fill="#90caf9" />
        <ellipse cx="50" cy="80" rx="28" ry="22" fill="#90caf9" />
        <circle cx="42" cy="35" r="3" fill="#1a237e" />
        <circle cx="58" cy="35" r="3" fill="#1a237e" />
        <path d="M44 45 Q50 50 56 45" stroke="#1a237e" strokeWidth="2" fill="none" />
    </svg>
);

const FemaleAvatar = ({ size = 40 }) => (
    <svg viewBox="0 0 100 100" width={size} height={size}>
        <circle cx="50" cy="50" r="48" fill="#fce4ec" />
        <circle cx="50" cy="38" r="18" fill="#f48fb1" />
        <ellipse cx="50" cy="80" rx="28" ry="22" fill="#f48fb1" />
        <circle cx="42" cy="35" r="3" fill="#880e4f" />
        <circle cx="58" cy="35" r="3" fill="#880e4f" />
        <path d="M44 45 Q50 50 56 45" stroke="#880e4f" strokeWidth="2" fill="none" />
        <path d="M30 25 Q50 5 70 25" stroke="#f48fb1" strokeWidth="8" fill="none" />
    </svg>
);

// Star Rating Display
const StarRating = ({ rating }) => (
    <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map(i => (
            <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e0e0e0', fontSize: '16px' }}>★</span>
        ))}
    </div>
);

const AdminFeedbackManagement = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, feedback: null });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await fetch("/api/admin/feedbacks");
            const data = await res.json();
            if (res.ok) {
                const enhanced = data.map((fb, idx) => ({
                    ...fb,
                    studentName: fb.student_name || fb.studentName, // MySQL uses student_name
                    gender: fb.gender || (idx % 2 === 0 ? 'MALE' : 'FEMALE'),
                    domain: fb.domain || 'Career Guidance',
                    rating: fb.rating || 5
                }));
                setFeedbacks(enhanced);
            }
        } catch (err) {
            console.error("Failed to fetch feedbacks", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (feedback) => {
        setDeleteModal({ open: true, feedback });
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.feedback) return;

        setDeleting(true);
        try {
            // Assume DELETE API exists at /api/admin/feedback/:id
            const res = await fetch(`/api/admin/feedback/${deleteModal.feedback._id || deleteModal.feedback.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                // Remove from UI
                setFeedbacks(prev => prev.filter(fb =>
                    (fb._id || fb.id) !== (deleteModal.feedback._id || deleteModal.feedback.id)
                ));
            } else {
                console.error("Delete failed");
            }
        } catch (err) {
            console.error("Error deleting feedback:", err);
        } finally {
            setDeleting(false);
            setDeleteModal({ open: false, feedback: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ open: false, feedback: null });
    };

    return (
        <div className="auth-page" style={{ alignItems: 'flex-start', paddingTop: '40px', minHeight: '100vh' }}>
            <BackButton />

            <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a202c', marginBottom: '10px' }}>
                        Feedback Management
                    </h1>
                    <p style={{ fontSize: '16px', color: '#718096' }}>
                        View and manage all student feedbacks
                    </p>
                </div>

                {/* Stats */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '30px',
                    marginBottom: '40px',
                    flexWrap: 'wrap'
                }}>
                    <div className="colorful-card" style={{ padding: '20px 40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#667eea' }}>{feedbacks.length}</div>
                        <div style={{ fontSize: '14px', color: '#718096' }}>Total Feedbacks</div>
                    </div>
                    <div className="colorful-card" style={{ padding: '20px 40px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: '800', color: '#48bb78' }}>
                            {feedbacks.filter(f => f.rating >= 4).length}
                        </div>
                        <div style={{ fontSize: '14px', color: '#718096' }}>Positive (4-5★)</div>
                    </div>
                </div>

                {/* Feedback Table */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <p style={{ color: '#718096' }}>Loading feedbacks...</p>
                    </div>
                ) : feedbacks.length === 0 ? (
                    <div className="colorful-card" style={{ padding: '60px', textAlign: 'center' }}>
                        <p style={{ color: '#718096', fontSize: '18px' }}>No feedbacks found</p>
                    </div>
                ) : (
                    <div className="colorful-card" style={{ padding: '0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Student</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Domain</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Rating</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Feedback</th>
                                    <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#4a5568', textTransform: 'uppercase' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedbacks.map((fb, idx) => (
                                    <tr key={fb._id || fb.id || idx} style={{ borderBottom: '1px solid #edf2f7' }}>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                {fb.gender === 'FEMALE' ? <FemaleAvatar size={36} /> : <MaleAvatar size={36} />}
                                                <span style={{ fontWeight: '600', color: '#1a202c' }}>{fb.studentName}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#718096', fontSize: '14px' }}>{fb.domain}</td>
                                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                            <StarRating rating={fb.rating} />
                                        </td>
                                        <td style={{ padding: '16px 20px', color: '#4a5568', fontSize: '14px', maxWidth: '300px' }}>
                                            {fb.comment?.length > 80 ? fb.comment.substring(0, 80) + '...' : fb.comment}
                                        </td>
                                        <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDeleteClick(fb)}
                                                style={{
                                                    background: '#fed7d7',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px 16px',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    color: '#c53030',
                                                    fontWeight: '600',
                                                    fontSize: '13px',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onMouseOver={(e) => e.target.style.background = '#feb2b2'}
                                                onMouseOut={(e) => e.target.style.background = '#fed7d7'}
                                            >
                                                <FiTrash2 size={14} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Back Button */}
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button
                        className="btn-primary"
                        onClick={() => navigate('/admin-dashboard')}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                    >
                        <FiArrowLeft /> Back to Admin Dashboard
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.open && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className="colorful-card" style={{
                        padding: '40px',
                        maxWidth: '400px',
                        textAlign: 'center',
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        <FiAlertTriangle size={48} style={{ color: '#ed8936', marginBottom: '20px' }} />
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '15px' }}>
                            Delete Feedback?
                        </h3>
                        <p style={{ color: '#718096', marginBottom: '30px' }}>
                            Are you sure you want to delete feedback from <strong>{deleteModal.feedback?.studentName}</strong>? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button
                                onClick={handleCancelDelete}
                                style={{
                                    padding: '12px 30px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '12px',
                                    background: '#fff',
                                    color: '#4a5568',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={deleting}
                                style={{
                                    padding: '12px 30px',
                                    border: 'none',
                                    borderRadius: '12px',
                                    background: '#e53e3e',
                                    color: '#fff',
                                    fontWeight: '600',
                                    cursor: deleting ? 'not-allowed' : 'pointer',
                                    opacity: deleting ? 0.7 : 1
                                }}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFeedbackManagement;
