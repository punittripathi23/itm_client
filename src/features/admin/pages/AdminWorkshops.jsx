import React, { useState, useEffect } from 'react';
import { workshopService } from '../../../services/workshop.service';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Modal from '../../../components/common/Modal/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
import './AdminTables.css';

export const AdminWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  
  // Modals
  const [isOpen, setIsOpen] = useState(false);
  const [activeWorkshop, setActiveWorkshop] = useState(null);
  
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete Dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteWorkshopId, setDeleteWorkshopId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadWorkshops = () => {
    setWorkshops(workshopService.getWorkshops());
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  const handleCreateOpen = () => {
    setActiveWorkshop(null);
    setTitle('');
    setSpeaker('');
    setDate('');
    setTime('');
    setLocation('');
    setDescription('');
    setIsOpen(true);
  };

  const handleEditOpen = (work) => {
    setActiveWorkshop(work);
    setTitle(work.title);
    setSpeaker(work.speaker);
    setDate(work.date);
    setTime(work.time);
    setLocation(work.location);
    setDescription(work.description);
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !speaker || !date || !time || !location) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const formData = { title, speaker, date, time, location, description };

    if (activeWorkshop) {
      workshopService.updateWorkshop(activeWorkshop.id, formData);
    } else {
      workshopService.createWorkshop(formData);
    }

    setSaving(false);
    setIsOpen(false);
    loadWorkshops();
  };

  const handleDeleteTrigger = (id) => {
    setDeleteWorkshopId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    workshopService.deleteWorkshop(deleteWorkshopId);
    setDeleting(false);
    setDeleteOpen(false);
    loadWorkshops();
  };

  return (
    <div className="admin-workshops-view">
      <div className="flex-between admin-table-header">
        <h3>Technical Seminar & Workshop Catalog</h3>
        <Button variant="primary" onClick={handleCreateOpen} icon={Plus}>
          Add Seminar
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Workshop Seminar</th>
              <th>Instructor / Speaker</th>
              <th>Date / Time</th>
              <th>Venue Venue</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workshops.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3">No workshops registered.</td>
              </tr>
            ) : (
              workshops.map((work) => (
                <tr key={work.id}>
                  <td>
                    <strong>{work.title}</strong>
                  </td>
                  <td>{work.speaker}</td>
                  <td>{work.date} @ {work.time}</td>
                  <td>{work.location}</td>
                  <td className="text-right">
                    <div className="action-btns flex-align justify-end">
                      <button onClick={() => handleEditOpen(work)} className="tbl-act-btn edit" aria-label="Edit workshop">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteTrigger(work.id)} className="tbl-act-btn delete" aria-label="Delete workshop">
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
        title={activeWorkshop ? 'Modify Seminar' : 'Create Seminar'}
        size="medium"
      >
        <form onSubmit={handleSave} className="admin-form animate-fade-in">
          <Input
            label="Workshop Title"
            id="w-title"
            type="text"
            placeholder="Hands-on Deep Learning..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid-2">
            <Input
              label="Instructor / Speaker"
              id="w-speaker"
              type="text"
              placeholder="Dr. Emily Watson"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              required
            />
            <Input
              label="Date"
              id="w-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid-2">
            <Input
              label="Timing"
              id="w-time"
              type="text"
              placeholder="e.g. 02:00 PM - 05:00 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <Input
              label="Venue Location"
              id="w-location"
              type="text"
              placeholder="Seminar Hall A"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="w-description" className="form-label">Description Context</label>
            <textarea
              id="w-description"
              rows="3"
              className="form-control"
              placeholder="Provide a summary of seminar topics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="cms-submit-row">
            <Button variant="secondary" onClick={() => setIsOpen(false)} className="mr-1" disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Save Seminar
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
        title="Delete Seminar Log"
        message="Are you sure you want to remove this seminar session listing?"
      />
    </div>
  );
};

export default AdminWorkshops;
