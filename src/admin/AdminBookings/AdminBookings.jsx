import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { useAuth } from '../../utils/AuthContext';
import BookingRow from './BookingRow';

const AdminBookings = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [editValues, setEditValues] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'bookings'));
      const data = snapshot.docs.map((doc, i) => ({
        id: doc.id,
        ...doc.data(),
        index: i + 1,
      }));
      setBookings(data);
      const initial = {};
      data.forEach((b) => {
        initial[b.id] = {
          distance: b.distance || '',
          duration: b.duration || '',
          cost: b.cost || '',
          toll: b.tollCharges || '',
          parking: b.parkingCharges || '',
          hill: b.hillCharges || '',
          permit: b.permitCharges || '',
        };
      });
      setEditValues(initial);
    } catch {
      setError('Error fetching bookings.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this booking permanently?')) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
        fetchBookings();
      } catch {
        alert('Failed to delete booking.');
      }
    }
  };

  useEffect(() => {
    if (!authLoading && user && isAdmin) fetchBookings();
    else if (!authLoading) {
      setError('Access denied. Admins only.');
      setLoading(false);
    }
  }, [user, isAdmin, authLoading]);

  if (authLoading) return <p className="mt-10 text-center">Checking access…</p>;

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h2 className="mb-6 text-3xl font-bold text-center">Manage Bookings</h2>
      {loading ? (
        <p>Loading bookings…</p>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded">{error}</div>
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
              {bookings.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  editValues={editValues}
                  setEditValues={setEditValues}
                  expandedId={expandedId}
                  setExpandedId={setExpandedId}
                  fetchBookings={fetchBookings}
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
