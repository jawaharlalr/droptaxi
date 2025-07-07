import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="px-4 py-8 mt-10 text-white bg-black">
      <div className="grid grid-cols-1 gap-10 mx-auto text-sm max-w-7xl sm:text-base sm:gap-8 md:grid-cols-3">
        
        {/* Company Info */}
        <div>
          <h4 className="mb-3 text-lg font-bold">Pranav Drop Taxi</h4>
          <p>Reliable and affordable outstation taxi service.</p>
          <p className="mt-4 text-gray-400">
            © {new Date().getFullYear()}{' '}
            <Link to="/admin-login" className="hover:underline">
              Pranav
            </Link>{' '}
            Drop Taxi. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-3 text-lg font-bold">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/" className="block hover:underline">Home</Link></li>
            <li><Link to="/about" className="block hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="block hover:underline">Contact Us</Link></li>
            <li><Link to="/my-bookings" className="block hover:underline">My Bookings</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-3 text-lg font-bold">Contact</h4>
          <p className="mb-1">📧 support@pranavtaxi.com</p>
          <p className="mb-1">📞 +91 98765 43210</p>
          <p>📍 Chennai, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
