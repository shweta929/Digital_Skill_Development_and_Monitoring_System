import React, { useState, useEffect, useCallback } from 'react';
import './ReviewSection.css';

// Avatar SVG components (lightweight, theme-safe)
const MaleAvatar = () => (
    <svg viewBox="0 0 100 100" width="60" height="60">
        <circle cx="50" cy="50" r="48" fill="#e3f2fd" />
        <circle cx="50" cy="38" r="18" fill="#90caf9" />
        <ellipse cx="50" cy="80" rx="28" ry="22" fill="#90caf9" />
        <circle cx="42" cy="35" r="3" fill="#1a237e" />
        <circle cx="58" cy="35" r="3" fill="#1a237e" />
        <path d="M44 45 Q50 50 56 45" stroke="#1a237e" strokeWidth="2" fill="none" />
    </svg>
);

const FemaleAvatar = () => (
    <svg viewBox="0 0 100 100" width="60" height="60">
        <circle cx="50" cy="50" r="48" fill="#fce4ec" />
        <circle cx="50" cy="38" r="18" fill="#f48fb1" />
        <ellipse cx="50" cy="80" rx="28" ry="22" fill="#f48fb1" />
        <circle cx="42" cy="35" r="3" fill="#880e4f" />
        <circle cx="58" cy="35" r="3" fill="#880e4f" />
        <path d="M44 45 Q50 50 56 45" stroke="#880e4f" strokeWidth="2" fill="none" />
        <path d="M30 25 Q50 5 70 25" stroke="#f48fb1" strokeWidth="8" fill="none" />
    </svg>
);

// Star Rating Component
const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} style={{ color: i <= rating ? '#ffc107' : '#e0e0e0', fontSize: '18px' }}>★</span>
        );
    }
    return <div className="star-rating">{stars}</div>;
};

const ReviewSection = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [currentBatch, setCurrentBatch] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                // Fetch from correct backend (MySQL)
                const res = await fetch("/api/students/feedback");
                const data = await res.json();
                if (res.ok && data.length > 0) {
                    // Enhance data with assumed fields if missing
                    const enhanced = data.map((fb, idx) => ({
                        ...fb,
                        gender: fb.gender || (idx % 2 === 0 ? 'MALE' : 'FEMALE'),
                        domain: fb.domain || 'Career Guidance',
                        rating: fb.rating || 5
                    }));
                    setFeedbacks(enhanced);
                }
            } catch (err) {
                console.error("Failed to fetch feedback", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, []);

    // Auto-rotation every 5 seconds (NEVER stops)
    useEffect(() => {
        if (feedbacks.length <= 3) return;

        const batchCount = Math.ceil(feedbacks.length / 3);
        const timer = setInterval(() => {
            setCurrentBatch((prev) => (prev + 1) % batchCount);
        }, 3000);

        return () => clearInterval(timer);
    }, [feedbacks]);

    // Get current 3 cards to display
    const getVisibleCards = useCallback(() => {
        if (feedbacks.length === 0) return [];
        if (feedbacks.length <= 3) return feedbacks;

        const startIdx = (currentBatch * 3) % feedbacks.length;
        const cards = [];
        for (let i = 0; i < 3; i++) {
            cards.push(feedbacks[(startIdx + i) % feedbacks.length]);
        }
        return cards;
    }, [feedbacks, currentBatch]);

    const visibleCards = getVisibleCards();

    if (loading) return null;
    if (feedbacks.length === 0) return null;

    return (
        <section className="feedback-section">
            <div className="container-welcome">
                <h2 className="section-title-large">What Our Students Say</h2>

                <div className="feedback-carousel-container">
                    <div className="feedback-carousel-track">
                        {visibleCards.map((fb, idx) => {
                            // Position: 0=left, 1=center, 2=right
                            const position = idx === 0 ? 'left' : idx === 1 ? 'center' : 'right';

                            return (
                                <div
                                    key={fb._id || fb.id || idx}
                                    className={`feedback-card-advanced ${position}`}
                                >
                                    <div className="feedback-card-inner">
                                        {/* Avatar + Name + Domain */}
                                        <div className="feedback-header">
                                            <div className="feedback-avatar">
                                                {fb.gender === 'FEMALE' ? <FemaleAvatar /> : <MaleAvatar />}
                                            </div>
                                            <div className="feedback-meta">
                                                <h4 className="feedback-name">{fb.studentName}</h4>
                                                <span className="feedback-domain">{fb.domain}</span>
                                            </div>
                                        </div>

                                        {/* Star Rating */}
                                        <StarRating rating={fb.rating} />

                                        {/* Feedback Text */}
                                        <p className="feedback-text">
                                            "{fb.comment?.length > 120 ? fb.comment.substring(0, 120) + '...' : fb.comment}"
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pagination Dots */}
                {feedbacks.length > 3 && (
                    <div className="feedback-pagination">
                        {Array.from({ length: Math.ceil(feedbacks.length / 3) }).map((_, idx) => (
                            <div
                                key={idx}
                                className={`feedback-dot ${idx === currentBatch ? 'active' : ''}`}
                                onClick={() => setCurrentBatch(idx)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ReviewSection;
