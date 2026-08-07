import React, { useState, useEffect } from 'react';
import { conferenceService } from '../../../services/conference.service';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
import './AdminTables.css';

export const AdminConferences = () => {
  const [conferences, setConferences] = useState([]);
  
  // Modals
  const [isOpen, setIsOpen] = useState(false);
  const [activeConf, setActiveConf] = useState(null);
  
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [saving, setSaving] = useState(false);

  // Delete Dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfId, setDeleteConfId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadConferences = () => {
    setConferences(conferenceService.getConferences());
  };

  useEffect(() => {
    loadConferences();
  }, []);

  const handleCreateOpen = () => {
    setActiveConf(null);
    setTitle('');
    setDate('');
    setEndDate('');
    setLocation('');
    setDescription('');
    setStatus('upcoming');
    setIsOpen(true);
  };

  const handleEditOpen = (conf) => {
    setActiveConf(conf);
    setTitle(conf.title);
    setDate(conf.date);
    setEndDate(conf.endDate);
    setLocation(conf.location);
    setDescription(conf.description);
    setStatus(conf.status);
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !date || !endDate || !location) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const formData = { title, date, endDate, location, description, status };

    if (activeConf) {
      conferenceService.updateConference(activeConf.id, formData);
    } else {
      conferenceService.createConference(formData);
    }

    setSaving(false);
    setIsOpen(false);
    loadConferences();
  };

  const handleDeleteTrigger = (id) => {
    setDeleteConfId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    conferenceService.deleteConference(deleteConfId);
    setDeleting(false);
    setDeleteOpen(false);
    loadConferences();
  };

  return (
    <div className="admin-conferences-view">
      <div className="flex-between admin-table-header">
        <h3>Conference Event Matrix</h3>
        <Button variant="primary" onClick={handleCreateOpen} icon={Plus}>
          Add Conference
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Conference Summit</th>
              <th>Status</th>
              <th>Date Parameters</th>
              <th>Location</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {conferences.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3">No conferences registered.</td>
              </tr>
            ) : (
              conferences.map((conf) => (
                <tr key={conf.id}>
                  <td>
                    <strong>{conf.title}</strong>
                  </td>
                  <td>
                    <span className={`badge ${conf.status === 'upcoming' ? 'badge-success' : 'badge-warning'}`}>
                      {conf.status.toUpperCase()}
                    </span>
                  </td>
                  <td>{conf.date} to {conf.endDate}</td>
                  <td>{conf.location}</td>
                  <td className="text-right">
                    <div className="action-btns flex-align justify-end">
                      <button onClick={() => handleEditOpen(conf)} className="tbl-act-btn edit" aria-label="Edit conference">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteTrigger(conf.id)} className="tbl-act-btn delete" aria-label="Delete conference">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={activeConf ? 'Modify Conference' : 'Register Conference'}
        size="medium"
      >
        <form onSubmit={handleSave} className="admin-form animate-fade-in">
          <Input
            label="Conference Title"
            id="c-title"
            type="text"
            placeholder="IEEE Cloud Conference 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid-2">
            <Input
              label="Start Date"
              id="c-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              id="c-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="grid-2">
            <Input
              label="Venue Location"
              id="c-location"
              type="text"
              placeholder="Pune, India (Hybrid)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />

            <Select
              label="Event Status"
              id="c-status"
              options={['upcoming', 'past']}
              value={status}
              placeholder="Select Status"
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="c-description" className="form-label">Description Context</label>
            <textarea
              id="c-description"
              rows="3"
              className="form-control"
              placeholder="Provide a summary of cloud/summit scopes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="cms-submit-row">
            <Button variant="secondary" onClick={() => setIsOpen(false)} className="mr-1" disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Save Event
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Delete Conference Event"
        message="Are you sure you want to delete this conference proceeding? This will clear related metadata references."
      />
    </div>
  );
};

export default AdminConferences;
