// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    today: 0,
    estimatedRevenue: 0,
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

        const todayStr = format(new Date(), 'yyyy-MM-dd');

        let revenue = 0;

        const counts = {
          total: bookings.length,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
          pending: 0,
          today: 0,
        };

        bookings.forEach(b => {
          const status = b.status;
          const date = b.pickupDate; // assuming format 'yyyy-MM-dd'
          if (status === 'confirmed') counts.confirmed++;
          if (status === 'completed') counts.completed++;
          if (status === 'cancelled') counts.cancelled++;
          if (status === 'pending') counts.pending++;
          if (date === todayStr) counts.today++;
          if (status === 'completed' && b.fare) revenue += Number(b.fare);
        });

        setStats({
          ...counts,
          estimatedRevenue: revenue,
        });
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchData();
  }, [user, isAdmin, authLoading]);

  if (authLoading) return <p className="mt-10 text-center">Checking access...</p>;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <h1 className="mb-6 text-3xl font-bold">Welcome, Pranav Drop Taxi</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="p-4 text-red-700 bg-red-100 rounded">{error}</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <StatCard label="Total Bookings" count={stats.total} color="blue" />
            <StatCard label="Confirmed" count={stats.confirmed} color="green" />
            <StatCard label="Completed" count={stats.completed} color="indigo" />
            <StatCard label="Cancelled" count={stats.cancelled} color="red" />
            <StatCard label="Pending" count={stats.pending} color="yellow" />
            <StatCard label="Today's Bookings" count={stats.today} color="purple" />
            <StatCard
              label="Estimated Revenue"
              count={`₹${stats.estimatedRevenue.toLocaleString()}`}
              color="emerald"
            />
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, count, color }) => (
  <div className={`p-4 bg-white rounded shadow border-t-4 border-${color}-500`}>
    <p className="mb-1 text-sm text-gray-600">{label}</p>
    <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
  </div>
);

export default AdminDashboard;
