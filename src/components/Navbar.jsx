import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="px-6 py-0 text-white bg-black shadow-md">
      <div className="container flex items-center justify-between mx-auto">
  {/* Logo */}
  <Link to="/" className="text-xl font-bold">
    <img
      src="/header.jpg"
      alt="Logo"
      className="object-contain transition-transform duration-300 h-28 hover:scale-110"
    />
  </Link>

  {/* Desktop Links */}
  <div className="items-center hidden gap-6 md:flex">
    <Link to="/my-bookings" className="hover:underline">My Bookings</Link>
          <Link to="/about" className="hover:underline">About Us</Link>
          <Link to="/contact" className="hover:underline">Contact Us</Link>
        </div>

        {/* Mobile Right Section */}
        <div className="flex items-center gap-4 md:hidden">
          {/* My Bookings always visible in mobile */}
          <Link to="/my-bookings" className="text-sm underline">
            My Bookings
          </Link>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="flex flex-col gap-4 p-4 text-white bg-black md:hidden">
          <Link to="/about" onClick={() => setMenuOpen(false)}>About Us</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact Us</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
