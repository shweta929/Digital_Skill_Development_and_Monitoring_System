import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../PROJECT_styles.css';
import BackButton from './BackButton';

const CRMLanding = () => {
    const navigate = useNavigate();

    return (
        <div className="auth-page full-height">
            <BackButton />
            <div className="auth-container" style={{ textAlign: 'center' }}>
                <div className="colorful-card auth-card" style={{ padding: '60px', borderRadius: '32px' }}>
                    <div style={{ fontSize: '80px', marginBottom: '30px' }}>🔐</div>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', color: '#1a202c', marginBottom: '20px' }}>
                        Welcome to Career Credential CRM
                    </h1>
                    <p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px', maxWidth: '500px', margin: '0 auto 40px' }}>
                        Access student leads, placement analytics, and recruitment coordination tools.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '300px', margin: '0 auto' }}>
                        <button
                            className="btn-primary"
                            style={{ padding: '15px' }}
                            onClick={() => navigate("/admin-login")}
                        >
                            Login as Admin
                        </button>
                        <button
                            className="btn-outline-primary"
                            style={{ padding: '15px' }}
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>
                    </div>
                </div>
                <p className="auth-footer" style={{ marginTop: '40px' }}>© 2025 Career Credentials</p>
            </div>
        </div>
    );
};

export default CRMLanding;
