import React from 'react';
import { Shield, Layers } from 'lucide-react';
import CardBox from '../../../components/common/Card/CardBox';
import './AuthCardLayout.css';

export const AuthCardLayout = ({
  title,
  subtitle,
  children,
  footerLink
}) => {
  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        <div className="auth-brand-header">
          <div className="auth-shield-logo">
            <Shield size={24} className="shield-icon" />
            <Layers size={14} className="layers-icon" />
          </div>
          <span className="auth-brand-name">WeGrow Conference Proceedings & Publications</span>
        </div>

        <CardBox className="auth-card-box">
          <div className="auth-card-header">
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </div>

          <div className="auth-card-body">
            {children}
          </div>

          {footerLink && (
            <div className="auth-card-footer">
              {footerLink}
            </div>
          )}
        </CardBox>

        <div className="auth-trust-notice">
          <span>Official WeGrow Conference Proceedings & Publications- Single Sign-On for Authors, Reviewers & Editors</span>
        </div>
      </div>
    </div>
  );
};

export default AuthCardLayout;
