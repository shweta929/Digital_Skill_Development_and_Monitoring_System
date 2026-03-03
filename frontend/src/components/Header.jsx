import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun, FiMoon } from 'react-icons/fi';
import './Header.css';
import logo from '../assets/logo.png';
import amarSirLogo from '../assets/amarSirLogo.png';


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const location = useLocation();
  const isWelcomePage = location.pathname === '/';

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <header className="header">
      <div className="header-container">
        {/* Left: Logo + Brand Name */}
        <div className={`header-brand ${isWelcomePage ? 'welcome-brand' : ''}`}>
          <img
            src={location.pathname === '/dashboard' ? amarSirLogo : logo}
            alt="Logo"
            className={`header-logo ${isWelcomePage ? 'welcome-logo' : 'dashboard-logo'}`}
          />
          {(!isWelcomePage && location.pathname !== '/dashboard') && <span className="brand-name">Career Credentials</span>}
        </div>

        {/* Right Section: Navigation + Actions */}
        <div className="header-right">
          {/* Navigation Links */}
          <nav className="header-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </nav>

          {/* Right: Login, Register & Menu */}
          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                marginRight: '15px'
              }}
              title={isDarkMode ? "Light Mode" : "Dark Mode"}
            >
              {isDarkMode ? <FiSun /> : <FiMoon />}
            </button>

            <Link to="/login" className="btn btn-outline btn-login">Login</Link>

            {isWelcomePage && (
              <Link to="/register" className="btn btn-outline btn-register">Register</Link>
            )}

            {!isWelcomePage && (
              <div className="menu-wrapper">
                <button
                  className={`menu-btn ${isMenuOpen ? 'active' : ''}`}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-label="Toggle Menu"
                >
                  <div className="hamburger"></div>
                </button>

                {isMenuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/welcome" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      Student Section
                    </Link>
                    <Link to="/ai-assistant" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      Career AI Assistant
                    </Link>
                    <Link to="/admin-dashboard" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      Admin Section
                    </Link>
                    <div
                      className="dropdown-item"
                      onClick={() => {
                        localStorage.removeItem("student");
                        localStorage.removeItem("studentId");
                        localStorage.removeItem("studentName");
                        localStorage.removeItem("studentEmail");
                        setIsMenuOpen(false);
                        window.location.href = "/";
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
