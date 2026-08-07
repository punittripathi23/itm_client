import React, { useState, useEffect } from 'react';
import reviewerService from '../../../services/reviewer.service';
import ReviewEvaluationForm from '../components/ReviewEvaluationForm';
import Breadcrumb from '../../../components/common/Breadcrumb/Breadcrumb';
import Badge from '../../../components/common/Badge/Badge';
import Timeline from '../../../components/common/Timeline/Timeline';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Skeleton from '../../../components/common/Skeleton/Skeleton';
import { 
  BookOpen, Clock, CheckCircle, XCircle, FileText, 
  Send, Award, Star, RefreshCw, Check
} from 'lucide-react';
import './ReviewerDashboard.css';

export const ReviewerDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('invitations'); // 'invitations' | 'active' | 'completed' | 'form'
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [asgnData, compData] = await Promise.all([
        reviewerService.getReviewerAssignments(),
        reviewerService.getCompletedReviews()
      ]);
      setAssignments(asgnData || []);
      setCompletedReviews(compData || []);
    } catch (err) {
      console.error('Failed to load reviewer workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleInvitationResponse = async (assignmentId, response) => {
    try {
      await reviewerService.respondToInvitation(assignmentId, response);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingInvitations = assignments.filter(a => a.status === 'pending');
  const activeReviews = assignments.filter(a => a.status === 'accepted');

  return (
    <div className="reviewer-dashboard-root container animate-fade-in">
      <Breadcrumb items={[{ label: 'Peer Reviewer Workspace' }]} />

      {/* Header */}
      <div className="reviewer-header flex-between mb-4">
        <div>
          <h1 className="dashboard-title">Peer Reviewer Workspace</h1>
          <p className="dashboard-subtitle">Evaluate assigned manuscripts, score research novelty, and submit constructive peer reviews.</p>
        </div>
        <button className="btn btn-secondary btn-sm flex-align" onClick={fetchDashboardData}>
          <RefreshCw size={14} className="mr-1" /> Refresh Workspace
        </button>
      </div>

      {/* Metrics Row */}
      <div className="reviewer-stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{pendingInvitations.length}</span>
            <span className="stat-label">Pending Invitations</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <BookOpen size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{activeReviews.length}</span>
            <span className="stat-label">Active Reviews</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{completedReviews.length}</span>
            <span className="stat-label">Completed Reviews</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="reviewer-tabs-bar mb-4">
        <button
          className={`tab-btn ${activeTab === 'invitations' ? 'active' : ''}`}
          onClick={() => setActiveTab('invitations')}
        >
          <Clock size={16} /> Invitations ({pendingInvitations.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          <BookOpen size={16} /> Active Reviews ({activeReviews.length})
        </button>

        <button
          className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <CheckCircle size={16} /> Completed Reviews ({completedReviews.length})
        </button>
      </div>

      {/* Form View overlay if reviewing */}
      {activeTab === 'form' && selectedAssignment ? (
        <ReviewEvaluationForm
          assignment={selectedAssignment}
          onCancel={() => setActiveTab('active')}
          onSubmitSuccess={() => {
            setActiveTab('completed');
            fetchDashboardData();
          }}
        />
      ) : null}

      {/* Tab 1: Invitations */}
      {activeTab === 'invitations' && (
        <div className="tab-pane animate-fade-in">
          {loading ? (
            <div className="p-4">
              <Skeleton variant="text" width="40%" height="24px" style={{ marginBottom: '12px' }} />
              <Skeleton variant="rect" width="100%" height="140px" />
            </div>
          ) : pendingInvitations.length === 0 ? (
            <EmptyState
              title="No Pending Review Invitations"
              message="You have no pending invitations to review at this moment."
            />
          ) : (
            <div className="invitations-stack">
              {pendingInvitations.map(asgn => {
                const sub = asgn.submission || {};

                return (
                  <div key={asgn._id || asgn.id} className="invitation-card border p-4 mb-3 rounded bg-white">
                    <div className="flex-between mb-2">
                      <span className="manuscript-id-tag">{sub.submissionCustomId || 'MS-2025'}</span>
                      <span className="due-date text-xs text-muted">
                        Review Due: {asgn.dueDate ? new Date(asgn.dueDate).toLocaleDateString() : 'In 14 Days'}
                      </span>
                    </div>

                    <h3 className="manuscript-title mb-2">{sub.title}</h3>
                    <p className="abstract-snippet text-muted text-sm mb-3">
                      {sub.abstract ? sub.abstract.substring(0, 180) + '...' : 'No abstract preview'}
                    </p>

                    <div className="invitation-actions border-t pt-3 flex-between align-center">
                      <span className="text-xs text-muted font-semibold">
                        Research Domain: {sub.researchArea || 'Computer Science'}
                      </span>

                      <div className="flex-align gap-2">
                        <Button
                          variant="secondary"
                          size="small"
                          icon={XCircle}
                          onClick={() => handleInvitationResponse(asgn._id || asgn.id, 'declined')}
                        >
                          Decline Invitation
                        </Button>

                        <Button
                          variant="primary"
                          size="small"
                          icon={Check}
                          onClick={() => handleInvitationResponse(asgn._id || asgn.id, 'accepted')}
                        >
                          Accept & Review
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Active Reviews */}
      {activeTab === 'active' && (
        <div className="tab-pane animate-fade-in">
          {activeReviews.length === 0 ? (
            <EmptyState
              title="No Active Reviews"
              message="Accept an invitation from the Pending Invitations tab to start reviewing."
            />
          ) : (
            <div className="active-reviews-stack">
              {activeReviews.map(asgn => {
                const sub = asgn.submission || {};

                return (
                  <div key={asgn._id || asgn.id} className="active-card border p-4 mb-3 rounded bg-white">
                    <div className="flex-between mb-2">
                      <span className="manuscript-id-tag">{sub.submissionCustomId || 'MS-2025'}</span>
                      <Badge variant="under-review">Review in Progress</Badge>
                    </div>

                    <h3 className="manuscript-title mb-2">{sub.title}</h3>
                    <p className="abstract-snippet text-muted text-sm mb-3">{sub.abstract}</p>

                    <Timeline currentStatus="under_review" />

                    <div className="active-footer border-t pt-3 flex-between align-center mt-3">
                      <span className="due-date text-xs text-muted">
                        Deadline: {asgn.dueDate ? new Date(asgn.dueDate).toLocaleDateString() : 'In 10 days'}
                      </span>

                      <Button
                        variant="primary"
                        size="small"
                        icon={Edit3}
                        onClick={() => {
                          setSelectedAssignment(asgn);
                          setActiveTab('form');
                        }}
                      >
                        Evaluate Manuscript
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Completed Reviews */}
      {activeTab === 'completed' && (
        <div className="tab-pane animate-fade-in">
          {completedReviews.length === 0 ? (
            <EmptyState
              title="No Completed Peer Reviews"
              message="Your submitted evaluation records will appear here once submitted."
            />
          ) : (
            <div className="completed-stack">
              {completedReviews.map(rev => (
                <div key={rev._id || rev.id} className="completed-card border p-4 mb-3 rounded bg-white">
                  <div className="flex-between mb-2">
                    <span className="manuscript-id-tag">{rev.submission?.submissionCustomId || 'MS-2025'}</span>
                    <Badge variant="accepted">Review Submitted</Badge>
                  </div>

                  <h3 className="manuscript-title mb-2">{rev.submission?.title || 'Evaluated Manuscript'}</h3>
                  
                  <div className="scores-summary border p-3 rounded bg-subtle mb-3 flex-between">
                    <div>
                      <span className="text-xs text-muted font-semibold block">Composite Score</span>
                      <span className="font-bold text-lg text-blue">{rev.overallScore || '4.2'} / 5.0</span>
                    </div>

                    <div>
                      <span className="text-xs text-muted font-semibold block">Recommendation</span>
                      <span className="font-semibold text-sm capitalize">{rev.recommendation ? rev.recommendation.replace('_', ' ') : 'Minor Revision'}</span>
                    </div>
                  </div>

                  <p className="author-comments-preview text-sm text-dark">
                    <strong>Author Feedback:</strong> "{rev.authorComments}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;
