import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import './AuthLayout.css';

export const AuthLayout = () => {
  return (
    <div className="auth-layout-root">
      <div className="auth-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="auth-container">
        <div className="auth-card glass animate-scale-up">
          <div className="auth-brand">
            <div className="auth-logo-icon">
              <GraduationCap size={28} />
            </div>
            <h2>Bakliwal Portal</h2>
            <p>Welcome back! Please sign in or create an account to access resources.</p>
          </div>
          
          <div className="auth-content">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
