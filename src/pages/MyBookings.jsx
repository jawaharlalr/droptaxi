import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const vehicleLabels = {
  sedan: 'Sedan (4+1 Seater)',
  muv: 'MUV (7+1 Seater)',
  innova: 'Innova (7+1 Seater)',
};

const getDays = (start, end) => {
  const s = new Date(start);
  const e = end ? new Date(end) : s;
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff + 1 : 1;
};

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(results);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('❌ Failed to load bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toNum = (val) => (typeof val === 'number' ? val : parseFloat(val) || 0);

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
  };

  const getStatusTag = (status) => {
    const base = 'text-xs px-2 py-1 rounded-full font-medium';
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
        return <span className={`${base} bg-green-100 text-green-700`}>Confirmed</span>;
      case 'completed':
        return <span className={`${base} bg-blue-100 text-blue-700`}>Completed</span>;
      case 'cancelled':
        return <span className={`${base} bg-red-100 text-red-700`}>Cancelled</span>;
      default:
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>Pending</span>;
    }
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 bg-center bg-cover filter blur-md brightness-75"
        style={{ backgroundImage: "url('/images/taxi.jpg')" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl p-4 mx-auto mt-10">
        <div className="relative flex items-center justify-center mb-6">
          <h2 className="text-3xl font-bold text-center text-white">Your Bookings</h2>
          <Link
            to="/"
            className="absolute right-0 px-4 py-2 text-black transition bg-white rounded hover:bg-white"
          >
            Home
          </Link>
        </div>

        {error && <p className="text-center text-red-300">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-200">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-200">No bookings found.</p>
        ) : (
          <ul className="space-y-6">
            {bookings.map((booking, index) => {
              const {
                id,
                bookingId,
                status,
                tripType,
                source,
                destination,
                date,
                returnDate,
                vehicleType,
                distance,
                duration,
                cost,
                tollCharges,
                parkingCharges,
                hillCharges,
                permitCharges,
              } = booking;

              const toll = toNum(tollCharges);
              const parking = toNum(parkingCharges);
              const hill = toNum(hillCharges);
              const permit = toNum(permitCharges);
              const base = toNum(cost);

              const isRound = (tripType || '').toLowerCase() === 'round';
              const days = getDays(date, isRound ? returnDate : date);
              const bata = days * 400;
              const total = base + bata + toll + parking + hill + permit;
              const isExpanded = expandedId === id;

              return (
                <li
                  key={id}
                  className="p-4 border-black rounded-lg shadow border- bg-white/80 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-black">{index + 1}.</span>
                      <h3 className="text-lg font-semibold break-all">
                        Booking ID: {bookingId || id}
                      </h3>
                    </div>
                    {getStatusTag(status)}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-black">
                      <strong>From:</strong> {source?.displayName || 'N/A'} 🡺{' '}
                      <strong>To:</strong> {destination?.displayName || 'N/A'}
                    </p>
                    <button
                      onClick={() => toggleExpand(id)}
                      className="text-sm text-blue-600"
                    >
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-green-600">
                    Total Cost: ₹{total}{' '}
                    <span className="italic text-gray-500">(May vary)</span>
                  </p>

                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-4 mt-4 text-sm md:grid-cols-2">
                      <div className="space-y-1">
                        <p>
                          <strong>Trip Type:</strong>{' '}
                          {isRound ? 'Round Trip' : 'Single Trip'}
                        </p>
                        <p><strong>Date:</strong> {date || 'N/A'}</p>
                        {isRound && returnDate && (
                          <p><strong>Return Date:</strong> {returnDate}</p>
                        )}
                        <p>
                          <strong>Vehicle:</strong>{' '}
                          {vehicleLabels[vehicleType] || vehicleType || 'N/A'}
                        </p>
                        {distance && (
                          <p>
                            <strong>Estimated Distance:</strong> {distance} km{' '}
                            <span className="italic text-gray-500">(May vary)</span>
                          </p>
                        )}
                        {duration && (
                          <p>
                            <strong>Estimated Duration:</strong>{' '}
                            {formatDuration(duration)}{' '}
                            <span className="italic text-gray-500">(May vary)</span>
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p>
                          <strong>Base Fare:</strong> ₹{base}{' '}
                          <span className="italic text-gray-500">(May vary)</span>
                        </p>
                        <p>
                          <strong>Driver Bata:</strong> ₹400 × {days} day(s) = ₹{bata}
                        </p>
                        {toll > 0 && <p><strong>Toll Charges:</strong> ₹{toll}</p>}
                        {parking > 0 && <p><strong>Parking Charges:</strong> ₹{parking}</p>}
                        {hill > 0 && <p><strong>Hill Charges:</strong> ₹{hill}</p>}
                        {permit > 0 && <p><strong>Permit Charges:</strong> ₹{permit}</p>}

                        <p className="mt-2 text-xs italic font-medium text-blue-700">
                          Final fare may vary based on actual trip.
                        </p>
                        <p className="text-xs italic font-semibold text-gray-600">
                          {status?.toLowerCase() === 'completed'
                            ? '* Toll, Parking, Hill & Permit Charges are included above.'
                            : '* Toll, Parking, Hill & Permit Charges are not included.'}
                        </p>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
