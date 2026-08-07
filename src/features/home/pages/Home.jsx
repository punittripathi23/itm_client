import React from 'react';
import DiscoveryHero from '../sections/DiscoveryHero';
import TrustMetricsSection from '../sections/TrustMetricsSection';
import LatestProceedingsSection from '../sections/LatestProceedingsSection';
import ConferenceHighlightsSection from '../sections/ConferenceHighlightsSection';
import FaqSection from '../sections/FaqSection';
import './Home.css';

export const Home = () => {
  return (
    <div className="academic-home-root">
      {/* 1. Discovery Hero (Search Publications) */}
      <DiscoveryHero />

      {/* 2. Trust Metrics & Indexing (ISSN, Scopus/WoS, COPE) */}
      <TrustMetricsSection />

      {/* 3. Latest Proceedings / Current Volume */}
      <LatestProceedingsSection />

      {/* 4. Conference Highlights & Call for Papers */}
      <ConferenceHighlightsSection />

      {/* 5. Editorial FAQs & Publishing Policies */}
      <FaqSection />
    </div>
  );
};

export default Home;

