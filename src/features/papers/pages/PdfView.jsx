import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { paperService } from '../../../services/paper.service';
import Button from '../../../components/common/Button/Button';
import Loader from '../../../components/common/Loader/Loader';
import { ArrowLeft, Download, FileText, AlertCircle } from 'lucide-react';
import './PdfView.css';

export const PdfView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch paper details with slight delay for premium load experience
    const timer = setTimeout(() => {
      const data = paperService.getPaperById(id);
      setPaper(data);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return <Loader fullPage message="Configuring secure PDF viewer..." />;
  }

  if (!paper) {
    return (
      <div className="pdf-error-container container flex-center">
        <AlertCircle size={48} className="text-danger mb-1" />
        <h2>Document Index Lost</h2>
        <p>The paper ID requested does not match any current files in the portal database.</p>
        <Link to="/papers" className="btn btn-secondary mt-2">Back to Publications</Link>
      </div>
    );
  }

  return (
    <div className="pdf-view-root animate-fade-in">
      <div className="pdf-view-header glass">
        <div className="container flex-between pdf-header-content">
          <div className="flex-align">
            <Link to="/papers" className="pdf-back-btn">
              <ArrowLeft size={18} />
            </Link>
            <div className="pdf-title-block">
              <h3>{paper.title}</h3>
              <p className="pdf-authors-meta">By {paper.authors}</p>
            </div>
          </div>

          <div className="pdf-actions-block">
            <a 
              href={paper.pdfUrl} 
              download={`${paper.title.replace(/\s+/g, '_')}.pdf`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary flex-align"
            >
              <Download size={16} />
              <span className="desktop-only-btn-text">Download PDF</span>
            </a>
          </div>
        </div>
      </div>

      <div className="pdf-viewer-frame-container container">
        <div className="pdf-meta-sidebar glass">
          <div className="sidebar-group border-b">
            <span className="badge badge-info">{paper.category}</span>
            <h4 className="mt-1">Indexed Journal</h4>
            <p className="sidebar-value">{paper.conference}</p>
          </div>

          <div className="sidebar-group border-b">
            <h4>Publication Parameters</h4>
            <div className="sidebar-param flex-between">
              <span>Year:</span>
              <strong>{paper.year}</strong>
            </div>
            <div className="sidebar-param flex-between">
              <span>Status:</span>
              <strong className="text-success">Verified Index</strong>
            </div>
          </div>

          <div className="sidebar-group">
            <h4>Abstract Review</h4>
            <p className="sidebar-abstract-text">{paper.abstract}</p>
          </div>
        </div>

        <div className="pdf-canvas glass">
          {/* Embedding standard dummy pdf inside iframe */}
          <iframe 
            src={`${paper.pdfUrl}#toolbar=0&navpanes=0`} 
            title={paper.title} 
            className="pdf-iframe"
            width="100%"
            height="100%"
          >
            <div className="iframe-fallback flex-center text-center">
              <FileText size={48} className="text-secondary mb-1" />
              <h3>PDF Viewer Blocked</h3>
              <p>Your browser doesn't support nested PDF preview. Click download to save files locally.</p>
              <a href={paper.pdfUrl} className="btn btn-primary mt-1">Download PDF File</a>
            </div>
          </iframe>
        </div>
      </div>
    </div>
  );
};

export default PdfView;
