import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../utils/AuthContext';
import BookingRow from './BookingRow';
import { Link } from 'react-router-dom';

const AdminBookings = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (authLoading) return <p className="mt-10 text-center text-white">Checking access…</p>;

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
    <div className="min-h-screen p-6 mx-auto text-white bg-black max-w-7xl">
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <h2 className="text-3xl font-bold text-yellow-400">Manage Bookings</h2>
          <Link
            to="/admin/dashboard"
            className="inline-block px-4 py-2 mt-2 text-sm font-medium text-yellow-300 transition border border-yellow-400 rounded sm:mt-0 hover:bg-yellow-400 hover:text-black"
          >
            Dashboard
          </Link>
        </div>

        <select
          className="p-2 text-sm text-black bg-white border border-gray-300 rounded"
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
        <p className="text-gray-200">Loading bookings…</p>
      ) : error ? (
        <div className="p-4 text-red-300 border border-red-500 rounded bg-red-900/30">{error}</div>
      ) : filteredBookings.length === 0 ? (
        <p className="text-gray-400">No bookings found for selected status.</p>
      ) : (
        <div className="overflow-auto border border-yellow-400 rounded">
          <table className="min-w-full text-sm text-left text-white bg-black">
            <thead className="text-xs font-semibold text-black uppercase bg-yellow-500">
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
