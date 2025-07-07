import React, { useState, useRef } from 'react';
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
    } catch {
      setMessage('❌ Error submitting booking. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen bg-center bg-cover"
      style={{ backgroundImage: "url('taxi.jpg')" }}
    >
      <div className="grid min-h-screen grid-cols-1 gap-8 p-6 text-white md:grid-cols-2 bg-black/70">
        <div className="p-6 shadow-lg bg-white/10 backdrop-blur-sm rounded-xl">
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
        </div>
      </div>
    </div>
  );
};

export default Home;
