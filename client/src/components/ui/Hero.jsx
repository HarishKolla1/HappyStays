import React from 'react';

const Hero = () => {
  return (
    <div className="relative flex min-h-[70vh] w-full items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 px-4 pt-28 text-center text-white shadow-xl sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      </div>
      <div className="relative z-10 max-w-3xl">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Find Your Next <span className="text-yellow-300">Perfect Getaway</span>
        </h1>
        <p className="mb-8 text-lg font-medium text-blue-100 sm:text-xl md:text-2xl">
          Discover homes, experiences, and places around the globe. Book unique
          accommodations and experience the world like a local.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#explore"
            className="rounded-full bg-white px-8 py-3 text-lg font-bold text-indigo-600 shadow-lg transition-transform hover:scale-105 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
          >
            Explore Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
