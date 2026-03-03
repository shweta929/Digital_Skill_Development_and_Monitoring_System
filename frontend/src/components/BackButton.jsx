import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <div className="back-btn-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <FiArrowLeft /> Back
            </button>
        </div>
    );
};

export default BackButton;
