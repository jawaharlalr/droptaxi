import React, { useEffect, useState, useRef } from 'react';
import { db } from '../utils/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import {
  CheckCircle,
  XCircle,
  ListOrdered,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

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
  const [trend, setTrend] = useState(null);

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
            toast.success('New booking received');
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
    <div className="min-h-screen p-6 text-white bg-black">
      <Toaster />
      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <h1 className="mb-6 text-3xl font-bold text-yellow-400">Pranav Drop Taxi Dashboard</h1>

      {loading ? (
        <p className="text-gray-300">Loading booking statistics...</p>
      ) : error ? (
        <div className="p-4 text-red-300 bg-red-900 border border-red-600 rounded">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <StatCard
              label="Total Bookings"
              count={stats.total}
              icon={<ListOrdered size={24} />}
              color="border-yellow-400"
              bg="bg-yellow-900"
            />
            <StatCard
              label="Confirmed"
              count={stats.confirmed}
              icon={<CheckCircle size={24} />}
              color="border-green-400"
              bg="bg-green-900"
            />
            <StatCard
              label="Completed"
              count={stats.completed}
              icon={<TrendingUp size={24} />}
              color="border-blue-400"
              bg="bg-blue-900"
            />
            <StatCard
              label="Cancelled"
              count={stats.cancelled}
              icon={<XCircle size={24} />}
              color="border-red-400"
              bg="bg-red-900"
            />
          </div>

          {trend && (
            <div className="flex items-center mt-6 text-sm">
              {trend === 'up' ? (
                <span className="flex items-center gap-2 text-green-400">
                  <ArrowUpRight size={18} /> Bookings are increasing
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-400">
                  <ArrowDownRight size={18} /> Bookings have decreased
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// 🎨 Reusable stat card component
const StatCard = ({ label, count, icon, color, bg }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md border ${color} ${bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-yellow-200">{label}</span>
        <div className="text-yellow-300">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white">{count}</p>
    </div>
  );
};

export default AdminDashboard;
