import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ExplorePage from './components/ExplorePage';
import PropertyDetailsPage from './components/PropertyDetailsPage';
import OwnerLanding from './components/OwnerLanding';
import OwnerDashboard from './components/OwnerDashboard';
import AddPropertyWizard from './components/AddPropertyWizard';
import AdminDashboard from './components/AdminDashboard';
import VerificationReview from './components/VerificationReview';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/become-host" element={<OwnerLanding />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />
          <Route path="/add-property" element={<AddPropertyWizard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin/verify/:id" element={<VerificationReview />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
