import api from './axios';
import { getStorageItem, setStorageItem } from '../utils/storage';

export const submissionService = {
  async submitPaper(data) {
    try {
      const response = await api.post('/submissions', data);
      return response.data.data.submission;
    } catch (err) {
      // LocalStorage fallback for seamless demo if backend offline
      const localSubmissions = getStorageItem('cpp_submissions', []);
      const newSubmission = {
        _id: `sub_${Date.now()}`,
        id: `sub_${Date.now()}`,
        submissionCustomId: `MS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setStorageItem('cpp_submissions', [newSubmission, ...localSubmissions]);
      return newSubmission;
    }
  },

  async saveDraft(data) {
    return this.submitPaper({ ...data, status: 'draft' });
  },

  async getMySubmissions(params = {}) {
    try {
      const response = await api.get('/submissions/my-submissions', { params });
      return response.data.data;
    } catch (err) {
      // LocalStorage fallback
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

  async getSubmissionById(id) {
    try {
      const response = await api.get(`/submissions/${id}`);
      return response.data.data.submission;
    } catch (err) {
      const localSubmissions = getStorageItem('cpp_submissions', []);
      return localSubmissions.find(s => s._id === id || s.id === id) || null;
    }
  }
};

export default submissionService;
