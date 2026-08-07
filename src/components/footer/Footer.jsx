import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, BookOpen, FileCheck, CheckCircle2, Award, Mail, MapPin, Globe, ExternalLink } from 'lucide-react';
import Badge from '../common/Badge/Badge';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="academic-footer" role="contentinfo">
      {/* Trust & Indexing Signals Banner */}
      <div className="footer-indexing-bar">
        <div className="container indexing-container">
          <div className="indexing-label">
            <CheckCircle2 size={16} className="indexing-icon" />
            <span>Indexed In Premier Databases:</span>
          </div>
          <div className="indexing-badges">
            <Badge variant="scopus">Scopus (Elsevier)</Badge>
            <Badge variant="wos">Web of Science (Clarivate)</Badge>
            <Badge variant="doi">Crossref DOI Registered</Badge>
            <Badge variant="info">Google Scholar</Badge>
            <Badge variant="peer-reviewed">COPE Compliant</Badge>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Metadata Columns */}
      <div className="container footer-main-grid">
        {/* Column 1: Academic Identity & ISSN */}
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <div className="footer-shield">
              <Shield size={20} className="shield-icon" />
            </div>
            <div>
              <span className="footer-brand-title">WeGrow Digital Library</span>
              <span className="footer-brand-tagline">Academic Press Conference Series</span>
            </div>
          </div>

          <p className="footer-mission-statement">
            A peer-reviewed academic publishing platform adhering to international editorial standards, strict COPE publication ethics, and permanent Crossref DOI archiving.
          </p>

          <div className="issn-block">
            <div className="issn-item">
              <span className="issn-label">Print ISSN:</span>
              <span className="issn-val">xxxx-xxxx</span>
            </div>
            <div className="issn-item">
              <span className="issn-label">Online e-ISSN:</span>
              <span className="issn-val">xxxx-xxxx</span>
            </div>
            <div className="issn-item">
              <span className="issn-label">DOI Prefix:</span>
              <span className="issn-val">xxxxxxxxxx</span>
            </div>
          </div>
        </div>

        {/* Column 2: Navigation & Proceedings */}
        <div className="footer-col">
          <h4 className="footer-col-title">Publications & Archives</h4>
          <ul className="footer-nav-list">
            <li><Link to="/proceedings">Latest Conference Proceedings</Link></li>
            <li><Link to="/papers">Search Research Papers</Link></li>
            <li><Link to="/archives">Archival Volumes (2018–2025)</Link></li>
            <li><Link to="/conferences">Upcoming Conferences</Link></li>
            <li><Link to="/gallery">Conference Photo Archives</Link></li>
          </ul>
        </div>

        {/* Column 3: Publishing Policies & Governance */}
        <div className="footer-col">
          <h4 className="footer-col-title">Editorial & Governance</h4>
          <ul className="footer-nav-list">
            <li><Link to="/editorial-board">Editorial Board Members</Link></li>
            <li><a href="#peer-review">Peer Review Process</a></li>
            <li><a href="#publication-ethics">Publication Ethics (COPE)</a></li>
            <li><a href="#open-access">Open Access Statement</a></li>
            <li><a href="#author-guidelines">Author Submission Guidelines</a></li>
          </ul>
        </div>

        {/* Column 4: Contact & Secretariat */}
        <div className="footer-col">
          <h4 className="footer-col-title">Editorial Secretariat</h4>
          <ul className="footer-contact-info">
            <li>
              <Mail size={15} className="contact-icon" />
              <span>editor@academic-publications.org</span>
            </li>
            <li>
              <Globe size={15} className="contact-icon" />
              <span>https://wegrow.org</span>
            </li>
            <li>
              <MapPin size={15} className="contact-icon" />
              <span>Division of Academic Publishing, Innovation Park, Bldg 4, Academic Ave</span>
            </li>
          </ul>
          <div className="open-access-notice">
            <FileCheck size={14} />
            <span>Creative Commons CC-BY 4.0 Licensed</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="container bottom-container">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} IEEE / Academic Press Conference Series. All Rights Reserved.
          </p>
          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="legal-sep">•</span>
            <a href="#terms">Terms of Service</a>
            <span className="legal-sep">•</span>
            <a href="#sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

