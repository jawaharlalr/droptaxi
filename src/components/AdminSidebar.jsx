import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarCheck, LogOut, MessageSquare } from 'lucide-react';
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
    `flex items-center gap-2 px-3 py-2 rounded-md font-medium transition ${
      location.pathname === path
        ? 'bg-yellow-400 text-black'
        : 'text-white hover:bg-yellow-400 hover:text-black'
    }`;

  return (
    <aside className="flex flex-col w-full min-h-screen p-6 text-white bg-black border-r border-yellow-400 sm:w-64">
      <div>
        <h2 className="mb-6 text-2xl font-extrabold text-yellow-300">Admin Panel</h2>
        <nav className="flex flex-col gap-2">
          <Link to="/admin" className={linkClass('/admin')}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>

          <Link to="/admin/bookings" className={linkClass('/admin/bookings')}>
            <CalendarCheck size={20} />
            Bookings
          </Link>

          <Link to="/admin/users" className={linkClass('/admin/users')}>
            <Users size={20} />
            Users
          </Link>

          <Link to="/admin/reviews" className={linkClass('/admin/reviews')}>
            <MessageSquare size={20} />
            Reviews
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 mt-2 font-medium text-white transition bg-red-600 rounded-md hover:bg-red-700"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
