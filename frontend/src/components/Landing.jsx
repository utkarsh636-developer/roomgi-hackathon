import React from 'react';

const Landing = () => {
  return (
    <div className="relative h-screen">
      {/* Background Image */}
      <img
        src="/images/landing-page2-upscaled.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 pt-20">
        <h1 className="text-5xl md:text-6xl font-bold font-archivo">
          Find Your Next Stay
        </h1>
        <p className="mt-4 text-lg md:text-xl font-Monteserrat">
          Discover the best rooms and PGs for students and professionals.
        </p>
        <button className="mt-8 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default Landing;
