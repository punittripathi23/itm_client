// AdminRoutes.jsx - Reference routes index for Administrator pages
import React from 'react';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import AdminPapers from '../features/admin/pages/AdminPapers';
import AdminConferences from '../features/admin/pages/AdminConferences';
import AdminWorkshops from '../features/admin/pages/AdminWorkshops';
import AdminGallery from '../features/admin/pages/AdminGallery';
import AdminUsers from '../features/admin/pages/AdminUsers';
import AdminCMS from '../features/admin/pages/AdminCMS';
import AdminJournals from '../features/admin/pages/AdminJournals';

export const adminRoutesList = [
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/admin/papers', element: <AdminPapers /> },
  { path: '/admin/conferences', element: <AdminConferences /> },
  { path: '/admin/workshops', element: <AdminWorkshops /> },
  { path: '/admin/gallery', element: <AdminGallery /> },
  { path: '/admin/users', element: <AdminUsers /> },
  { path: '/admin/cms', element: <AdminCMS /> },
  { path: '/admin/journals', element: <AdminJournals /> }
];

export default adminRoutesList;
