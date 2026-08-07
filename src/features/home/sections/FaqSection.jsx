import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, FileText, CheckCircle2 } from 'lucide-react';
import './FaqSection.css';

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'How are DOI numbers assigned and registered for accepted papers?',
      answer: 'Upon acceptance and final camera-ready PDF submission, each article is assigned a unique Crossref DOI prefix (10.1109/APCS.YYYY.XXXXXX). Metadata is submitted directly to the Crossref Registry within 48 hours of volume publication to ensure permanent URL resolving.'
    },
    {
      question: 'What is the double-blind peer review policy and editorial workflow?',
      answer: 'Every manuscript is evaluated by at least two independent expert peer reviewers registered in the editorial board system. Author identities and institutional affiliations are blinded during the review phase. Authors receive detailed feedback reports and revision directives.'
    },
    {
      question: 'Are all conference proceedings indexed in Scopus and Web of Science?',
      answer: 'Yes. Conference proceedings published under IEEE / Academic Press series are submitted immediately post-publication to Elsevier Scopus, Clarivate Web of Science (ESCI), DBLP, and Google Scholar for indexing evaluation.'
    },
    {
      question: 'What Open Access licensing models are available for authors?',
      answer: 'All papers are published under the Creative Commons Attribution 4.0 International License (CC-BY 4.0). Authors retain full copyright ownership of their original research while granting the platform a non-exclusive license to archive and distribute full-text PDFs.'
    },
    {
      question: 'How can authors export citations to BibTeX, RIS, APA or IEEE formats?',
      answer: 'Every article detail page and publication card features a one-click "Cite Paper" button. Authors and researchers can copy formatted citations directly or download standalone .bib and .ris files for Reference Manager, EndNote, Zotero, or Mendeley.'
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section section-padding" aria-labelledby="faq-heading">
      <div className="container">
        <div className="section-header-academic">
          <div className="header-tag">
            <HelpCircle size={16} /> Publishing Policies & Information
          </div>
          <h2 id="faq-heading" className="section-title">
            Frequently Asked Questions
          </h2>
          <p className="section-subtitle">
            Find answers regarding editorial guidelines, peer review standards, indexing timelines, and copyright compliance.
          </p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  {isOpen ? <ChevronUp size={18} className="faq-icon" /> : <ChevronDown size={18} className="faq-icon" />}
                </button>

                {isOpen && (
                  <div id={`faq-answer-${index}`} className="faq-answer-content">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
