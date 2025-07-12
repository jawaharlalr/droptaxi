import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="px-4 py-6 mt-auto text-white bg-black">
      <div className="grid grid-cols-1 gap-8 mx-auto text-sm max-w-7xl sm:text-base md:grid-cols-3 sm:grid-cols-2">
        
        {/* Company Info */}
        <div>
          <h4 className="mb-3 text-lg font-bold">Pranav Drop Taxi</h4>
          <p>Reliable and affordable outstation taxi service.</p>
          <p className="mt-4 text-gray-400">
            © {new Date().getFullYear()}{' '}
            <Link to="/admin-login">
              Pranav
            </Link>{' '}
            Drop Taxi. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-3 text-lg font-bold">Quick Links</h4>
          <ul className="space-y-2">
            <li><Link to="/about" className="inline-block transition-transform duration-200 hover:scale-105">About Us</Link></li>
            <li><Link to="/contact" className="inline-block transition-transform duration-200 hover:scale-105">Contact Us</Link></li>
            <li><Link to="/my-bookings" className="inline-block transition-transform duration-200 hover:scale-105">My Bookings</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-3 text-lg font-bold">Contact</h4>
          <div className="flex items-start gap-2 mb-2">
            <FiMail className="mt-1 text-white" />
            <button
  className="text-white hover:text-red-500"
  onClick={() => window.open('https://mail.google.com/mail/u/0/#inbox', '_blank')}
>
  droptaxipravan@gmail.com
</button>

          </div>
          <div className="flex items-center gap-2 mb-2">
            <FiPhone className="text-white" />
            <a href="tel:+919884609789" className="text-white hover:text-red-500">
              +91 9884609789
            </a>
          </div>
          <div className="flex items-start gap-2">
            <FiMapPin className="mt-1 text-white" />
            <span>
              28A, Karmel St, opposite V Cure Hospital,<br />
              Pallikaranai, Chennai, Tamil Nadu 600100
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
