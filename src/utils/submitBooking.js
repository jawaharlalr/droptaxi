import { db } from './firebase';
import { serverTimestamp } from 'firebase/firestore';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function validatePlace(place, fieldName) {
  if (
    !place ||
    typeof place !== 'object' ||
    typeof place.placeId !== 'string' ||
    typeof place.displayName !== 'string' ||
    typeof place.lat !== 'number' ||
    typeof place.lng !== 'number'
  ) {
    throw new Error(`Missing or invalid Place object: ${fieldName}`);
  }
}

// Utility to get Place result from <gmpx-placeautocomplete>
async function getPlaceData(elementRef) {
  const node = elementRef?.current?.querySelector('gmpx-placeautocomplete');
  if (!node || !node.value) throw new Error('Place not selected');

  const placePrediction = node.value;
  const place = placePrediction.toPlace();
  await place.fetchFields({ fields: ['id', 'displayName', 'location'] });

  return {
    placeId: place.id,
    displayName: place.displayName?.text || '',
    lat: place.location?.latitude,
    lng: place.location?.longitude,
  };
}

export default async function submitBooking({
  tripType,
  sourceRef,
  destinationRef,
  date,
  returnDate,
  returnDistance,
  vehicleType,
  cost,
  distance,
  duration,
  name,
  phone,
  userId,
  userEmail,
}) {
  try {
    const source = await getPlaceData(sourceRef);
    const destination = await getPlaceData(destinationRef);

    validatePlace(source, 'source');
    validatePlace(destination, 'destination');

    const bookingsRef = collection(db, 'bookings');

    // Prevent duplicate bookings
    const q = query(
      bookingsRef,
      where('phone', '==', phone),
      where('date', '==', date),
      where('source.displayName', '==', source.displayName),
      where('destination.displayName', '==', destination.displayName)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error('Booking already exists for this trip.');
    }

    const newBooking = {
      tripType,
      source: {
        placeId: source.placeId,
        displayName: source.displayName,
        latitude: source.lat,
        longitude: source.lng,
      },
      destination: {
        placeId: destination.placeId,
        displayName: destination.displayName,
        latitude: destination.lat,
        longitude: destination.lng,
      },
      date,
      returnDate: tripType === 'round' ? returnDate : null,
      returnDistance: tripType === 'round' ? returnDistance : null,
      vehicleType,
      cost,
      distance,
      duration,
      name,
      phone,
      userId,
      userEmail,
      createdAt: serverTimestamp(),
      status: 'pending',
    };

    await addDoc(bookingsRef, newBooking);
  } catch (error) {
    console.error('❌ submitBooking error:', error.message);
    throw error;
  }
}
