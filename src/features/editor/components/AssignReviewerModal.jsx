import React, { useState, useEffect } from 'react';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import editorService from '../../../services/editor.service';
import { UserCheck, Search, Send, Check } from 'lucide-react';
import './AssignReviewerModal.css';

export const AssignReviewerModal = ({ isOpen, onClose, submission, onAssigned }) => {
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewerId, setSelectedReviewerId] = useState('');
  const [search, setSearch] = useState('');
  const [note, setNote] = useState('Dear Colleague, You are cordially invited to peer review this manuscript submitted to ICAME 2025.');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      editorService.getAvailableReviewers().then(list => setReviewers(list || []));
    }
  }, [isOpen]);

  const filteredReviewers = reviewers.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) || 
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedReviewerId) return;
    setSubmitting(true);
    try {
      await editorService.assignReviewer(submission._id || submission.id, selectedReviewerId, note);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onAssigned) onAssigned();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!submission) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Peer Reviewer — ${submission.submissionCustomId || 'MS-2025'}`}
      size="medium"
    >
      <div className="assign-reviewer-modal">
        <p className="paper-title-preview font-semibold mb-3">
          "{submission.title}"
        </p>

        {success ? (
          <div className="alert alert-success flex-align p-3 mb-3">
            <Check size={20} />
            <span>Reviewer assigned & invitation sent successfully!</span>
          </div>
        ) : (
          <>
            {/* Search Box */}
            <div className="search-box-wrapper mb-3">
              <div className="search-input-inner flex-align border p-2 rounded">
                <Search size={16} className="text-muted mr-2" />
                <input
                  type="text"
                  placeholder="Search reviewers by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-none outline-none text-sm"
                />
              </div>
            </div>

            {/* Reviewer Selection List */}
            <div className="reviewer-list-container border rounded mb-3">
              {filteredReviewers.length === 0 ? (
                <p className="text-muted p-3 text-center text-sm">No reviewers found</p>
              ) : (
                filteredReviewers.map(r => {
                  const isSelected = selectedReviewerId === (r._id || r.id);

                  return (
                    <div
                      key={r._id || r.id}
                      className={`reviewer-option-card p-3 border-b flex-between align-center cursor-pointer ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedReviewerId(r._id || r.id)}
                    >
                      <div>
                        <p className="reviewer-name font-semibold text-sm">{r.name}</p>
                        <p className="reviewer-email text-xs text-muted">{r.email}</p>
                      </div>
                      <div className="text-right">
                        <span className="badge badge-info text-xs">
                          {r.activeWorkload} active reviews
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Invitation Note */}
            <div className="form-group mb-3">
              <label className="form-label text-sm font-semibold mb-1 block">Invitation Message Note</label>
              <textarea
                className="form-textarea text-sm w-full p-2 border rounded"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div className="modal-footer flex-between border-t pt-3">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAssign}
                disabled={!selectedReviewerId || submitting}
                icon={Send}
              >
                {submitting ? 'Assigning...' : 'Assign & Send Invitation'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default AssignReviewerModal;
