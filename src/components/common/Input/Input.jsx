import React from 'react';
import './Input.css';

export const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helpText,
  icon: Icon,
  required = false,
  className = '',
  ...props
}) => {
  const errorId = error ? `${id}-error` : undefined;
  const helpId = helpText ? `${id}-help` : undefined;

  return (
    <div className={`academic-form-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="academic-form-label">
          {label} {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="input-field-wrapper">
        {Icon && <Icon size={16} className="input-left-icon" />}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`academic-form-input ${Icon ? 'has-left-icon' : ''}`}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId || helpId}
          {...props}
        />
      </div>
      {helpText && !error && <span id={helpId} className="help-text">{helpText}</span>}
      {error && <span id={errorId} className="error-message">{error}</span>}
    </div>
  );
};

export default Input;

