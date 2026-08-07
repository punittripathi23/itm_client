import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('cpp_token');
      if (token) {
        try {
          const userData = await authService.getMe(token);
          setUser(userData);
        } catch (err) {
          console.error('Session validation failed:', err.message);
          localStorage.removeItem('cpp_token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('cpp_token', data.token);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      localStorage.setItem('cpp_token', data.token);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const registerAdmin = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.registerAdmin(name, email, password);
      localStorage.setItem('cpp_token', data.token);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cpp_token');
  };

  const updateProfile = (updatedData) => {
    if (!user) return;
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const isAuthenticated = !!user;
  
  const userRoles = user ? (user.roles && user.roles.length > 0 ? user.roles : [user.role || 'user']) : [];

  const hasRole = (targetRole) => {
    if (!user) return false;
    if (user.role === 'super_admin' || userRoles.includes('super_admin')) return true;
    return user.role === targetRole || userRoles.includes(targetRole);
  };

  const hasAnyRole = (rolesList = []) => {
    if (!user) return false;
    if (user.role === 'super_admin' || userRoles.includes('super_admin')) return true;
    return rolesList.some(r => user.role === r || userRoles.includes(r));
  };

  const isAuthor = hasRole('author');
  const isReviewer = hasRole('reviewer');
  const isEditor = hasRole('editor') || hasRole('editor_in_chief');
  const isEditorInChief = hasRole('editor_in_chief');
  const isProductionManager = hasRole('production_manager');
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin' || userRoles.includes('admin') || userRoles.includes('super_admin');
  const isSuperAdmin = user?.role === 'super_admin' || userRoles.includes('super_admin');

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      isAdmin,
      isSuperAdmin,
      isAuthor,
      isReviewer,
      isEditor,
      isEditorInChief,
      isProductionManager,
      userRoles,
      hasRole,
      hasAnyRole,
      login,
      register,
      registerAdmin,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};


