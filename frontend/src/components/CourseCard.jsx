import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course, isInformational = false }) => {
    const navigate = useNavigate();

    // Dynamically resolve image path from assets
    const getImageUrl = (imageName) => {
        return new URL(`../assets/courses/${imageName}`, import.meta.url).href;
    };

    const handleCardClick = () => {
        if (!isInformational) {
            navigate(`/course/${course.id}`);
        }
    };

    return (
        <div
            className={`course-card ${isInformational ? 'informational' : ''}`}
            onClick={handleCardClick}
        >
            <div className="card-image-wrapper">
                <img
                    src={getImageUrl(course.image)}
                    alt={course.title}
                    className="course-image-small"
                />
            </div>
            <div className="card-content">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>

                {isInformational && (
                    <div className="course-basic-info">
                        <div className="info-item">
                            <span className="info-label">Level:</span>
                            <span className="info-value">{course.level}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Duration:</span>
                            <span className="info-value">{course.duration}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Focus:</span>
                            <span className="info-value">{course.learningFocus}</span>
                        </div>
                    </div>
                )}

                {!isInformational && (
                    <button className="btn-get-started">
                        Get Started
                        <span className="arrow">→</span>
                    </button>
                )}
            </div>
            <div className="card-hover-bg"></div>
        </div>
    );
};

export default CourseCard;
