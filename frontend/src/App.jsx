import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Tenant Pages
import Landing from './pages/tenant/Landing';
import ExplorePage from './pages/tenant/ExplorePage';
import PropertyDetailsPage from './pages/tenant/PropertyDetailsPage';
import ProfilePage from './pages/tenant/ProfilePage';
import AboutPage from './components/shared/AboutPage';

// Owner Pages
import OwnerLanding from './pages/owner/OwnerLanding';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddPropertyPage from './pages/owner/AddPropertyPage';
import VerificationPage from './pages/owner/VerificationPage';

// Admin Pages
import NewAdminDashboard from './pages/admin/NewAdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import PropertyManagement from './pages/admin/PropertyManagement';
import ReportsManagement from './pages/admin/ReportsManagement';
import VerificationQueue from './pages/admin/VerificationQueue';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import PropertyVerificationPage from './pages/admin/PropertyVerificationPage';

// Components
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import WhyRoomGi from './components/shared/WhyRoomGi';

const HomeRoute = () => {
  const user = authService.getCurrentUser();
  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
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
      <Route path="/why-roomgi" element={<WhyRoomGi />} />
      <Route path="/about" element={<AboutPage />} />

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
