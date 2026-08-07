import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import { Book, Settings, FileText, Activity } from 'lucide-react';
import './UserLayout.css';

export const UserLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="user-layout-root">
      <Navbar />
      
      <div className="user-dashboard-header">
        <div className="container flex-between dashboard-header-content">
          <div>
            <h1>Researcher Dashboard</h1>
            <p>Access your saved academic papers, history logs, and manage profile credentials.</p>
          </div>
        </div>
      </div>

      <div className="container user-dashboard-container">
        <div className="user-dashboard-grid">
          {/* User Sidebar Panel */}
          <aside className="user-sidebar glass">
            <div className="user-sidebar-menu">
              <Link 
                to="/user" 
                className={`user-sidebar-link ${isActive('/user') ? 'active' : ''}`}
              >
                <Book size={18} />
                <span>My Library</span>
              </Link>
              
              <Link 
                to="/user/downloads" 
                className={`user-sidebar-link ${isActive('/user/downloads') ? 'active' : ''}`}
              >
                <Activity size={18} />
                <span>Download History</span>
              </Link>
              
              <Link 
                to="/profile" 
                className={`user-sidebar-link ${isActive('/profile') ? 'active' : ''}`}
              >
                <Settings size={18} />
                <span>Account Profile</span>
              </Link>
            </div>
          </aside>

          {/* User Feature Content */}
          <main className="user-dashboard-content">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserLayout;
