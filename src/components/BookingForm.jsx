import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TripSummary from './TripSummary';

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
  tripType,
  setTripType,
  source,
  destination,
  sourceRef,
  destinationRef,
  date,
  returnDate,
  vehicleType,
  setVehicleType,
  name,
  phone,
  cost,
  distance,
  duration,
  message,
  setSource,
  setDestination,
  setDate,
  setReturnDate,
  setName,
  setPhone,
  onSubmit,
  today,
  isNameEditable,
}) => {
  const [isBooked, setIsBooked] = useState(false);

  const isFormValid =
    source &&
    destination &&
    date &&
    name?.trim() &&
    /^\d{10}$/.test(phone) &&
    vehicleType &&
    cost &&
    distance &&
    duration;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    await onSubmit();
    setIsBooked(true);
    setTimeout(() => setIsBooked(false), 3000);
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

      {/* Source and Destination */}
      <label className="block text-sm">
        Source
        <input
          name="source"
          type="text"
          autoComplete="address-line1"
          value={source}
          ref={sourceRef}
          onChange={(e) => setSource(e.target.value)}
          className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
        />
      </label>
      <label className="block text-sm">
        Destination
        <input
          name="destination"
          type="text"
          autoComplete="address-line2"
          value={destination}
          ref={destinationRef}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
        />
      </label>

      {/* Dates */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-sm">
          Date
          <input
            name="date"
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
          />
        </label>
        {tripType === 'round' && (
          <label className="block text-sm">
            Return Date
            <input
              name="returnDate"
              type="date"
              min={date}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80"
            />
          </label>
        )}
      </div>

      {/* Vehicle Type */}
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

      {/* Name and Phone */}
      <label className="block text-sm">
        Your Name
        <input
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={!isNameEditable}
          className={`w-full px-4 py-2 mt-1 text-black border border-white rounded bg-white/80 ${
            !isNameEditable && 'opacity-60 cursor-not-allowed'
          }`}
          autoComplete="name"
        />
      </label>
      <label className="block text-sm">
        Mobile Number
        <input
          name="phone"
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
      </label>

      {/* Trip Summary */}
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
            disabled={!isFormValid}
            className={`w-full px-6 py-3 rounded-xl font-semibold transition ${
              isFormValid
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            Confirm Booking
          </button>
        )}
      </div>

      {/* Validation Message */}
      {message && <p className="mt-2 text-sm text-yellow-300">{message}</p>}
    </div>
  );
};

export default BookingForm;
