import { getStorageItem, setStorageItem } from '../utils/storage';

export const conferenceService = {
  getConferences: () => {
    return getStorageItem('cpp_conferences', []);
  },

  getConferenceById: (id) => {
    const conferences = getStorageItem('cpp_conferences', []);
    return conferences.find(c => c.id === id) || null;
  },

  createConference: (conferenceData) => {
    const conferences = getStorageItem('cpp_conferences', []);
    const newConf = {
      id: `conf_${Date.now()}`,
      schedule: [],
      ...conferenceData
    };
    const updated = [newConf, ...conferences];
    setStorageItem('cpp_conferences', updated);
    return newConf;
  },

  updateConference: (id, conferenceData) => {
    const conferences = getStorageItem('cpp_conferences', []);
    const updated = conferences.map(c => {
      if (c.id === id) {
        return { ...c, ...conferenceData };
      }
      return c;
    });
    setStorageItem('cpp_conferences', updated);
    return updated.find(c => c.id === id);
  },

  deleteConference: (id) => {
    const conferences = getStorageItem('cpp_conferences', []);
    const filtered = conferences.filter(c => c.id !== id);
    setStorageItem('cpp_conferences', filtered);
    return true;
  }
};

export default conferenceService;
