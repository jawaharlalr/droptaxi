import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-6 mt-10 text-white bg-black">
      <div className="grid grid-cols-1 gap-6 px-4 mx-auto text-sm max-w-7xl md:grid-cols-3">
        
        {/* Company Info */}
        <div>
          <h4 className="mb-2 text-lg font-bold">Pranav Drop Taxi</h4>
          <p>Reliable and affordable outstation taxi service.</p>
          <p className="mt-2">
            © {new Date().getFullYear()}{' '}
            <Link to="/admin-login" className="">
              Pranav
            </Link>{' '}
            Drop Taxi. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-2 text-lg font-bold">Quick Links</h4>
          <ul className="space-y-1">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/my-bookings" className="hover:underline">My Bookings</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-2 text-lg font-bold">Contact</h4>
          <p>Email: support@pranavtaxi.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: Chennai, Tamil Nadu</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
