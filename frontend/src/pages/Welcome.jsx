import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import ReviewSection from '../components/ReviewSection';
import { courses } from '../data/mockData';
import './Welcome.css';

function Welcome() {
    return (
        <div className="welcome-page">
            <div className="hero-container">
                <div className="hero-content">
                    <h1 className="hero-heading">
                        Accelerate Your <br />
                        <span className="hero-brand-highlight">Career Journey</span>
                    </h1>
                    <p className="hero-description">
                        Your trusted platform for managing and showcasing professional credentials.
                        Build your career profile, verify achievements, and unlock global opportunities.
                    </p>
                    <div className="hero-actions">
                        <Link to="/login" className="btn-hero-primary">
                            Get Started Now
                            <span className="arrow">→</span>
                        </Link>
                    </div>
                </div>

                <div className="hero-visual">
                    <div className="abstract-card" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                            src="/upcoming.jpg"
                            alt="Upcoming"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '40px'
                            }}
                        />
                    </div>
                </div>
            </div>

            <section className="welcome-courses-section">
                <div className="container-welcome">
                    <h2 className="section-title">Choose your learning path</h2>
                    <div className="course-grid">
                        {courses.slice(0, 4).map(course => (
                            <CourseCard
                                key={course.id}
                                course={course}
                                isInformational={true}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <ReviewSection />
        </div>
    );
}

export default Welcome;
