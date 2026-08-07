import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader/Loader';

export const GuestRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <Loader fullPage />;
  }

  // If already authenticated, redirect to the appropriate dashboard
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/user'} replace />;
  }

  return children;
};

export default GuestRoute;
