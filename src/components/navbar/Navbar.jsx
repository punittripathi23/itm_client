import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Search, Sun, Moon, Menu, X, User, LogOut, BookOpen, Shield, Award, Layers, Bell, FileText, CheckCircle } from 'lucide-react';
import notificationService from '../../services/notification.service';
import './Navbar.css';

export const Navbar = () => {
  const auth = useAuth() || {};
  const { user, isAuthenticated, isAdmin, isAuthor, isReviewer, isEditor, isSuperAdmin, logout } = auth;
  const { theme, toggleTheme } = useTheme() || { theme: 'light', toggleTheme: () => { } };

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      notificationService.getUserNotifications().then(data => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      });
    }
  }, [isAuthenticated, showNotifications]);

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead().then(() => {
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    });
  };

  const handleLogout = () => {
    if (logout) logout();
    setShowDropdown(false);
    setShowNotifications(false);
    navigate('/');
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/papers?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  const getRoleDisplayName = () => {
    if (!user) return 'Visitor';
    if (user.role === 'super_admin') return 'Super Administrator';
    if (user.role === 'admin') return 'System Administrator';
    if (user.role === 'editor_in_chief') return 'Editor-in-Chief';
    if (user.role === 'editor') return 'Section Editor';
    if (user.role === 'reviewer') return 'Peer Reviewer';
    if (user.role === 'author') return 'Journal Author';
    return 'Registered Researcher';
  };

  return (
    <header className={`academic-header sticky-top ${isScrolled ? 'header-scrolled' : ''}`}>
      {/* Top Academic Utility Bar */}
      <div className="top-utility-bar">
        <div className="container utility-container">
          <div className="utility-left">
            <span className="utility-item">ISSN: xxxx (Online)</span>
            <span className="utility-sep">|</span>
            <span className="utility-item">Scopus & Web of Science Indexed</span>
            <span className="utility-sep">|</span>
            <span className="utility-item">DOI Prefix: xxxx</span>
          </div>
          <div className="utility-right">
            <Link to="/author/submit" className="utility-link utility-submit-highlight">
              <FileText size={12} className="mr-1 inline-icon" /> Submit Paper
            </Link>
            <span className="utility-sep">|</span>
            <Link to="/editorial-board" className="utility-link">Editorial Board</Link>
            <span className="utility-sep">|</span>
            <Link to="/archives" className="utility-link">Archives</Link>
            <span className="utility-sep">|</span>
            <button onClick={toggleTheme} className="theme-toggle-inline" aria-label="Toggle dark mode">
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav className={`navbar-main ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container navbar-container">
          {/* Logo & Brand Identity */}
          <Link to="/" className="navbar-logo" onClick={() => setIsOpen(false)}>
            <div className="logo-shield">
              <Shield className="logo-shield-icon" size={22} />
              <Layers className="logo-layers-icon" size={14} />
            </div>
            <div className="logo-text">
              <span className="logo-title">ITM-JET</span>
              <span className="logo-subtitle">ITM Journal of Engineering & Technology</span>
            </div>
          </Link>

          {/* Persistent Quick Search Bar */}
          <form className="navbar-search-form" onSubmit={handleQuickSearch} role="search">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search Title, Author, Keywords or DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="navbar-search-input"
                aria-label="Quick publication search"
              />
              <button type="submit" className="search-submit-btn" aria-label="Search">
                Search
              </button>
            </div>
          </form>

          {/* User Account / Auth CTAs */}
          <div className="navbar-user-actions">
            {isAuthenticated ? (
              <>
                {/* Notification Center */}
                <div className="notification-center-container">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowDropdown(false);
                    }}
                    className="notification-trigger-btn btn-secondary btn-sm"
                    aria-label="Notifications"
                  >
                    <Bell size={16} />
                    {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                  </button>

                  {showNotifications && (
                    <div className="notification-dropdown">
                      <div className="dropdown-header">
                        <p className="dropdown-title">Notifications</p>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkAllRead} className="notification-count-btn">
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="dropdown-divider"></div>
                      <div className="notification-list">
                        {notifications.length === 0 ? (
                          <p className="text-muted text-xs p-2 text-center">No notifications yet</p>
                        ) : (
                          notifications.map(n => (
                            <div key={n._id || n.id} className={`notification-item ${!n.isRead ? 'unread' : ''}`}>
                              <div className="notification-icon">
                                <FileText size={14} />
                              </div>
                              <div className="notification-content">
                                <p className="notification-text">{n.title}</p>
                                <span className="notification-time">{n.message}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="profile-dropdown-container">
                  <button
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                      setShowNotifications(false);
                    }}
                    className="profile-trigger-btn btn-secondary btn-sm"
                    aria-expanded={showDropdown}
                  >
                    <User size={15} />
                    <span className="user-name-display">{user?.name ? user.name.split(' ')[0] : 'Researcher'}</span>
                  </button>

                  {showDropdown && (
                    <div className="profile-dropdown">
                      <div className="dropdown-header">
                        <p className="user-name">{user?.name || 'Researcher'}</p>
                        <p className="user-email">{user?.email || 'user@academic.edu'}</p>
                        <span className="badge badge-info">
                          {getRoleDisplayName()}
                        </span>
                      </div>

                      <div className="dropdown-divider"></div>

                      {isAdmin && (
                        <Link to="/admin" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                          <Shield size={15} /> Admin Dashboard
                        </Link>
                      )}

                      {isAuthor && (
                        <Link to="/author/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                          <FileText size={15} /> Author Dashboard
                        </Link>
                      )}

                      {isEditor && (
                        <Link to="/editor/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                          <Award size={15} /> Editorial Board Panel
                        </Link>
                      )}

                      {isReviewer && (
                        <Link to="/reviewer/dashboard" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                          <BookOpen size={15} /> Reviewer Workspace
                        </Link>
                      )}

                      <Link to="/user" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        <BookOpen size={15} /> Saved Publications
                      </Link>

                      <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                        <User size={15} /> Profile & ORCID
                      </Link>

                      <div className="dropdown-divider"></div>

                      <button onClick={handleLogout} className="dropdown-item logout text-danger">
                        <LogOut size={15} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
              </div>
            )}

            {/* Mobile Drawer Trigger */}
            <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation menu">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Secondary Academic Links Bar */}
        <div className="navbar-sublinks-bar">
          <div className="container sublinks-container">
            <div className="nav-links">
              <Link to="/author/submit" className={`nav-link submit-paper-highlight-nav ${isActive('/author/submit') ? 'active' : ''}`}>
                <FileText size={13} /> Submit Paper
              </Link>
              <Link to="/conferences" className={`nav-link ${isActive('/conferences') ? 'active' : ''}`}>Conferences</Link>
              <Link to="/proceedings" className={`nav-link ${isActive('/proceedings') ? 'active' : ''}`}>Proceedings</Link>
              <Link to="/papers" className={`nav-link ${isActive('/papers') ? 'active' : ''}`}>Publications</Link>
              <Link to="/archives" className={`nav-link ${isActive('/archives') ? 'active' : ''}`}>Archives</Link>
              <Link to="/editorial-board" className={`nav-link ${isActive('/editorial-board') ? 'active' : ''}`}>Editorial Board</Link>
              <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}>Gallery</Link>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="mobile-drawer animate-fade-in">
          <div className="container mobile-drawer-container">
            <form className="mobile-search-form" onSubmit={handleQuickSearch}>
              <input
                type="text"
                placeholder="Search publications or DOI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>

            <div className="mobile-links">
              <Link to="/author/submit" className="mobile-link submit-paper-highlight-mobile" onClick={() => setIsOpen(false)}>
                <FileText size={16} /> Submit Paper
              </Link>
              <Link to="/conferences" className="mobile-link" onClick={() => setIsOpen(false)}>Conferences</Link>
              <Link to="/proceedings" className="mobile-link" onClick={() => setIsOpen(false)}>Proceedings</Link>
              <Link to="/papers" className="mobile-link" onClick={() => setIsOpen(false)}>Publications</Link>
              <Link to="/archives" className="mobile-link" onClick={() => setIsOpen(false)}>Archives</Link>
              <Link to="/editorial-board" className="mobile-link" onClick={() => setIsOpen(false)}>Editorial Board</Link>
              <Link to="/gallery" className="mobile-link" onClick={() => setIsOpen(false)}>Gallery</Link>
              <Link to="/about" className="mobile-link" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/contact" className="mobile-link" onClick={() => setIsOpen(false)}>Contact</Link>

              <div className="mobile-divider"></div>

              {!isAuthenticated && (
                <div className="mobile-auth-btns">
                  <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setIsOpen(false)}>Login</Link>
                  <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setIsOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
