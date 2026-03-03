function Contact() {
    return (
        <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem'
        }}>
            <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                <h1>Contact Us</h1>
                <p style={{ fontSize: '1.1rem', marginTop: '1rem', lineHeight: '1.8' }}>
                    Have questions? We'd love to hear from you. Send us a message and
                    we'll respond as soon as possible.
                </p>
                <p style={{ marginTop: '2rem', fontSize: '1.1rem' }}>
                    Email: <strong>support@careercredentials.com</strong>
                </p>
            </div>
        </div>
    );
}

export default Contact;
