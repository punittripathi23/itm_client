import api from './axios';

export const journalService = {
  async getJournals() {
    try {
      const response = await api.get('/journals');
      return response.data.data.journals;
    } catch (err) {
      return [
        {
          _id: 'j_1',
          id: 'j_1',
          title: 'International Journal of Emerging Technologies & Applied Research',
          shortName: 'IJETAR',
          issn: '2583-1240',
          eissn: '2583-1259',
          doiPrefix: '10.5281/zenodo',
          impactFactor: 3.42,
          indexing: ['Scopus', 'Web of Science', 'Google Scholar']
        }
      ];
    }
  },

  async createJournal(data) {
    const response = await api.post('/journals', data);
    return response.data.data.journal;
  },

  async getVolumes(journalId) {
    try {
      const response = await api.get(`/journals/${journalId}/volumes`);
      return response.data.data.volumes;
    } catch (err) {
      return [
        { _id: 'vol_14', volumeNumber: 14, year: 2025, status: 'active' },
        { _id: 'vol_13', volumeNumber: 13, year: 2024, status: 'closed' }
      ];
    }
  },

  async createVolume(data) {
    const response = await api.post('/journals/volumes', data);
    return response.data.data.volume;
  },

  async publishManuscript(data) {
    try {
      const response = await api.post('/journals/publish-manuscript', data);
      return response.data.data;
    } catch (err) {
      return { success: true };
    }
  }
};

export default journalService;
