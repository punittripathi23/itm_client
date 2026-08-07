import React, { useState, useEffect } from 'react';
import { cmsService } from '../../../services/cms.service';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import { Save, Plus, Trash2, CheckCircle, Settings, Volume2 } from 'lucide-react';
import './AdminPages.css';

export const AdminCMS = () => {
  const [cms, setCms] = useState({});
  
  // Hero configs
  const [homeHeroTitle, setHomeHeroTitle] = useState('');
  const [homeHeroSubtitle, setHomeHeroSubtitle] = useState('');
  const [aboutUsText, setAboutUsText] = useState('');
  
  // Contacts
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  // Announcements list
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncementText, setNewAnnouncementText] = useState('');

  const [savingSettings, setSavingSettings] = useState(false);
  const [successSettings, setSuccessSettings] = useState(false);

  const loadCmsData = () => {
    const data = cmsService.getSettings();
    setCms(data);
    setHomeHeroTitle(data.homeHeroTitle);
    setHomeHeroSubtitle(data.homeHeroSubtitle);
    setAboutUsText(data.aboutUsText);
    setContactEmail(data.contactEmail);
    setContactPhone(data.contactPhone);
    setContactAddress(data.contactAddress);
    setAnnouncements(data.announcements || []);
  };

  useEffect(() => {
    loadCmsData();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSuccessSettings(false);
    setSavingSettings(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    cmsService.updateSettings({
      homeHeroTitle,
      homeHeroSubtitle,
      aboutUsText,
      contactEmail,
      contactPhone,
      contactAddress
    });

    setSavingSettings(false);
    setSuccessSettings(true);
    loadCmsData();
  };

  const handleAddAnnouncement = (e) => {
    e.preventDefault();
    if (!newAnnouncementText.trim()) return;
    cmsService.createAnnouncement(newAnnouncementText);
    setNewAnnouncementText('');
    loadCmsData();
  };

  const handleDeleteAnnouncement = (id) => {
    cmsService.deleteAnnouncement(id);
    loadCmsData();
  };

  return (
    <div className="admin-cms-view animate-fade-in">
      <div className="flex-between admin-table-header">
        <h3>Website Content Management (CMS)</h3>
      </div>

      {successSettings && (
        <div className="profile-success-banner flex-align animate-scale-up">
          <CheckCircle size={18} />
          <span>Global website CMS parameters updated successfully!</span>
        </div>
      )}

      <div className="admin-dashboard-layout-grid">
        {/* Settings form */}
        <form onSubmit={handleSaveSettings} className="cms-settings-form glass">
          <div className="panel-header border-b">
            <h4>Landing Hero & Metadata Configuration</h4>
          </div>
          <div className="panel-body flex-column-stack">
            <Input
              label="Hero Primary Heading"
              id="hero-title"
              type="text"
              value={homeHeroTitle}
              onChange={(e) => setHomeHeroTitle(e.target.value)}
              required
            />

            <Input
              label="Hero Subtitle Description"
              id="hero-subtitle"
              type="text"
              value={homeHeroSubtitle}
              onChange={(e) => setHomeHeroSubtitle(e.target.value)}
              required
            />

            <div className="form-group">
              <label htmlFor="cms-about" className="form-label">About Us Narrative</label>
              <textarea
                id="cms-about"
                rows="4"
                className="form-control"
                value={aboutUsText}
                onChange={(e) => setAboutUsText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="panel-header border-b mt-2 mb-1" style={{ paddingLeft: 0, paddingRight: 0 }}>
              <h4>Support Desk Coordinates</h4>
            </div>

            <div className="grid-2">
              <Input
                label="Public Email"
                id="contact-email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
              />

              <Input
                label="Helpdesk Phone"
                id="contact-phone"
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
            </div>

            <Input
              label="Campus Address Coordinates"
              id="contact-address"
              type="text"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              required
            />

            <div className="cms-submit-row">
              <Button type="submit" variant="primary" loading={savingSettings} icon={Save}>
                Save Page Details
              </Button>
            </div>
          </div>
        </form>

        {/* Announcements manager */}
        <div className="cms-announcements-panel glass">
          <div className="panel-header border-b">
            <h4>Announcements & Call Tickers</h4>
          </div>
          <div className="panel-body">
            <form onSubmit={handleAddAnnouncement} className="announcement-input-row flex-align">
              <Input
                id="new-ann"
                type="text"
                placeholder="Call for papers is open..."
                value={newAnnouncementText}
                onChange={(e) => setNewAnnouncementText(e.target.value)}
                className="flex-1"
                style={{ marginBottom: 0 }}
              />
              <Button type="submit" variant="primary" icon={Plus}>
                Post
              </Button>
            </form>

            <div className="announcements-cms-list mt-2">
              <h5>Active Ticker Feeds:</h5>
              {announcements.length === 0 ? (
                <p className="empty-logs text-center mt-1">No active announcements.</p>
              ) : (
                <div className="announcements-stack mt-1">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="ann-row flex-between border-b py-1">
                      <div className="ann-text flex-align">
                        <Volume2 size={16} className="text-secondary" />
                        <div>
                          <p className="font-semibold text-secondary" style={{ fontSize: '0.85rem' }}>{ann.text}</p>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{ann.date}</span>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="tbl-act-btn delete"
                        aria-label="Delete announcement"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCMS;
