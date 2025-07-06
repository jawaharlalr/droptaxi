// src/components/AdminSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck } from 'lucide-react';

const AdminSidebar = () => {
  return (
    <aside className="w-full min-h-screen p-4 text-white bg-gray-800 sm:w-64">
      <h2 className="mb-6 text-2xl font-bold">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <div className="flex items-center gap-2 font-semibold text-gray-300">
          <LayoutDashboard size={20} />
          Dashboard
        </div>
        <Link to="/admin/bookings" className="flex items-center gap-2 hover:text-gray-300">
          <CalendarCheck size={20} />
          Bookings
        </Link>
        <Link to="/admin/users" className="flex items-center gap-2 hover:text-gray-300">
          <Users size={20} />
          Users
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
