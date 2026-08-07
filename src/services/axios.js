// Mock Axios Instance for simulation compatibility

import { apiDelay } from './api';

export const mockAxios = {
  get: async (url) => {
    await apiDelay();
    // Simply returns local storage mocks
    return { data: [] };
  },
  post: async (url, data) => {
    await apiDelay();
    return { data };
  },
  put: async (url, data) => {
    await apiDelay();
    return { data };
  },
  delete: async (url) => {
    await apiDelay();
    return { data: { success: true } };
  }
};

export default mockAxios;
