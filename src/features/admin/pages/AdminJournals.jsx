import React, { useState, useEffect } from 'react';
import journalService from '../../../services/journal.service';
import Breadcrumb from '../../../components/common/Breadcrumb/Breadcrumb';
import Badge from '../../../components/common/Badge/Badge';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import { BookOpen, Layers, Plus, Shield, Check } from 'lucide-react';
import './AdminPages.css';

export const AdminJournals = () => {
  const [journals, setJournals] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVolNum, setNewVolNum] = useState('');
  const [newVolYear, setNewVolYear] = useState('2025');

  useEffect(() => {
    journalService.getJournals().then(list => {
      setJournals(list || []);
      if (list && list.length > 0) {
        journalService.getVolumes(list[0]._id || list[0].id).then(vols => setVolumes(vols || []));
      }
    });
  }, []);

  const handleCreateVolume = async (e) => {
    e.preventDefault();
    if (!journals[0] || !newVolNum) return;

    try {
      const vol = await journalService.createVolume({
        journal: journals[0]._id || journals[0].id,
        volumeNumber: parseInt(newVolNum),
        year: parseInt(newVolYear)
      });
      setVolumes(prev => [vol, ...prev]);
      setIsModalOpen(false);
      setNewVolNum('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-journals-root container p-4 animate-fade-in">
      <Breadcrumb items={[{ label: 'Admin Panel', path: '/admin' }, { label: 'Journal & Volume Management' }]} />

      <div className="flex-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Journal & Volume Management</h1>
          <p className="text-muted text-sm">Configure publication issues, ISSNs, volume archives, and indexing status.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create New Volume
        </Button>
      </div>

      {/* Journal Info Overview Card */}
      {journals.map(j => (
        <div key={j._id || j.id} className="journal-card border p-4 mb-4 rounded bg-white">
          <div className="flex-between mb-2">
            <h2 className="text-xl font-bold text-navy">{j.title} ({j.shortName})</h2>
            <Badge variant="doi">ISSN: {j.issn}</Badge>
          </div>
          <p className="text-muted text-sm mb-3">{j.description}</p>
          <div className="flex-align gap-3 text-xs font-semibold text-muted">
            <span>DOI Prefix: <strong>{j.doiPrefix}</strong></span>
            <span>Impact Factor: <strong>{j.impactFactor}</strong></span>
            <span>Publisher: <strong>{j.publisher}</strong></span>
          </div>
        </div>
      ))}

      {/* Volumes & Issues Table */}
      <div className="volumes-section border p-4 rounded bg-white">
        <h3 className="font-bold text-lg mb-3">Published Volume Archives</h3>
        <table className="admin-table w-full">
          <thead>
            <tr>
              <th>Volume #</th>
              <th>Publication Year</th>
              <th>Issues Count</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {volumes.map((v, i) => (
              <tr key={v._id || i}>
                <td><strong>Volume {v.volumeNumber}</strong></td>
                <td>{v.year}</td>
                <td>4 Issues</td>
                <td><Badge variant={v.status === 'active' ? 'success' : 'info'}>{v.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Volume Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Journal Volume">
        <form onSubmit={handleCreateVolume} className="p-2">
          <Input
            label="Volume Number"
            type="number"
            placeholder="e.g. 15"
            value={newVolNum}
            onChange={(e) => setNewVolNum(e.target.value)}
            required
          />
          <Input
            label="Publication Year"
            type="number"
            value={newVolYear}
            onChange={(e) => setNewVolYear(e.target.value)}
            required
          />
          <div className="flex-between border-t pt-3 mt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" icon={Check}>Create Volume</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminJournals;
