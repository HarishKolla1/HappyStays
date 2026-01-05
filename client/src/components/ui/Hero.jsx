import React from 'react';

const Hero = () => {
  return (
    <div className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 -z-10">
            <img 
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80" 
                alt="Background" 
                className="h-full w-full object-cover"
            />
            {/* Dark gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="mx-auto max-w-7xl px-6 text-white md:px-8">
            <div className="max-w-2xl">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl drop-shadow-md">
                    Find your next <br />
                    <span className="text-primary">perfect getaway</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-200 drop-shadow-sm">
                    Discover homes, experiences, and places around the globe. 
                    Book unique accommodations and experience the world like a local.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                    <a
                        href="/explore"
                        className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all hover:scale-105"
                    >
                        Explore Now
                    </a>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Hero;