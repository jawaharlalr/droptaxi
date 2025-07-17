// src/pages/AdminDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import {
  FiCheckCircle,
  FiXCircle,
  FiList,
  FiTrendingUp,
  FiArrowUpRight,
  FiArrowDownRight,
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
  const [trend, setTrend] = useState(null); // up or down

  const prevBookingCount = useRef(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (authLoading || !user || !isAdmin) return;

    const bookingsRef = collection(db, 'bookings');

    const unsubscribe = onSnapshot(
      bookingsRef,
      (snapshot) => {
        const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        const statsData = {
          total: bookings.length,
          confirmed: bookings.filter((b) => b.status === 'confirmed').length,
          completed: bookings.filter((b) => b.status === 'completed').length,
          cancelled: bookings.filter((b) => b.status === 'cancelled').length,
        };

        setStats(statsData);
        setLoading(false);

        if (prevBookingCount.current > 0) {
          const diff = bookings.length - prevBookingCount.current;
          if (diff > 0) {
            setTrend('up');
            toast.success('📦 New booking received');
            if (audioRef.current) audioRef.current.play();
          } else if (diff < 0) {
            setTrend('down');
          }
        }

        prevBookingCount.current = bookings.length;
      },
      (err) => {
        console.error('❌ Firestore error:', err);
        setError('Failed to fetch booking stats.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin, authLoading]);

  if (authLoading) {
    return <p className="mt-10 text-center text-black">Checking admin access...</p>;
  }

  return (
    <div className="p-6">
      <Toaster />
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <h1 className="mb-6 text-3xl font-bold">Pranav Drop Taxi Dashboard</h1>

      {loading ? (
        <p>Loading booking statistics...</p>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <StatCard label="Total Bookings" count={stats.total} icon={<FiList />} color="gray" />
            <StatCard label="Confirmed" count={stats.confirmed} icon={<FiCheckCircle />} color="green" />
            <StatCard label="Completed" count={stats.completed} icon={<FiTrendingUp />} color="blue" />
            <StatCard label="Cancelled" count={stats.cancelled} icon={<FiXCircle />} color="red" />
          </div>

          {trend && (
            <div className="flex items-center mt-4 text-sm text-gray-600">
              {trend === 'up' ? (
                <span className="flex items-center gap-1 text-green-600">
                  <FiArrowUpRight /> Bookings are increasing
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <FiArrowDownRight /> Bookings have decreased
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// 🎨 Stat card with color themes
const StatCard = ({ label, count, icon, color }) => {
  const colorMap = {
    gray: 'border-gray-300',
    green: 'border-green-400',
    red: 'border-red-400',
    blue: 'border-blue-400',
  };

  return (
    <div className={`p-4 bg-white border rounded shadow ${colorMap[color] || 'border-gray-300'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-black">{label}</span>
        <div className="text-xl text-black">{icon}</div>
      </div>
      <p className="text-2xl font-bold text-black">{count}</p>
    </div>
  );
};

export default AdminDashboard;
