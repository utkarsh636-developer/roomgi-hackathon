import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'app'

  const showRegisterPage = () => setCurrentView('register');
  const showLoginPage = () => setCurrentView('login');
  const showApp = () => setCurrentView('app');

  const renderContent = () => {
    switch (currentView) {
      case 'register':
        return <RegisterPage onShowLogin={showLoginPage} />;
      case 'app':
        return (
          <>
            <Navbar />
            <Landing />
            <Footer />
          </>
        );
      case 'login':
      default:
        return <LoginPage onLogin={showApp} onShowRegister={showRegisterPage} />;
    }
  };

  return <>{renderContent()}</>;
}

export default App;
