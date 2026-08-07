import React, { useState } from 'react';
import { 
  FileText, Users, Tag, ShieldCheck, Upload, Check, 
  ArrowRight, ArrowLeft, Plus, Trash2, Save, Send, AlertCircle
} from 'lucide-react';
import submissionService from '../../../services/submission.service';
import Button from '../../../components/common/Button/Button';
import Input from '../../../components/common/Input/Input';
import Select from '../../../components/common/Select/Select';
import { PAPER_CATEGORIES } from '../../../utils/constants';
import './SubmissionWizard.css';

const WIZARD_STEPS = [
  { id: 1, label: 'Title & Abstract', icon: FileText },
  { id: 2, label: 'Authors & ORCID', icon: Users },
  { id: 3, label: 'Keywords & Domain', icon: Tag },
  { id: 4, label: 'Declarations & Ethics', icon: ShieldCheck },
  { id: 5, label: 'Files & Confirmation', icon: Upload }
];

export const SubmissionWizard = ({ onComplete, user = {} }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Submission Form State
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    researchArea: 'Artificial Intelligence & Machine Learning',
    keywordsInput: 'Deep Learning, Neural Networks, Computer Vision',
    keywords: ['Deep Learning', 'Neural Networks', 'Computer Vision'],
    authors: [
      {
        name: user.name || '',
        email: user.email || '',
        affiliation: 'Department of Computer Science & Engineering',
        orcid: '0000-0002-1825-0097',
        isCorresponding: true
      }
    ],
    declarations: {
      fundingInfo: 'Supported by National Science Foundation Grant #NSF-2025-CS.',
      conflictOfInterest: 'The authors declare that they have no known competing financial interests or personal relationships.',
      ethicalApproval: true,
      originalWorkConsent: true
    },
    files: {
      pdfUrl: '',
      pdfFileName: '',
      supplementaryUrl: '',
      supplementaryFileName: ''
    }
  });

  const handleInputChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
  };

  const handleDeclarationChange = (field, val) => {
    setFormData(prev => ({
      ...prev,
      declarations: { ...prev.declarations, [field]: val }
    }));
  };

  // Author Management
  const handleAuthorChange = (idx, field, val) => {
    const updated = [...formData.authors];
    updated[idx][field] = val;
    setFormData(prev => ({ ...prev, authors: updated }));
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [
        ...prev.authors,
        { name: '', email: '', affiliation: '', orcid: '', isCorresponding: false }
      ]
    }));
  };

  const removeAuthor = (idx) => {
    if (formData.authors.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter((_, i) => i !== idx)
    }));
  };

  // File Upload Simulators
  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    const dummyUrl = `/uploads/${fileType}/${Date.now()}_${file.name}`;
    setFormData(prev => ({
      ...prev,
      files: {
        ...prev.files,
        [`${fileType}Url`]: dummyUrl,
        [`${fileType}FileName`]: file.name
      }
    }));
  };

  // Step Validation
  const validateStep = (step) => {
    setErrorMsg('');
    if (step === 1) {
      if (!formData.title.trim()) return 'Please enter the manuscript title';
      if (!formData.abstract.trim() || formData.abstract.trim().length < 50) {
        return 'Abstract must be at least 50 characters long';
      }
    } else if (step === 2) {
      for (const a of formData.authors) {
        if (!a.name.trim() || !a.email.trim() || !a.affiliation.trim()) {
          return 'All author fields (Name, Email, Affiliation) are required';
        }
      }
    } else if (step === 4) {
      if (!formData.declarations.originalWorkConsent) {
        return 'You must confirm that this is original work';
      }
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep(currentStep);
    if (err) {
      setErrorMsg(err);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setErrorMsg('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await submissionService.saveDraft(formData);
      setSuccessMsg('Draft saved successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        if (onComplete) onComplete();
      }, 1200);
    } catch (err) {
      setErrorMsg('Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFinal = async () => {
    const err = validateStep(currentStep);
    if (err) {
      setErrorMsg(err);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const keywordsArray = formData.keywordsInput
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        keywords: keywordsArray.length > 0 ? keywordsArray : formData.keywords,
        status: 'submitted'
      };

      await submissionService.submitPaper(payload);
      setSuccessMsg('Manuscript submitted successfully for Peer Review!');
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    } catch (err) {
      setErrorMsg('Submission failed. Please check network or file attachment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="submission-wizard-card">
      {/* Wizard Header Progress Bar */}
      <div className="wizard-progress-header">
        {WIZARD_STEPS.map(step => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div 
              key={step.id} 
              className={`wizard-step-indicator ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="step-badge">
                {isCompleted ? <Check size={16} /> : <Icon size={16} />}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Error & Success Feedback Alerts */}
      {errorMsg && (
        <div className="alert alert-danger flex-align">
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success flex-align">
          <Check size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Step Body */}
      <div className="wizard-body">
        {/* Step 1: Title & Abstract */}
        {currentStep === 1 && (
          <div className="wizard-step-content animate-fade-in">
            <h3 className="step-title">Step 1: Title & Abstract</h3>
            <p className="step-subtitle">Provide the full working title, abstract summary, and primary research category.</p>
            
            <div className="form-group mb-3">
              <label className="form-label required">Manuscript Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Next-Generation Neural Architectures for Real-Time Event Processing"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <Select
                label="Primary Research Area"
                options={PAPER_CATEGORIES}
                value={formData.researchArea}
                onChange={(e) => handleInputChange('researchArea', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Abstract (250 - 500 words)</label>
              <textarea
                className="form-textarea"
                rows={6}
                placeholder="Write or paste your abstract summarizing objectives, methodology, key result metrics, and conclusions..."
                value={formData.abstract}
                onChange={(e) => handleInputChange('abstract', e.target.value)}
              />
              <span className="form-hint">Word count: {formData.abstract.trim().split(/\s+/).filter(Boolean).length} words</span>
            </div>
          </div>
        )}

        {/* Step 2: Authors & ORCID */}
        {currentStep === 2 && (
          <div className="wizard-step-content animate-fade-in">
            <div className="flex-between align-center mb-2">
              <div>
                <h3 className="step-title">Step 2: Authors & Affiliations</h3>
                <p className="step-subtitle">Add all co-authors in correct publication sequence with valid ORCID iDs.</p>
              </div>
              <button className="btn btn-secondary btn-sm flex-align" onClick={addAuthor}>
                <Plus size={14} /> Add Co-Author
              </button>
            </div>

            {formData.authors.map((author, idx) => (
              <div key={idx} className="author-card border mb-3">
                <div className="author-card-header flex-between">
                  <span className="font-semibold">Author #{idx + 1}</span>
                  {formData.authors.length > 1 && (
                    <button className="btn-icon-danger" onClick={() => removeAuthor(idx)}>
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <div className="grid-2 gap-2 mt-2">
                  <Input
                    label="Full Name"
                    placeholder="Dr. Alexander Wright"
                    value={author.name}
                    onChange={(e) => handleAuthorChange(idx, 'name', e.target.value)}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="a.wright@university.edu"
                    value={author.email}
                    onChange={(e) => handleAuthorChange(idx, 'email', e.target.value)}
                  />
                </div>

                <div className="grid-2 gap-2 mt-2">
                  <Input
                    label="Institutional Affiliation"
                    placeholder="Department of Computer Science, MIT"
                    value={author.affiliation}
                    onChange={(e) => handleAuthorChange(idx, 'affiliation', e.target.value)}
                  />

                  <Input
                    label="ORCID iD"
                    placeholder="0000-0002-1825-0097"
                    value={author.orcid}
                    onChange={(e) => handleAuthorChange(idx, 'orcid', e.target.value)}
                  />
                </div>

                <div className="checkbox-wrapper mt-2">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={author.isCorresponding}
                      onChange={(e) => handleAuthorChange(idx, 'isCorresponding', e.target.checked)}
                    />
                    <span>Designate as Corresponding Author</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Keywords & Domain */}
        {currentStep === 3 && (
          <div className="wizard-step-content animate-fade-in">
            <h3 className="step-title">Step 3: Keywords & Subject Categorization</h3>
            <p className="step-subtitle">Specify comma-separated index terms to help match suitable peer reviewers.</p>

            <div className="form-group mb-3">
              <label className="form-label required">Index Keywords (Comma Separated)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Deep Learning, Neural Networks, Computer Vision, Signal Processing"
                value={formData.keywordsInput}
                onChange={(e) => handleInputChange('keywordsInput', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 4: Declarations & Ethics */}
        {currentStep === 4 && (
          <div className="wizard-step-content animate-fade-in">
            <h3 className="step-title">Step 4: Ethics & Declarations</h3>
            <p className="step-subtitle">Required scientific integrity and disclosure statements.</p>

            <div className="form-group mb-3">
              <label className="form-label">Funding & Financial Disclosures</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.declarations.fundingInfo}
                onChange={(e) => handleDeclarationChange('fundingInfo', e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <label className="form-label">Conflict of Interest Statement</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={formData.declarations.conflictOfInterest}
                onChange={(e) => handleDeclarationChange('conflictOfInterest', e.target.value)}
              />
            </div>

            <div className="declarations-checklist border-t pt-3">
              <label className="checkbox-label mb-2">
                <input
                  type="checkbox"
                  checked={formData.declarations.ethicalApproval}
                  onChange={(e) => handleDeclarationChange('ethicalApproval', e.target.checked)}
                />
                <span>Ethical approval and participant consent obtained (if applicable).</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.declarations.originalWorkConsent}
                  onChange={(e) => handleDeclarationChange('originalWorkConsent', e.target.checked)}
                />
                <span>I certify that this paper is original work and is not under evaluation elsewhere.</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 5: Files & Confirmation */}
        {currentStep === 5 && (
          <div className="wizard-step-content animate-fade-in">
            <h3 className="step-title">Step 5: File Upload & Final Confirmation</h3>
            <p className="step-subtitle">Upload camera-ready PDF manuscript and supplementary dataset files.</p>

            <div className="upload-dropzone border mb-3">
              <Upload size={28} className="upload-icon mb-1" />
              <p className="font-semibold">Main Manuscript PDF (*.pdf)</p>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={(e) => handleFileUpload(e, 'pdf')} 
                className="file-input-hidden" 
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="btn btn-secondary btn-sm mt-1">
                {formData.files.pdfFileName ? `Attached: ${formData.files.pdfFileName}` : 'Select PDF File'}
              </label>
            </div>

            <div className="upload-dropzone border mb-3">
              <Upload size={24} className="upload-icon mb-1" />
              <p className="font-semibold">Supplementary Files (ZIP/PDF/CSV - Optional)</p>
              <input 
                type="file" 
                onChange={(e) => handleFileUpload(e, 'supplementary')} 
                className="file-input-hidden" 
                id="supp-upload"
              />
              <label htmlFor="supp-upload" className="btn btn-secondary btn-sm mt-1">
                {formData.files.supplementaryFileName ? `Attached: ${formData.files.supplementaryFileName}` : 'Attach Dataset / Code'}
              </label>
            </div>

            {/* Final Submission Summary */}
            <div className="summary-box border p-3 mt-3">
              <h4>Manuscript Submission Summary</h4>
              <p><strong>Title:</strong> {formData.title || 'Untitled Manuscript'}</p>
              <p><strong>Category:</strong> {formData.researchArea}</p>
              <p><strong>Authors:</strong> {formData.authors.map(a => a.name).join(', ')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="wizard-footer-toolbar border-t flex-between mt-4 pt-3">
        <div>
          {currentStep > 1 && (
            <Button variant="secondary" onClick={prevStep} icon={ArrowLeft}>
              Previous
            </Button>
          )}
        </div>

        <div className="flex-align gap-2">
          <Button variant="secondary" onClick={handleSaveDraft} icon={Save} disabled={isSubmitting}>
            Save Draft
          </Button>

          {currentStep < 5 ? (
            <Button variant="primary" onClick={nextStep} icon={ArrowRight}>
              Next Step
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSubmitFinal} icon={Send} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Manuscript'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionWizard;
