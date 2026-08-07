import React from 'react';
import { Calendar, MapPin, Award, Users, ArrowRight, FileText, CheckCircle } from 'lucide-react';
import Badge from '../../../components/common/Badge/Badge';
import './ConferenceHighlightsSection.css';

const ConferenceHighlightsSection = () => {
  const upcomingConferences = [
    {
      id: 'conf-2025-01',
      acronym: 'ICISR 2025',
      name: '12th International Conference on Intelligent Systems & Robotics',
      dates: 'October 14–16, 2025',
      location: 'Zurich, Switzerland & Virtual Hybrid',
      cfpDeadline: 'August 30, 2025',
      indexing: ['Scopus', 'Web of Science', 'IEEE Xplore'],
      topics: ['Deep Learning', 'Autonomous Systems', 'Swarm Robotics', 'Human-Robot Interaction'],
      acceptedPapersCount: '84 Accepted Papers'
    },
    {
      id: 'conf-2025-02',
      acronym: 'ISSCC 2025',
      name: 'IEEE International Symposium on Cybersecurity & Cryptography',
      dates: 'November 20–22, 2025',
      location: 'Boston, MA, USA',
      cfpDeadline: 'September 15, 2025',
      indexing: ['Scopus', 'Web of Science', 'ACM Digital Library'],
      topics: ['Zero-Knowledge Proofs', 'Post-Quantum Crypto', 'Cloud Security', 'Privacy-Preserving AI'],
      acceptedPapersCount: '62 Accepted Papers'
    },
    {
      id: 'conf-2025-03',
      acronym: 'BDS 2025',
      name: 'ACM Conference on Big Data Systems & Parallel Processing',
      dates: 'December 08–10, 2025',
      location: 'Singapore & Online',
      cfpDeadline: 'October 01, 2025',
      indexing: ['Scopus', 'IEEE Xplore', 'DBLP'],
      topics: ['Genomics Computing', 'Graph Analytics Engines', 'Distributed Cache', 'HPC Clusters'],
      acceptedPapersCount: '95 Accepted Papers'
    }
  ];

  return (
    <section className="conference-highlights-section section-padding" aria-labelledby="conferences-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-academic">
          <div className="header-tag">
            <Calendar size={16} /> Upcoming Proceedings & Call For Papers
          </div>
          <h2 id="conferences-heading" className="section-title">
            Featured International Academic Conferences
          </h2>
          <p className="section-subtitle">
            Submit your original research to premier double-blind peer-reviewed conferences with guaranteed Scopus and Crossref DOI publication.
          </p>
        </div>

        {/* Conference Cards Grid */}
        <div className="grid-3 conference-grid">
          {upcomingConferences.map((conf) => (
            <div key={conf.id} className="conference-card">
              <div className="conf-card-header">
                <span className="conf-acronym">{conf.acronym}</span>
                <Badge variant="peer-reviewed">CFP Open</Badge>
              </div>

              <h3 className="conf-title">{conf.name}</h3>

              <div className="conf-details-list">
                <div className="conf-detail-item">
                  <Calendar size={14} className="detail-icon" />
                  <span><strong>Dates:</strong> {conf.dates}</span>
                </div>
                <div className="conf-detail-item">
                  <MapPin size={14} className="detail-icon" />
                  <span><strong>Venue:</strong> {conf.location}</span>
                </div>
                <div className="conf-detail-item cfp-highlight">
                  <FileText size={14} className="detail-icon" />
                  <span><strong>Submission Deadline:</strong> {conf.cfpDeadline}</span>
                </div>
              </div>

              {/* Indexing Badges */}
              <div className="conf-indexing-row">
                <span className="indexing-title">Indexing:</span>
                {conf.indexing.map((idx, i) => (
                  <span key={i} className="conf-badge-pill">{idx}</span>
                ))}
              </div>

              <div className="conf-card-footer">
                <a href={`/conferences`} className="btn btn-secondary btn-sm full-width">
                  View Conference Schedule & Submission Guide <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConferenceHighlightsSection;
