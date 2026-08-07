import { getStorageItem, setStorageItem } from '../utils/storage';

export const paperService = {
  getPapers: () => {
    return getStorageItem('cpp_papers', []);
  },

  getPaperById: (id) => {
    const papers = getStorageItem('cpp_papers', []);
    return papers.find(p => p.id === id) || null;
  },

  createPaper: (paperData) => {
    const papers = getStorageItem('cpp_papers', []);
    const newPaper = {
      id: `pap_${Date.now()}`,
      downloads: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      ...paperData
    };
    const updated = [newPaper, ...papers];
    setStorageItem('cpp_papers', updated);
    return newPaper;
  },

  updatePaper: (id, paperData) => {
    const papers = getStorageItem('cpp_papers', []);
    const updated = papers.map(p => {
      if (p.id === id) {
        return { ...p, ...paperData };
      }
      return p;
    });
    setStorageItem('cpp_papers', updated);
    return updated.find(p => p.id === id);
  },

  deletePaper: (id) => {
    const papers = getStorageItem('cpp_papers', []);
    const filtered = papers.filter(p => p.id !== id);
    setStorageItem('cpp_papers', filtered);
    return true;
  },

  searchPapers: (query = '', category = '', year = '', conference = '') => {
    let papers = getStorageItem('cpp_papers', []);
    
    if (query) {
      const q = query.toLowerCase();
      papers = papers.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.authors.toLowerCase().includes(q) || 
        p.abstract.toLowerCase().includes(q)
      );
    }
    
    if (category) {
      papers = papers.filter(p => p.category === category);
    }
    
    if (year) {
      papers = papers.filter(p => p.year === year);
    }
    
    if (conference) {
      papers = papers.filter(p => p.conference === conference);
    }
    
    return papers;
  }
};

export default paperService;
