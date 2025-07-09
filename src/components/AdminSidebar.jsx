// src/components/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-full min-h-screen p-4 text-black bg-white border-r border-gray-300 sm:w-64">
      <h2 className="mb-6 text-2xl font-bold">Admin Panel</h2>

      <nav className="flex flex-col gap-4">

        {/* ── Dashboard (NON‑CLICKABLE) ─────────────────────────── */}
        <div className="flex items-center gap-2 font-semibold text-black">
          <LayoutDashboard size={20} />
          Dashboard
        </div>

        {/* ── Bookings ──────────────────────────────────────────── */}
        <Link
          to="/admin/bookings"
          className={`flex items-center gap-2 font-semibold hover:text-black ${
            location.pathname === '/admin/bookings' ? 'text-black' : 'text-gray-600'
          }`}
        >
          <CalendarCheck size={20} />
          Bookings
        </Link>

        {/* ── Users ─────────────────────────────────────────────── */}
        <Link
          to="/admin/users"
          className={`flex items-center gap-2 font-semibold hover:text-black ${
            location.pathname === '/admin/users' ? 'text-black' : 'text-gray-600'
          }`}
        >
          <Users size={20} />
          Users
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
