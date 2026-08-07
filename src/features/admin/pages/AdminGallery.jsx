import React, { useState, useEffect } from 'react';
import { galleryService } from '../../../services/gallery.service';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Select from '../../../components/common/Select/Select';
import Modal from '../../../components/common/Modal/Modal';
import ConfirmDialog from '../../../components/common/ConfirmDialog/ConfirmDialog';
import { Plus, Edit2, Trash2, Camera, Video, Image } from 'lucide-react';
import './AdminTables.css';

export const AdminGallery = () => {
  const [albums, setAlbums] = useState([]);
  
  // Modals
  const [isOpen, setIsOpen] = useState(false);
  const [activeAlbum, setActiveAlbum] = useState(null);
  
  const [title, setTitle] = useState('');
  const [type, setType] = useState('image');
  const [coverImage, setCoverImage] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete Dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteAlbumId, setDeleteAlbumId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadAlbums = () => {
    setAlbums(galleryService.getAlbums());
  };

  useEffect(() => {
    loadAlbums();
  }, []);

  const handleCreateOpen = () => {
    setActiveAlbum(null);
    setTitle('');
    setType('image');
    setCoverImage('https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80');
    setIsOpen(true);
  };

  const handleEditOpen = (album) => {
    setActiveAlbum(album);
    setTitle(album.title);
    setType(album.type);
    setCoverImage(album.coverImage);
    setIsOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title || !coverImage) return;

    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const formData = { title, type, coverImage };

    if (activeAlbum) {
      galleryService.updateAlbum(activeAlbum.id, formData);
    } else {
      galleryService.createAlbum(formData);
    }

    setSaving(false);
    setIsOpen(false);
    loadAlbums();
  };

  const handleDeleteTrigger = (id) => {
    setDeleteAlbumId(id);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    galleryService.deleteAlbum(deleteAlbumId);
    setDeleting(false);
    setDeleteOpen(false);
    loadAlbums();
  };

  return (
    <div className="admin-gallery-view">
      <div className="flex-between admin-table-header">
        <h3>Media Album Database</h3>
        <Button variant="primary" onClick={handleCreateOpen} icon={Plus}>
          Add Album
        </Button>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cover</th>
              <th>Album Title</th>
              <th>Type</th>
              <th>Media Count</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-3">No albums registered.</td>
              </tr>
            ) : (
              albums.map((album) => (
                <tr key={album.id}>
                  <td style={{ width: '80px' }}>
                    <img 
                      src={album.coverImage} 
                      alt="" 
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} 
                    />
                  </td>
                  <td>
                    <strong>{album.title}</strong>
                  </td>
                  <td>
                    <span className={`badge ${album.type === 'video' ? 'badge-danger' : 'badge-success'}`}>
                      {album.type.toUpperCase()}
                    </span>
                  </td>
                  <td>{album.items?.length || 0} items</td>
                  <td className="text-right">
                    <div className="action-btns flex-align justify-end">
                      <button onClick={() => handleEditOpen(album)} className="tbl-act-btn edit" aria-label="Edit album">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteTrigger(album.id)} className="tbl-act-btn delete" aria-label="Delete album">
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
        title={activeAlbum ? 'Modify Media Album' : 'Create Media Album'}
        size="medium"
      >
        <form onSubmit={handleSave} className="admin-form animate-fade-in">
          <Input
            label="Album Title"
            id="g-title"
            type="text"
            placeholder="Summit Gallery highlights..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Select
            label="Media Category Type"
            id="g-type"
            options={['image', 'video']}
            value={type}
            placeholder="Select Type"
            onChange={(e) => setType(e.target.value)}
            required
          />

          <Input
            label="Cover Image Link"
            id="g-cover"
            type="text"
            placeholder="https://images.unsplash.com/photo..."
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            required
          />

          <div className="cms-submit-row">
            <Button variant="secondary" onClick={() => setIsOpen(false)} className="mr-1" disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              Save Album
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
        title="Delete Media Album"
        message="Are you sure you want to remove this media album along with its content?"
      />
    </div>
  );
};

export default AdminGallery;
