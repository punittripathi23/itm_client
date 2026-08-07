import React from 'react';
import './Select.css';

export const Select = ({
  label,
  id,
  options = [], // can be string array or object array with {value, label}
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="form-control select-control"
        required={required}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt, idx) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={idx} value={val}>
              {lbl}
            </option>
          );
        })}
      </select>
      {error && <span className="error-message animate-fade-in">{error}</span>}
    </div>
  );
};

export default Select;
