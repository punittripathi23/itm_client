import React from 'react';
import Spinner from '../Spinner/Spinner';
import './Loader.css';

export const Loader = ({ fullPage = false, message = 'Loading resources...' }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="loader-card glass">
        <Spinner size="large" />
        <p className="loader-message">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
