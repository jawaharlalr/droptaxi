import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <Link to="/my-bookings" className="inline-block transition-transform duration-200 hover:scale-105">
            My Bookings
          </Link>
          <Link to="/about" className="inline-block transition-transform duration-200 hover:scale-105">
            About Us
          </Link>
          <Link to="/contact" className="inline-block transition-transform duration-200 hover:scale-105">
            Contact Us
          </Link>

          {/* Auth Section */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <img
                src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp&s=100'}
                alt="Profile"
                className="object-cover w-10 h-10 border-2 border-white rounded-full cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow text-black min-w-[180px] z-10">
                  <div className="px-4 py-2 text-sm border-b">{user.email}</div>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Right Section */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/my-bookings" className="text-sm underline">
            My Bookings
          </Link>

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
          {user && (
            <>
              <span className="text-sm">{user.email}</span>
              <button onClick={logout} className="text-left text-red-400">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
