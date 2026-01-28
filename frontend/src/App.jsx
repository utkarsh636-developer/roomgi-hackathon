import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Landing from './components/Landing';
import ExplorePage from './components/ExplorePage';
import PropertyDetailsPage from './components/PropertyDetailsPage';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';
import OwnerLanding from './components/OwnerLanding';

// Layout wrapper to conditionally show landing page based on role
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
      <Route path="/" element={<HomeRoute />} />
      <Route path="/owner" element={<OwnerLanding />} />
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
    </Routes>
  );
}

export default App;
