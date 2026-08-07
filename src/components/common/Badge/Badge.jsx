import React from 'react';
import './Badge.css';

/**
 * Academic Trust Badge component
 * Types: 'doi', 'orcid', 'scopus', 'wos', 'open-access', 'peer-reviewed', 'success', 'warning', 'info'
 */
const Badge = ({ children, variant = 'info', icon = null, href = null, className = '', ...props }) => {
  const badgeContent = (
    <span className={`academic-badge badge-${variant} ${className}`} {...props}>
      {icon && <span className="badge-icon">{icon}</span>}
      <span className="badge-label">{children}</span>
    </span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="badge-link">
        {badgeContent}
      </a>
    );
  }

  return badgeContent;
};

export default Badge;
