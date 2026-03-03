import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, icon, delay, onClick }) => {
    return (
        <div
            className="dashboard-card"
            style={{ animationDelay: `${delay}s` }}
            onClick={onClick}
        >
            <div className="card-icon-wrapper">
                <span className="card-icon">{icon}</span>
            </div>
            <h3>{title}</h3>
            <div className="card-hover-bg"></div>
        </div>
    );
};

export default DashboardCard;
