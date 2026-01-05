import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 mt-auto border-t border-gray-200">
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        
        {/* Main Content - Flex container for perfect distribution */}
        <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:items-start">
          
          {/* Left Side: Brand & Mission */}
          <div className="max-w-sm space-y-6">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 group-hover:border-primary/20 transition-all">
                <img
                  className="h-8 w-8 opacity-90"
                  src="https://cdn-icons-png.flaticon.com/128/10751/10751558.png"
                  alt="Logo"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-primary">
                HappyStay
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              Discover the perfect getaway with HappyStay. From cozy cabins to luxury lofts, we connect you with unique homes and unforgettable experiences worldwide.
            </p>
            <div className="flex gap-4">
              <SocialIcon href="https://www.linkedin.com/in/harish-kolla-5b1622251" icon={<Linkedin className="w-5 h-5" />} />
              <SocialIcon href="#" icon={<Instagram className="w-5 h-5" />} />
              <SocialIcon href="#" icon={<Facebook className="w-5 h-5" />} />
              <SocialIcon href="#" icon={<Twitter className="w-5 h-5" />} />
            </div>
          </div>

          {/* Right Side: Explore Links */}
          <div className="lg:text-right">
            <h3 className="text-gray-900 font-semibold mb-6">Explore</h3>
            <ul className="space-y-4 text-sm inline-flex flex-col lg:items-end">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/account/places" label="List Your Space" />
              <FooterLink to="/account/bookings" label="My Bookings" />
              <FooterLink to="#" label="Destinations" />
            </ul>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const SocialIcon = ({ icon, href }) => (
  <a 
    href={href} 
    className="bg-white border border-gray-200 p-2.5 rounded-full hover:bg-primary hover:text-white hover:border-primary text-gray-500 transition-all duration-300 shadow-sm"
  >
    {icon}
  </a>
);

const FooterLink = ({ to, label }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group"
    >
      <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300"></span>
      {label}
    </Link>
  </li>
);

export default Footer;