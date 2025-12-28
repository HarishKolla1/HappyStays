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

            {/* Mission Section */}
            <div className="mb-16 grid gap-12 lg:grid-cols-2 items-center">
                <div className="order-2 lg:order-1">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                        alt="Team working together"
                        className="rounded-2xl shadow-xl hover:scale-[1.02] transition-transform duration-300"
                    />
                </div>
                <div className="order-1 lg:order-2">
                    <h2 className="mb-6 text-3xl font-bold text-gray-800">Our Mission</h2>
                    <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                        At HappyStays, we believe that travel is the only thing you buy that makes you richer. Our mission is to connect travelers with unique, comfortable, and affordable accommodations around the world.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Whether you're looking for a cozy cottage in the countryside, a modern apartment in the city, or a seaside villa, we have something for everyone. We are dedicated to providing a seamless booking experience and ensuring that every stay is a happy one.
                    </p>
                </div>
            </div>

            {/* Team Section */}
            <div className="rounded-2xl bg-gray-50 p-8 text-center">
                <h2 className="mb-8 text-2xl font-semibold text-gray-800">Meet the Team</h2>
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-md">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                            alt="Hemanth Kumar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Hemanth Kumar</h3>
                    <p className="text-primary font-medium">Lead Developer</p>
                    <p className="mt-4 max-w-lg text-gray-600">
                        Passionate about building scalable web applications and creating meaningful user experiences. Built HappyStays from the ground up to solve the problem of finding reliable and beautiful places to stay.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
