import React, { useEffect, useState, useCallback } from "react";
import { db } from "../utils/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../utils/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const vehicleLabels = {
  sedan: "Sedan (4+1 Seater)",
  muv: "MUV (7+1 Seater)",
  innova: "Innova (7+1 Seater)",
};

const getDays = (start, end) => {
  const s = new Date(start);
  const e = end ? new Date(end) : s;
  const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff + 1 : 1;
};

const MyBookings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState("");

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const bookingQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );
      const bookingSnap = await getDocs(bookingQuery);
      const bookingsData = bookingSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        tempReview: "",
        review: "", // default
      }));

      const reviewQuery = query(
        collection(db, "reviews"),
        where("userId", "==", user.uid)
      );
      const reviewSnap = await getDocs(reviewQuery);
      const reviewMap = {};
      reviewSnap.docs.forEach((doc) => {
        const r = doc.data();
        if (r.bookingId) {
          reviewMap[r.bookingId] = r.review;
        }
      });

      const merged = bookingsData.map((b) => ({
        ...b,
        review: reviewMap[b.id] || "",
      }));

      setBookings(merged);
    } catch (err) {
      console.error("Error fetching bookings:", err.message || err);
      setError("❌ Failed to load bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchBookings();
  }, [user, fetchBookings]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toNum = (val) => (typeof val === "number" ? val : parseFloat(val) || 0);

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = Math.round(minutes % 60);
    return `${h}h ${m}m`;
  };

  const getStatusTag = (status) => {
    const base = "text-xs px-2 py-1 rounded-full font-medium";
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return (
          <span className={`${base} bg-green-600 text-white`}>Confirmed</span>
        );
      case "completed":
        return (
          <span className={`${base} bg-blue-600 text-white`}>Completed</span>
        );
      case "cancelled":
        return (
          <span className={`${base} bg-red-600 text-white`}>Cancelled</span>
        );
      default:
        return (
          <span className={`${base} bg-yellow-500 text-white`}>Pending</span>
        );
    }
  };

  const handleReviewSubmit = async (bookingId, reviewText) => {
    if (!reviewText.trim()) return alert("Please enter a valid review.");

    try {
      const reviewQuery = query(
        collection(db, "reviews"),
        where("bookingId", "==", bookingId),
        where("userId", "==", user.uid)
      );
      const reviewSnap = await getDocs(reviewQuery);
      if (!reviewSnap.empty) {
        alert("❗ You have already submitted a review for this booking.");
        return;
      }

      await addDoc(collection(db, "reviews"), {
        bookingId,
        userId: user.uid,
        name: user.displayName || "Anonymous",
        review: reviewText.trim(),
        createdAt: serverTimestamp(),
      });

      await fetchBookings();
      alert("✅ Review submitted. Thank you!");
    } catch (error) {
      console.error("Error submitting review:", error.message || error);
      alert("❌ Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen text-white bg-gradient-to-br from-black via-gray-900 to-black">
      <div
        className="absolute inset-0 bg-center bg-cover blur-sm brightness-75"
        style={{ backgroundImage: "url('/images/taxi.jpg')" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-5xl px-4 py-10 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-yellow-300">Your Bookings</h2>
          <Link
            to="/"
            className="px-4 py-2 text-black transition bg-yellow-300 rounded hover:bg-yellow-400"
          >
            Home
          </Link>
        </div>

        {error && <p className="text-center text-red-400">{error}</p>}

        {loading ? (
          <p className="text-center text-gray-300">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-400">No bookings found.</p>
        ) : (
          <ul className="space-y-6">
            {bookings.map((booking, index) => {
              const {
                id,
                bookingId,
                status,
                tripType,
                source,
                destination,
                date,
                returnDate,
                vehicleType,
                distance,
                duration,
                cost,
                tollCharges,
                parkingCharges,
                hillCharges,
                permitCharges,
                review,
                tempReview = "",
              } = booking;

              const toll = toNum(tollCharges);
              const parking = toNum(parkingCharges);
              const hill = toNum(hillCharges);
              const permit = toNum(permitCharges);
              const base = toNum(cost);
              const isRound = (tripType || "").toLowerCase() === "round";
              const days = getDays(date, isRound ? returnDate : date);
              const bata = days * 400;
              const total = base + bata + toll + parking + hill + permit;
              const isExpanded = expandedId === id;

              return (
                <li
                  key={id}
                  className="relative p-4 text-white border border-yellow-500 rounded-lg shadow-lg bg-black/70 backdrop-blur-md"
                >
                  {/* Top Row: Booking ID + Right Column */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-yellow-300">
                          {index + 1}.
                        </span>
                        <h3 className="text-base font-semibold break-all sm:text-lg">
                          Booking ID: {bookingId || id}
                        </h3>
                      </div>
                    </div>

                    <div className="text-right">
                      {/* Status Tag (Right aligned) */}
                      <div className="mb-1">{getStatusTag(status)}</div>

                      {/* Expand/Collapse Button (Right aligned) */}
                      <button
                        onClick={() => toggleExpand(id)}
                        className="text-sm text-yellow-400 hover:underline"
                      >
                        {isExpanded ? "Collapse" : "Expand"}
                      </button>
                    </div>
                  </div>

                  {/* From → To */}
                  <p className="mt-2 text-sm">
                    <strong>From:</strong> {source?.displayName || "N/A"}{" "}
                    <span className="mx-1">🡺</span>
                    <strong>To:</strong> {destination?.displayName || "N/A"}
                  </p>

                  {/* Cost */}
                  <p className="flex items-center gap-2 mt-2 text-sm font-semibold text-yellow-300">
                    Total Cost: ₹{total}
                    {status?.toLowerCase() === "completed" ? (
                      <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-md">
                        Paid
                      </span>
                    ) : (
                      <span className="text-xs italic text-gray-400">
                        (Estimated)
                      </span>
                    )}
                  </p>

                  {isExpanded && (
                    <div className="grid grid-cols-1 gap-4 p-4 mt-4 text-xs text-white border border-gray-600 rounded-lg bg-black/90 sm:text-sm md:grid-cols-2">
                      {/* Left Column */}
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold text-gray-300">
                            Trip Type:
                          </span>{" "}
                          <span>{isRound ? "Round Trip" : "Single Trip"}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-300">
                            Date:
                          </span>{" "}
                          <span>{date || "N/A"}</span>
                        </p>
                        {isRound && returnDate && (
                          <p>
                            <span className="font-semibold text-gray-300">
                              Return Date:
                            </span>{" "}
                            <span>{returnDate}</span>
                          </p>
                        )}
                        <p>
                          <span className="font-semibold text-gray-300">
                            Vehicle:
                          </span>{" "}
                          <span>
                            {vehicleLabels[vehicleType] || vehicleType || "N/A"}
                          </span>
                        </p>
                        {distance && (
                          <p>
                            <span className="font-semibold text-gray-300">
                              Distance:
                            </span>{" "}
                            <span>
                              {distance} km{" "}
                              {status?.toLowerCase() !== "completed" && (
                                <span className="text-gray-500">
                                  (Estimated)
                                </span>
                              )}
                            </span>
                          </p>
                        )}
                        {duration && (
                          <p>
                            <span className="font-semibold text-gray-300">
                              Duration:
                            </span>{" "}
                            <span>
                              {formatDuration(duration)}{" "}
                              {status?.toLowerCase() !== "completed" && (
                                <span className="text-gray-500">
                                  (Estimated)
                                </span>
                              )}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="space-y-2">
                        <p>
                          <span className="font-semibold text-gray-300">
                            Base Fare:
                          </span>{" "}
                          <span>₹{base}</span>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-300">
                            Driver Bata:
                          </span>{" "}
                          <span>
                            ₹400 × {days} day(s) = ₹{bata}
                          </span>
                        </p>
                        {isRound && returnDate && toll > 0 && (
                          <p>
                            <span className="font-semibold text-gray-300">
                              Toll Charges:
                            </span>{" "}
                            <span>₹{toll}</span>
                          </p>
                        )}
                        {parking > 0 && (
                          <p>
                            <span className="font-semibold text-gray-300">
                              Parking Charges:
                            </span>{" "}
                            <span>₹{parking}</span>
                          </p>
                        )}
                        {hill > 0 && (
                          <p>
                            <span className="font-semibold text-gray-300">
                              Hill Charges:
                            </span>{" "}
                            <span>₹{hill}</span>
                          </p>
                        )}
                        {permit > 0 && (
                          <p>
                            <span className="font-semibold text-gray-300">
                              Permit Charges:
                            </span>{" "}
                            <span>₹{permit}</span>
                          </p>
                        )}
                        <p className="pt-1 italic text-yellow-400">
                          Final fare may vary based on actual trip.
                        </p>
                        <p className="italic font-medium text-gray-400">
                          {status?.toLowerCase() === "completed"
                            ? "* Charges are included above."
                            : "* Additional charges not yet included."}
                        </p>
                      </div>

                      {/* Review Display */}
                      {status?.toLowerCase() === "completed" && review && (
                        <div className="col-span-1 mt-2 md:col-span-2">
                          <p className="mb-1 text-sm font-semibold text-yellow-300">
                            Your Review:
                          </p>
                          <p className="p-2 text-xs italic text-gray-300 bg-gray-800 rounded sm:text-sm">
                            {review}
                          </p>
                        </div>
                      )}

                      {/* Review Form */}
                      {status?.toLowerCase() === "completed" &&
                        (!review || review === "") && (
                          <div className="col-span-1 mt-2 md:col-span-2">
                            <p className="mb-1 text-sm font-semibold text-yellow-300">
                              Rate Your Trip:
                            </p>
                            <textarea
                              rows={3}
                              className="w-full p-2 text-sm text-black rounded-md"
                              placeholder="Write your review here..."
                              value={tempReview}
                              onChange={(e) => {
                                const updated = bookings.map((b) =>
                                  b.id === id
                                    ? { ...b, tempReview: e.target.value }
                                    : b
                                );
                                setBookings(updated);
                              }}
                            />
                            <button
                              onClick={() => handleReviewSubmit(id, tempReview)}
                              className="px-4 py-2 mt-2 text-sm text-black bg-yellow-300 rounded hover:bg-yellow-400"
                            >
                              Submit Review
                            </button>
                          </div>
                        )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
