import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Landing from './components/Landing';
import ExplorePage from './components/ExplorePage';
import PropertyDetailsPage from './components/PropertyDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NewAdminDashboard from './components/NewAdminDashboard';
import UserManagement from './components/UserManagement';
import PropertyManagement from './components/PropertyManagement';
import ReportsManagement from './components/ReportsManagement';
import VerificationQueue from './components/VerificationQueue';
import AdminAnalytics from './components/AdminAnalytics';
import OwnerLanding from './components/OwnerLanding';
import OwnerDashboard from './components/OwnerDashboard';
import ProfilePage from './components/ProfilePage';
import AddPropertyPage from './components/AddPropertyPage';
import VerificationPage from './components/VerificationPage';
import PropertyVerificationPage from './components/PropertyVerificationPage';

const HomeRoute = () => {
  const user = authService.getCurrentUser();
  if (user && user.role === 'owner') {
    return <Navigate to="/owner" replace />;
  }
  return <Landing />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/" element={<HomeRoute />} />
      <Route path="/owner" element={<OwnerLanding />} />
      <Route
        path="/owner-dashboard"
        element={
          <ProtectedRoute>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-property"
        element={
          <ProtectedRoute>
            <AddPropertyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-property/:id"
        element={
          <ProtectedRoute>
            <AddPropertyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/verification"
        element={
          <ProtectedRoute>
            <VerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ExplorePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property/:id"
        element={
          <ProtectedRoute>
            <PropertyDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/property/:id/verify"
        element={
          <ProtectedRoute>
            <PropertyVerificationPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <NewAdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/properties"
        element={
          <AdminRoute>
            <PropertyManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <ReportsManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/verifications"
        element={
          <AdminRoute>
            <VerificationQueue />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />



      {/* Redirect /admin to /admin/dashboard */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;
