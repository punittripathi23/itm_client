import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Layers, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import './DiscoveryHero.css';

const DiscoveryHero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = [
    'All Subjects',
    'Computer Science & AI',
    'Data Science & ML',
    'Robotics & Automation',
    'Cybersecurity & Networks',
    'Electrical & Electronics'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query || selectedCategory !== 'All Subjects') {
      const categoryParam = selectedCategory !== 'All Subjects' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
      navigate(`/papers?q=${encodeURIComponent(query)}&type=${searchType}${categoryParam}`);
    }
  };

  return (
    <section className="discovery-hero" aria-labelledby="hero-title">
      <div className="container discovery-hero-container">
        {/* Academic Platform Title Banner */}
        <div className="hero-content">
          <div className="hero-trust-badge">
            <span className="trust-dot"></span>
            <span>Official WeGrow Conference Proceedings & Publications</span>
          </div>

          <h1 id="hero-title" className="hero-title">
            WeGrow Conference Proceedings & Publications
          </h1>

          <p className="hero-subtitle">
            Search over 100+ peer-reviewed proceedings, research papers, and technical reports indexed in Scopus, Web of Science, and Crossref.
          </p>

          {/* Academic Search Form */}
          <form className="hero-search-card" onSubmit={handleSearch} role="search">
            <div className="search-row-primary">
              <div className="search-field-main">
                <Search size={18} className="search-icon-hero" />
                <input
                  type="text"
                  placeholder="Search by Title, Author, Keyword, ORCID or DOI (e.g. 10.1109/ICCS.2025)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="hero-search-input"
                  aria-label="Search academic publications"
                />
              </div>

              <div className="search-select-wrapper">
                <SlidersHorizontal size={14} className="select-icon" />
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="search-type-select"
                  aria-label="Search filter field"
                >
                  <option value="all">All Fields</option>
                  <option value="title">Paper Title</option>
                  <option value="author">Author Name</option>
                  <option value="doi">DOI Number</option>
                  <option value="conference">Conference</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary btn-lg search-submit-hero">
                Search Publications
              </button>
            </div>

            {/* Subject Category Pills */}
            <div className="hero-categories">
              <span className="categories-label">Popular Subjects:</span>
              <div className="category-pills">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {/* Hero Quick Stats Strip */}
          <div className="hero-stats-strip">
            <div className="hero-stat-item">
              <span className="stat-number">15,400+</span>
              <span className="stat-label">Peer-Reviewed Papers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat-item">
              <span className="stat-number">142</span>
              <span className="stat-label">Conference Proceedings</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat-item">
              <span className="stat-number">4.85</span>
              <span className="stat-label">Impact Factor Metric</span>
            </div>
            <div className="stat-divider"></div>
            <div className="hero-stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Crossref DOI Archiving</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoveryHero;
