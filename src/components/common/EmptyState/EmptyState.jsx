import React from 'react';
import { HelpCircle } from 'lucide-react';
import './EmptyState.css';

export const EmptyState = ({
  title = 'No items found',
  message = 'Try refining your filters or upload new records.',
  icon: Icon = HelpCircle
}) => {
  return (
    <div className="empty-state-container flex-center animate-fade-in">
      <div className="empty-state-icon-wrapper">
        <Icon size={40} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-message">{message}</p>
    </div>
  );
};

export default EmptyState;
