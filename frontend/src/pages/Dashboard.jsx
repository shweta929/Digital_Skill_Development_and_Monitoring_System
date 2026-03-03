import React from 'react';

import CourseCard from '../components/CourseCard';
import ChatbotIcon from '../components/ChatbotIcon';
import { courses } from '../data/mockData';
import './Dashboard.css';

const Dashboard = () => {
    // Note: In a real app, this would come from the logged-in student's profile/backend
    // For demonstration, let's assume the student has selected 'java' and 'cpp'
    const [selectedCourseIds] = React.useState(['java', 'cpp', 'cloud', 'dsa']); // Showing all for now, but logic is ready

    const filteredCourses = courses.filter(course => selectedCourseIds.includes(course.id));

    return (
        <div className="dashboard-page">
            <main className="dashboard-main">
                <section className="dashboard-hero">
                    <div className="container-dashboard">
                        <h1>Choose your learning path</h1>
                        <p>Continue your learning journey with your selected courses.</p>
                    </div>
                </section>

                <section className="courses-section">
                    <div className="container-dashboard">
                        <h2 className="section-title">Your Learning Path</h2>
                        <div className="course-grid">
                            {filteredCourses.map(course => (
                                <CourseCard key={course.id} course={course} isInformational={false} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <ChatbotIcon />
        </div>
    );
};

export default Dashboard;
