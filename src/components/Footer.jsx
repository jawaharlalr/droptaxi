import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        
        {/* Company Info */}
        <div>
          <h4 className="font-bold text-lg mb-2">Pranav Drop Taxi</h4>
          <p>Reliable and affordable outstation taxi service.</p>
          <p className="mt-2">© {new Date().getFullYear()} Pranav Drop Taxi. All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-lg mb-2">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/my-bookings" className="hover:underline">My Bookings</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-bold text-lg mb-2">Contact</h4>
          <p>Email: support@pranavtaxi.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: Chennai, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
