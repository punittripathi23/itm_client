import { getStorageItem, setStorageItem } from '../utils/storage';

export const workshopService = {
  getWorkshops: () => {
    return getStorageItem('cpp_workshops', []);
  },

  getWorkshopById: (id) => {
    const workshops = getStorageItem('cpp_workshops', []);
    return workshops.find(w => w.id === id) || null;
  },

  createWorkshop: (workshopData) => {
    const workshops = getStorageItem('cpp_workshops', []);
    const newWorkshop = {
      id: `work_${Date.now()}`,
      ...workshopData
    };
    const updated = [newWorkshop, ...workshops];
    setStorageItem('cpp_workshops', updated);
    return newWorkshop;
  },

  updateWorkshop: (id, workshopData) => {
    const workshops = getStorageItem('cpp_workshops', []);
    const updated = workshops.map(w => {
      if (w.id === id) {
        return { ...w, ...workshopData };
      }
      return w;
    });
    setStorageItem('cpp_workshops', updated);
    return updated.find(w => w.id === id);
  },

  deleteWorkshop: (id) => {
    const workshops = getStorageItem('cpp_workshops', []);
    const filtered = workshops.filter(w => w.id !== id);
    setStorageItem('cpp_workshops', filtered);
    return true;
  }
};

export default workshopService;
