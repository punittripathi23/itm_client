import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../Button/Button';
import './ErrorState.css';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'Failed to load content. Please check your connection and try again.',
  onRetry
}) => {
  return (
    <div className="error-state-container flex-center animate-fade-in">
      <div className="error-state-icon-wrapper">
        <AlertCircle size={40} className="error-state-icon" />
      </div>
      <h3 className="error-state-title">{title}</h3>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <Button 
          variant="secondary" 
          onClick={onRetry} 
          icon={RefreshCw}
          className="retry-btn"
        >
          Retry Load
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
