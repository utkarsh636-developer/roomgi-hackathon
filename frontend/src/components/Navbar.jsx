import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserCircle, LogIn, Menu, X, User } from 'lucide-react';
import authService from '../services/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const showWhiteBg = isScrolled || (location.pathname !== '/' && location.pathname !== '/home');

  // Auth state
  const user = authService.getCurrentUser();

  // Change navbar background on scroll
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

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
          <Link to={user && user.role === 'owner' ? '/owner' : '/'} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">R</div>
            <span className={`text-2xl font-bold tracking-tight ${showWhiteBg ? 'text-gray-900' : 'text-white'}`}>
              Room<span className="text-indigo-600">Gi</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center space-x-8 ${showWhiteBg ? 'text-gray-600' : 'text-gray-200'}`}>
            <Link to={user && user.role === 'owner' ? '/owner' : '/'} className="hover:text-indigo-500 font-medium transition-colors">
              Home
            </Link>
            <Link to="/explore" className="hover:text-indigo-500 font-medium transition-colors">
              Explore
            </Link>
            <Link to="/about" className="hover:text-indigo-500 font-medium transition-colors">
              About
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* List Property Logic: Guest -> Login, Owner -> Become Host, Tenant -> Hidden */}
            {(!user || user.role === 'owner') && (
              <Link
                to={user ? "/owner-dashboard" : "/login"}
                className={`px-4 py-2 font-bold rounded-full transition-all border-2 ${showWhiteBg
                  ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  : 'border-white text-white hover:bg-white/10'
                  }`}
              >
                List Property
              </Link>
            )}

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 focus:outline-none">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center text-indigo-700 font-bold overflow-hidden shadow-sm">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                      user.username?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className={`font-bold hidden lg:block ${showWhiteBg ? 'text-gray-700' : 'text-white'}`}>
                    {user.username?.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transform origin-top-right scale-0 group-hover:scale-100 transition-transform duration-200 ease-in-out">
                  <div className="p-4 border-b border-gray-50 bg-gray-50">
                    <p className="font-bold text-gray-900 truncate">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors font-medium text-sm">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <button
                  className={`flex items-center gap-2 px-5 py-2 font-bold rounded-full shadow-lg transition-all ${showWhiteBg
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                    : 'bg-white text-indigo-900 hover:bg-indigo-50'
                    }`}
                >
                  <User size={18} />
                  <span>Login</span>
                </button>
              </Link>
            )}
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
              <Link to={user && user.role === 'owner' ? '/owner' : '/'} onClick={() => setIsOpen(false)} className="text-left text-lg font-medium text-gray-800 py-2 border-b border-gray-50">
                Home
              </Link>
              <Link to="/explore" onClick={() => setIsOpen(false)} className="text-left text-lg font-medium text-gray-800 py-2 border-b border-gray-50">
                Explore
              </Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="text-left text-lg font-medium text-gray-800 py-2 border-b border-gray-50">
                About
              </Link>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {user ? (
                  <>
                    {/* Owner sees List Property in Mobile too */}
                    {user.role === 'owner' && (
                      <Link to="/become-host" onClick={() => setIsOpen(false)} className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-indigo-600 shadow-lg shadow-indigo-200">
                        List Property
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); setIsOpen(false); }} className="col-span-2 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-red-500 shadow-lg">
                      Logout ({user.username})
                    </button>
                  </>
                ) : (
                  <>
                    {/* Guest sees Login and List Property (redirects to Login) */}
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100">
                      Login
                    </Link>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-indigo-600 shadow-lg shadow-indigo-200">
                      List Property
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
