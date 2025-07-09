import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import {
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiTrendingUp,
} from 'react-icons/fi';

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !isAdmin) {
        setError('Access denied. Admins only.');
        setLoading(false);
        return;
      }

      try {
        const snapshot = await getDocs(collection(db, 'bookings'));
        const bookings = snapshot.docs.map(doc => doc.data());

        const statsData = {
          total: bookings.length,
          confirmed: bookings.filter(b => b.status === 'confirmed').length,
          completed: bookings.filter(b => b.status === 'completed').length,
          cancelled: bookings.filter(b => b.status === 'cancelled').length,
        };

        setStats(statsData);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchData();
  }, [user, isAdmin, authLoading]);

  if (authLoading) return <p className="mt-10 text-center text-black">Checking access...</p>;

  return (
    <div className="flex min-h-screen text-black bg-white">
      <AdminSidebar className="bg-white border-r border-black" />
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-3xl font-bold">Welcome, Pranav Drop Taxi</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <StatCard label="Total Bookings" count={stats.total} icon={<FiList />} />
            <StatCard label="Confirmed" count={stats.confirmed} icon={<FiCheckCircle />} />
            <StatCard label="Completed" count={stats.completed} icon={<FiTrendingUp />} />
            <StatCard label="Cancelled" count={stats.cancelled} icon={<FiXCircle />} />
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, count, icon }) => (
  <div className="p-4 bg-white border border-gray-300 rounded shadow">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-black">{label}</span>
      <div className="text-xl text-black">{icon}</div>
    </div>
    <p className="text-2xl font-bold text-black">{count}</p>
  </div>
);

export default AdminDashboard;
