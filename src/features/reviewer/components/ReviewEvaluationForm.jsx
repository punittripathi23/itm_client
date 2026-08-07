import React, { useState } from 'react';
import Button from '../../../components/common/Button/Button';
import reviewerService from '../../../services/reviewer.service';
import { Star, Send, CheckCircle, AlertCircle, MessageSquare, Lock } from 'lucide-react';
import './ReviewEvaluationForm.css';

export const ReviewEvaluationForm = ({ assignment, onSubmitSuccess, onCancel }) => {
  const submission = assignment?.submission || assignment;

  const [scores, setScores] = useState({
    originality: 4,
    novelty: 4,
    technicalQuality: 4,
    presentation: 4
  });

  const [authorComments, setAuthorComments] = useState('');
  const [confidentialComments, setConfidentialComments] = useState('');
  const [recommendation, setRecommendation] = useState('minor_revision');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleScoreChange = (field, val) => {
    setScores(prev => ({ ...prev, [field]: val }));
  };

  const calculateOverall = () => {
    const avg = (scores.originality + scores.novelty + scores.technicalQuality + scores.presentation) / 4;
    return avg.toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!authorComments.trim() || authorComments.trim().length < 30) {
      setError('Comments to the author must be at least 30 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewerService.submitReview({
        submissionId: submission._id || submission.id,
        assignmentId: assignment._id || assignment.id,
        scores,
        authorComments,
        confidentialComments,
        recommendation
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSubmitSuccess) onSubmitSuccess();
      }, 1500);
    } catch (err) {
      setError('Failed to submit peer review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="review-evaluation-form border p-4 rounded bg-white" onSubmit={handleSubmit}>
      <div className="form-header border-b pb-3 mb-4">
        <h3 className="text-xl font-bold">Manuscript Evaluation Form</h3>
        <p className="text-sm text-muted">
          Paper ID: <strong>{submission?.submissionCustomId || 'MS-2025-104'}</strong> — "{submission?.title}"
        </p>
      </div>

      {error && (
        <div className="alert alert-danger flex-align p-3 mb-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success flex-align p-3 mb-3">
          <CheckCircle size={18} />
          <span>Peer review submitted successfully! Thank you for your contribution.</span>
        </div>
      )}

      {/* 4 Criteria Scoring Section */}
      <div className="criteria-scoring-section mb-4">
        <h4 className="section-title text-base font-semibold mb-3">1. Quantitative Criteria Scoring (1 to 5 Scale)</h4>

        <div className="criteria-grid">
          <div className="criteria-item p-3 border rounded">
            <label className="criteria-label font-semibold text-sm block mb-2">Originality & Contribution</label>
            <div className="flex-align gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${scores.originality >= star ? 'active' : ''}`}
                  onClick={() => handleScoreChange('originality', star)}
                >
                  ★
                </button>
              ))}
              <span className="score-val font-bold text-sm ml-2">{scores.originality}/5</span>
            </div>
          </div>

          <div className="criteria-item p-3 border rounded">
            <label className="criteria-label font-semibold text-sm block mb-2">Scientific Novelty & Impact</label>
            <div className="flex-align gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${scores.novelty >= star ? 'active' : ''}`}
                  onClick={() => handleScoreChange('novelty', star)}
                >
                  ★
                </button>
              ))}
              <span className="score-val font-bold text-sm ml-2">{scores.novelty}/5</span>
            </div>
          </div>

          <div className="criteria-item p-3 border rounded">
            <label className="criteria-label font-semibold text-sm block mb-2">Technical Quality & Rigor</label>
            <div className="flex-align gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${scores.technicalQuality >= star ? 'active' : ''}`}
                  onClick={() => handleScoreChange('technicalQuality', star)}
                >
                  ★
                </button>
              ))}
              <span className="score-val font-bold text-sm ml-2">{scores.technicalQuality}/5</span>
            </div>
          </div>

          <div className="criteria-item p-3 border rounded">
            <label className="criteria-label font-semibold text-sm block mb-2">Presentation & Clarity</label>
            <div className="flex-align gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${scores.presentation >= star ? 'active' : ''}`}
                  onClick={() => handleScoreChange('presentation', star)}
                >
                  ★
                </button>
              ))}
              <span className="score-val font-bold text-sm ml-2">{scores.presentation}/5</span>
            </div>
          </div>
        </div>

        <div className="overall-score-summary mt-3 p-3 bg-subtle border rounded flex-between align-center">
          <span className="font-semibold text-sm">Calculated Composite Score:</span>
          <span className="overall-score-badge text-lg font-bold text-blue">{calculateOverall()} / 5.0</span>
        </div>
      </div>

      {/* Author Comments Section */}
      <div className="form-group mb-4">
        <label className="form-label font-semibold text-sm block mb-1">
          <MessageSquare size={16} className="inline-icon mr-1" /> 2. Comments & Constructive Feedback to Author (Required)
        </label>
        <textarea
          className="form-textarea w-full p-3 border rounded text-sm"
          rows={5}
          placeholder="Provide detailed feedback highlighting manuscript strengths, methodology gaps, required figure improvements, or literature additions..."
          value={authorComments}
          onChange={(e) => setAuthorComments(e.target.value)}
        />
      </div>

      {/* Confidential Comments Section */}
      <div className="form-group mb-4">
        <label className="form-label font-semibold text-sm block mb-1">
          <Lock size={16} className="inline-icon mr-1 text-amber" /> 3. Confidential Comments to Handling Editor (Optional)
        </label>
        <textarea
          className="form-textarea w-full p-3 border rounded text-sm"
          rows={3}
          placeholder="Private remarks regarding manuscript suitability, ethical concerns, or editorial suggestions..."
          value={confidentialComments}
          onChange={(e) => setConfidentialComments(e.target.value)}
        />
      </div>

      {/* Final Recommendation Section */}
      <div className="recommendation-section mb-4 border-t pt-3">
        <label className="form-label font-semibold text-sm block mb-2">4. Final Peer Review Recommendation</label>
        <div className="recommendation-options-grid">
          <label className={`recommendation-radio-card ${recommendation === 'accept' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="recommendation"
              value="accept"
              checked={recommendation === 'accept'}
              onChange={(e) => setRecommendation(e.target.value)}
            />
            <span className="font-semibold">Accept Unconditionally</span>
          </label>

          <label className={`recommendation-radio-card ${recommendation === 'minor_revision' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="recommendation"
              value="minor_revision"
              checked={recommendation === 'minor_revision'}
              onChange={(e) => setRecommendation(e.target.value)}
            />
            <span className="font-semibold">Minor Revisions Required</span>
          </label>

          <label className={`recommendation-radio-card ${recommendation === 'major_revision' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="recommendation"
              value="major_revision"
              checked={recommendation === 'major_revision'}
              onChange={(e) => setRecommendation(e.target.value)}
            />
            <span className="font-semibold">Major Revisions Required</span>
          </label>

          <label className={`recommendation-radio-card ${recommendation === 'reject' ? 'selected' : ''}`}>
            <input
              type="radio"
              name="recommendation"
              value="reject"
              checked={recommendation === 'reject'}
              onChange={(e) => setRecommendation(e.target.value)}
            />
            <span className="font-semibold">Reject Manuscript</span>
          </label>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="form-footer border-t pt-3 flex-between">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" disabled={isSubmitting} icon={Send}>
          {isSubmitting ? 'Submitting Review...' : 'Submit Final Peer Review'}
        </Button>
      </div>
    </form>
  );
};

export default ReviewEvaluationForm;
