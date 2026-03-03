const About = () => {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%)',
            minHeight: 'calc(100vh - 80px)'
        }}>
            {/* Mission Section */}
            <div style={{ textAlign: 'center', maxWidth: '1000px', marginBottom: '5rem' }}>
                <h1 style={{ color: '#1A365D', fontSize: '3.5rem', fontWeight: '900', marginBottom: '1.5rem', letterSpacing: '-1px' }}>About Us</h1>
                <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: '#4A5568', fontWeight: '500' }}>
                    At <span style={{ color: '#1A365D', fontWeight: '700' }}>Career Credential</span>, we're more than just an educational platform; we're a beacon of hope and a bridge to dreams.
                    We recognize the passion burning in each student, the aspirations held back by circumstances, and the untapped potential waiting to soar.
                    Our commitment is deeply rooted in the belief that education should be a heartfelt journey, not a race.
                    Guided by distinguished professionals, we aim to light the path for those seeking knowledge, irrespective of life's hurdles or the tick-tock of the daily grind.
                    Every course, every certification, is a testament to our promise: to empower you, touch lives, and transform futures, one dream at a time.
                </p>
            </div>

            {/* Profile Section */}
            <div style={{
                background: '#ffffff',
                borderRadius: '30px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
                padding: '3rem',
                maxWidth: '1100px',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'minmax(300px, 1fr) 2fr',
                gap: '3rem',
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '220px',
                        height: '220px',
                        background: 'linear-gradient(135deg, #1A365D 0%, #3182ce 100%)',
                        borderRadius: '25%',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '5rem',
                        boxShadow: '0 15px 35px rgba(49, 130, 206, 0.3)'
                    }}>
                        👨‍🏫
                    </div>
                    <h2 style={{ color: '#1A365D', fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Dr. Amar Panchal</h2>
                    <p style={{ color: '#3182ce', fontWeight: '700', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Career Architect</p>
                </div>

                <div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '2rem' }}>
                        {['TEDx Speaker', 'Global Teacher Award Winner', '23,000+ Students Trained', '30,000+ Hours of Mentorship'].map((tag, idx) => (
                            <span key={idx} style={{
                                background: '#edf2f7',
                                color: '#2d3748',
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                border: '1px solid #e2e8f0'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#4A5568', marginBottom: '1.5rem' }}>
                        Dr. Amar Panchal is one of India’s leading tech educators known for turning absolute beginners, including non-tech working professionals, into job-ready software developers in months, not years.
                    </p>
                    <p style={{ fontSize: '1.15rem', lineHeight: '1.7', color: '#4A5568', position: 'relative', paddingLeft: '1.5rem', borderLeft: '4px solid #3182ce' }}>
                        He holds a World Book of Records recognition for completing 30,000 hours of training and has been featured across multiple platforms for his innovative project-based teaching methodology.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
