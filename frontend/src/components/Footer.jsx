import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <nav className="footer-nav">
                    <Link to="/" className="footer-link">Home</Link>
                    <Link to="/about" className="footer-link">About Us</Link>
                    <Link to="/contact" className="footer-link">Contact</Link>
                </nav>
                <p className="footer-text">© 2026 Career Credentials. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
