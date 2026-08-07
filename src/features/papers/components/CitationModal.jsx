import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';
import './CitationModal.css';

const CitationModal = ({ isOpen, onClose, paper }) => {
  const [activeTab, setActiveTab] = useState('bibtex');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !paper) return null;

  const authorsString = paper.authors ? paper.authors.join(', ') : 'Unknown Authors';
  const firstAuthorLastName = paper.authors && paper.authors[0] ? paper.authors[0].split(' ').pop().toLowerCase() : 'author';
  const year = paper.year || new Date(paper.publicationDate || Date.now()).getFullYear();
  const citationKey = `${firstAuthorLastName}${year}${paper.title ? paper.title.split(' ')[0].toLowerCase() : 'paper'}`;

  const citations = {
    bibtex: `@inproceedings{${citationKey},\n  author    = {${authorsString.replace(/,/g, ' and')}},\n  title     = {${paper.title}},\n  booktitle = {${paper.conferenceName || 'Proceedings of International Conference'}},\n  volume    = {${paper.volume || '1'}},\n  number    = {${paper.issue || '1'}},\n  pages     = {${paper.pages || '101-112'}},\n  year      = {${year}},\n  publisher = {IEEE / Academic Press},\n  doi       = {${paper.doi || '10.1109/ICCS.2025.1029381'}}\n}`,
    ris: `TY  - CONF\nTI  - ${paper.title}\n${paper.authors ? paper.authors.map(a => `AU  - ${a}`).join('\n') : ''}\nJO  - ${paper.conferenceName || 'Proceedings'}\nVL  - ${paper.volume || '1'}\nIS  - ${paper.issue || '1'}\nPY  - ${year}\nDO  - ${paper.doi || '10.1109/ICCS.2025.1029381'}\nER  -`,
    ieee: `${authorsString}, "${paper.title}," in ${paper.conferenceName || 'Proc. Int. Conf.'}, vol. ${paper.volume || '1'}, no. ${paper.issue || '1'}, pp. ${paper.pages || '101-112'}, ${year}, doi: ${paper.doi || '10.1109/ICCS.2025.1029381'}.`,
    apa: `${authorsString} (${year}). ${paper.title}. ${paper.conferenceName || 'Proceedings of International Conference'}, ${paper.volume || '1'}(${paper.issue || '1'}), ${paper.pages || '101-112'}. https://doi.org/${paper.doi || '10.1109/ICCS.2025.1029381'}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(citations[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = activeTab === 'bibtex' ? 'bib' : activeTab === 'ris' ? 'ris' : 'txt';
    const blob = new Blob([citations[activeTab]], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${citationKey}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="citation-modal-overlay" onClick={onClose}>
      <div className="citation-modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="citation-modal-title">
        <div className="citation-modal-header">
          <div className="citation-modal-title-group">
            <FileText size={20} className="modal-icon" />
            <h3 id="citation-modal-title">Export Citation</h3>
          </div>
          <button className="citation-modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="citation-paper-summary">
          <span className="citation-paper-title">{paper.title}</span>
          <span className="citation-paper-meta">{paper.conferenceName} ({year})</span>
        </div>

        <div className="citation-tabs" role="tablist">
          {['bibtex', 'ris', 'ieee', 'apa'].map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              className={`citation-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="citation-body">
          <pre className="citation-code">{citations[activeTab]}</pre>
        </div>

        <div className="citation-modal-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleDownload}>
            <Download size={14} /> Download .{activeTab === 'bibtex' ? 'bib' : activeTab === 'ris' ? 'ris' : 'txt'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleCopy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied to Clipboard' : 'Copy Citation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitationModal;
