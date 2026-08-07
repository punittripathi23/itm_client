import React from 'react';
import './Spinner.css';

export const Spinner = ({ size = 'medium', color = 'primary' }) => {
  return (
    <div className={`spinner spinner-${size} spinner-${color}`} aria-label="Loading spinner">
      <div className="spinner-ring"></div>
    </div>
  );
};

export default Spinner;
