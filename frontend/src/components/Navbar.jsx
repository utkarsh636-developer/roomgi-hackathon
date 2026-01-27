import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle, LogIn, Menu, X, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const showWhiteBg = isScrolled || location.pathname !== '/';

  // Change navbar background on scroll
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', to: '/' },
    { name: 'Explore', to: '/explore' },
    { name: 'About', to: '/about' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-montserrat ${showWhiteBg ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">R</div>
            <span className={`text-2xl font-bold tracking-tight ${showWhiteBg ? 'text-gray-900' : 'text-white'}`}>
              Room<span className="text-indigo-600">Gi</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center space-x-8 ${showWhiteBg ? 'text-gray-600' : 'text-gray-200'}`}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className="hover:text-indigo-500 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/become-host"
              className={`px-4 py-2 font-bold rounded-full transition-all border-2 ${showWhiteBg
                ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                : 'border-white text-white hover:bg-white/10'
                }`}
            >
              List Property
            </Link>
            <button
              className={`flex items-center gap-2 px-5 py-2 font-bold rounded-full shadow-lg transition-all ${showWhiteBg
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                : 'bg-white text-indigo-900 hover:bg-indigo-50'
                }`}
            >
              <User size={18} />
              <span>Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition ${showWhiteBg ? 'text-gray-900' : 'text-white'}`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl p-6 md:hidden animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link key={item.name} to={item.to} onClick={() => setIsOpen(false)} className="text-left text-lg font-medium text-gray-800 py-2 border-b border-gray-50">
                  {item.name}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100">
                  Login
                </Link>
                <Link to="/list-property" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-indigo-600 shadow-lg shadow-indigo-200">
                  List Property
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
