import { getStorageItem, setStorageItem } from '../utils/storage';

export const cmsService = {
  getSettings: () => {
    return getStorageItem('cpp_cms', {});
  },

  updateSettings: (newSettings) => {
    const current = getStorageItem('cpp_cms', {});
    const updated = { ...current, ...newSettings };
    setStorageItem('cpp_cms', updated);
    return updated;
  },

  getAnnouncements: () => {
    const settings = getStorageItem('cpp_cms', {});
    return settings.announcements || [];
  },

  createAnnouncement: (text) => {
    const settings = getStorageItem('cpp_cms', {});
    const announcements = settings.announcements || [];
    const newAnn = {
      id: `ann_${Date.now()}`,
      text,
      date: new Date().toISOString().split('T')[0]
    };
    
    settings.announcements = [newAnn, ...announcements];
    setStorageItem('cpp_cms', settings);
    return newAnn;
  },

  deleteAnnouncement: (id) => {
    const settings = getStorageItem('cpp_cms', {});
    const announcements = settings.announcements || [];
    settings.announcements = announcements.filter(a => a.id !== id);
    setStorageItem('cpp_cms', settings);
    return true;
  }
};

export default cmsService;
