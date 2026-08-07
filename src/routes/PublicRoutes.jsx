// PublicRoutes.jsx - Reference routes index for Visitor pages
import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../features/home/pages/Home';
import About from '../features/about/pages/About';
import Contact from '../features/contact/pages/Contact';
import Papers from '../features/papers/pages/Papers';
import Conferences from '../features/conferences/pages/Conferences';
import Workshops from '../features/workshops/pages/Workshops';
import Gallery from '../features/gallery/pages/Gallery';

export const publicRoutesList = [
  { path: '/', element: <Home /> },
  { path: '/about', element: <About /> },
  { path: '/contact', element: <Contact /> },
  { path: '/papers', element: <Papers /> },
  { path: '/conferences', element: <Conferences /> },
  { path: '/workshops', element: <Workshops /> },
  { path: '/gallery', element: <Gallery /> }
];

export default publicRoutesList;
