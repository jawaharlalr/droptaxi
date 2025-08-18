import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="px-4 py-10 mt-auto text-white bg-black">
      <div className="grid grid-cols-1 gap-10 mx-auto text-sm max-w-7xl sm:grid-cols-2 md:grid-cols-3 sm:text-base">

        {/* 🟡 Company Info */}
        <div>
          <h4 className="mb-3 text-lg font-bold text-yellow-300">Pranav Drop Taxi</h4>
          <p className="text-white/80">Reliable and affordable outstation taxi service.</p>
          <p className="mt-4 text-white/60">
            © {new Date().getFullYear()}{' '}
            <Link to="/admin-login">
              Pranav
            </Link>{' '}
            Drop Taxi. All rights reserved.
          </p>
        </div>

        {/* 🔵 Quick Links */}
        <div>
          <h4 className="mb-3 text-lg font-bold text-yellow-300">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="inline-block transition-transform duration-200 text-white/80 hover:text-yellow-300 hover:scale-105">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="inline-block transition-transform duration-200 text-white/80 hover:text-yellow-300 hover:scale-105">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/my-bookings" className="inline-block transition-transform duration-200 text-white/80 hover:text-yellow-300 hover:scale-105">
                My Bookings
              </Link>
            </li>
          </ul>
        </div>

        {/* 🟣 Contact Info */}
        <div>
          <h4 className="mb-3 text-lg font-bold text-yellow-300">Contact</h4>

          <div className="flex items-start gap-2 mb-3">
            <FiMail className="mt-1 text-yellow-300" />
            <a
              href="mailto:droptaxipravan@gmail.com"
              className="transition text-white/80 hover:text-yellow-300"
            >
              droptaxipravan@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <FiPhone className="text-yellow-300" />
            <a
              href="tel:+919884609789"
              className="transition text-white/80 hover:text-yellow-300"
            >
              +91 9884609789
            </a>
          </div>

          <div className="flex items-start gap-2 text-white/80">
            <FiMapPin className="mt-1 text-yellow-300" />
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
