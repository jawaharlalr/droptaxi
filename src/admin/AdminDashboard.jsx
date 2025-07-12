import React, { useEffect, useState, useRef } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import {
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiTrendingUp,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

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

  const prevBookingCount = useRef(0);
  const soundRef = useRef(null);

  useEffect(() => {
    if (!user || !isAdmin || authLoading) return;

    const unsubscribe = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const bookings = snapshot.docs.map(doc => doc.data());

      const statsData = {
        total: bookings.length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
        cancelled: bookings.filter(b => b.status === 'cancelled').length,
      };

      setStats(statsData);
      setLoading(false);

      // ✅ Detect new booking
      if (prevBookingCount.current && bookings.length > prevBookingCount.current) {
        soundRef.current?.play();
        toast.success('📦 New Booking Received!');
      }

      prevBookingCount.current = bookings.length;
    }, (error) => {
      console.error('🔥 Real-time booking listener failed:', error);
      setError('Failed to listen to bookings.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAdmin, authLoading]);

  if (authLoading) return <p className="mt-10 text-center text-black">Checking access...</p>;

  return (
    <div className="flex min-h-screen text-black bg-white">
      <AdminSidebar className="bg-white border-r border-black" />
      <main className="flex-1 p-6">
        <Toaster position="top-center" reverseOrder={false} />
        <h1 className="mb-6 text-3xl font-bold">Welcome, Pranav Drop Taxi</h1>

        {/* 🔊 Hidden audio for notification */}
        <audio ref={soundRef} src="/notification.mp3" preload="auto" />

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
