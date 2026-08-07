import React, { useState, useEffect } from 'react';
import { conferenceService } from '../../../services/conference.service';
import Button from '../../../components/common/Button/Button';
import Modal from '../../../components/common/Modal/Modal';
import { Calendar, MapPin, Clock, Award, Users, BookOpen } from 'lucide-react';
import './Conferences.css';

export const Conferences = () => {
  const [conferences, setConferences] = useState([]);
  const [selectedConf, setSelectedConf] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setConferences(conferenceService.getConferences());
  }, []);

  const handleOpenSchedule = (conf) => {
    setSelectedConf(conf);
    setIsModalOpen(true);
  };

  const upcomingConfs = conferences.filter(c => c.status === 'upcoming');
  const pastConfs = conferences.filter(c => c.status === 'past');

  return (
    <div className="conferences-root container animate-fade-in">
      <div className="conferences-page-header">
        <h1>Indexed Symposia & Conferences</h1>
        <p>Explore upcoming summits, access past event lists, and inspect technical presentation schedules.</p>
      </div>

      {/* Upcoming Conferences */}
      <section className="conferences-section">
        <h2 className="section-title">Upcoming Symposia</h2>
        <div className="conferences-grid grid-2">
          {upcomingConfs.map(conf => (
            <div key={conf.id} className="conference-card glass glass-hover">
              <div className="card-header-row flex-between">
                <span className="badge badge-success">Upcoming</span>
                <span className="event-date-badge flex-align">
                  <Calendar size={14} /> {conf.date}
                </span>
              </div>
              
              <h3 className="conf-title">{conf.title}</h3>
              <p className="conf-location flex-align">
                <MapPin size={14} className="location-icon" /> {conf.location}
              </p>
              
              <p className="conf-desc">{conf.description}</p>
              
              <div className="conf-actions border-t flex-between">
                <span className="dates-text">Dates: {conf.date} to {conf.endDate}</span>
                <Button 
                  variant="primary" 
                  size="small" 
                  onClick={() => handleOpenSchedule(conf)}
                >
                  View Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Conferences */}
      <section className="conferences-section mt-4">
        <h2 className="section-title">Past Proceedings Index</h2>
        <div className="conferences-grid grid-2">
          {pastConfs.map(conf => (
            <div key={conf.id} className="conference-card past glass glass-hover">
              <div className="card-header-row flex-between">
                <span className="badge badge-warning">Concluded</span>
                <span className="event-date-badge flex-align">
                  <Calendar size={14} /> {conf.date}
                </span>
              </div>
              
              <h3 className="conf-title">{conf.title}</h3>
              <p className="conf-location flex-align">
                <MapPin size={14} className="location-icon" /> {conf.location}
              </p>
              
              <p className="conf-desc">{conf.description}</p>
              
              <div className="conf-actions border-t">
                <span className="dates-text">Proceedings completed. Reference abstracts indexed inside the Publications library.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Schedule Modal */}
      {selectedConf && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`${selectedConf.title} - Presentation Schedule`}
          size="medium"
        >
          <div className="schedule-modal-content">
            <p className="schedule-intro">The following presentation tracks are scheduled for this hybrid/live event. Registered speakers should report 15 mins before track schedules.</p>
            
            {selectedConf.schedule && selectedConf.schedule.length > 0 ? (
              <div className="schedule-timeline">
                {selectedConf.schedule.map((track, idx) => (
                  <div key={idx} className="timeline-item flex-align">
                    <div className="timeline-badge">
                      <Clock size={16} />
                    </div>
                    <div className="timeline-info glass">
                      <span className="track-time">{track.day} | {track.time}</span>
                      <h4 className="track-title">{track.event}</h4>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-schedule text-center py-2 glass">
                <BookOpen size={32} className="text-secondary mb-1" />
                <p>Detailed track presentations are currently being compiled. Please check back next week.</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Conferences;
