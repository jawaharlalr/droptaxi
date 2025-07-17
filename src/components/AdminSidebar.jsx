import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, LogOut } from 'lucide-react';
import { useAuth } from '../utils/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert('Failed to logout. Please try again.');
    }
  };

  const linkClass = (path) =>
    `flex items-center gap-2 font-semibold px-2 py-2 rounded transition-all ${
      location.pathname === path
        ? 'text-black border-l-4 border-blue-600 bg-blue-50'
        : 'text-gray-600 hover:text-black'
    }`;

  return (
    <aside className="flex flex-col justify-between w-full min-h-screen p-4 text-black bg-white border-r border-gray-300 sm:w-64">
      <div>
        <h2 className="mb-6 text-2xl font-bold">Admin Panel</h2>

        <nav className="flex flex-col gap-2">
          <div className="flex items-center gap-2 px-2 py-2 font-semibold text-black">
            <LayoutDashboard size={20} />
            Dashboard
          </div>

          <Link to="/admin/bookings" className={linkClass('/admin/bookings')}>
            <CalendarCheck size={20} />
            Bookings
          </Link>

          <Link to="/admin/users" className={linkClass('/admin/users')}>
            <Users size={20} />
            Users
          </Link>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 mt-6 text-sm font-medium text-white transition bg-red-600 rounded hover:bg-red-700"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
