import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout/PublicLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import UserLayout from '../layouts/UserLayout/UserLayout';
import AdminLayout from '../layouts/AdminLayout/AdminLayout';

// Guard components
import ProtectedRoute from '../routes/ProtectedRoute';
import GuestRoute from '../routes/GuestRoute';

// Route list models
import publicRoutesList from '../routes/PublicRoutes';
import userRoutesList from '../routes/UserRoutes';
import adminRoutesList from '../routes/AdminRoutes';
import authorRoutesList from '../routes/AuthorRoutes';
import editorRoutesList from '../routes/EditorRoutes';
import reviewerRoutesList from '../routes/ReviewerRoutes';

// Visitor Special Pages
import PdfView from '../features/papers/pages/PdfView';

// Auth Pages
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import AdminRegister from '../features/auth/pages/AdminRegister';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Visitor / Public Routes */}
      <Route element={<PublicLayout />}>
        {publicRoutesList.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Direct Submit Paper Route Aliases */}
        <Route path="/submit" element={<Navigate to="/author/submit" replace />} />
        <Route path="/submit-paper" element={<Navigate to="/author/submit" replace />} />

        {/* Full PDF is protected but uses public header/footer styling */}
        <Route
          path="/papers/:id"
          element={
            <ProtectedRoute>
              <PdfView />
            </ProtectedRoute>
          }
        />

        {/* Author Workspace Routes */}
        {authorRoutesList.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={['author', 'user', 'admin', 'super_admin']}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* Editor Workspace Routes */}
        {editorRoutesList.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={['editor', 'editor_in_chief', 'admin', 'super_admin']}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}

        {/* Reviewer Workspace Routes */}
        {reviewerRoutesList.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={['reviewer', 'editor', 'editor_in_chief', 'admin', 'super_admin']}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Guest-only Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/admin/register"
          element={
            <GuestRoute>
              <AdminRegister />
            </GuestRoute>
          }
        />
      </Route>


      {/* Researcher / User Dashboard Routes */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        {userRoutesList.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Administrator Control Panel Routes */}
      <Route
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {adminRoutesList.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
