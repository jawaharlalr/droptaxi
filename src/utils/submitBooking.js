import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Generate a custom booking ID.
 * Example: PV1234-John-1545
 */
const generateBookingId = (phone, name) => {
  const now = new Date();
  const hr = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const last4 = phone.slice(-4);
  const cleanName = name.trim().split(' ')[0]; // First name only
  return `PV${last4}-${cleanName}-${hr}${min}`;
};

/**
 * Submits a booking to Firebase Firestore.
 * Expects the following fields in bookingData:
 * userId, name, phone, tripType, vehicleType, source, destination, date, cost, duration, distance
 */
const submitBooking = async (bookingData) => {
  try {
    const requiredFields = [
      'userId',
      'name',
      'phone',
      'tripType',
      'vehicleType',     // ✅ Make sure this field is passed (not "seater")
      'source',
      'destination',
      'date',
      'cost',
      'duration',
      'distance'
    ];

    for (const field of requiredFields) {
      if (!bookingData[field]) {
        console.error(`❌ Missing field: ${field}`, bookingData);
        throw new Error(`Missing required field: ${field}`);
      }
    }

    const bookingId = generateBookingId(bookingData.phone, bookingData.name);

    const newBooking = {
      ...bookingData,
      bookingId,
      status: 'Yet to Confirm',
      createdAt: Timestamp.now()
    };

    console.log('📤 Submitting booking to Firestore:', newBooking);

    await addDoc(collection(db, 'bookings'), newBooking);

    console.log('✅ Booking submitted successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error in submitBooking:', error.message || error);
    throw new Error('Failed to submit booking. Please try again.');
  }
};

export default submitBooking;
