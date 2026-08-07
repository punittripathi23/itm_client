import React, { useState } from 'react';
import { FileText, Download, Eye, ExternalLink, ChevronDown, ChevronUp, Quote, Check, Copy } from 'lucide-react';
import Badge from '../../../components/common/Badge/Badge';
import CitationModal from './CitationModal';
import './PublicationCard.css';

const PublicationCard = ({ paper }) => {
  const [isAbstractExpanded, setIsAbstractExpanded] = useState(false);
  const [isCitationOpen, setIsCitationOpen] = useState(false);
  const [copiedDoi, setCopiedDoi] = useState(false);

  if (!paper) return null;

  const handleCopyDoi = (e) => {
    e.stopPropagation();
    if (paper.doi) {
      navigator.clipboard.writeText(`https://doi.org/${paper.doi}`);
      setCopiedDoi(true);
      setTimeout(() => setCopiedDoi(false), 2000);
    }
  };

  return (
    <article className="publication-card">
      <div className="publication-card-body">
        {/* Thumbnail / Volume Emblem */}
        <div className="publication-thumbnail" aria-hidden="true">
          <div className="thumbnail-cover">
            <span className="thumbnail-vol">VOL. {paper.volume || '12'}</span>
            <FileText size={24} className="thumbnail-icon" />
            <span className="thumbnail-year">{paper.year || '2025'}</span>
          </div>
        </div>

        {/* Paper Information Area */}
        <div className="publication-content">
          {/* Header Metadata Tags */}
          <div className="publication-meta-header">
            <Badge variant="peer-reviewed">Peer Reviewed</Badge>
            {paper.isOpenAccess && <Badge variant="open-access">Open Access</Badge>}
            {paper.doi && (
              <Badge variant="doi" href={`https://doi.org/${paper.doi}`}>
                DOI: {paper.doi}
              </Badge>
            )}
            {paper.scopusIndexed && <Badge variant="scopus">Scopus</Badge>}
            {paper.wosIndexed && <Badge variant="wos">Web of Science</Badge>}
          </div>

          {/* Paper Title */}
          <h3 className="publication-title">
            <a href={`/papers/${paper.id || paper._id || '1'}`}>{paper.title}</a>
          </h3>

          {/* Authors List with ORCID icons */}
          <div className="publication-authors">
            <span className="authors-label">Authors:</span>
            {paper.authors && paper.authors.length > 0 ? (
              paper.authors.map((author, index) => {
                const authorName = typeof author === 'string' ? author : author.name;
                const orcid = typeof author === 'object' ? author.orcid : null;

                return (
                  <span key={index} className="author-item">
                    {index > 0 && ', '}
                    <span className="author-name">{authorName}</span>
                    {orcid && (
                      <a
                        href={`https://orcid.org/${orcid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="orcid-link"
                        title={`ORCID iD: ${orcid}`}
                        aria-label={`ORCID for ${authorName}`}
                      >
                        <span className="orcid-badge">iD</span>
                      </a>
                    )}
                  </span>
                );
              })
            ) : (
              <span className="author-name">IEEE Conference Contributors</span>
            )}
          </div>

          {/* Conference / Journal Volume info */}
          <div className="publication-journal-meta">
            <span className="meta-conf">{paper.conferenceName || 'International Conference on Computational Intelligence'}</span>
            <span className="meta-sep">•</span>
            <span>Vol. {paper.volume || '14'}, Issue {paper.issue || '2'}</span>
            <span className="meta-sep">•</span>
            <span>{paper.publicationDate || 'July 2025'}</span>
            {paper.pages && (
              <>
                <span className="meta-sep">•</span>
                <span>pp. {paper.pages}</span>
              </>
            )}
          </div>

          {/* Keyword Pills */}
          {paper.keywords && paper.keywords.length > 0 && (
            <div className="publication-keywords">
              {paper.keywords.map((kw, idx) => (
                <span key={idx} className="keyword-pill">
                  {kw}
                </span>
              ))}
            </div>
          )}

          {/* Collapsible Abstract with Serif Typography (75ch) */}
          {paper.abstract && (
            <div className="publication-abstract-container">
              <div className={`academic-abstract publication-abstract ${isAbstractExpanded ? 'expanded' : 'collapsed'}`}>
                <strong>Abstract — </strong>
                {paper.abstract}
              </div>
              <button
                className="abstract-toggle-btn"
                onClick={() => setIsAbstractExpanded(!isAbstractExpanded)}
                aria-expanded={isAbstractExpanded}
              >
                {isAbstractExpanded ? (
                  <>Show Less <ChevronUp size={14} /></>
                ) : (
                  <>Read Full Abstract <ChevronDown size={14} /></>
                )}
              </button>
            </div>
          )}

          {/* Metrics & Action Footer Toolbar */}
          <div className="publication-action-bar">
            <div className="publication-metrics">
              <span className="metric-item" title="Full text views">
                <Eye size={14} /> {paper.viewsCount || paper.views || '1,420'} <span className="metric-label">Views</span>
              </span>
              <span className="metric-item" title="PDF Downloads">
                <Download size={14} /> {paper.downloadsCount || paper.downloads || '680'} <span className="metric-label">Downloads</span>
              </span>
            </div>

            <div className="publication-ctas">
              {paper.doi && (
                <button
                  className="btn btn-tertiary btn-sm"
                  onClick={handleCopyDoi}
                  title="Copy DOI URL"
                >
                  {copiedDoi ? <Check size={14} /> : <ExternalLink size={14} />}
                  {copiedDoi ? 'DOI Copied' : 'DOI'}
                </button>
              )}

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsCitationOpen(true)}
              >
                <Quote size={14} /> Cite Paper
              </button>

              <a
                href={paper.pdfUrl || `/papers/${paper.id || '1'}`}
                className="btn btn-primary btn-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={14} /> Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Citation Modal */}
      <CitationModal
        isOpen={isCitationOpen}
        onClose={() => setIsCitationOpen(false)}
        paper={paper}
      />
    </article>
  );
};

export default PublicationCard;
