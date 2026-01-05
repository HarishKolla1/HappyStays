import React from 'react';

const AboutPage = () => {
    return (
        <div className="mx-auto pt-24 max-w-6xl px-8 pb-16">
            {/* Hero Section */}
            <div className="mb-12 text-center">
                <h1 className="mb-4 text-4xl font-bold text-primary">About HappyStays</h1>
                <p className="text-xl text-gray-600">
                    Your journey to finding the perfect place starts here.
                </p>
            </div>

           
            {/* Team Section */}
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
                <h2 className="mb-8 text-2xl font-semibold text-gray-800">Meet the Team</h2>
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                            alt="harish Kolla"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Harish Kolla</h3>
                    <p className="text-primary font-medium">Developer</p>
                    <p className="mt-4 max-w-lg text-gray-600">
                        Passionate about building scalable web applications and creating meaningful user experiences. Built HappyStays from the ground up to solve the problem of finding reliable and beautiful places to stay.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
