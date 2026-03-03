import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OneOnOneMeeting.css'; // Reusing the same premium glass styles

const CareerTest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: localStorage.getItem('studentName') || '',
        email: localStorage.getItem('studentEmail') || '',
        phone: '',
        careerInterest: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('/api/students/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('studentId', data.student._id);
                navigate('/career-result');
            }
        } catch (error) {
            console.error('Test submission failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="one-on-one-page">
            <div className="bg-decor-orb orb-1"></div>
            <div className="container-one-on-one">
                <div className="glass-card">
                    <form onSubmit={handleSubmit} className="prompt-content">
                        <h1>Career Assessment</h1>
                        <p>Complete this quick test to find your ideal career path.</p>

                        <div style={{ textAlign: 'left', marginTop: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b' }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}
                            />

                            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b' }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}
                            />

                            <label style={{ display: 'block', marginBottom: '8px', color: '#64748b' }}>Do you enjoy solving logical problems?</label>
                            <select
                                name="careerInterest"
                                value={formData.careerInterest}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '15px' }}
                            >
                                <option value="">Select an option</option>
                                <option value="Software Development">Yes (Technical / Logical work)</option>
                                <option value="Design / Creative">No (Creative work)</option>
                            </select>
                        </div>

                        <button type="submit" className="schedule-btn" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Assessment'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CareerTest;
