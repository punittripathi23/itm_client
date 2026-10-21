import React, { useState, useEffect } from 'react';
import { cmsService } from '../../../services/cms.service';
import { Shield, Award, Users, BookOpen } from 'lucide-react';
import './About.css';

export const About = () => {
  const [cms, setCms] = useState({});

  useEffect(() => {
    setCms(cmsService.getSettings());
  }, []);

  return (
    <div className="about-root animate-fade-in">
      <div className="about-hero">
        <div className="container">
          <span>About Our Portal</span>
          <h1>Fostering Scholarly Innovation</h1>
          <p>Learn about ITM-JET, our digital journal platform, and our future roadmap.</p>
        </div>
      </div>

      <section className="container about-details grid-2">
        <div>
          <h2>Platform Overview</h2>
          <p className="about-desc">
            {cms.aboutUsText || 'ITM Journal of Engineering & Technology (ITM-JET) is a scholarly journal platform dedicated to sharing engineering and technology research.'}
          </p>
          <p className="about-desc">
            Our priority is to establish a secure database interface facilitating role-based digital downloads. While guest researchers can quickly browse and audit abstracts and metadata, registered users can view and download complete publications.
          </p>
        </div>

        <div className="about-features-list">
          <div className="about-feature flex-align">
            <div className="feature-icon-circle"><Shield size={20} /></div>
            <div>
              <h4>Secure Role-Based Authentication</h4>
              <p>JWT-driven access limits complete PDF downloads strictly to authenticated researchers and admins.</p>
            </div>
          </div>

          <div className="about-feature flex-align">
            <div className="feature-icon-circle"><BookOpen size={20} /></div>
            <div>
              <h4>Centralized Publication CRUD</h4>
              <p>Administrators can upload proceedings index parameters directly via an easy-to-use control panel.</p>
            </div>
          </div>

          <div className="about-feature flex-align">
            <div className="feature-icon-circle"><Users size={20} /></div>
            <div>
              <h4>Scholarly Communities</h4>
              <p>Hosts listings for global computing events, local medical seminars, and dynamic media highlights.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container text-center">
          <h2>Core Institutional Values</h2>
          <div className="values-grid grid-3 mt-3">
            <div className="value-card glass">
              <Award className="value-icon" />
              <h3>Academic Integrity</h3>
              <p>Upholding standard indexing values, thorough metadata listings, and authenticated access safeguards.</p>
            </div>
            <div className="value-card glass">
              <BookOpen className="value-icon" />
              <h3>Open Knowledge</h3>
              <p>Providing quick, open-source abstract views so global visitors can explore and check paper scopes.</p>
            </div>
            <div className="value-card glass">
              <Users className="value-icon" />
              <h3>Digital Evolution</h3>
              <p>Fostering scalable architectures to incorporate ticketing gateways, automated certificate generator algorithms, and review modules.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
