import React from 'react';
import { ShieldCheck, Users, Star } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/landing-page2-upscaled.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Darker Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 font-medium text-sm tracking-wide uppercase">
            🚀 #1 Student Housing Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-montserrat text-white leading-tight mb-6 drop-shadow-lg">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Perfect Stay</span> <br /> without the Hassle.
          </h1>
          <p className="text-lg md:text-2xl text-gray-200 font-montserrat max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover 10,000+ verified PGs and Rooms. Zero brokerage, 100% transparency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95">
              Explore Now
            </button>
            <button className="px-10 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-xl transition-all hover:scale-105">
              List Your Property
            </button>
          </div>
        </div>
      </div>

      {/* Trust Strip / Stats Section (New) */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="p-6 rounded-2xl bg-indigo-50/50 hover:bg-indigo-50 transition-colors">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">100% Verified</h3>
            <p className="text-gray-600 font-medium">Physically verified listings</p>
          </div>

          <div className="p-6 rounded-2xl bg-pink-50/50 hover:bg-pink-50 transition-colors">
            <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">50k+ Students</h3>
            <p className="text-gray-600 font-medium">Trusted by students across India</p>
          </div>

          <div className="p-6 rounded-2xl bg-yellow-50/50 hover:bg-yellow-50 transition-colors">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={28} />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">4.8/5 Rated</h3>
            <p className="text-gray-600 font-medium">Top-rated amenities & hosts</p>
          </div>

        </div>
      </div>
    </div>
  );
};
