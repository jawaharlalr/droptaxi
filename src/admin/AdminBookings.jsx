import React, { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../utils/AuthContext';

const AdminBookings = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editValues, setEditValues] = useState({});
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

  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
      fetchBookings();
    } catch {
      alert('Failed to update status.');
    }
  };

  const saveCharges = async (id) => {
    const v = editValues[id];
    const toNum = (n) => (+n ? +n : 0);
    const distance = toNum(v.distance);
    const duration = toNum(v.duration);
    const cost = toNum(v.cost);
    const toll = toNum(v.toll);
    const parking = toNum(v.parking);
    const hill = toNum(v.hill);
    const permit = toNum(v.permit);
    const totalCost = cost + toll + parking + hill + permit;

    try {
      await updateDoc(doc(db, 'bookings', id), {
        distance,
        duration,
        cost,
        tollCharges: toll,
        parkingCharges: parking,
        hillCharges: hill,
        permitCharges: permit,
        totalCost,
      });
      fetchBookings();
    } catch {
      alert('Failed to save charges.');
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
              {bookings.map((b) => {
                const isExpanded = expandedId === b.id;
                const v = editValues[b.id] || {};
                const inputCls = `w-full border px-2 py-1 rounded text-xs`;

                const toNum = (n) => (+n ? +n : 0);
                const totalCost =
                  toNum(v.cost) +
                  toNum(v.toll) +
                  toNum(v.parking) +
                  toNum(v.hill) +
                  toNum(v.permit);

                return (
                  <React.Fragment key={b.id}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{b.index}</td>
                      <td className="px-3 py-2">{b.name}</td>
                      <td className="px-3 py-2">{b.phone}</td>
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium text-gray-800">
                          {b.source}
                        </div>
                        <div className="text-xs text-center text-gray-500">to</div>
                        <div className="text-sm font-medium text-gray-800">
                          {b.destination}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        {b.date}
                        {b.returnDate && (
                          <>
                            <br />
                            <span className="text-xs text-gray-500">
                              Return: {b.returnDate}
                            </span>
                          </>
                        )}
                      </td>
                      <td className="px-3 py-2">{b.vehicleType}</td>
                      <td className="px-3 py-2">
                        <select
                          value={b.status || ''}
                          onChange={(e) => updateStatus(b.id, e.target.value)}
                          className="px-2 py-1 text-xs border rounded"
                        >
                          <option value="">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-3 py-2 font-semibold text-blue-700">
                        ₹{b.totalCost || totalCost}
                      </td>
                      <td className="px-3 py-2 space-x-2">
                        <button
                          onClick={() =>
                            setExpandedId((prev) => (prev === b.id ? null : b.id))
                          }
                          className="text-xs text-blue-600 underline"
                        >
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="text-xs text-red-600 underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="border-b bg-gray-50">
                        <td colSpan={9} className="px-4 py-4">
                          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {[
                              ['Distance (km)', 'distance'],
                              ['Duration (min)', 'duration'],
                              ['Base Cost ₹', 'cost'],
                              ['Toll ₹', 'toll'],
                              ['Parking ₹', 'parking'],
                              ['Hill ₹', 'hill'],
                              ['Permit ₹', 'permit'],
                            ].map(([label, key]) => (
                              <label key={key} className="text-xs">
                                <span className="block mb-0.5">{label}</span>
                                <input
                                  type="number"
                                  value={v[key]}
                                  onChange={(e) =>
                                    setEditValues((prev) => ({
                                      ...prev,
                                      [b.id]: {
                                        ...prev[b.id],
                                        [key]: e.target.value,
                                      },
                                    }))
                                  }
                                  className={inputCls}
                                  min="0"
                                />
                              </label>
                            ))}
                          </div>
                          <div className="mt-3 text-sm font-medium">
                            Calculated Total Cost:{' '}
                            <span className="font-bold text-green-700">₹{totalCost}</span>
                          </div>
                          <div className="mt-2">
                            <button
                              onClick={() => saveCharges(b.id)}
                              className="px-4 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              Save Fare Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
