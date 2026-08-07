import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader/Loader';

export const ProtectedRoute = ({ children, adminOnly = false, allowedRoles = null }) => {
  const { isAuthenticated, isAdmin, hasAnyRole, loading } = useAuth();

  if (loading) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!hasAnyRole(rolesArray)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

