import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import Footer from '../../components/footer/Footer';
import './PublicLayout.css';

export const PublicLayout = () => {
  return (
    <div className="public-layout-root">
      <a href="#main-content" className="skip-to-content">
        Skip to main academic content
      </a>
      <Navbar />
      <main id="main-content" className="public-layout-main" tabIndex="-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

