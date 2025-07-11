// src/utils/submitBooking.js

import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

/** Generate a booking ID like: PV6789-John-1432 */
const generateBookingId = (phone, name) => {
  const now = new Date();
  const hr = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const last4 = phone.slice(-4);
  const firstName = (name || '').trim().split(' ')[0];
  return `PV${last4}-${firstName}-${hr}${min}`;
};

/** Submit a booking (only for authenticated users) */
const submitBooking = async (bookingData) => {
  try {
    if (!bookingData.userId) {
      throw new Error('You must be logged in to submit a booking.');
    }

    const required = [
      'name', 'phone', 'tripType', 'vehicleType',
      'source', 'destination', 'date',
      'cost', 'duration', 'distance', 'userId'
    ];
    if (bookingData.tripType === 'round') required.push('returnDate');

    for (const f of required) {
      const v = bookingData[f];
      if (v == null || (typeof v === 'string' && v.trim() === '')) {
        throw new Error(`Missing required field: ${f}`);
      }
    }

    const name         = bookingData.name.trim();
    const phone        = bookingData.phone.trim();
    const tripType     = bookingData.tripType;
    const vehicleType  = bookingData.vehicleType.trim().toLowerCase();
    const source       = bookingData.source.trim();
    const destination  = bookingData.destination.trim();
    const date         = bookingData.date;
    const cost         = Number(bookingData.cost);
    const duration     = Number(bookingData.duration);
    const distance     = Number(bookingData.distance);
    const userId       = bookingData.userId;

    if ([cost, duration, distance].some(n => isNaN(n))) {
      throw new Error('Cost, duration or distance is not a valid number.');
    }

    let returnDate      = null;
    let returnDistance  = null;
    if (tripType === 'round') {
      returnDate     = bookingData.returnDate.trim();
      returnDistance = Number(bookingData.returnDistance || 0);
      if (isNaN(returnDistance)) {
        throw new Error('Return distance must be a valid number.');
      }
    }

    const bookingId = generateBookingId(phone, name);
    const newBooking = {
      name,
      phone,
      tripType,
      vehicleType,
      source,
      destination,
      date,
      cost,
      duration,
      distance,
      bookingId,
      status: 'Yet to Confirm',
      createdAt: Timestamp.now(),
      userId,
      ...(tripType === 'round' && { returnDate, returnDistance }),
    };

    // 🔐 Save booking to Firestore
    await setDoc(doc(db, 'bookings', bookingId), newBooking);

    return { success: true };
  } catch (err) {
    console.error('❌ submitBooking error:', err);
    throw new Error('❌ Error submitting booking. Please try again.');
  }
};

export default submitBooking;
