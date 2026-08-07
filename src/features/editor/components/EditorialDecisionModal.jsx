import React, { useState } from 'react';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import editorService from '../../../services/editor.service';
import { Award, Edit3, XCircle, CheckCircle, Send } from 'lucide-react';
import './EditorialDecisionModal.css';

export const EditorialDecisionModal = ({ isOpen, onClose, submission, onDecisionMade }) => {
  const [decision, setDecision] = useState('revision_requested');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApplyDecision = async () => {
    if (!submission) return;
    setSubmitting(true);
    try {
      await editorService.updateManuscriptStatus(
        submission._id || submission.id,
        decision,
        comment || `Editorial decision issued: ${decision}`
      );
      onClose();
      if (onDecisionMade) onDecisionMade();
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
      title={`Editorial Decision — ${submission.submissionCustomId || 'MS-2025'}`}
      size="medium"
    >
      <div className="editorial-decision-modal">
        <p className="paper-title-preview font-semibold mb-3">
          "{submission.title}"
        </p>

        <div className="decision-options-grid mb-3">
          <button
            className={`decision-btn ${decision === 'under_review' ? 'selected' : ''}`}
            onClick={() => setDecision('under_review')}
          >
            <Send size={18} className="text-blue" />
            <span>Send to Peer Review</span>
          </button>

          <button
            className={`decision-btn ${decision === 'revision_requested' ? 'selected' : ''}`}
            onClick={() => setDecision('revision_requested')}
          >
            <Edit3 size={18} className="text-orange" />
            <span>Request Revision</span>
          </button>

          <button
            className={`decision-btn ${decision === 'accepted' ? 'selected' : ''}`}
            onClick={() => setDecision('accepted')}
          >
            <CheckCircle size={18} className="text-green" />
            <span>Accept Manuscript</span>
          </button>

          <button
            className={`decision-btn ${decision === 'rejected' ? 'selected' : ''}`}
            onClick={() => setDecision('rejected')}
          >
            <XCircle size={18} className="text-red" />
            <span>Reject Manuscript</span>
          </button>
        </div>

        <div className="form-group mb-3">
          <label className="form-label text-sm font-semibold mb-1 block">Decision Notes / Author Feedback Comments</label>
          <textarea
            className="form-textarea text-sm w-full p-2 border rounded"
            rows={4}
            placeholder="Provide specific feedback or revision requirements for the author..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="modal-footer flex-between border-t pt-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApplyDecision} disabled={submitting}>
            {submitting ? 'Applying...' : 'Confirm Decision'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditorialDecisionModal;
