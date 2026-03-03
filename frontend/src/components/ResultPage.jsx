import React, { useMemo, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiAward, FiArrowRight, FiRefreshCw, FiCalendar, FiMap } from "react-icons/fi";
import AskAIChat from "./AskAI/AskAIChat";
import BackButton from "./BackButton";
import "../PROJECT_styles.css";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAIChat, setShowAIChat] = useState(false);

  const { state } = location || {};
  const { result, language, career } = state || {};
  const student = JSON.parse(localStorage.getItem("student"));
  // ... existing memo and useEffect logic ...
  const scores = result || { systems: 0, enterprise: 0, automation: 0, intelligence: 0 };
  const maxScore = Math.max(...Object.values(scores), 1);

  const bars = useMemo(() => {
    return [
      { key: "systems", label: "Systems", value: scores.systems, color: '#3b82f6' },
      { key: "enterprise", label: "Enterprise", value: scores.enterprise, color: '#8b5cf6' },
      { key: "automation", label: "Automation", value: scores.automation, color: '#10b981' },
      { key: "intelligence", label: "Intelligence", value: scores.intelligence, color: '#f59e0b' },
    ].map((b) => ({
      ...b,
      percent: Math.round((b.value / maxScore) * 100),
    }));
  }, [scores, maxScore]);

  const bestDomain = bars.reduce((best, curr) => curr.value > best.value ? curr : best);

  useEffect(() => {
    if (!student || !language || !career) return;
    fetch("/api/test/save-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: student.id,
        primary_language: language,
        recommended_career: career,
        strongest_domain: bestDomain.label,
        systems_score: scores.systems,
        enterprise_score: scores.enterprise,
        automation_score: scores.automation,
        intelligence_score: scores.intelligence,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ result saved:", data))
      .catch((err) => console.error("❌ error saving result:", err));
  }, [student, language, career, bestDomain.label, scores]);

  return (
    <div className="auth-page" style={{ alignItems: 'center', padding: '60px 20px' }}>
      <BackButton />
      {showAIChat && (
        <AskAIChat
          onClose={() => setShowAIChat(false)}
          initialData={{
            tech: career || language,
            domain: bestDomain.label,
            scores: scores,
            studentName: student?.fullName
          }}
        />
      )}

      <div className="auth-logo">
        <img src="/logo.png" alt="Career Credentials" />
      </div>

      <div className="auth-container" style={{ maxWidth: '850px' }}>
        <div className="colorful-card" style={{ padding: '48px' }}>
// ... rest of the component ...
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: '#f0fdf4', marginBottom: '20px' }}>
              <FiAward style={{ fontSize: '48px', color: '#22c55e' }} />
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 10px' }}>Congratulations!</h2>
            <p style={{ fontSize: '16px', color: '#64748b' }}>
              <b>{student?.fullName || "Student"}</b>, your personalized career roadmap is ready.
            </p>
          </div>

          <div className="row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '40px' }}>

            {/* Primary Result */}
            <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', padding: '30px', borderRadius: '24px', border: '1px solid #bfdbfe' }}>
              <h4 style={{ margin: '0 0 20px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>
                Key Recommendation
              </h4>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: '0 0 5px', fontSize: '13px', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Language Mastery</p>
                <p style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#111827' }}>{language || "In Analysis"}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 5px', fontSize: '13px', color: '#1e40af', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recommended Role</p>
                <p style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b', lineHeight: 1.4 }}>{career || "Evaluating..."}</p>
              </div>
            </div>

            {/* Stats Summary */}
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: '0 0 20px', fontSize: '18px' }}>Analytics Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bars.map(item => (
                  <div key={item.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                      <span style={{ fontWeight: '600', color: '#475569' }}>{item.label}</span>
                      <span style={{ fontWeight: '700', color: item.color }}>{item.value} pts</span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.percent}%`, height: '100%', background: item.color, borderRadius: '4px', transition: 'width 1s ease' }}></div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '20px', fontSize: '13px', textAlign: 'center', color: '#64748b' }}>
                You are strongest in <b>{bestDomain.label}</b> domain.
              </p>
            </div>
          </div>

          <div style={{ background: '#fef3c7', padding: '24px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h5 style={{ margin: '0 0 5px', fontSize: '16px', fontWeight: '700', color: '#92400e' }}>Ready to start your journey?</h5>
              <p style={{ margin: 0, fontSize: '14px', color: '#b45309' }}>Generate a week-by-week roadmap with AI Assistant</p>
            </div>
            <button
              className="btn-primary"
              style={{ height: '48px', width: 'auto', padding: '0 25px', background: '#d97706', boxShadow: 'none' }}
              onClick={() => setShowAIChat(true)}
            >
              <FiMap style={{ marginRight: '10px' }} /> Explore Roadmap
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <button className="btn-primary" style={{ padding: '0 30px' }} onClick={() => navigate("/welcome")}>
              Go to Dashboard <FiArrowRight style={{ marginLeft: '10px' }} />
            </button>
            <button className="btn-outline-primary" style={{ height: '54px', border: '1.5px solid #e2e8f0', background: '#fff' }} onClick={() => navigate("/one-on-one")}>
              Schedule Mentorship <FiCalendar style={{ marginLeft: '10px' }} />
            </button>
            <button className="btn-outline-primary" style={{ height: '54px', border: '1.5px solid #e2e8f0', background: '#fff' }} onClick={() => navigate("/test")}>
              Try Again <FiRefreshCw style={{ marginLeft: '10px' }} />
            </button>
          </div>

        </div>
        <p className="auth-footer text-center mt-4">© 2025 Career Credentials</p>
      </div>
    </div>
  );
};

export default ResultPage;
