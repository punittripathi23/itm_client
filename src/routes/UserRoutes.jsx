// UserRoutes.jsx - Reference routes index for Researcher pages
import React from 'react';
import UserDashboard from '../features/home/pages/UserDashboard';
import DownloadHistory from '../features/home/pages/DownloadHistory';
import Profile from '../features/home/pages/Profile';

export const userRoutesList = [
  { path: '/user', element: <UserDashboard /> },
  { path: '/user/downloads', element: <DownloadHistory /> },
  { path: '/profile', element: <Profile /> }
];

export default userRoutesList;
