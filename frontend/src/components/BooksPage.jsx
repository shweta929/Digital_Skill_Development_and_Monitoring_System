import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import "../PROJECT_styles.css";

const BooksPage = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);
    const [viewingPdf, setViewingPdf] = useState(false);

    const student = JSON.parse(localStorage.getItem("student"));

    const roadmaps = [
        { id: 'r1', title: "Java Roadmap", pdf: "Java Roadmap by Career Credentials.pdf", icon: "☕", overview: "Complete path from basics to enterprise master." },
        { id: 'r2', title: "Python Roadmap", pdf: "Python Roadmap by Career Credentials.pdf", icon: "🐍", overview: "Step-by-step guide to data science and automation." },
        { id: 'r3', title: "MongoDB Roadmap", pdf: "MongoDB Roadmap by Career Credentials.pdf", icon: "🍃", overview: "Master NoSQL database design and scaling." },
        { id: 'r4', title: "Prompt Engineering", pdf: "Prompt Engineering Roadmap By Career Credentials.pdf", icon: "🤖", overview: "Unlock the power of Generative AI." },
    ];

    const coreBooks = [
        { id: 'b1', title: "Algorithms Master", pdf: "Algorithms Notes by Career Credentials .pdf", icon: "📊", desc: "Complex problem solving made simple." },
        { id: 'b2', title: "DSA Interview Prep", pdf: "Data Structures and Algorithms Interview Preparation Codes By Career Credentials.pdf", icon: "💻", desc: "Top 100+ coding interview problems." },
        { id: 'b3', title: "Effective Java", pdf: "Effective Java.pdf", icon: "⭐", desc: "Best practices for professional development." },
        { id: 'b4', title: "Java Core Notes", pdf: "Java Notes by Career Credentials.pdf", icon: "📔", desc: "Comprehensive technical interview reference." },
        { id: 'b5', title: "Objective C Master", pdf: "Objective C Notes by Career Credentials.pdf", icon: "🍎", desc: "Legacy system and iOS core foundations." },
        { id: 'b6', title: "Python Deep Dive", pdf: "Python Notes by Career Credentials.pdf", icon: "📜", desc: "Advanced syntax and internal mechanisms." },
        { id: 'b7', title: "Spring Framework", pdf: "Spring Framework Notes by Career Credentials.pdf", icon: "🍃", desc: "Enterprise cloud application architecture." },
        { id: 'b8', title: "SQL Mastery", pdf: "SQL Notes by Career Credentials.pdf", icon: "🛢️", desc: "Database query optimization and management." },
    ];

    useEffect(() => {
        const fetchReadHistory = async () => {
            const id = student?.id || student?._id;
            if (id) {
                try {
                    const res = await fetch(`/api/students/sync/${student.email}`);
                    if (res.ok) {
                        const data = await res.json();
                        // Assume data contains readBooks or similar
                    }
                } catch (err) {
                    console.error("Sync error:", err);
                }
            }
            setLoading(false);
        };
        fetchReadHistory();
    }, []);

    const [readBooks, setReadBooks] = useState(() => {
        const saved = localStorage.getItem(`read_books_${student?.id || student?._id}`);
        return saved ? JSON.parse(saved) : [];
    });

    const openBook = async (book) => {
        setSelectedBook(book);
        setViewingPdf(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // CRM Track
        const id = student?.id || student?._id;
        if (id) {
            try {
                await fetch("/api/students/read-book", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: id, bookId: book.id, title: book.title })
                });

                if (!readBooks.find(rb => rb.id === book.id)) {
                    const updated = [...readBooks, { ...book, timestamp: new Date().toLocaleString() }];
                    setReadBooks(updated);
                    localStorage.setItem(`read_books_${id}`, JSON.stringify(updated));
                }
            } catch (err) {
                console.log("Tracking failed offline?");
            }
        }
    };

    const BookCard = ({ book, isRoadmap = false, isCompleted = false }) => (
        <div
            className="glass-card"
            style={{
                padding: '24px',
                borderRadius: '24px',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = '#667eea'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
        >
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>{book.icon}</div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>{book.title}</h3>
                    {isCompleted && <span style={{ background: '#48bb78', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: '700' }}>DONE</span>}
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{book.overview || book.desc || "Verified Technical Material"}</p>
                {isCompleted && <p style={{ fontSize: '12px', color: '#48bb78', marginTop: '10px', fontWeight: 'bold' }}>Finished: {book.timestamp}</p>}
            </div>

            <button
                className="btn-primary"
                style={{ marginTop: '20px', height: '45px', borderRadius: '12px', fontSize: '14px', background: isCompleted ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                onClick={() => openBook(book)}
            >
                {isRoadmap ? "📝 Read Roadmap" : isCompleted ? "🔄 Reopen Source" : "📘 Read Book"}
            </button>
        </div>
    );

    if (viewingPdf && selectedBook) {
        return (
            <div className="auth-page full-height" style={{ display: 'block', background: '#0d1117' }}>
                <div className="container-fluid" style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <button
                            className="back-btn"
                            style={{ background: 'transparent', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            onClick={() => { setViewingPdf(false); setSelectedBook(null); }}
                        >
                            <span style={{ fontSize: '24px' }}>←</span> <span style={{ fontWeight: '600' }}>Back to Books</span>
                        </button>
                        <h2 style={{ color: '#fff', fontSize: '20px', fontWeight: '700' }}>{selectedBook.title}</h2>
                        <div style={{ width: '100px' }} />
                    </div>
                    <div style={{ height: '85vh', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                        <iframe
                            src={`/src/assets/Books/${selectedBook.pdf}#toolbar=0`}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                            title={selectedBook.title}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const filteredRoadmaps = roadmaps.filter(b => !readBooks.find(rb => rb.id === b.id));
    const filteredCore = coreBooks.filter(b => !readBooks.find(rb => rb.id === b.id));

    return (
        <div className="auth-page full-height" style={{ display: 'block', padding: '40px 0', overflowY: 'auto' }}>
            <BackButton />
            <div className="auth-logo" style={{ marginBottom: '30px', textAlign: 'center' }}>
                <img src="/logo.png" alt="Career Credentials" style={{ height: '60px' }} />
            </div>

            <div className="container-fluid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 30px' }}>
                <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '42px', fontWeight: '900', color: '#fff', marginBottom: '15px' }}>Knowledge Hub</h1>
                    <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', maxWidth: '700px', margin: '0 auto' }}>
                        Premium technical curriculum and career transition roadmaps curated for excellence.
                    </p>
                </header>

                {/* Section 1: Roadmaps */}
                {filteredRoadmaps.length > 0 && (
                    <section style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '30px', borderLeft: '5px solid #667eea', paddingLeft: '15px' }}>🔵 Your Career Roadmaps</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                            {filteredRoadmaps.map(book => <BookCard key={book.id} book={book} isRoadmap />)}
                        </div>
                    </section>
                )}

                {/* Section 2: Core Books */}
                {filteredCore.length > 0 && (
                    <section style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '30px', borderLeft: '5px solid #48bb78', paddingLeft: '15px' }}>🟢 Core Technical Library</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                            {filteredCore.map(book => <BookCard key={book.id} book={book} />)}
                        </div>
                    </section>
                )}

                {/* Section 3: Completed */}
                {readBooks.length > 0 && (
                    <section style={{ marginBottom: '60px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '30px', borderLeft: '5px solid #764ba2', paddingLeft: '15px' }}>🟣 Completed Achievements</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                            {readBooks.map(book => <BookCard key={book.id} book={book} isCompleted />)}
                        </div>
                    </section>
                )}

                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <button className="btn-primary dashboard-btn" style={{ minWidth: '300px', height: '60px', fontSize: '18px' }} onClick={() => navigate("/welcome")}>
                        ← Back to Career Dashboard
                    </button>
                </div>
            </div>
            <p className="auth-footer" style={{ marginTop: '80px' }}>© 2025 Career Credentials</p>
        </div>
    );
};

export default BooksPage;
