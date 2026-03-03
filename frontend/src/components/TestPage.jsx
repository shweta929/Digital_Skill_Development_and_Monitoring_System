import React, { useEffect, useState } from "react";
import { getQuestions } from "../api/questions";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiClock, FiLayers } from "react-icons/fi";
import BackButton from "./BackButton";
import "../PROJECT_styles.css";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [canTakeTest, setCanTakeTest] = useState(null); // null = checking, true/false = result
  const navigate = useNavigate();

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));

    // RETEST BLOCKING: Check if student can take test
    const checkTestEligibility = async () => {
      if (student?.id) {
        try {
          const res = await fetch(`/api/students/can-take/${student.id}`);
          if (res.ok) {
            const data = await res.json();
            if (!data.canTakeTest) {
              // Redirect to retest request page
              alert("⚠️ You have already taken the test. Please request a retest.");
              navigate("/retest-request");
              return;
            }
          }
        } catch (err) {
          console.log("Could not verify test eligibility, allowing test");
        }
      }
      setCanTakeTest(true);
    };

    checkTestEligibility();

    const fetchQuestions = async () => {
      const data = await getQuestions();
      setQuestions(data);
    };
    fetchQuestions();
  }, [navigate]);


  const handleRandomSelect = () => {
    const randomAnswers = {};
    questions.forEach((q) => {
      const letters = ["A", "B", "C", "D"];
      const randIndex = Math.floor(Math.random() * 4);
      const letter = letters[randIndex];
      const text = q.options[randIndex];
      randomAnswers[q.id] = `${letter}: ${text}`;
    });
    setAnswers(randomAnswers);
  };

  const handleChange = (qid, letter, text) => {
    setAnswers({ ...answers, [qid]: `${letter}: ${text}` });
  };

  const handleSubmit = async () => {
    // VALIDATION: All questions must be answered
    if (Object.keys(answers).length < questions.length) {
      const unanswered = questions.length - Object.keys(answers).length;
      alert(`⚠️ Please answer all questions! You have ${unanswered} unanswered question(s).`);
      return;
    }

    let systems = 0, enterprise = 0, automation = 0, intelligence = 0;
    Object.entries(answers).forEach(([qid, value]) => {
      const letter = value.split(":")[0];
      if (letter === "A") systems++;
      else if (letter === "B") enterprise++;
      else if (letter === "C") automation++;
      else if (letter === "D") intelligence++;
    });

    const result = { systems, enterprise, automation, intelligence };
    const maxScore = Math.max(systems, enterprise, automation, intelligence);
    let language = ""; let career = "";
    if (maxScore === systems) { language = "C / C++"; career = "Cybersecurity Core / System Performance Engineering"; }
    else if (maxScore === enterprise) { language = "Java"; career = "Cloud / Enterprise Backend / Product Engineer"; }
    else if (maxScore === automation) { language = "Python (Automation/Scripting)"; career = "DevOps / Infra / SecOps / Cloud Tooling"; }
    else if (maxScore === intelligence) { language = "Python (Data/ML/AI)"; career = "Machine Learning / Data Science / AI Engineer"; }

    // Save test result to consolidated backend (Project_Cdac - Port 5001)
    const student = JSON.parse(localStorage.getItem("student"));
    if (student?.id) {
      try {
        const response = await fetch("/api/students/save-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: student.id,
            systems_score: systems,
            enterprise_score: enterprise,
            automation_score: automation,
            intelligence_score: intelligence,
            primary_language: language,
            recommended_career: career,
            strongest_domain: language.split(" ")[0] // Simplified domain mapping
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Test saved successfully:", data);

          // CRITICAL: Update local student data with newest domain/test status
          if (data.student) {
            localStorage.setItem("student", JSON.stringify(data.student));
          }
        }
      } catch (err) {
        console.error("Failed to save test result:", err);
      }
    }

    navigate("/result", { state: { result, language, career } });
  };

  const progress = Math.round((Object.keys(answers).length / questions.length) * 100) || 0;

  return (
    <div className="auth-page" style={{ flexDirection: 'column', alignItems: 'center', paddingTop: '60px' }}>
      <BackButton />
      <div className="auth-logo">
        <img src="/logo.png" alt="Career Credentials" />
      </div>

      <div className="assessment-sheet">
        <div style={{ borderBottom: '2px solid #edeff2', paddingBottom: '30px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#1a202c' }}>Career Discovery Assessment</h1>
            <p style={{ color: '#718096', marginTop: '8px', fontSize: '16px' }}>Understand your strengths and find your ideal career path</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              className="btn-outline-primary"
              style={{ height: '44px', padding: '0 20px', borderRadius: '12px', border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: '600', cursor: 'pointer' }}
              onClick={handleRandomSelect}
            >
              Quick Fill 🎲
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>Assessment Progress</span>
            <span style={{ fontWeight: '700', color: '#667eea' }}>{progress}%</span>
          </div>
          <div style={{ background: 'var(--input-bg)', height: '12px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{
              background: 'linear-gradient(90deg, #3182ce, #63b3ed)',
              height: '100%',
              width: `${progress}%`,
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        <div className="questions-container">
          {questions.map((q, index) => (
            <div
              key={q.id}
              style={{
                marginBottom: "50px",
                paddingBottom: "40px",
                borderBottom: "1px solid #f0f4f8"
              }}
            >
              <h4 style={{ fontWeight: "700", fontSize: '20px', marginBottom: "25px", color: 'var(--text-primary)', display: 'flex', gap: '15px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{index + 1}.</span> {q.question}
              </h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {q.options.map((opt, idx) => {
                  const letter = ["A", "B", "C", "D"][idx];
                  const isSelected = answers[q.id]?.startsWith(letter);
                  return (
                    <label
                      key={idx}
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        padding: "20px 25px",
                        borderRadius: "16px",
                        background: isSelected ? "var(--bg-color)" : "var(--input-bg)",
                        border: isSelected ? "2px solid #667eea" : "2px solid var(--border-color)",
                        cursor: "pointer",
                        transition: 'all 0.2s ease',
                        boxShadow: isSelected ? '0 10px 20px rgba(102, 126, 234, 0.1)' : 'none',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <input
                        type="radio"
                        name={`q${q.id}`}
                        style={{ width: '20px', height: '20px', accentColor: '#667eea' }}
                        checked={isSelected}
                        onChange={() => handleChange(q.id, letter, opt)}
                      />
                      <span style={{ fontSize: '16px', color: isSelected ? '#667eea' : 'var(--text-primary)' }}>
                        <b style={{ marginRight: '8px' }}>{letter}.</b> {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            style={{ maxWidth: '400px', margin: '0 auto', fontSize: '18px', height: '64px' }}
          >
            Submit My Assessment {Object.keys(answers).length < questions.length ? `(${Object.keys(answers).length}/${questions.length})` : '✅'}
          </button>
          <p style={{ color: '#a0aec0', marginTop: '20px', fontSize: '14px' }}>Please review your answers before submitting. You cannot change them later.</p>
        </div>
      </div>

      <p className="auth-footer" style={{ width: '100%', padding: '40px 0' }}>© 2025 Career Credentials - Assessment Division</p>
    </div>
  );
};

export default TestPage;
