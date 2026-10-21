import React, { useState } from 'react';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Select from '../../../components/common/Select/Select';
import { PAPER_CATEGORIES } from '../../../utils/constants';
import { Search, Filter, RefreshCw } from 'lucide-react';
import './AdvancedSearchModal.css';

export const AdvancedSearchModal = ({ isOpen, onClose, onApplyFilters, currentFilters = {} }) => {
  const [title, setTitle] = useState(currentFilters.title || '');
  const [author, setAuthor] = useState(currentFilters.author || '');
  const [doi, setDoi] = useState(currentFilters.doi || '');
  const [orcid, setOrcid] = useState(currentFilters.orcid || '');
  const [keywords, setKeywords] = useState(currentFilters.keywords || '');
  const [category, setCategory] = useState(currentFilters.category || '');
  const [year, setYear] = useState(currentFilters.year || '');

  const handleReset = () => {
    setTitle('');
    setAuthor('');
    setDoi('');
    setOrcid('');
    setKeywords('');
    setCategory('');
    setYear('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onApplyFilters({ title, author, doi, orcid, keywords, category, year });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced Publication Search & Filters"
      size="medium"
    >
      <form onSubmit={handleSearch} className="advanced-search-form">
        <div className="form-group mb-3">
          <Input
            label="Publication Title"
            placeholder="Search words in title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid-2 gap-2 mb-3">
          <Input
            label="Author Name"
            placeholder="e.g. Alexander Wright"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />

          <Input
            label="ORCID iD"
            placeholder="0000-0002-1825-0097"
            value={orcid}
            onChange={(e) => setOrcid(e.target.value)}
          />
        </div>

        <div className="grid-2 gap-2 mb-3">
          <Input
            label="DOI Prefix or Number"
            placeholder="xxxx"
            value={doi}
            onChange={(e) => setDoi(e.target.value)}
          />

          <Input
            label="Keywords (Comma separated)"
            placeholder="Deep Learning, Vision"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
        </div>

        <div className="grid-2 gap-2 mb-3">
          <Select
            label="Research Subject Category"
            options={PAPER_CATEGORIES}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <Input
            label="Publication Year"
            type="number"
            placeholder="e.g. 2025"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        <div className="modal-footer flex-between border-t pt-3 mt-4">
          <Button variant="secondary" type="button" icon={RefreshCw} onClick={handleReset}>
            Reset Filters
          </Button>
          <Button variant="primary" type="submit" icon={Search}>
            Search Publications
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AdvancedSearchModal;
