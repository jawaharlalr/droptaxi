import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { db } from '../../utils/firebase';
import { useAuth } from '../../utils/AuthContext';
import BookingRow from './BookingRow';
import { Link } from 'react-router-dom';

const messaging = getMessaging();

const AdminBookings = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔔 Register admin token for push notifications
  useEffect(() => {
    if (authLoading || !user || !isAdmin) return;

    const registerAdminToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Notification permission denied');
          return;
        }

        const token = await getToken(messaging, {
          vapidKey: 'BNOd40yGdGsvTGUAvw5Jx9iIch5lEW7m1eflUakxtmElGM9VqJVylHJymoJi8yjLwQCWM29yBsM8tFFa2SIcQ04',
        });

        if (token) {
          await setDoc(doc(db, 'admin_tokens', user.uid), { token }, { merge: true });
          console.log('✅ FCM token saved');
        }
      } catch (err) {
        console.error('FCM token error:', err);
      }
    };

    registerAdminToken();
  }, [user, isAdmin, authLoading]);

  // 📩 Foreground notification listener
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📥 Foreground FCM:', payload);
      const { title, body } = payload.notification || {};
      if (title && body) new Notification(title, { body });
    });

    return () => unsubscribe(); // cleanup
  }, []);

  // 📦 Fetch bookings in real-time
  useEffect(() => {
    if (authLoading) return;

    if (!user || !isAdmin) {
      setError('Access denied. Admins only.');
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'bookings'),
      (snapshot) => {
        const data = snapshot.docs.map((doc, index) => {
          const booking = doc.data();
          return {
            id: doc.id,
            index: index + 1,
            ...booking,
          };
        });

        const initialValues = {};
        data.forEach((b) => {
          initialValues[b.id] = {
            distance: b.distance || '',
            duration: b.duration || '',
            cost: b.cost || '',
            toll: b.tollCharges || '',
            parking: b.parkingCharges || '',
            hill: b.hillCharges || '',
            permit: b.permitCharges || '',
          };
        });

        setBookings(data);
        setEditValues(initialValues);
        setLoading(false);
      },
      (err) => {
        console.error('Bookings fetch error:', err);
        setError('Failed to load bookings.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isAdmin, authLoading]);

  // 🗑️ Handle deletion
  const handleDelete = async (id) => {
    if (window.confirm('Delete this booking permanently?')) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
      } catch {
        alert('Failed to delete booking.');
      }
    }
  };

  if (authLoading) return <p className="mt-10 text-center">Checking access…</p>;

  const filteredBookings =
    statusFilter === 'all'
      ? bookings
      : bookings.filter((b) => {
          const status = (b.status || '').toLowerCase();
          if (statusFilter === 'pending') {
            return status === 'yet to confirm' || status === 'pending';
          }
          return status === statusFilter;
        });

  const statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending (New)', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  return (
    <div className="min-h-screen p-6 mx-auto text-black bg-white max-w-7xl">
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <h2 className="text-3xl font-bold">Manage Bookings</h2>
          <Link
            to="/admin/dashboard"
            className="inline-block px-4 py-2 mt-2 text-sm font-medium text-black transition bg-white border border-black rounded sm:mt-0 hover:bg-black hover:text-white"
          >
            Dashboard
          </Link>
        </div>

        <select
          className="p-2 text-sm border border-gray-300 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading bookings…</p>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded">{error}</div>
      ) : filteredBookings.length === 0 ? (
        <p>No bookings found for selected status.</p>
      ) : (
        <div className="overflow-auto border border-gray-300 rounded">
          <table className="min-w-full text-sm text-left text-black bg-white">
            <thead className="text-xs font-semibold uppercase bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-2">S.No</th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">From → To</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Vehicle</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Total Cost</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  editValues={editValues}
                  setEditValues={setEditValues}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  fetchBookings={() => {}}
                  handleDelete={handleDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
