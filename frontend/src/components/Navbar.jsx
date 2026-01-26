import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

const Navbar = ({ onShowHome, onShowExplore }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to create nav items, switching between Link and onClick
  const navItems = [
    { name: 'Home', handler: onShowHome, to: '/' },
    { name: 'Explore', handler: onShowExplore, to: '/explore' },
    { name: 'About', to: '/about' },
    { name: 'Help', to: '/help' },
  ];

  return (
    <nav className="font-montserrat absolute top-6 left-0 w-full z-50">
      <div className="max-w-screen-xl mx-auto px-6 sm:px-8 lg:px-12">
        <div
          className="
            bg-white/70 backdrop-blur-lg
            border border-white/30
            shadow-lg
            rounded-2xl
            px-6
          "
        >
          <div className="flex items-center justify-between h-16">

            {/* Left: Logo */}
            <div onClick={onShowHome} className="text-2xl font-bold text-gray-800 cursor-pointer">
              Room Saathi
            </div>

            {/* Center: Nav Links */}
            <div className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => (
                item.handler ? (
                  <div
                    key={item.name}
                    onClick={item.handler}
                    className="text-gray-700 hover:text-indigo-600 text-base font-medium transition cursor-pointer"
                  >
                    {item.name}
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="text-gray-700 hover:text-indigo-600 text-base font-medium transition"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* Right: Profile + List Property */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Profile */}
              <Link
                to="/profile"
                className="text-gray-600 hover:text-indigo-600 transition"
                title="Profile"
              >
                <UserCircle size={30} />
              </Link>

              {/* List Property */}
              <Link
                to="/list-property"
                className="
                  px-5 py-2
                  rounded-xl
                  text-base font-semibold
                  text-white
                  bg-indigo-600 hover:bg-indigo-700
                  transition
                "
              >
                List Property
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-white/60 transition"
            >
              {!isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="
              mt-3
              bg-white/70 backdrop-blur-lg
              border border-white/30
              rounded-2xl
              shadow-lg
              px-6 py-4
              md:hidden
            "
          >
            <div className="space-y-3">
              <div onClick={onShowHome} className="block text-lg font-medium text-gray-700 cursor-pointer">Home</div>
              <div onClick={onShowExplore} className="block text-lg font-medium text-gray-700 cursor-pointer">Explore</div>
              <Link className="block text-lg font-medium text-gray-700" to="/about">About</Link>
              <Link className="block text-lg font-medium text-gray-700" to="/help">Help</Link>
              <Link className="block text-lg font-medium text-gray-700" to="/profile">Profile</Link>

              <Link
                to="/list-property"
                className="
                  block text-center mt-3
                  px-4 py-2
                  rounded-xl
                  text-lg font-semibold
                  text-white
                  bg-indigo-600 hover:bg-indigo-700
                "
              >
                List Property
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
