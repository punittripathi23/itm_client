import React from 'react';
import { ShieldCheck, Award, FileCheck, CheckCircle2, Globe, Database, ExternalLink } from 'lucide-react';
import Badge from '../../../components/common/Badge/Badge';
import './TrustMetricsSection.css';

const TrustMetricsSection = () => {
  const indexingServices = [
    { name: 'Scopus (Elsevier)', category: 'Abstract & Citation Database', badge: 'Scopus Indexed', status: 'Verified' },
    { name: 'Web of Science (Clarivate)', category: 'Core Collection (ESCI)', badge: 'WoS Indexed', status: 'Verified' },
    { name: 'Crossref DOI Repository', category: 'Permanent Metadata Deposit', badge: 'DOI Registered', status: 'Verified' },
    { name: 'Google Scholar', category: 'Global Citation Index', badge: 'Full Text Indexed', status: 'Verified' },
    { name: 'DBLP Computer Science', category: 'Bibliography Database', badge: 'DBLP Listed', status: 'Verified' },
    { name: 'COPE Committee', category: 'Publication Ethics Standard', badge: 'COPE Compliant', status: 'Active Member' },
  ];

  return (
    <section className="trust-metrics-section section-padding" aria-labelledby="trust-heading">
      <div className="container">
        <div className="section-header-academic">
          <div className="header-tag">
            <ShieldCheck size={16} /> Trust & Indexing Verification
          </div>
          <h2 id="trust-heading" className="section-title">
            Rigorous Editorial Standards & Global Indexing
          </h2>
          <p className="section-subtitle">
            All published conference proceedings undergo double-blind peer review and are deposited with Crossref for persistent DOI resolving and global indexation.
          </p>
        </div>

        {/* Indexing Partners Grid */}
        <div className="grid-3 trust-cards-grid">
          {indexingServices.map((service, index) => (
            <div key={index} className="trust-metric-card">
              <div className="metric-card-header">
                <div className="metric-icon-bg">
                  <Database size={18} className="metric-icon" />
                </div>
                <Badge variant="peer-reviewed">{service.status}</Badge>
              </div>

              <h3 className="metric-title">{service.name}</h3>
              <p className="metric-desc">{service.category}</p>

              <div className="metric-footer-tag">
                <CheckCircle2 size={13} className="check-icon" />
                <span>{service.badge}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Metadata Transparency Box */}
        <div className="metadata-transparency-box">
          <div className="transparency-left">
            <h4 className="transparency-title">Journal & Proceedings Metadata Specifications</h4>
            <p className="transparency-desc">
              All published volumes strictly adhere to Crossref schema v5.3.1, Dublin Core metadata standards, and Google Scholar Highwire tag specifications for automated crawling and library citation harvesting.
            </p>
          </div>
          <div className="transparency-stats">
            <div className="stat-pill">
              <span className="pill-key">ISSN (Print):</span>
              <span className="pill-val">2831-9033</span>
            </div>
            <div className="stat-pill">
              <span className="pill-key">e-ISSN (Online):</span>
              <span className="pill-val">2831-9041</span>
            </div>
            <div className="stat-pill">
              <span className="pill-key">Acceptance Rate:</span>
              <span className="pill-val">24.5%</span>
            </div>
            <div className="stat-pill">
              <span className="pill-key">Review Cycle:</span>
              <span className="pill-val">28 Days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustMetricsSection;
