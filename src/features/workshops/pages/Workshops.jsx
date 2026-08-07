import React, { useState, useEffect } from 'react';
import { workshopService } from '../../../services/workshop.service';
import { Compass, User, Calendar, Clock, MapPin } from 'lucide-react';
import './Workshops.css';

export const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    setWorkshops(workshopService.getWorkshops());
  }, []);

  return (
    <div className="workshops-root container animate-fade-in">
      <div className="workshops-page-header">
        <h1>Technical Workshops & Seminars</h1>
        <p>Participate in hands-on training courses led by peer experts. Register details are available on event portals.</p>
      </div>

      <div className="workshops-grid grid-2">
        {workshops.map(work => (
          <div key={work.id} className="workshop-card glass glass-hover">
            <div className="workshop-badge-row flex-align">
              <span className="badge badge-info flex-align">
                <Compass size={12} /> Workshop
              </span>
            </div>

            <h3 className="workshop-title">{work.title}</h3>
            
            <div className="speaker-profile flex-align">
              <div className="speaker-avatar">
                <User size={16} />
              </div>
              <div>
                <span className="speaker-label">Workshop Instructor</span>
                <h4 className="speaker-name">{work.speaker}</h4>
              </div>
            </div>

            <p className="workshop-desc">{work.description}</p>

            <div className="workshop-details-stack border-t">
              <div className="workshop-detail-item flex-align">
                <Calendar size={14} className="detail-icon" />
                <span><strong>Date:</strong> {work.date}</span>
              </div>
              <div className="workshop-detail-item flex-align">
                <Clock size={14} className="detail-icon" />
                <span><strong>Timing:</strong> {work.time}</span>
              </div>
              <div className="workshop-detail-item flex-align">
                <MapPin size={14} className="detail-icon" />
                <span><strong>Venue:</strong> {work.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workshops;
