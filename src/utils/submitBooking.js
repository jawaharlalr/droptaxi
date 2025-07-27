import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateBookingId } from "../utils/generateBookingId";

/**
 * Safely extracts and flattens place details from the Google Places API (New).
 * 
 * @param {Object} place - Place object returned from <gmpx-placeautocomplete>
 * @returns {Object} - Flattened and serializable place info
 */
function extractPlaceDetails(place) {
  return {
    displayName: place.displayName || '',
    formattedAddress: place.formattedAddress || '',
    placeId: place.id || '',
    location: {
      lat: typeof place?.location?.lat === 'function' ? place.location.lat() : null,
      lng: typeof place?.location?.lng === 'function' ? place.location.lng() : null,
    },
    addressComponents: place?.addressComponents || [],
    types: place?.types || [],
    plusCode: place?.plusCode || null,
    businessStatus: place?.businessStatus || null,
  };
}

export default async function submitBooking(data) {
  const {
    tripType,
    date,
    returnDate,
    source,
    destination,
    vehicleType,
    cost,
    distance,
    duration,
    name,
    phone,
    userId,
    userEmail,
  } = data;

  if (!source || !destination) {
    throw new Error("Source or destination not provided.");
  }

  const extractedSource = extractPlaceDetails(source);
  const extractedDestination = extractPlaceDetails(destination);

  const {
    displayName: sourceDisplayName,
    location: { lat: sourceLat, lng: sourceLng },
  } = extractedSource;
  const {
    displayName: destinationDisplayName,
    location: { lat: destLat, lng: destLng },
  } = extractedDestination;

  if (
    !sourceDisplayName || !destinationDisplayName ||
    typeof sourceLat !== "number" || typeof sourceLng !== "number" ||
    typeof destLat !== "number" || typeof destLng !== "number"
  ) {
    throw new Error("Incomplete or invalid source/destination location.");
  }

  const bookingQuery = query(
    collection(db, "bookings"),
    where("phone", "==", phone),
    where("date", "==", date),
    where("source.displayName", "==", sourceDisplayName),
    where("destination.displayName", "==", destinationDisplayName)
  );

  const existing = await getDocs(bookingQuery);
  if (!existing.empty) {
    throw new Error("Booking already exists for these details.");
  }

  const bookingId = generateBookingId(name, phone);

  const bookingEntry = {
    bookingId,
    tripType,
    date,
    returnDate: tripType === "round" ? returnDate : null,
    source: extractedSource,
    destination: extractedDestination,
    vehicleType,
    cost,
    distance,
    duration,
    name,
    phone,
    userId,
    userEmail,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "bookings"), bookingEntry);
}
