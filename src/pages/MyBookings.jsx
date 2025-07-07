import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const vehicleLabels = {
  sedan: 'Sedan (4+1 Seater)',
  muv: 'MUV (7+1 Seater)',
  innova: 'Innova (7+1 Seater)',
};

const MyBookings = () => {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (phone.length !== 10) {
        setBookings([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      try {
        const q = query(collection(db, 'bookings'), where('phone', '==', phone));
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(results);
        setSearched(true);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
        setSearched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [phone]);

  const toggleExpand = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const toNum = (val) => (typeof val === 'number' ? val : parseFloat(val) || 0);

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
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
        <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
          <h2 className="mb-4 text-3xl font-bold text-center text-white md:mb-0 md:text-left">
            Search Your Bookings
          </h2>
          <Link
            to="/"
            className="px-4 py-2 text-white transition bg-black rounded hover:bg-gray-800"
          >
            Home
          </Link>
        </div>

        {/* Phone Input */}
        <div className="w-full mx-auto mb-8 md:w-1/2">
          <input
            type="tel"
            placeholder="Enter your 10-digit phone number"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
            }
            className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        {/* Results */}
        {loading ? (
          <p className="text-center text-gray-200">Loading...</p>
        ) : !searched ? (
          <p className="text-center text-gray-200">
            Enter your phone number to view bookings.
          </p>
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
              const base = toNum(cost);
              const total = toNum(totalCost) || base + toll + parking + hill + permit;
              const isExpanded = expandedId === id;

              return (
                <li
                  key={id}
                  className="p-4 border border-gray-300 rounded-lg shadow bg-white/80 backdrop-blur-md"
                >
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
                        <p><strong>Base Fare:</strong> ₹{base}</p>
                        {toll > 0 && <p><strong>Toll Charges:</strong> ₹{toll}</p>}
                        {parking > 0 && <p><strong>Parking Charges:</strong> ₹{parking}</p>}
                        {hill > 0 && <p><strong>Hill Charges:</strong> ₹{hill}</p>}
                        {permit > 0 && <p><strong>Permit Charges:</strong> ₹{permit}</p>}

                        <p className="mt-2 text-base font-semibold text-blue-700">
                          Total Cost: ₹{total}
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
