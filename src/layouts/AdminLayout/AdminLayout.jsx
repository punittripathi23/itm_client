import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { 
  LayoutDashboard, FileText, Calendar, Compass, 
  Image, Users, Settings, Sun, Moon, LogOut, 
  Menu, X, GraduationCap, ChevronLeft, ChevronRight 
} from 'lucide-react';
import './AdminLayout.css';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Analytics', path: '/admin', icon: LayoutDashboard },
    { name: 'Manage Papers', path: '/admin/papers', icon: FileText },
    { name: 'Conferences', path: '/admin/conferences', icon: Calendar },
    { name: 'Workshops', path: '/admin/workshops', icon: Compass },
    { name: 'Media Gallery', path: '/admin/gallery', icon: Image },
    { name: 'User Directory', path: '/admin/users', icon: Users },
    { name: 'CMS & Settings', path: '/admin/cms', icon: Settings }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`admin-layout-root ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && <div className="admin-sidebar-overlay" onClick={() => setMobileOpen(false)}></div>}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar glass ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-logo">
            <GraduationCap className="admin-logo-icon" />
            {!collapsed && <span className="admin-logo-text">Admin Panel</span>}
          </Link>
          <button className="collapse-btn desktop-only" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
          <button className="mobile-close-btn mobile-only" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-menu-link ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={20} className="menu-icon" />
                {!collapsed && <span className="menu-label">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout} className="admin-menu-link logout text-danger">
            <LogOut size={20} className="menu-icon" />
            {!collapsed && <span className="menu-label">Exit Panel</span>}
          </button>
        </div>
      </aside>

      {/* Admin Content Area */}
      <div className="admin-main-area">
        {/* Admin Header */}
        <header className="admin-header glass">
          <div className="flex-align">
            <button className="admin-menu-hamburger mobile-only" onClick={() => setMobileOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="admin-header-title">
              {menuItems.find(item => isActive(item.path))?.name || 'Administrator Portal'}
            </h2>
          </div>

          <div className="admin-header-actions">
            <button onClick={toggleTheme} className="admin-action-btn" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <div className="admin-user-profile">
              <span className="admin-user-name">{user?.name}</span>
              <span className="badge badge-danger">Admin</span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="admin-content-viewport">
          <div className="admin-content-card animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
