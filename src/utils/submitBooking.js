import { collection, addDoc, Timestamp, setDoc, doc } from 'firebase/firestore';
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

/** Submit a booking (works for both public + authenticated flows) */
const submitBooking = async (bookingData) => {
  try {
    /* ------------------------- Validate required fields -------------------- */
    const required = [
      'name', 'phone', 'tripType', 'vehicleType',
      'source', 'destination', 'date',
      'cost', 'duration', 'distance'
    ];
    if (bookingData.tripType === 'round') required.push('returnDate');

    for (const f of required) {
      const v = bookingData[f];
      if (v == null || (typeof v === 'string' && v.trim() === '')) {
        throw new Error(`Missing required field: ${f}`);
      }
    }

    /* --------------------------- Normalise values -------------------------- */
    const name         = bookingData.name.trim();
    const phone        = bookingData.phone.trim();
    const tripType     = bookingData.tripType;
    const vehicleType  = bookingData.vehicleType.trim().toLowerCase();
    const source       = bookingData.source.trim();
    const destination  = bookingData.destination.trim();
    const date         = bookingData.date;        // keep as string (e.g. 2025‑07‑09)
    const cost         = Number(bookingData.cost);
    const duration     = Number(bookingData.duration);
    const distance     = Number(bookingData.distance);
    const userId       = bookingData.userId || null;       // when authenticated

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

    /* ------------------------- Assemble Firestore doc ---------------------- */
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
      ...(tripType === 'round' && { returnDate, returnDistance }),
      ...(userId && { userId })                    // only if supplied
    };

    /* ------------------------------ Firestore writes ----------------------- */
    await addDoc(collection(db, 'bookings'), newBooking);

    // Store / merge basic user info by phone (optional, no auth needed)
    await setDoc(
      doc(db, 'users', phone),
      { name, phone, updatedAt: Timestamp.now() },
      { merge: true }
    );

    return { success: true };

  } catch (err) {
    console.error('❌ submitBooking error:', err);
    throw new Error('❌ Error submitting booking. Please try again.');
  }
};

export default submitBooking;
