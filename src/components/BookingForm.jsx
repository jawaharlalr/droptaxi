import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TripSummary from './TripSummary';
import { useAuth } from '../utils/AuthContext'; // ✅
import { FiLoader } from 'react-icons/fi'; // Spinner for loading

const vehicleOptions = [
  {
    type: 'sedan',
    label: 'Sedan (4+1 Seater)',
    rate: { single: 14, round: 13 },
    icon: '/images/sedan.png',
  },
  {
    type: 'muv',
    label: 'MUV (7+1 Seater)',
    rate: { single: 18, round: 17 },
    icon: '/images/muv.png',
  },
  {
    type: 'innova',
    label: 'Innova (7+1 Seater)',
    rate: { single: 19, round: 18 },
    icon: '/images/innova.png',
  },
];

const BookingForm = ({
  tripType, setTripType,
  source, setSource,
  destination, setDestination,
  date, setDate,
  returnDate, setReturnDate,
  vehicleType, setVehicleType,
  cost, distance, duration,
  name, setName,
  phone, setPhone,
  message, onSubmit,
  today, sourceRef, destinationRef,
}) => {
  const [isBooked, setIsBooked] = useState(false);
  const [submitting, setSubmitting] = useState(false); // ⏳
  const { user, loginWithGoogle } = useAuth(); // ✅

  const isFormValid =
    source &&
    destination &&
    date &&
    name?.trim() &&
    /^\d{10}$/.test(phone) &&
    vehicleType &&
    cost &&
    distance &&
    duration &&
    (tripType === 'single' || returnDate);

  const handleSubmit = async () => {
    if (!isFormValid || submitting) return;

    try {
      setSubmitting(true);

      // 🔐 Ask to login if not already logged in
      if (!user) {
        await loginWithGoogle();
        alert('Login successful. Please click "Confirm Booking" again.');
        return; // 🛑 Let user click again after login
      }

      await onSubmit(); // ✅ Proceed with booking
      setIsBooked(true);
      setTimeout(() => setIsBooked(false), 3000);
    } catch (err) {
      console.error('Booking failed:', err.message);
      alert('Booking failed: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-3xl font-bold">Plan Your Trip</h2>

      {/* Trip Type Switch */}
      <div className="flex gap-4">
        {['single', 'round'].map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTripType(type)}
            className={`px-4 py-2 rounded-full font-medium border transition ${
              tripType === type
                ? 'bg-white text-black'
                : 'border-white text-white hover:bg-white/20'
            }`}
          >
            {type === 'single' ? 'Single Trip' : 'Round Trip'}
          </motion.button>
        ))}
      </div>

      {/* Source & Destination */}
      <label htmlFor="source" className="block text-sm">Source</label>
      <input
        id="source"
        type="text"
        value={source}
        ref={sourceRef}
        onChange={(e) => setSource(e.target.value)}
        className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
      />

      <label htmlFor="destination" className="block mt-4 text-sm">Destination</label>
      <input
        id="destination"
        type="text"
        value={destination}
        ref={destinationRef}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
      />

      {/* Date & Return Date */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="date" className="block text-sm">Date</label>
          <input
            id="date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
          />
        </div>

        {tripType === 'round' && (
          <div>
            <label htmlFor="returnDate" className="block text-sm">Return Date</label>
            <input
              id="returnDate"
              type="date"
              min={date}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
            />
          </div>
        )}
      </div>

      {/* Vehicle Selection */}
      <div>
        <span className="block mb-2 text-sm">Select Vehicle</span>
        <div className="flex justify-between gap-2">
          {vehicleOptions.map((v) => (
            <motion.button
              key={v.type}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setVehicleType(v.type)}
              className={`flex-1 px-2 py-3 rounded-lg text-xs sm:text-sm font-medium border text-center transition ${
                vehicleType === v.type
                  ? 'bg-white text-black border-white'
                  : 'border-white text-white hover:bg-white/10'
              }`}
            >
              <div className="flex flex-col items-center">
                <img src={v.icon} alt={v.type} className="h-8 mb-2" />
                <span>{v.label}</span>
                <span className="font-normal">₹{v.rate[tripType]}/Km</span>
                <span className="text-[11px] mt-1 block">
                  Min {tripType === 'single' ? '250' : '150'} Km
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Name & Phone */}
      <label htmlFor="name" className="block text-sm">Your Name</label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
        autoComplete="name"
      />

      <label htmlFor="phone" className="block mt-4 text-sm">Mobile Number</label>
      <input
        id="phone"
        type="tel"
        autoComplete="tel"
        value={phone}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d{0,10}$/.test(val)) setPhone(val);
        }}
        className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
        placeholder="10-digit Mobile Number"
      />

      {/* Summary */}
      <AnimatePresence>
        {isFormValid && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
          >
            <TripSummary
              distance={distance}
              duration={duration}
              cost={cost}
              tripType={tripType}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Button */}
      <div>
        {isBooked ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="py-3 font-semibold text-center text-white bg-green-600 rounded-xl"
          >
            ✅ Booking Confirmed!
          </motion.div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitting}
            className={`w-full px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
              isFormValid && !submitting
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            {submitting && <FiLoader className="animate-spin" />}
            {submitting ? 'Processing…' : 'Confirm Booking'}
          </button>
        )}
      </div>

      {/* Validation Message */}
      {message && <p className="mt-2 text-sm text-yellow-300">{message}</p>}
    </div>
  );
};

export default BookingForm;
