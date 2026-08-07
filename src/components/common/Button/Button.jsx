import React from 'react';
import Spinner from '../Spinner/Spinner';
import './Button.css';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, tertiary
  size = 'medium', // small, medium, large
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full-width' : ''} ${loading ? 'btn-loading' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} />}
      {!loading && Icon && <Icon size={16} className="btn-icon" />}
      <span className="btn-text-content">{children}</span>
    </button>
  );
};

export default Button;

