import React, { useState } from 'react';
import { Layers, ArrowRight, Filter, BookOpen } from 'lucide-react';
import PublicationCard from '../../papers/components/PublicationCard';
import './LatestProceedingsSection.css';

const LatestProceedingsSection = () => {
  const [selectedTrack, setSelectedTrack] = useState('all');

  const mockPapers = [
    {
      id: 'paper-101',
      title: 'Deep Residual Learning for Autonomous Robotic Navigation in Unstructured Environments',
      authors: [
        { name: 'Dr. Elena Rostova', orcid: '0000-0002-1825-0097' },
        { name: 'Prof. Marcus Vance', orcid: '0000-0001-9283-4411' },
        { name: 'Aisha Al-Mansoor' }
      ],
      conferenceName: 'International Conference on Intelligent Systems & Robotics (ICISR 2025)',
      volume: '14',
      issue: '2',
      year: '2025',
      pages: '104-118',
      publicationDate: 'July 2025',
      doi: '10.1109/ICISR.2025.1098421',
      isOpenAccess: true,
      scopusIndexed: true,
      wosIndexed: true,
      keywords: ['Deep Learning', 'Autonomous Navigation', 'Robotics', 'Path Planning', 'LiDAR Sensor Fusion'],
      abstract: 'Autonomous navigation in non-deterministic, unstructured physical environments presents critical challenges in real-time trajectory optimization and sensor noise filtering. This paper introduces a multi-scale deep residual reinforcement learning architecture (ResNav-Net) capable of performing end-to-end LiDAR and visual odometry sensor fusion at 120 FPS. Extensive benchmark validations across 15 real-world terrain scenarios demonstrate a 34.2% reduction in position error compared to conventional Kalman-filtered SLAM frameworks.',
      viewsCount: '1,842',
      downloadsCount: '920',
      track: 'ai'
    },
    {
      id: 'paper-102',
      title: 'Zero-Knowledge Proof Verification in Distributed Quantum-Resistant Blockchain Protocol',
      authors: [
        { name: 'Prof. Kenji Takahashi', orcid: '0000-0003-4401-8829' },
        { name: 'David Chen', orcid: '0000-0002-9912-3004' }
      ],
      conferenceName: 'IEEE International Symposium on Cybersecurity & Cryptography (ISSCC 2025)',
      volume: '14',
      issue: '1',
      year: '2025',
      pages: '45-58',
      publicationDate: 'June 2025',
      doi: '10.1109/ISSCC.2025.9984102',
      isOpenAccess: true,
      scopusIndexed: true,
      wosIndexed: true,
      keywords: ['Zero-Knowledge Proofs', 'Post-Quantum Cryptography', 'Lattice Cryptography', 'Consensus'],
      abstract: 'Post-quantum cryptographic transitions require energy-efficient zk-SNARK constructs resilient against Shor and Grover quantum algorithmic attacks. We formulate a novel lattice-based zero-knowledge proof framework (zk-Lattice-V2) with constant-size proof keys and O(log N) verification complexity. Experimental benchmarks executed on distributed edge validator networks prove zero transaction latency degradation while maintaining 128-bit quantum security margins.',
      viewsCount: '2,410',
      downloadsCount: '1,150',
      track: 'cybersecurity'
    },
    {
      id: 'paper-103',
      title: 'Scalable Distributed Graph Analytics Engine for Multi-Petabyte Genomics Data Streams',
      authors: [
        { name: 'Dr. Sarah Jenkins', orcid: '0000-0001-5542-8819' },
        { name: 'Vikram Singh' }
      ],
      conferenceName: 'ACM Conference on Big Data Systems & Parallel Processing (BDS 2025)',
      volume: '13',
      issue: '4',
      year: '2025',
      pages: '210-225',
      publicationDate: 'May 2025',
      doi: '10.1145/BDS.2025.3341908',
      isOpenAccess: false,
      scopusIndexed: true,
      wosIndexed: false,
      keywords: ['Distributed Systems', 'Graph Analytics', 'Genomics Data', 'Spark GraphX', 'High-Performance Computing'],
      abstract: 'Processing petabyte-scale genomic sequence graphs requires unprecedented memory bandwidth and asynchronous node communication. In this study, we propose G-Streamer, an out-of-core distributed graph partitioning engine that minimizes cross-cluster network serialization overhead by employing dynamic cache locality partitioning.',
      viewsCount: '1,290',
      downloadsCount: '540',
      track: 'data'
    }
  ];

  const filteredPapers = selectedTrack === 'all'
    ? mockPapers
    : mockPapers.filter(paper => paper.track === selectedTrack);

  return (
    <section className="latest-proceedings-section section-padding" aria-labelledby="proceedings-heading">
      <div className="container">
        {/* Section Header */}
        <div className="proceedings-header-row">
          <div>
            <div className="header-tag">
              <Layers size={16} /> Current Volume & Proceedings
            </div>
            <h2 id="proceedings-heading" className="section-title">
              Recently Accepted & Published Proceedings
            </h2>
            <p className="section-subtitle">
              Browse the latest peer-reviewed conference publications, complete with full-text PDF downloads, citation exports, and Crossref DOI links.
            </p>
          </div>

          <a href="/papers" className="btn btn-secondary btn-md view-all-btn">
            Browse All Proceedings <ArrowRight size={14} />
          </a>
        </div>

        {/* Track Filter Tabs */}
        <div className="proceedings-track-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={selectedTrack === 'all'}
            className={`track-tab ${selectedTrack === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('all')}
          >
            All Research Tracks
          </button>
          <button
            role="tab"
            aria-selected={selectedTrack === 'ai'}
            className={`track-tab ${selectedTrack === 'ai' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('ai')}
          >
            AI & Robotics
          </button>
          <button
            role="tab"
            aria-selected={selectedTrack === 'cybersecurity'}
            className={`track-tab ${selectedTrack === 'cybersecurity' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('cybersecurity')}
          >
            Cybersecurity & Privacy
          </button>
          <button
            role="tab"
            aria-selected={selectedTrack === 'data'}
            className={`track-tab ${selectedTrack === 'data' ? 'active' : ''}`}
            onClick={() => setSelectedTrack('data')}
          >
            Data Engineering & Systems
          </button>
        </div>

        {/* Publication Cards List */}
        <div className="proceedings-list">
          {filteredPapers.map((paper) => (
            <PublicationCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProceedingsSection;
