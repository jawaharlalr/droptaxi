import React, { useState, useRef } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';
import { motion } from 'framer-motion'; // ✅ Framer Motion

import BookingForm from '../components/BookingForm';
import usePlacesAutocomplete from '../hooks/usePlacesAutocomplete';
import useDistanceCalculator from '../hooks/useDistanceCalculator';
import validatePhone from '../utils/validatePhone';
import submitBooking from '../utils/submitBooking';

const Home = () => {
  const [tripType, setTripType] = useState('single');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [vehicleType, setVehicleType] = useState('sedan');
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [cost, setCost] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const sourceRef = useRef(null);
  const destinationRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const [sourcePlaceId, setSourcePlaceId] = useState(null);
  const [destinationPlaceId, setDestinationPlaceId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  usePlacesAutocomplete(
    sourceRef,
    destinationRef,
    setSource,
    setSourcePlaceId,
    setDestination,
    setDestinationPlaceId
  );

  useDistanceCalculator(
    sourcePlaceId,
    destinationPlaceId,
    vehicleType,
    setDistance,
    setDuration,
    setCost,
    setMessage,
    tripType
  );

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!source || !destination || !date || !cost || !name || !phone) {
      setMessage('Please fill all required fields and wait for the estimate.');
      return;
    }

    if (!validatePhone(phone)) {
      setMessage('Enter a valid 10-digit phone number.');
      return;
    }

    try {
      await submitBooking({
        name,
        phone,
        tripType,
        vehicleType,
        source,
        destination,
        date,
        returnDate: tripType === 'round' ? returnDate : '',
        cost,
        duration,
        distance,
        userId: user.uid,
      });

      setMessage('✅ Booking submitted successfully!');
      setSource('');
      setDestination('');
      setSourcePlaceId(null);
      setDestinationPlaceId(null);
      setDate('');
      setReturnDate('');
      setVehicleType('sedan');
      setDistance(null);
      setDuration(null);
      setCost(null);
      setPhone('');
      setName('');
    } catch (err) {
      setMessage(err.message || '❌ Error submitting booking.');
    }
  };

  return (
    <div
      className="min-h-screen text-white bg-center bg-cover"
      style={{ backgroundImage: "url('taxi.jpg')" }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6 bg-black/70 sm:p-6">
        {/* Hero Section */}
        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold sm:text-4xl drop-shadow-md">
            Fast. Reliable. Affordable.
          </h1>
          <p className="max-w-md mx-auto text-sm text-gray-100 sm:text-base">
            Book your outstation taxi with Pranav Drop Taxi. Transparent pricing and on-time pickup—always.
          </p>
        </motion.div>

        {/* Booking Form */}
        <motion.div
          className="w-full max-w-3xl p-4 border shadow-2xl sm:p-6 bg-white/10 backdrop-blur-md rounded-xl border-white/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BookingForm
    tripType={tripType}
    setTripType={setTripType}
    date={date}
    setDate={setDate}
    returnDate={returnDate}
    setReturnDate={setReturnDate}
    today={today}
    source={source}
    setSource={setSource}
    destination={destination}
    setDestination={setDestination}
    sourceRef={sourceRef}
    destinationRef={destinationRef}
    vehicleType={vehicleType}
    setVehicleType={setVehicleType}
    distance={distance}
    duration={duration}
    cost={cost}
    name={name}
    setName={setName}
    phone={phone}
    setPhone={setPhone}
    isNameEditable={true}
    message={message}
    onSubmit={handleBooking}
  />
</motion.div>
      </div>

      {/* Floating Buttons */}
      <motion.div
        className="fixed z-50 flex flex-col items-end space-y-2 bottom-4 right-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <a
          href="https://wa.me/919884609789"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 text-white transition duration-300 transform bg-green-600 rounded-full shadow-lg hover:bg-green-700 hover:scale-105"
        >
          <FaWhatsapp size={20} />
        </a>
        <a
          href="tel:9884609789"
          className="items-center justify-center hidden p-3 text-white transition duration-300 transform bg-blue-600 rounded-full shadow-lg sm:flex hover:bg-blue-700 hover:scale-105"
        >
          <FaPhoneAlt size={18} />
        </a>
      </motion.div>
    </div>
  );
};

export default Home;
