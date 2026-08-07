import api from './axios';
import { getStorageItem, setStorageItem } from '../utils/storage';

export const editorService = {
  async getDashboardStats() {
    try {
      const response = await api.get('/editor/stats');
      return response.data.data.stats;
    } catch (err) {
      const localSubmissions = getStorageItem('cpp_submissions', []);
      return {
        totalSubmissions: localSubmissions.length || 14,
        pendingTechnicalCheck: localSubmissions.filter(s => s.status === 'submitted').length || 4,
        underReview: localSubmissions.filter(s => s.status === 'under_review').length || 6,
        revisionsNeeded: localSubmissions.filter(s => s.status === 'revision_requested').length || 2,
        accepted: localSubmissions.filter(s => s.status === 'accepted' || s.status === 'published').length || 2,
        totalReviewers: 8
      };
    }
  },

  async getAllSubmissions(params = {}) {
    try {
      const response = await api.get('/editor/submissions', { params });
      return response.data.data;
    } catch (err) {
      const localSubmissions = getStorageItem('cpp_submissions', []);
      let filtered = localSubmissions;
      if (params.status && params.status !== 'all') {
        filtered = filtered.filter(s => s.status === params.status);
      }
      return {
        submissions: filtered,
        pagination: { page: 1, limit: 10, total: filtered.length, pages: 1 }
      };
    }
  },

  async getAvailableReviewers() {
    try {
      const response = await api.get('/editor/reviewers');
      return response.data.data.reviewers;
    } catch (err) {
      return [
        { _id: 'rev_1', id: 'rev_1', name: 'Dr. Sarah Jenkins', email: 's.jenkins@academic.edu', activeWorkload: 2 },
        { _id: 'rev_2', id: 'rev_2', name: 'Prof. Marcus Chen', email: 'm.chen@stanford.edu', activeWorkload: 1 },
        { _id: 'rev_3', id: 'rev_3', name: 'Peer Reviewer (Demo)', email: 'reviewer@test.com', activeWorkload: 0 },
        { _id: 'rev_4', id: 'rev_4', name: 'Dr. Elena Rostova', email: 'e.rostova@oxford.ac.uk', activeWorkload: 3 }
      ];
    }
  },

  async assignReviewer(submissionId, reviewerId, invitationNote) {
    try {
      const response = await api.post('/editor/assign-reviewer', {
        submissionId,
        reviewerId,
        invitationNote
      });
      return response.data.data;
    } catch (err) {
      const localSubmissions = getStorageItem('cpp_submissions', []);
      const updated = localSubmissions.map(s => {
        if (s._id === submissionId || s.id === submissionId) {
          return { ...s, status: 'under_review' };
        }
        return s;
      });
      setStorageItem('cpp_submissions', updated);
      return { success: true };
    }
  },

  async updateManuscriptStatus(submissionId, status, comment) {
    try {
      const response = await api.patch(`/editor/submissions/${submissionId}/status`, {
        status,
        comment
      });
      return response.data.data.submission;
    } catch (err) {
      const localSubmissions = getStorageItem('cpp_submissions', []);
      const updated = localSubmissions.map(s => {
        if (s._id === submissionId || s.id === submissionId) {
          return { ...s, status };
        }
        return s;
      });
      setStorageItem('cpp_submissions', updated);
      return { success: true };
    }
  }
};

export default editorService;
