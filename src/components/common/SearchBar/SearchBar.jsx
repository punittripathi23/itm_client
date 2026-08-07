import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search papers, authors, conferences...',
  className = ''
}) => {
  return (
    <div className={`search-bar-wrapper glass ${className}`}>
      <Search size={18} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button onClick={onClear} className="search-clear-btn" aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
