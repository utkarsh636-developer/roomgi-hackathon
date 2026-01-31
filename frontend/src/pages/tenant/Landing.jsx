import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Star, ArrowRight } from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import WhyRoomGi from '../../components/shared/WhyRoomGi';

import authService from '../../services/authService';

const Landing = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full min-h-screen flex flex-col lg:flex-row bg-brand-dark overflow-hidden pt-24 lg:pt-28">

        {/* Left Content (Text) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 pb-12 lg:pt-0 z-10">
          <div className="inline-flex items-center gap-2 self-start mb-6 px-4 py-1.5 rounded-full bg-brand-cream/10 border border-brand-cream/20 text-brand-cream font-medium text-xs sm:text-sm tracking-wide uppercase">
            <span className="flex h-2 w-2 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.6)]"></span>
            #1 Student Housing Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold font-montserrat text-brand-cream leading-[1.1] mb-6">
            Rooms That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-cream to-brand-primary animate-gradient bg-300%">Feel Like Home</span>
          </h1>

          <p className="text-base sm:text-lg text-brand-cream/70 font-montserrat max-w-lg mb-10 leading-relaxed">
            Discover 10,000+ verified PGs and Rooms with zero brokerage. We make finding your home away from home easy, safe, and transparent.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/explore">
              <button className="flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-brand-cream font-bold text-lg rounded-2xl shadow-lg shadow-brand-dark/50 border border-brand-cream/10 transition-all hover:scale-105 active:scale-95 group">
                Explore Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            {!user && (
              <Link to="/login">
                <button className="px-8 py-4 bg-transparent hover:bg-brand-cream/10 border border-brand-cream/20 text-brand-cream font-bold text-lg rounded-2xl transition-all hover:scale-105 shadow-sm">
                  List Property
                </button>
              </Link>
            )}
          </div>

          <div className="mt-8 mb-4 inline-flex items-center gap-3 bg-brand-cream/5 border border-brand-cream/10 p-3 rounded-xl backdrop-blur-sm self-start animate-fade-in-up">
            <div className="bg-green-500/20 p-2 rounded-full text-green-400">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-brand-cream font-bold text-sm">100% Verified</p>
              <p className="text-brand-cream/50 text-xs text-left">Trust & Safety Guarantee</p>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-4 text-brand-cream/50 text-sm font-medium">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-brand-primary border-2 border-brand-dark"></div>
              <div className="w-8 h-8 rounded-full bg-brand-secondary border-2 border-brand-dark"></div>
              <div className="w-8 h-8 rounded-full bg-brand-cream border-2 border-brand-dark"></div>
            </div>
            <p>Joined by 10k+ students this month</p>
          </div>
        </div>

        {/* Right Content (Image) */}
        <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto">
          {/* Decorative blurred blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] opacity-70 pointer-events-none"></div>

          <div className="absolute inset-0 lg:left-0 lg:top-0 lg:bottom-0 lg:right-0 p-4 lg:pt-4 lg:pr-4 lg:pl-0 lg:pb-20 flex items-center justify-center">
            <img
              src="/images/landing-page3.jpg"
              alt="Student Housing"
              className="w-full h-full object-cover rounded-[2rem] lg:rounded-l-[4rem] lg:rounded-r-none shadow-2xl border-4 border-white opacity-90 hover:opacity-100 transition-opacity duration-700"
            />


          </div>
        </div>
      </div>

      {/* Trust Strip / Stats Section */}
      <div className="bg-white py-16 relative z-20">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

          <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-brand-primary/10 transition-colors border border-slate-100 hover:border-brand-primary/20">
            <div className="w-16 h-16 bg-white shadow-sm text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Verified Listings</h3>
            <p className="text-gray-500 leading-relaxed">Every property is physically verified by our ground team.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-brand-secondary/10 transition-colors border border-slate-100 hover:border-brand-secondary/20">
            <div className="w-16 h-16 bg-white shadow-sm text-brand-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Users size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Student Friendly</h3>
            <p className="text-gray-500 leading-relaxed">Join a community of 50k+ students across India.</p>
          </div>

          <div className="group p-8 rounded-3xl bg-slate-50 hover:bg-brand-dark/10 transition-colors border border-slate-100 hover:border-brand-dark/20">
            <div className="w-16 h-16 bg-white shadow-sm text-brand-dark rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Star size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Rated Stays</h3>
            <p className="text-gray-500 leading-relaxed">4.8/5 average rating for our premium properties.</p>
          </div>

        </div>
      </div>
      {/* Why RoomGi Section */}
      <WhyRoomGi />

      <Footer />
    </div>
  );
};

export default Landing;
