import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="font-Montserrat sticky top-4 z-50">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Link to="/" className="text-2xl font-bold text-gray-800">
              RoomGi
            </Link>

            {/* Center: Nav Links */}
            <div className="hidden md:flex items-center space-x-10">
              {['Home', 'Explore', 'About', 'Help'].map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-indigo-600 text-base font-medium transition"
                >
                  {item}
                </Link>
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
              <Link className="block text-lg font-medium text-gray-700" to="/">Home</Link>
              <Link className="block text-lg font-medium text-gray-700" to="/explore">Explore</Link>
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
