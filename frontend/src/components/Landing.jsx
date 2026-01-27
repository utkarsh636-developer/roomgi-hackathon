import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Star, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex flex-col lg:flex-row bg-[#0f172a] overflow-hidden pt-24 lg:pt-28">

        {/* Left Content (Text) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 pb-12 lg:pt-0 z-10">
          <div className="inline-flex items-center gap-2 self-start mb-6 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-xs sm:text-sm tracking-wide uppercase">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
            #1 Student Housing Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-montserrat text-white leading-[1.1] mb-6">
            Find Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient">Perfect Stay</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 font-montserrat max-w-lg mb-10 leading-relaxed">
            Discover 10,000+ verified PGs and Rooms with zero brokerage. We make finding your home away from home easy, safe, and transparent.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/explore">
              <button className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 group">
                Explore Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/become-host">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg rounded-2xl transition-all hover:scale-105 backdrop-blur-sm">
                List Property
              </button>
            </Link>
          </div>

          <div className="mt-8 mb-4 inline-flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm self-start animate-fade-in-up">
            <div className="bg-green-500/20 p-2 rounded-full text-green-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-white font-bold text-sm">100% Verified</p>
              <p className="text-gray-400 text-xs text-left">Trust & Safety Guarantee</p>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-4 text-gray-500 text-sm font-medium">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-[#0f172a]"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#0f172a]"></div>
              <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-[#0f172a]"></div>
            </div>
            <p>Joined by 10k+ students this month</p>
          </div>
        </div>

        {/* Right Content (Image) */}
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto">
          {/* Decorative blurred blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

          <div className="absolute inset-0 lg:left-0 lg:top-0 lg:bottom-0 lg:right-0 p-4 lg:p-4 lg:pl-0 flex items-center justify-center">
            <img
              src="/images/landing-page2-upscaled.jpg"
              alt="Student Housing"
              className="w-full h-full object-cover rounded-[2rem] lg:rounded-l-[4rem] lg:rounded-r-none shadow-2xl border-4 border-white/5 opacity-90 hover:opacity-100 transition-opacity duration-700"
            />


          </div>
        </div>
      </div>

      {/* Trust Strip / Stats Section */}
      <div className="bg-white py-16 border-b border-gray-100 relative z-20">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-indigo-50/50 transition-colors border border-slate-100 hover:border-indigo-100">
            <div className="w-16 h-16 bg-white shadow-sm text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified Listings</h3>
            <p className="text-gray-500 leading-relaxed">Every property is physically verified by our ground team.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-pink-50/50 transition-colors border border-slate-100 hover:border-pink-100">
            <div className="w-16 h-16 bg-white shadow-sm text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Friendly</h3>
            <p className="text-gray-500 leading-relaxed">Join a community of 50k+ students across India.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-yellow-50/50 transition-colors border border-slate-100 hover:border-yellow-100">
            <div className="w-16 h-16 bg-white shadow-sm text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Star size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Rated Stays</h3>
            <p className="text-gray-500 leading-relaxed">4.8/5 average rating for our premium properties.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Landing;
