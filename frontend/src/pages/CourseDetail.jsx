import React from 'react';
import { useParams, Link } from 'react-router-dom';

import ChatbotIcon from '../components/ChatbotIcon';
import { courses } from '../data/mockData';
import './Dashboard.css'; // Reuse some basic layout styles

const CourseDetail = () => {
    const { id } = useParams();
    const course = courses.find(c => c.id === id);

    if (!course) return <div>Course not found</div>;

    return (
        <div className="dashboard-page">

            <main className="dashboard-main container" style={{ padding: '6rem 2rem' }}>
                <Link to="/dashboard" style={{ color: 'var(--primary-color)', fontWeight: 600, display: 'inline-block', marginBottom: '2rem' }}>
                    ← Back to Dashboard
                </Link>
                <h1 style={{ color: 'var(--primary-color)', fontSize: '3.5rem', marginBottom: '1.5rem' }}>{course.title}</h1>
                <div className="course-content-placeholder" style={{ background: '#f8fafc', padding: '4rem', borderRadius: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>{course.icon}</div>
                    <p style={{ fontSize: '1.4rem', color: '#4a5568', marginBottom: '2rem' }}>{course.description}</p>
                    <div style={{ border: '2px dashed #cbd5e0', padding: '3rem', borderRadius: '15px' }}>
                        <h3 style={{ color: '#718096' }}>Recorded Sessions Coming Soon...</h3>
                    </div>
                </div>
            </main>
            <ChatbotIcon />

        </div>
    );
};

export default CourseDetail;
