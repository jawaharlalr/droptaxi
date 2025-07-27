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

function extractPlaceDetails(place) {
  const formattedAddress = place?.formattedAddress || '';
  const displayName = place?.displayName || '';
  const fullAddress = displayName && formattedAddress
    ? `${displayName}, ${formattedAddress}`
    : formattedAddress || displayName;

  return {
    formattedAddress,
    displayName,
    fullAddress,
    placeId: place?.id || place?.placeId || '',
    location: {
      lat: typeof place?.location?.lat === "function"
        ? place.location.lat()
        : place?.location?.lat ?? null,
      lng: typeof place?.location?.lng === "function"
        ? place.location.lng()
        : place?.location?.lng ?? null,
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
    fullAddress: sourceAddress,
    location: { lat: sourceLat, lng: sourceLng },
  } = extractedSource;
  const {
    fullAddress: destinationAddress,
    location: { lat: destLat, lng: destLng },
  } = extractedDestination;

  if (
    !sourceAddress || !destinationAddress ||
    typeof sourceLat !== "number" || typeof sourceLng !== "number" ||
    typeof destLat !== "number" || typeof destLng !== "number"
  ) {
    throw new Error("Incomplete or invalid source/destination location.");
  }

  const bookingQuery = query(
    collection(db, "bookings"),
    where("phone", "==", phone),
    where("date", "==", date),
    where("source.fullAddress", "==", sourceAddress),
    where("destination.fullAddress", "==", destinationAddress)
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
    userId: userId || null,
    userEmail: userEmail || null,
    status: "pending",
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "bookings"), bookingEntry);
  return bookingId; // ✅ return bookingId to show in toast
}
