import React, { useState, useEffect } from 'react';
import editorService from '../../../services/editor.service';
import AssignReviewerModal from '../components/AssignReviewerModal';
import EditorialDecisionModal from '../components/EditorialDecisionModal';
import Breadcrumb from '../../../components/common/Breadcrumb/Breadcrumb';
import Badge from '../../../components/common/Badge/Badge';
import Timeline from '../../../components/common/Timeline/Timeline';
import Button from '../../../components/common/Button/Button';
import EmptyState from '../../../components/common/EmptyState/EmptyState';
import Skeleton from '../../../components/common/Skeleton/Skeleton';
import { 
  Shield, Users, FileText, Clock, AlertTriangle, CheckCircle, 
  UserPlus, Award, RefreshCw, Filter, Search, Edit3
} from 'lucide-react';
import './EditorDashboard.css';

export const EditorDashboard = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingTechnicalCheck: 0,
    underReview: 0,
    revisionsNeeded: 0,
    accepted: 0,
    totalReviewers: 0
  });

  const [submissions, setSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [assignModalPaper, setAssignModalPaper] = useState(null);
  const [decisionModalPaper, setDecisionModalPaper] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, subData] = await Promise.all([
        editorService.getDashboardStats(),
        editorService.getAllSubmissions({ status: statusFilter, search })
      ]);
      setStats(statsData);
      setSubmissions(subData.submissions || []);
    } catch (err) {
      console.error('Failed to load editorial dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [statusFilter]);

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
    if (status === 'submitted') return 'Pending Technical Check';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="editor-dashboard-root container animate-fade-in">
      <Breadcrumb items={[{ label: 'Editorial Board Control Panel' }]} />

      {/* Top Banner */}
      <div className="editor-dashboard-header flex-between mb-4">
        <div>
          <h1 className="dashboard-title">Editorial Management Workspace</h1>
          <p className="dashboard-subtitle">Technical evaluation queue, peer reviewer assignments, and publication pipeline management.</p>
        </div>
        <button className="btn btn-secondary btn-sm flex-align" onClick={loadDashboardData}>
          <RefreshCw size={14} className="mr-1" /> Refresh Queue
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="editor-stats-grid mb-4">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalSubmissions}</span>
            <span className="stat-label">Total Manuscripts</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.pendingTechnicalCheck}</span>
            <span className="stat-label">Technical Check Queue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.underReview}</span>
            <span className="stat-label">In Peer Review</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.revisionsNeeded}</span>
            <span className="stat-label">Revision Queue</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.accepted}</span>
            <span className="stat-label">Accepted / Production</span>
          </div>
        </div>
      </div>

      {/* Editorial Controls & Filters Bar */}
      <div className="editor-controls-card border p-3 mb-4 rounded bg-white">
        <div className="flex-between align-center flex-wrap gap-2">
          {/* Status Filter Chips */}
          <div className="status-filter-row flex-align gap-2">
            <Filter size={16} className="text-muted" />
            {['all', 'submitted', 'under_review', 'revision_requested', 'accepted', 'published'].map(st => (
              <button
                key={st}
                className={`filter-chip ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'all' ? 'All Queue' : formatStatusLabel(st)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submissions Queue */}
      {loading ? (
        <div className="p-4">
          <Skeleton variant="text" width="50%" height="24px" style={{ marginBottom: '14px' }} />
          <Skeleton variant="rect" width="100%" height="180px" style={{ marginBottom: '16px' }} />
          <Skeleton variant="rect" width="100%" height="180px" />
        </div>
      ) : submissions.length === 0 ? (
        <EmptyState
          title="No Manuscripts in Queue"
          message="No active submissions currently match the selected editorial queue filter."
        />
      ) : (
        <div className="editor-submissions-stack">
          {submissions.map(sub => (
            <div key={sub._id || sub.id} className="editor-manuscript-card border p-4 mb-3 rounded bg-white">
              <div className="manuscript-header flex-between mb-2">
                <div className="flex-align gap-2">
                  <span className="manuscript-id-tag">{sub.submissionCustomId || 'MS-2025-104'}</span>
                  <Badge variant={getStatusBadgeVariant(sub.status)}>
                    {formatStatusLabel(sub.status)}
                  </Badge>
                  <span className="research-area-tag text-xs font-semibold text-muted">
                    {sub.researchArea || 'Computer Science'}
                  </span>
                </div>

                <span className="submission-date text-xs text-muted">
                  Submitted: {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>

              <h3 className="manuscript-title mb-2">{sub.title}</h3>
              <p className="manuscript-authors text-sm text-dark mb-3">
                <strong>Submitter:</strong> {sub.submitter?.name || 'Author'} ({sub.submitter?.email || 'author@academic.edu'})
              </p>

              {/* Manuscript Progress Timeline */}
              <Timeline currentStatus={sub.status} />

              {/* Editorial Action Bar */}
              <div className="editor-actions-bar border-t pt-3 flex-between align-center mt-3">
                <div className="reviewer-count-info text-xs text-muted">
                  <strong>Assigned Reviewers:</strong> {sub.assignedReviewers ? sub.assignedReviewers.length : 0} reviewers
                </div>

                <div className="flex-align gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    icon={UserPlus}
                    onClick={() => setAssignModalPaper(sub)}
                  >
                    Assign Reviewer
                  </Button>

                  <Button
                    variant="primary"
                    size="small"
                    icon={Edit3}
                    onClick={() => setDecisionModalPaper(sub)}
                  >
                    Editorial Decision
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {assignModalPaper && (
        <AssignReviewerModal
          isOpen={!!assignModalPaper}
          onClose={() => setAssignModalPaper(null)}
          submission={assignModalPaper}
          onAssigned={loadDashboardData}
        />
      )}

      {decisionModalPaper && (
        <EditorialDecisionModal
          isOpen={!!decisionModalPaper}
          onClose={() => setDecisionModalPaper(null)}
          submission={decisionModalPaper}
          onDecisionMade={loadDashboardData}
        />
      )}
    </div>
  );
};

export default EditorDashboard;
