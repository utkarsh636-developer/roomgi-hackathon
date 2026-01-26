import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Footer from './components/Footer';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ExplorePage from './components/ExplorePage';

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'app', 'explore'

  const showRegisterPage = () => setCurrentView('register');
  const showLoginPage = () => setCurrentView('login');
  const showApp = () => setCurrentView('app');
  const showExplorePage = () => setCurrentView('explore');

  const renderContent = () => {
    switch (currentView) {
      case 'register':
        return <RegisterPage onShowLogin={showLoginPage} />;
      case 'app':
        return (
          <div className="flex flex-col min-h-screen">
            <Navbar onShowHome={showApp} onShowExplore={showExplorePage} />
            <main className="flex-grow">
              <Landing />
            </main>
            <Footer />
          </div>
        );
      case 'explore':
        return (
          <div className="flex flex-col min-h-screen">
            <Navbar onShowHome={showApp} onShowExplore={showExplorePage} />
            <main className="flex-grow">
              <ExplorePage />
            </main>
            <Footer />
          </div>
        );
      case 'login':
      default:
        return <LoginPage onLogin={showApp} onShowRegister={showRegisterPage} />;
    }
  };

  return <>{renderContent()}</>;
}

export default App;
