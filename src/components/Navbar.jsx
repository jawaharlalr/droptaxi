import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiMapPin, FiPhone } from 'react-icons/fi';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) &&
        (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target))
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setDropdownOpen(false);
      await logout();
      setTimeout(() => navigate('/'), 100);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* 🔹 Top Contact Bar (Mobile Only) */}
      <div className="sticky top-0 z-[60] flex items-center justify-center h-10 px-4 text-sm font-medium bg-yellow-300 text-black md:hidden">
        <a
          href="https://www.google.com/maps/place/28A,+Karmel+St,+opposite+V+Cure+Hospital,+Pallikaranai,+Chennai,+Tamil+Nadu+600100"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:underline"
        >
          <FiMapPin size={14} />
          Office Location
        </a>
        <span className="mx-2 text-gray-600">|</span>
        <a href="tel:+919884609789" className="flex items-center gap-1 hover:underline">
          <FiPhone size={14} />
          +91 9884609789
        </a>
      </div>

      {/* 🔸 Main Navbar */}
      <nav className="sticky z-50 px-6 text-white bg-black shadow-sm top-10 md:top-0 backdrop-blur">
        <div className="container flex items-center justify-between h-16 mx-auto md:h-[72px]">
          {/* 🔸 Logo */}
          <Link to="/" className="text-xl font-bold">
            <img
              src="/header.png"
              alt="Logo"
              className="object-contain h-24 -my-4 transition-transform duration-300 scale-105 hover:scale-110"
            />
          </Link>

          {/* 🔸 Desktop Menu */}
          <div className="items-center hidden gap-6 text-white md:flex">
            <Link to="/my-bookings" className="transition hover:text-yellow-300">My Bookings</Link>
            <Link to="/about" className="transition hover:text-yellow-300">About Us</Link>
            <Link to="/contact" className="transition hover:text-yellow-300">Contact Us</Link>

            {user && (
              <div className="relative" ref={desktopDropdownRef}>
                <img
                  src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp&s=100'}
                  alt="Profile"
                  className="object-cover w-10 h-10 transition border-2 border-yellow-300 rounded-full cursor-pointer hover:scale-105"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black border rounded shadow min-w-[180px] z-10">
                    <div className="px-4 py-2 text-sm border-b">{user.email}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 🔸 Mobile Menu Button & Profile */}
          <div className="flex items-center gap-3 md:hidden">
            <Link to="/my-bookings" className="text-sm font-medium hover:text-yellow-300">My Bookings</Link>

            {user && (
              <div className="relative" ref={mobileDropdownRef}>
                <img
                  src={user.photoURL || 'https://www.gravatar.com/avatar/?d=mp&s=100'}
                  alt="Profile"
                  className="object-cover border-2 border-yellow-300 rounded-full cursor-pointer w-9 h-9"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                />
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white text-black border rounded shadow min-w-[180px] z-10">
                    <div className="px-4 py-2 text-sm border-b">{user.email}</div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className="text-white">
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* 🔸 Mobile Menu Links */}
        {menuOpen && (
          <div className="flex flex-col gap-4 px-6 py-4 text-white bg-black/90 md:hidden">
            <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300">About Us</Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="hover:text-yellow-300">Contact Us</Link>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
