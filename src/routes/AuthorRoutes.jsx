import React from 'react';
import AuthorDashboard from '../features/author/pages/AuthorDashboard';

export const authorRoutesList = [
  { path: '/author/dashboard', element: <AuthorDashboard /> },
  { path: '/author/submit', element: <AuthorDashboard /> }
];

export default authorRoutesList;
