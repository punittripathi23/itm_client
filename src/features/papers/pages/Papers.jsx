import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { paperService } from '../../../services/paper.service';
import { useAuth } from '../../../hooks/useAuth';
import { usePagination } from '../../../hooks/usePagination';
import { useDebounce } from '../../../hooks/useDebounce';
import { PAPER_CATEGORIES } from '../../../utils/constants';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import Select from '../../../components/common/Select/Select';
import Pagination from '../../../components/common/Pagination/Pagination';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Breadcrumb from '../../../components/common/Breadcrumb/Breadcrumb';
import { SkeletonPaperList } from '../../../components/common/Skeleton/Skeleton';
import { getStorageItem, setStorageItem } from '../../../utils/storage';
import AdvancedSearchModal from '../components/AdvancedSearchModal';
import { 
  Download, Bookmark, Eye, Calendar, BookOpen, 
  ChevronRight, Award, Lock, ExternalLink, Filter 
} from 'lucide-react';
import './Papers.css';

export const Papers = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [year, setYear] = useState('');
  const [conference, setConference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdvSearchOpen, setIsAdvSearchOpen] = useState(false);
  const [advFilters, setAdvFilters] = useState({});
  
  // Available conferences & years for dropdown options
  const [allConferences, setAllConferences] = useState([]);
  const [allYears, setAllYears] = useState([]);
  
  // Dynamic papers list
  const [papers, setPapers] = useState([]);
  
  // Modal State
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Debouncing search
  const debouncedSearch = useDebounce(search, 300);

  // Load select options on mount
  useEffect(() => {
    setIsLoading(true);
    const list = paperService.getPapers();
    
    // Unique conferences
    const confs = [...new Set(list.map(p => p.conference))];
    setAllConferences(confs);

    // Unique years
    const years = [...new Set(list.map(p => p.year))].sort((a, b) => b - a);
    setAllYears(years);
    setIsLoading(false);
  }, []);

  // Filter papers on search/filter state updates
  useEffect(() => {
    const results = paperService.searchPapers(
      debouncedSearch,
      category,
      year,
      conference
    );
    setPapers(results);
  }, [debouncedSearch, category, year, conference]);

  // Bookmarking handling (fallback if context isn't fully set up or we can read from storage directly)
  const [bookmarks, setBookmarks] = useState([]);
  useEffect(() => {
    if (user) {
      const allBms = getStorageItem('cpp_bookmarks', {});
      setBookmarks(allBms[user.email] || []);
    } else {
      setBookmarks([]);
    }
  }, [user]);

  const toggleBookmark = (paper) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const allBms = getStorageItem('cpp_bookmarks', {});
    const userBms = allBms[user.email] || [];
    const exists = userBms.some(p => p.id === paper.id);
    let updated;
    if (exists) {
      updated = userBms.filter(p => p.id !== paper.id);
    } else {
      updated = [...userBms, paper];
    }
    allBms[user.email] = updated;
    setStorageItem('cpp_bookmarks', allBms);
    setBookmarks(updated);
  };

  const isBookmarked = (paperId) => bookmarks.some(p => p.id === paperId);

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNext,
    hasPrev
  } = usePagination(papers, 5);

  const handleViewPaperDetails = (paper) => {
    setSelectedPaper(paper);
    setIsModalOpen(true);
  };

  const handleAccessFullPaper = (paper) => {
    setIsModalOpen(false);
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Record download logs
      const logs = getStorageItem('cpp_logs', []);
      const newLog = {
        id: `log_${Date.now()}`,
        userEmail: user.email,
        paperTitle: paper.title,
        date: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      setStorageItem('cpp_logs', [newLog, ...logs]);

      // Increment downloads count in local DB
      const allPapers = getStorageItem('cpp_papers', []);
      const updated = allPapers.map(p => {
        if (p.id === paper.id) {
          return { ...p, downloads: p.downloads + 1 };
        }
        return p;
      });
      setStorageItem('cpp_papers', updated);

      // Re-trigger load to show download count update
      const activeResults = paperService.searchPapers(debouncedSearch, category, year, conference);
      setPapers(activeResults);

      navigate(`/papers/${paper.id}`);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setYear('');
    setConference('');
  };

  return (
    <div className="papers-root container animate-fade-in">
      <Breadcrumb items={[{ label: 'Publications Index' }]} />

      <div className="papers-page-header">
        <h1>Research Proceedings Index</h1>
        <p>Browse, review abstracts, and access complete research proceedings compiled by the Bakliwal Foundation.</p>
      </div>

      <div className="papers-layout-grid">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar glass">
          <div className="filters-header flex-between border-b">
            <h3>Filters</h3>
            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Reset All
            </button>
          </div>

          <div className="filters-body">
            <Select
              label="Subject Category"
              id="category-filter"
              placeholder="All Categories"
              options={PAPER_CATEGORIES}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Select
              label="Publication Year"
              id="year-filter"
              placeholder="All Years"
              options={allYears}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <Select
              label="Summit / Conference"
              id="conference-filter"
              placeholder="All Conferences"
              options={allConferences}
              value={conference}
              onChange={(e) => setConference(e.target.value)}
            />
          </div>
        </aside>

        {/* Papers Main View */}
        <main className="papers-main-content">
          <div className="search-row flex-align gap-2">
            <div className="flex-grow-1">
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClear={() => setSearch('')}
                placeholder="Search by keyword, author, abstract title..."
              />
            </div>
            <button className="btn btn-secondary btn-sm flex-align" onClick={() => setIsAdvSearchOpen(true)}>
              <Filter size={15} /> Advanced Search
            </button>
          </div>

          <div className="results-info flex-between">
            <p className="results-count">Showing <strong>{papers.length}</strong> publications</p>
          </div>

          {isLoading ? (
            <SkeletonPaperList count={3} />
          ) : papers.length === 0 ? (
            <EmptyState 
              title="No papers match search criteria" 
              message="Please adjust your keywords or reset active filters."
            />
          ) : (
            <div className="papers-list-stack">
              {paginatedData.map((paper) => (
                <div key={paper.id} className="paper-row-card glass glass-hover">
                  <div className="paper-row-content">
                    <div className="paper-row-header flex-align">
                      <span className="badge badge-info">{paper.category}</span>
                      <span className="paper-row-meta flex-align">
                        <Calendar size={14} /> {paper.year}
                      </span>
                    </div>
                    
                    <h3 className="paper-row-title" onClick={() => handleViewPaperDetails(paper)}>
                      {paper.title}
                    </h3>
                    
                    <p className="paper-row-authors">By {paper.authors}</p>
                    
                    <p className="paper-row-abstract-snippet">
                      {paper.abstract.substring(0, 180)}...
                    </p>

                    <div className="paper-row-footer border-t">
                      <span className="paper-row-event font-semibold text-secondary">
                        {paper.conference}
                      </span>
                      <span className="flex-align">
                        <Download size={14} /> <strong>{paper.downloads}</strong> downloads
                      </span>
                    </div>
                  </div>

                  <div className="paper-row-actions">
                    <button 
                      onClick={() => toggleBookmark(paper)} 
                      className={`bookmark-row-btn ${isBookmarked(paper.id) ? 'bookmarked' : ''}`}
                      aria-label="Save paper"
                    >
                      <Bookmark size={20} fill={isBookmarked(paper.id) ? 'currentColor' : 'none'} />
                    </button>
                    
                    <Button 
                      variant="primary" 
                      onClick={() => handleViewPaperDetails(paper)}
                      icon={Eye}
                      size="small"
                    >
                      View Abstract
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        </main>
      </div>

      {/* Paper Details Modal */}
      {selectedPaper && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Publication Summary"
          size="large"
        >
          <div className="paper-details-modal">
            <span className="badge badge-success mb-1">{selectedPaper.category}</span>
            <h2>{selectedPaper.title}</h2>
            <p className="modal-authors">Written by: <strong>{selectedPaper.authors}</strong></p>
            
            <div className="modal-meta-grid border-y">
              <div className="modal-meta-item">
                <span>Conference Proceedings:</span>
                <strong>{selectedPaper.conference}</strong>
              </div>
              <div className="modal-meta-item">
                <span>Publication Year:</span>
                <strong>{selectedPaper.year}</strong>
              </div>
              <div className="modal-meta-item">
                <span>Total Downloads:</span>
                <strong>{selectedPaper.downloads} instances</strong>
              </div>
            </div>

            <div className="modal-abstract-section">
              <h4>Abstract Context</h4>
              <p>{selectedPaper.abstract}</p>
            </div>

            <div className="modal-action-row border-t flex-between">
              <button onClick={() => toggleBookmark(selectedPaper)} className="btn btn-secondary flex-align">
                <Bookmark size={18} fill={isBookmarked(selectedPaper.id) ? 'currentColor' : 'none'} />
                <span>{isBookmarked(selectedPaper.id) ? 'Remove Bookmark' : 'Bookmark Abstract'}</span>
              </button>

              <Button 
                variant="primary" 
                onClick={() => handleAccessFullPaper(selectedPaper)}
                icon={isAuthenticated ? Eye : Lock}
              >
                {isAuthenticated ? 'View Full Paper (PDF)' : 'Login to View Full PDF'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Advanced Multi-Faceted Search Modal */}
      <AdvancedSearchModal
        isOpen={isAdvSearchOpen}
        onClose={() => setIsAdvSearchOpen(false)}
        currentFilters={advFilters}
        onApplyFilters={(filters) => {
          setAdvFilters(filters);
          if (filters.keywords || filters.title || filters.author || filters.doi) {
            setSearch(filters.title || filters.keywords || filters.author || filters.doi);
          }
          if (filters.category) setCategory(filters.category);
          if (filters.year) setYear(filters.year);
        }}
      />
    </div>
  );
};

export default Papers;
