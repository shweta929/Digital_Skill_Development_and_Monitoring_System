import React, { useState, useEffect } from 'react';

const AdminRecordedSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topic, setTopic] = useState("Full Stack Java");
    const [newSession, setNewSession] = useState({
        topicName: "Full Stack Java",
        sessionNumber: "",
        title: "",
        description: "",
        videoUrl: ""
    });

    const topics = [
        "Full Stack Java",
        "Data Science & AI",
        "Cloud Computing (AWS/Azure)",
        "DevOps Engineering",
        "Cybersecurity"
    ];

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await fetch("http://localhost:8081/api/recorded-sessions");
            if (res.ok) {
                const data = await res.json();
                setSessions(data);
            }
        } catch (err) {
            console.error("Error fetching sessions:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSession = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8081/api/recorded-sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newSession,
                    sessionNumber: parseInt(newSession.sessionNumber)
                })
            });
            if (res.ok) {
                alert("Session added successfully! ✅");
                setNewSession({
                    topicName: topic,
                    sessionNumber: "",
                    title: "",
                    description: "",
                    videoUrl: ""
                });
                fetchSessions();
            }
        } catch (err) {
            alert("Failed to add session.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this session?")) return;
        try {
            const res = await fetch(`http://localhost:8081/api/recorded-sessions/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                alert("Session deleted. 🗑️");
                fetchSessions();
            }
        } catch (err) {
            alert("Delete failed.");
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm p-4" style={{ borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontWeight: '800', marginBottom: '20px' }}>Add New Session 🎥</h4>
                        <form onSubmit={handleAddSession}>
                            <div className="mb-3">
                                <label className="form-label">Course / Career Topic</label>
                                <select
                                    className="form-select"
                                    value={newSession.topicName}
                                    onChange={(e) => setNewSession({ ...newSession, topicName: e.target.value })}
                                    required
                                >
                                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Session Number</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    placeholder="e.g. 1"
                                    value={newSession.sessionNumber}
                                    onChange={(e) => setNewSession({ ...newSession, sessionNumber: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Session Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Intro to ML"
                                    value={newSession.title}
                                    onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Video URL (YouTube Embed or ID)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="https://www.youtube.com/embed/..."
                                    value={newSession.videoUrl}
                                    onChange={(e) => setNewSession({ ...newSession, videoUrl: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={newSession.description}
                                    onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary w-100 py-2" style={{ borderRadius: '12px', fontWeight: '700' }}>
                                Publish Session
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm" style={{ borderRadius: '20px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div className="card-header bg-white py-3 border-0">
                            <h4 className="mb-0" style={{ fontWeight: '800' }}>Manage Recordings</h4>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="px-4">Topic</th>
                                        <th>S.No</th>
                                        <th>Title</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="text-center py-5 text-muted">No sessions added yet.</td>
                                        </tr>
                                    ) : (
                                        sessions.map((s) => (
                                            <tr key={s.id}>
                                                <td className="px-4">
                                                    <span className="badge bg-soft-primary text-primary" style={{ background: '#eff6ff', color: '#3b82f6', padding: '6px 12px', borderRadius: '8px' }}>
                                                        {s.topicName}
                                                    </span>
                                                </td>
                                                <td>{s.sessionNumber}</td>
                                                <td>
                                                    <div style={{ fontWeight: '600' }}>{s.title}</div>
                                                    <small className="text-muted">{s.videoUrl.substring(0, 30)}...</small>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminRecordedSessions;
