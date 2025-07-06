import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';

const vehicleLabels = {
  sedan: 'Sedan (4+1 Seater)',
  muv: 'MUV (7+1 Seater)',
  innova: 'Innova (7+1 Seater)',
};

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); // for expand/collapse

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(data);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const getStatusTag = (status) => {
    const baseClass = 'text-xs px-2 py-1 rounded-full font-medium';
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
        return <span className={`${baseClass} bg-green-100 text-green-700`}>Confirmed</span>;
      case 'completed':
        return <span className={`${baseClass} bg-blue-100 text-blue-700`}>Completed</span>;
      case 'cancelled':
        return <span className={`${baseClass} bg-red-100 text-red-700`}>Cancelled</span>;
      default:
        return <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>Pending</span>;
    }
  };

  const toNum = (n) => (typeof n === 'number' ? n : parseFloat(n) || 0);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div
        className="absolute inset-0 z-0 bg-center bg-cover filter blur-md brightness-75"
        style={{ backgroundImage: "url('/images/taxi.jpg')" }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl p-4 mx-auto mt-10">
        <div className="flex justify-end mb-4">
          <Link to="/" className="px-4 py-2 text-white transition bg-black rounded hover:bg-gray-800">
            Home
          </Link>
        </div>

        <h2 className="mb-6 text-3xl font-bold text-center text-white">My Bookings</h2>

        {loading ? (
          <p className="text-center text-gray-200">Loading your bookings...</p>
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
                totalCost,
              } = booking;

              const toll = toNum(tollCharges);
              const parking = toNum(parkingCharges);
              const hill = toNum(hillCharges);
              const permit = toNum(permitCharges);
              const baseCost = toNum(cost);
              const fullCost = toNum(totalCost) || baseCost + toll + parking + hill + permit;

              const isExpanded = expandedId === id;

              return (
                <li key={id} className="p-4 border border-gray-300 rounded-lg shadow bg-white/80 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-500">{index + 1}.</span>
                      <h3 className="text-lg font-semibold break-all">
                        Booking ID: {bookingId || id}
                      </h3>
                    </div>
                    {getStatusTag(status)}
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-700">
                      <strong>From:</strong> {source} → <strong>To:</strong> {destination}
                    </p>
                    <button
                      onClick={() => toggleExpand(id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {isExpanded ? 'Collapse ▲' : 'Expand ▼'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-4 mt-4 text-sm md:grid-cols-2">
                      <div className="space-y-1">
                        <p><strong>Trip Type:</strong> {tripType === 'round' ? 'Round Trip' : 'Single Trip'}</p>
                        <p><strong>Date:</strong> {date || 'N/A'}</p>
                        {tripType === 'round' && returnDate && (
                          <p><strong>Return Date:</strong> {returnDate}</p>
                        )}
                        <p><strong>Vehicle:</strong> {vehicleLabels[vehicleType] || vehicleType}</p>
                        {distance && (
                          <p><strong>Estimated Distance:</strong> {distance} km{' '}
                            <span className="italic text-gray-500">(May vary)</span></p>
                        )}
                        {duration && (
                          <p><strong>Estimated Duration:</strong> {formatDuration(duration)}{' '}
                            <span className="italic text-gray-500">(May vary)</span></p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p><strong>Base Fare:</strong> ₹{baseCost}</p>
                        {toll > 0 && <p><strong>Toll Charges:</strong> ₹{toll}</p>}
                        {parking > 0 && <p><strong>Parking Charges:</strong> ₹{parking}</p>}
                        {hill > 0 && <p><strong>Hill Charges:</strong> ₹{hill}</p>}
                        {permit > 0 && <p><strong>Permit Charges:</strong> ₹{permit}</p>}

                        <p className="mt-2 text-base font-semibold text-blue-700">
                          Total Cost: ₹{fullCost}
                        </p>

                        <p className="mt-1 text-xs italic font-medium text-blue-700">
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
