import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import submissionService from '../../../services/submission.service';
import SubmissionWizard from '../components/SubmissionWizard';
import Breadcrumb from '../../../components/common/Breadcrumb/Breadcrumb';
import Badge from '../../../components/common/Badge/Badge';
import Timeline from '../../../components/common/Timeline/Timeline';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Skeleton from '../../../components/common/Skeleton/Skeleton';
import { 
  FileText, Plus, Clock, AlertTriangle, CheckCircle, 
  XCircle, Send, MessageSquare, Bell, User, RefreshCw, Eye
} from 'lucide-react';
import './AuthorDashboard.css';

export const AuthorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('manuscripts'); // 'manuscripts' | 'submit' | 'messages'
  const [statusFilter, setStatusFilter] = useState('all');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const data = await submissionService.getMySubmissions({ status: statusFilter });
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error('Failed to load author submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  // Statistics counts
  const stats = {
    total: submissions.length,
    drafts: submissions.filter(s => s.status === 'draft').length,
    underReview: submissions.filter(s => s.status === 'under_review' || s.status === 'submitted').length,
    revisions: submissions.filter(s => s.status === 'revision_requested' || s.status === 'revision').length,
    accepted: submissions.filter(s => s.status === 'accepted' || s.status === 'published').length
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'draft': return 'draft';
      case 'submitted': return 'submitted';
      case 'under_review': return 'under-review';
      case 'revision_requested':
      case 'revision': return 'revision';
      case 'accepted': return 'accepted';
      case 'rejected': return 'rejected';
      case 'published': return 'published';
      default: return 'info';
    }
  };

  const formatStatusLabel = (status) => {
    if (status === 'under_review') return 'Under Review';
    if (status === 'revision_requested') return 'Revision Requested';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="author-dashboard-root container animate-fade-in">
      <Breadcrumb items={[{ label: 'Author Workspace' }]} />

      {/* Dashboard Top Banner */}
      <div className="author-dashboard-header flex-between mb-4">
        <div>
          <h1 className="dashboard-title">Author Portal & Submissions</h1>
          <p className="dashboard-subtitle">Manage your research manuscripts, track peer review progress, and submit new papers.</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => setActiveTab('submit')} 
          icon={Plus}
        >
          Submit New Manuscript
        </Button>
      </div>

      {/* Stat Cards Metrics Row */}
      <div className="author-stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Submissions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.underReview}</span>
            <span className="stat-label">Under Peer Review</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.revisions}</span>
            <span className="stat-label">Revisions Needed</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.accepted}</span>
            <span className="stat-label">Accepted / Published</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="author-tabs-bar mb-4">
        <button 
          className={`tab-btn ${activeTab === 'manuscripts' ? 'active' : ''}`}
          onClick={() => setActiveTab('manuscripts')}
        >
          <FileText size={16} /> My Manuscripts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'submit' ? 'active' : ''}`}
          onClick={() => setActiveTab('submit')}
        >
          <Plus size={16} /> New Submission
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <MessageSquare size={16} /> Editorial Messages
        </button>
      </div>

      {/* Tab Content 1: My Manuscripts */}
      {activeTab === 'manuscripts' && (
        <div className="tab-pane animate-fade-in">
          {/* Status Filter Chips */}
          <div className="status-filter-row mb-3">
            {['all', 'submitted', 'under_review', 'revision_requested', 'accepted', 'draft'].map(st => (
              <button
                key={st}
                className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'all' ? 'All Papers' : formatStatusLabel(st)}
              </button>
            ))}
            <button className="btn-icon-refresh" onClick={fetchSubmissions} title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>

          {loading ? (
            <div className="p-4">
              <Skeleton variant="text" width="60%" height="24px" style={{ marginBottom: '12px' }} />
              <Skeleton variant="rect" width="100%" height="160px" style={{ marginBottom: '16px' }} />
              <Skeleton variant="rect" width="100%" height="160px" />
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState
              title="No Manuscripts Found"
              message="You haven't submitted any research papers under this status yet."
              action={
                <Button variant="primary" onClick={() => setActiveTab('submit')} icon={Plus}>
                  Submit Your First Paper
                </Button>
              }
            />
          ) : (
            <div className="manuscripts-stack">
              {submissions.map(sub => (
                <div key={sub._id || sub.id} className="manuscript-card border p-4 mb-3">
                  <div className="manuscript-header flex-between mb-2">
                    <div className="flex-align gap-2">
                      <span className="manuscript-id-tag">{sub.submissionCustomId || 'MS-2025-104'}</span>
                      <Badge variant={getStatusBadgeVariant(sub.status)}>
                        {formatStatusLabel(sub.status)}
                      </Badge>
                    </div>
                    <span className="submission-date text-muted">
                      Submitted: {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="manuscript-title mb-2">{sub.title}</h3>
                  <p className="manuscript-abstract-snippet text-muted mb-3">
                    {sub.abstract ? sub.abstract.substring(0, 160) + '...' : 'No abstract provided'}
                  </p>

                  {/* Horizontal Lifecycle Progress Timeline */}
                  <Timeline currentStatus={sub.status} />

                  <div className="manuscript-footer border-t pt-3 flex-between align-center mt-3">
                    <div className="authors-info">
                      <strong>Authors:</strong> {sub.authors ? sub.authors.map(a => a.name).join(', ') : user.name}
                    </div>

                    <div className="flex-align gap-2">
                      <Button variant="secondary" size="small" icon={Eye} onClick={() => setSelectedSubmission(sub)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Submission Wizard */}
      {activeTab === 'submit' && (
        <div className="tab-pane animate-fade-in">
          <SubmissionWizard 
            user={user} 
            onComplete={() => {
              setActiveTab('manuscripts');
              fetchSubmissions();
            }} 
          />
        </div>
      )}

      {/* Tab Content 3: Messages */}
      {activeTab === 'messages' && (
        <div className="tab-pane animate-fade-in">
          <div className="messages-card border p-4">
            <h3>Editorial Communication Channel</h3>
            <p className="text-muted mb-3">Direct notification feed from Section Editors regarding your active submissions.</p>

            <div className="message-item border p-3 mb-2 rounded bg-subtle">
              <div className="flex-between mb-1">
                <strong>Editorial Board — ICAME 2025</strong>
                <span className="text-muted text-xs">Today, 10:30 AM</span>
              </div>
              <p className="text-sm">Your submission MS-2025-104 has successfully passed the technical check and has been assigned to 2 peer reviewers.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorDashboard;
