import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OneOnOneMeeting.css';

const CareerResult = () => {
    const navigate = useNavigate();
    const [result, setResult] = useState('Loading...');

    useEffect(() => {
        const studentId = localStorage.getItem('studentId');
        const fetchResult = async () => {
            try {
                const res = await fetch(`/api/students/result?studentId=${studentId}`);
                const data = await res.json();
                setResult(data.interest || 'Software Development');
            } catch (err) {
                setResult('Error loading result');
            }
        };
        fetchResult();
    }, []);

    return (
        <div className="one-on-one-page">
            <div className="bg-decor-orb orb-1"></div>
            <div className="container-one-on-one">
                <div className="glass-card">
                    <div className="prompt-content">
                        <div className="icon-wrapper">
                            <span role="img" aria-label="rocket">🚀</span>
                        </div>
                        <h1>Your Results Are In!</h1>
                        <p style={{ fontSize: '1.2rem', margin: '20px 0', color: '#1e293b' }}>
                            Your ideal career path is: <br />
                            <strong style={{ color: '#2563eb', fontSize: '1.5rem' }}>{result}</strong>
                        </p>

                        <p>Take the next step in your career with a personalized session.</p>

                        <button
                            className="schedule-btn"
                            onClick={() => navigate('/one-on-one')}
                        >
                            Schedule One-on-One Meeting
                        </button>

                        <button
                            className="back-btn"
                            onClick={() => navigate('/student-dashboard')}
                            style={{ background: 'transparent', color: '#64748b', marginTop: '10px' }}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerResult;
