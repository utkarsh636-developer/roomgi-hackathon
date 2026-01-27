import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ExplorePage from './components/ExplorePage';

import PropertyDetailsPage from './components/PropertyDetailsPage';

// Layout wrapper for pages that need Navbar and Footer
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Auth Routes (no Navbar/Footer) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main App Routes (with Layout) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="property/:id" element={<PropertyDetailsPage />} />
        {/* Add other protected routes here later */}
      </Route>
    </Routes>
  );
}

export default App;
