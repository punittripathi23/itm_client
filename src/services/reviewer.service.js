import api from './axios';
import { getStorageItem, setStorageItem } from '../utils/storage';

export const reviewerService = {
  async getReviewerAssignments() {
    try {
      const response = await api.get('/reviewer/assignments');
      return response.data.data.assignments;
    } catch (err) {
      const localSubmissions = getStorageItem('cpp_submissions', []);
      return localSubmissions.map((s, idx) => ({
        _id: `asgn_${s._id || idx}`,
        id: `asgn_${s._id || idx}`,
        submission: s,
        status: idx === 0 ? 'accepted' : 'pending',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
      }));
    }
  },

  async respondToInvitation(assignmentId, responseStatus, declineReason = '') {
    try {
      const response = await api.post(`/reviewer/assignments/${assignmentId}/respond`, {
        response: responseStatus,
        declineReason
      });
      return response.data.data.assignment;
    } catch (err) {
      return { _id: assignmentId, status: responseStatus };
    }
  },

  async submitReview(payload) {
    try {
      const response = await api.post('/reviewer/reviews', payload);
      return response.data.data.review;
    } catch (err) {
      const localReviews = getStorageItem('cpp_reviews', []);
      const newReview = {
        _id: `rev_${Date.now()}`,
        id: `rev_${Date.now()}`,
        ...payload,
        submittedAt: new Date().toISOString()
      };
      setStorageItem('cpp_reviews', [newReview, ...localReviews]);
      return newReview;
    }
  },

  async getCompletedReviews() {
    try {
      const response = await api.get('/reviewer/reviews/my-reviews');
      return response.data.data.reviews;
    } catch (err) {
      return getStorageItem('cpp_reviews', []);
    }
  }
};

export default reviewerService;
