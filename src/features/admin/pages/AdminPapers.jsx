import React, { useState, useEffect } from 'react';
import { paperService } from '../../../services/paper.service';
import { PAPER_CATEGORIES } from '../../../utils/constants';
import { validatePaper } from '../../../utils/validators';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Select from '../../../components/common/Select/Select';
import Modal from '../../../components/common/Modal/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';
import Pagination from '../../../components/common/Pagination/Pagination';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import { Plus, Edit2, Trash2, Eye, Download, FileText } from 'lucide-react';
import './AdminTables.css';

export const AdminPapers = () => {
  const [papers, setPapers] = useState([]);
  const [search, setSearch] = useState('');
  
  // Modal states for Create/Edit
  const [isOpen, setIsOpen] = useState(false);
  const [activePaper, setActivePaper] = useState(null); // null if creating, paper object if editing
  
  // Form fields
  const [title, setTitle] = useState('');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [year, setYear] = useState('');
  const [conference, setConference] = useState('');
  const [category, setCategory] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete dialog states
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePaperId, setDeletePaperId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination page state
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Load papers on mount/search
  const loadPapers = () => {
    const list = paperService.searchPapers(search);
    setPapers(list);
  };

  useEffect(() => {
    loadPapers();
    setPage(1); // Reset page on filter
  }, [search]);

  // Open modal for Create
  const handleCreateOpen = () => {
    setActivePaper(null);
    setTitle('');
    setAuthors('');
    setAbstract('');
    setYear(new Date().getFullYear().toString());
    setConference('');
    setCategory('');
    setPdfUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setFormErrors({});
    setIsOpen(true);
  };

  // Open modal for Edit
  const handleEditOpen = (paper) => {
    setActivePaper(paper);
    setTitle(paper.title);
    setAuthors(paper.authors);
    setAbstract(paper.abstract);
    setYear(paper.year);
    setConference(paper.conference);
    setCategory(paper.category);
    setPdfUrl(paper.pdfUrl);
    setFormErrors({});
    setIsOpen(true);
  };

  // Save create/edit form
  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const formData = { title, authors, abstract, year, conference, category, pdfUrl };
    const { isValid, errors } = validatePaper(formData);

    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Latency delay

    if (activePaper) {
      // Edit
      paperService.updatePaper(activePaper.id, formData);
    } else {
      // Create
      paperService.createPaper(formData);
    }

    setSaving(false);
    setIsOpen(false);
    loadPapers();
  };

  // Trigger Delete confirmation dialog
  const handleDeleteTrigger = (id) => {
    setDeletePaperId(id);
    setDeleteOpen(true);
  };

  // Execute Delete
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    paperService.deletePaper(deletePaperId);
    setDeleting(false);
    setDeleteOpen(false);
    loadPapers();
  };

  // Paginate list
  const totalPages = Math.ceil(papers.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedPapers = papers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="admin-papers-view">
      <div className="flex-between admin-table-header">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch('')}
          placeholder="Filter publications by title, author..."
          className="admin-search-bar"
        />
        <Button variant="primary" onClick={handleCreateOpen} icon={Plus}>
          Add Publication
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Year</th>
              <th>Downloads</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPapers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3">No publications matches search criteria.</td>
              </tr>
            ) : (
              paginatedPapers.map((paper) => (
                <tr key={paper.id}>
                  <td className="paper-title-cell">
                    <span className="p-title-text">{paper.title}</span>
                    <span className="p-authors-text">By {paper.authors}</span>
                  </td>
                  <td>
                    <span className="badge badge-info">{paper.category}</span>
                  </td>
                  <td>{paper.year}</td>
                  <td>
                    <span className="flex-align">
                      <Download size={14} className="text-secondary" /> {paper.downloads}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="action-btns flex-align justify-end">
                      <button 
                        onClick={() => handleEditOpen(paper)} 
                        className="tbl-act-btn edit" 
                        aria-label="Edit publication"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTrigger(paper.id)} 
                        className="tbl-act-btn delete" 
                        aria-label="Delete publication"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        hasNext={page < totalPages}
        hasPrev={page > 1}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activePaper ? 'Edit Publication Index' : 'Add Research Publication'}
        size="large"
      >
        <form onSubmit={handleSave} className="admin-form animate-fade-in">
          <Input
            label="Paper Title"
            id="p-title"
            type="text"
            placeholder="A Machine Learning Approach to Scalable Grid Computing..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={formErrors.title}
            required
          />

          <div className="grid-2">
            <Input
              label="Authors List"
              id="p-authors"
              type="text"
              placeholder="e.g. John Doe, Sonu Tripathi"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              error={formErrors.authors}
              required
            />

            <Select
              label="Subject Category"
              id="p-category"
              options={PAPER_CATEGORIES}
              value={category}
              placeholder="Select Category"
              onChange={(e) => setCategory(e.target.value)}
              error={formErrors.category}
              required
            />
          </div>

          <div className="grid-2">
            <Input
              label="Publication Year"
              id="p-year"
              type="text"
              placeholder="e.g. 2026"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              error={formErrors.year}
              required
            />

            <Input
              label="Conference Proceeding Title"
              id="p-conference"
              type="text"
              placeholder="e.g. IEEE Global Cloud Conference 2026"
              value={conference}
              onChange={(e) => setConference(e.target.value)}
              error={formErrors.conference}
              required
            />
          </div>

          <Input
            label="Full Document URL (PDF Link)"
            id="p-pdfUrl"
            type="text"
            placeholder="https://example.com/paper.pdf"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            error={formErrors.pdfUrl}
            required
          />

          <div className="form-group">
            <label htmlFor="p-abstract" className="form-label">Abstract Context *</label>
            <textarea
              id="p-abstract"
              rows="4"
              className="form-control"
              placeholder="Describe publication research findings..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            ></textarea>
            {formErrors.abstract && <span className="error-message">{formErrors.abstract}</span>}
          </div>

          <div className="cms-submit-row">
            <Button variant="secondary" onClick={() => setIsOpen(false)} className="mr-1" disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {activePaper ? 'Update Publication' : 'Save Publication'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Publication Index"
        message="Are you sure you want to delete this publication from the proceeding catalog? This will clear its bookmark lists and download history index parameters."
      />
    </div>
  );
};

export default AdminPapers;
