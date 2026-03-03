import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CRMLeads = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState([]);

    useEffect(() => {
        const admin = localStorage.getItem("admin");
        if (!admin) {
            navigate("/admin/login");
            return;
        }

        // Fetch from Admin Backend (Port 5001)
        console.log("Fetching CRM Leads from /api/admin/crm/leads...");
        fetch("/api/admin/crm/leads")
            .then((res) => {
                console.log("CRM Leads Response Status:", res.status);
                return res.json();
            })
            .then((data) => {
                console.log("CRM Leads Data:", data);
                if (Array.isArray(data)) {
                    setLeads(data);
                } else {
                    console.error("CRM Leads API returned non-array:", data);
                    setLeads([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch leads:", err);
                setLeads([]);
            });
    }, [navigate]);

    return (
        <div style={{ padding: "30px" }}>
            <h2>📋 CRM Leads</h2>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                }}
            >
                <thead>
                    <tr style={{ background: "#f1f5f9" }}>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Test Result</th>
                        <th>Recommended Path</th>
                        <th>Status</th>
                        <th>AI Assistant</th>
                    </tr>
                </thead>
                <tbody>
                    {leads.map((lead) => (
                        <tr key={lead.lead_id}>
                            <td>{lead.fullName}</td>
                            <td>{lead.email}</td>
                            <td>{lead.mobile}</td>
                            <td>{lead.test_result}</td>
                            <td>{lead.recommended_path}</td>
                            <td>{lead.lead_status}</td>
                            <td style={{ textAlign: 'center' }}>
                                <button
                                    onClick={() => navigate('/ai-assistant', { state: { student: lead } })}
                                    style={{
                                        background: 'linear-gradient(135deg, #7edbd4, #a8b3e8)',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        margin: '0 auto'
                                    }}
                                    title="AI Career Guidance"
                                >
                                    🤖 AI
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CRMLeads;
