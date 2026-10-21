import React, { useState } from 'react';
import Modal from '../../../components/common/Modal/Modal';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import journalService from '../../../services/journal.service';
import { Globe, Check, AlertCircle } from 'lucide-react';
import './PublishManuscriptModal.css';

export const PublishManuscriptModal = ({ isOpen, onClose, submission, onPublished }) => {
  const [volumeNumber, setVolumeNumber] = useState('14');
  const [issueNumber, setIssueNumber] = useState('2');
  const [pages, setPages] = useState('101-115');
  const [doi, setDoi] = useState('xxxx');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!submission) return;

    setSubmitting(true);
    try {
      await journalService.publishManuscript({
        submissionId: submission._id || submission.id,
        volumeNumber: parseInt(volumeNumber),
        issueNumber: parseInt(issueNumber),
        pages,
        doi
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onPublished) onPublished();
      }, 1500);
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
      title={`Publish Manuscript — ${submission.submissionCustomId || 'MS-2025'}`}
      size="medium"
    >
      <form onSubmit={handlePublish} className="publish-manuscript-modal">
        <p className="paper-title-preview font-semibold mb-3">
          "{submission.title}"
        </p>

        {success ? (
          <div className="alert alert-success flex-align p-3 mb-3">
            <Check size={20} />
            <span>Manuscript published & synced to public proceedings index!</span>
          </div>
        ) : (
          <>
            <div className="grid-2 gap-2 mb-3">
              <Input
                label="Volume Number"
                type="number"
                value={volumeNumber}
                onChange={(e) => setVolumeNumber(e.target.value)}
                required
              />

              <Input
                label="Issue Number"
                type="number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                required
              />
            </div>

            <div className="grid-2 gap-2 mb-3">
              <Input
                label="Page Range (e.g. 101-115)"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                required
              />

              <Input
                label="Assigned DOI"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                required
              />
            </div>

            <div className="modal-footer flex-between border-t pt-3 mt-4">
              <Button variant="secondary" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting} icon={Globe}>
                {submitting ? 'Publishing...' : 'Publish to Proceedings Index'}
              </Button>
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default PublishManuscriptModal;
