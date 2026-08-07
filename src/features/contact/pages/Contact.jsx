import React, { useState, useEffect } from 'react';
import { cmsService } from '../../../services/cms.service';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

export const Contact = () => {
  const [cms, setCms] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCms(cmsService.getSettings());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setLoading(false);
    setSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="contact-root animate-fade-in">
      <div className="contact-hero">
        <div className="container">
          <span>Get in Touch</span>
          <h1>Contact Publications Desk</h1>
          <p>Have questions regarding paper upload indices, workshop schedules, or review credentials? Drop us a line.</p>
        </div>
      </div>

      <div className="container contact-container grid-2">
        {/* Contact Info */}
        <div className="contact-info-panel">
          <h2>Institutional Head Office</h2>
          <p className="contact-panel-desc">For general academic issues, portal access support, or submission audits, please contact us below or submit the message form.</p>
          
          <div className="contact-cards-stack">
            <div className="contact-detail-card glass">
              <Mail className="contact-icon" />
              <div>
                <h4>Support Email</h4>
                <p>{cms.contactEmail || 'contact@bakliwal.edu'}</p>
              </div>
            </div>

            <div className="contact-detail-card glass">
              <Phone className="contact-icon" />
              <div>
                <h4>Helpdesk Contact</h4>
                <p>{cms.contactPhone || '+91 98765 43210'}</p>
              </div>
            </div>

            <div className="contact-detail-card glass">
              <MapPin className="contact-icon" />
              <div>
                <h4>Campus Address</h4>
                <p>{cms.contactAddress || 'Bakliwal Campus, Pune, Maharashtra, India'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-panel glass">
          {success ? (
            <div className="contact-success-state flex-center animate-scale-up">
              <CheckCircle size={54} className="success-icon" />
              <h3>Message Transmitted</h3>
              <p>Thank you for contacting Bakliwal Publications Desk. Our team will review and respond to your inquiry shortly.</p>
              <Button variant="secondary" onClick={() => setSuccess(false)}>Send Another Message</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3>Submit Inquiry</h3>
              <p className="form-helper-text">Required fields are marked with an asterisk (*)</p>
              
              <Input
                label="Full Name"
                id="name"
                type="text"
                placeholder="e.g. Sonu Tripathi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="e.g. user@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Subject"
                id="subject"
                type="text"
                placeholder="Inquiry subject heading"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  rows="4"
                  className="form-control"
                  placeholder="Enter details of your query..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={loading}
                icon={Send}
                className="w-100"
              >
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
