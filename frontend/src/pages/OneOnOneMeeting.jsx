import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OneOnOneMeeting.css';

const OneOnOneMeeting = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [meetingInfo, setMeetingInfo] = useState(null);

    const handleSchedule = async () => {
        const studentId = localStorage.getItem('studentId');

        if (!studentId) {
            setMessage('❌ Student ID not found. Please log in first.');
            return;
        }

        setLoading(true);
        setMessage('🔄 Scheduling your meeting...');

        try {
            const response = await fetch('/api/meetings/smart-auto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    note: 'Requested via One-on-One Meeting feature',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setMeetingInfo(data.meeting);
                setMessage('');
            } else {
                setMessage(`❌ ${data.error || 'Failed to schedule meeting'}`);
            }
        } catch (error) {
            console.error('Error scheduling meeting:', error);
            setMessage('❌ Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="one-on-one-page">
            <div className="bg-decor-orb orb-1"></div>
            <div className="bg-decor-orb orb-2"></div>

            <div className="container-one-on-one">
                <div className="glass-card">
                    {!success ? (
                        <div className="prompt-content">
                            <div className="icon-wrapper">
                                <span role="img" aria-label="meeting">🤝</span>
                            </div>
                            <h1>One-on-One Guidance</h1>
                            <p>Would you like to schedule a one-on-one meeting with our expert trainer?</p>

                            <button
                                className={`schedule-btn ${loading ? 'loading' : ''}`}
                                onClick={handleSchedule}
                                disabled={loading}
                            >
                                {loading ? 'Scheduling...' : 'Schedule One-on-One Meeting'}
                            </button>

                            {message && <p className="status-message">{message}</p>}
                        </div>
                    ) : (
                        <div className="success-content">
                            <div className="icon-wrapper success">
                                <span role="img" aria-label="success">✅</span>
                            </div>
                            <h2>Meeting Scheduled!</h2>
                            <p className="success-text">
                                Your meeting has been scheduled for:<br />
                                <strong>{meetingInfo?.finalDate}</strong>
                            </p>
                            <p className="hint-text">Check your email for the invitation link.</p>

                            <button
                                className="back-btn"
                                onClick={() => navigate('/student-dashboard')}
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OneOnOneMeeting;
