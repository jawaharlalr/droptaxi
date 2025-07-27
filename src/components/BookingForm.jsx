import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

import TripTypeSelector from './BookingForm/TripTypeSelector';
import DateTimePicker from './BookingForm/DateTimePicker';
import LocationInputs from './BookingForm/LocationInputs';
import VehicleSelector from './BookingForm/VehicleSelector';
import ContactInputs from './BookingForm/ContactInputs';
import SubmitButton from './BookingForm/SubmitButton';
import TripSummary from './TripSummary';

import { useAuth } from '../utils/AuthContext';
import useDistanceCalculator from '../hooks/useDistanceCalculator';
import submitBooking from '../utils/submitBooking';

const BookingForm = () => {
  const [tripType, setTripType] = useState('oneway');
  const [date, setDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginCompleted, setLoginCompleted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const [sourcePlace, setSourcePlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [pickupError, setPickupError] = useState('');
  const [dropError, setDropError] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const { user, loginWithGoogle } = useAuth();

  const {
    distance = null,
    duration = null,
    cost = null
  } = useDistanceCalculator({
    sourcePlace,
    destinationPlace,
    vehicleType,
    tripType
  }) || {};

  const validatePlace = (place, label) => {
    try {
      if (
        !place?.displayName ||
        typeof place?.location?.lat !== 'function' ||
        typeof place?.location?.lng !== 'function'
      ) {
        return `${label} is invalid`;
      }
      const lat = place.location.lat();
      const lng = place.location.lng();
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return `${label} coordinates are invalid`;
      }
    } catch {
      return `${label} is invalid`;
    }
    return '';
  };

  const validateForm = () => {
    const sourceErr = validatePlace(sourcePlace, 'Pickup location');
    const destErr = validatePlace(destinationPlace, 'Drop location');

    setPickupError(sourceErr);
    setDropError(destErr);

    if (sourceErr || destErr) return 'Location validation failed';
    if (!vehicleType) return 'Please select a vehicle';
    if (!name.trim().match(/^[A-Za-z ]+$/)) return 'Name must contain only letters';
    if (!phone.trim().match(/^[6-9]\d{9}$/)) return 'Enter a valid 10-digit Indian phone number';
    if (!date) return 'Please select a travel date';
    if (tripType === 'roundtrip' && !returnDate) return 'Please select a return date';
    if (!distance || !cost || !duration) return 'Trip details not calculated yet';
    return '';
  };

  useEffect(() => {
    const inputsValid =
      sourcePlace &&
      destinationPlace &&
      !validatePlace(sourcePlace, 'Pickup location') &&
      !validatePlace(destinationPlace, 'Drop location') &&
      vehicleType &&
      name.trim().match(/^[A-Za-z ]+$/) &&
      phone.trim().match(/^[6-9]\d{9}$/) &&
      date &&
      (tripType === 'oneway' || returnDate) &&
      distance &&
      duration &&
      cost;

    setShowSummary(inputsValid);
  }, [
    sourcePlace,
    destinationPlace,
    vehicleType,
    name,
    phone,
    date,
    returnDate,
    tripType,
    distance,
    duration,
    cost
  ]);

  const resetForm = () => {
    setTripType('oneway');
    setDate('');
    setReturnDate('');
    setVehicleType('');
    setName('');
    setPhone('');
    setSourcePlace(null);
    setDestinationPlace(null);
    setPickupError('');
    setDropError('');
    setShowSummary(false);
  };

  const handleFinalSubmit = async () => {
    const bookingData = {
      tripType: tripType === 'roundtrip' ? 'round' : 'single',
      date,
      returnDate: tripType === 'roundtrip' ? returnDate : null,
      source: sourcePlace,
      destination: destinationPlace,
      vehicleType,
      cost,
      distance,
      duration,
      name,
      phone,
      userId: user?.uid || null,
      userEmail: user?.email || null
    };

    try {
      const id = await submitBooking(bookingData);
      setBookingId(id);
      setShowSuccessModal(true);
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      setError('Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      if (validationError !== 'Location validation failed') {
        setError(validationError);
      }
      return;
    }

    setSubmitting(true);

    try {
      if (!user && !loginCompleted) {
        await loginWithGoogle();
        setLoginCompleted(true);
        setShowLoginModal(true);
        return;
      }

      await handleFinalSubmit();
    } catch (err) {
      console.error('Login or submission error:', err);
      setError('Something went wrong during login.');
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 text-white"
      >
        <TripTypeSelector tripType={tripType} setTripType={setTripType} />
        <LocationInputs
          onSourcePlaceSelect={setSourcePlace}
          onDestinationPlaceSelect={setDestinationPlace}
          pickupError={pickupError}
          dropError={dropError}
        />
        <DateTimePicker
          tripType={tripType}
          date={date}
          returnDate={returnDate}
          setDate={setDate}
          setReturnDate={setReturnDate}
        />
        <VehicleSelector
          tripType={tripType}
          vehicleType={vehicleType}
          setVehicleType={setVehicleType}
        />
        <ContactInputs
          name={name}
          phone={phone}
          setName={setName}
          setPhone={setPhone}
        />
        <AnimatePresence>
          {distance && cost && duration && showSummary && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.4 }}
            >
              <TripSummary
                distance={distance}
                duration={duration}
                cost={cost}
                tripType={tripType === 'roundtrip' ? 'round' : 'single'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <SubmitButton submitting={submitting} />

        {error && (
          <motion.p
            className="flex items-center justify-center gap-2 text-sm font-medium text-red-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertTriangle className="w-5 h-5" /> {error}
          </motion.p>
        )}
      </motion.form>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm p-6 text-center bg-white shadow-2xl rounded-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle2 className="w-10 h-10 mx-auto mb-3 text-green-500" />
              <h2 className="mb-2 text-xl font-bold text-gray-800">Booking Successful</h2>
              <p className="mb-4 text-gray-600">Your booking ID is:</p>
              <p className="px-2 py-1 font-mono text-lg text-gray-800 bg-gray-100 rounded">{bookingId}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 mt-6 font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Confirmation Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm p-6 text-center bg-white shadow-xl rounded-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="mb-4 text-xl font-bold text-gray-800">Login Successful</h3>
              <p className="mb-6 text-gray-600">Please confirm your booking.</p>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  handleFinalSubmit();
                }}
                className="w-full px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 rounded-xl"
              >
                Confirm Booking
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingForm;
