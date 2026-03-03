import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Welcome from './pages/Welcome';
import About from './pages/About';
import Contact from './pages/Contact';

// Basic components (Fast loading)
import Login from './components/Login';
import Register from './components/Register';
import StudentSection from './pages/StudentSection';
import EducationDetails from './components/EducationDetails';
import CRMLanding from './components/CRMLanding';
import AdminLogin from './components/AdminLogin';

// Heavy components (Lazy Loading)
const TestPage = lazy(() => import('./components/TestPage'));
const ResultPage = lazy(() => import('./components/ResultPage'));
const AIAssistant = lazy(() => import('./components/AIAssistant'));
const MentorshipPage = lazy(() => import('./components/MentorshipPage'));
const FeedbackPage = lazy(() => import('./components/FeedbackPage'));
const SessionsPage = lazy(() => import('./components/SessionsPage'));
const TopicSessions = lazy(() => import('./components/TopicSessions'));
const BooksPage = lazy(() => import('./components/BooksPage'));
const PlacementCRM = lazy(() => import('./components/PlacementCRM'));
const AdminDashboard = lazy(() => import('./pages/Admin/AdminDashboard'));
const StudentCRM = lazy(() => import('./components/StudentCRM'));
const AdminFeedbackManagement = lazy(() => import('./components/AdminFeedbackManagement'));
const TrainerDashboard = lazy(() => import('./components/TrainerDashboard'));
const TrainerLogin = lazy(() => import('./components/TrainerLogin'));
const RetestRequestPage = lazy(() => import('./components/RetestRequestPage'));


import TrainerSection from './pages/TrainerSection';
import CourseDetail from './pages/CourseDetail';
import Dashboard from './pages/Dashboard';

import './App.css';
import './PROJECT_styles.css';

// Simple Loader Component
const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
    <div className="spinner-border text-primary" role="status"></div>
  </div>
);

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/welcome" element={<StudentSection />} />
            <Route path="/student-dashboard" element={<StudentSection />} />
            <Route path="/education" element={<EducationDetails />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/mentorship" element={<MentorshipPage />} />
            <Route path="/one-on-one" element={<MentorshipPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/sessions" element={<SessionsPage />} />
            <Route path="/topic-sessions" element={<TopicSessions />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/crm" element={<CRMLanding />} />
            <Route path="/student-crm" element={<StudentCRM />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-feedbacks" element={<AdminFeedbackManagement />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/trainer-login" element={<TrainerLogin />} />
            <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
            <Route path="/retest-request" element={<RetestRequestPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />

          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
