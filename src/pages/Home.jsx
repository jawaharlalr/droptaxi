// Home.jsx

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BookingForm from '../components/BookingForm';
import {
  Car,
  ClipboardList,
  PhoneCall,
  CheckCircle,
  Quote,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../utils/firebase';

function Home() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(6));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data());
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < reviews.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('taxi.jpg')" }}
    >
      <div className="min-h-screen bg-black/70">

        {/* Hero Section */}
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-3xl p-6 mx-auto bg-black/80 rounded-xl sm:p-10"
          >
            <h1 className="mb-6 text-3xl font-extrabold text-yellow-300 sm:text-5xl drop-shadow-lg">
              Welcome to Pranav Drop Taxi
            </h1>
            <p className="mb-6 text-base text-gray-100 sm:text-xl">
              Book your ride easily and travel comfortably with us!
            </p>
            <a
              href="#booking"
              className="inline-block px-6 py-3 font-bold text-black transition bg-yellow-400 rounded-full shadow hover:bg-yellow-300 sm:px-8 sm:py-3"
            >
              Book Now
            </a>
          </motion.div>
        </div>

        {/* Booking Section */}
        <section id="booking" className="px-4 py-16 sm:py-20">
          <div className="max-w-4xl p-6 mx-auto shadow-lg bg-black/80 rounded-xl sm:p-10">
            <h2 className="mb-6 text-3xl font-bold text-center text-yellow-300 sm:text-4xl">
              Book Your Ride
            </h2>
            <BookingForm />
          </div>
        </section>

        {/* How It Works */}
        <section className="px-4 py-16 text-white sm:py-20">
          <h2 className="mb-10 text-3xl font-bold text-center sm:text-4xl">How It Works</h2>
          <div className="grid max-w-6xl gap-8 mx-auto sm:grid-cols-3">
            {[
              { Icon: Car, title: 'Choose Your Ride', description: 'Select from a range of clean and comfortable vehicles.' },
              { Icon: ClipboardList, title: 'Enter Trip Details', description: 'Fill in pickup and drop locations, trip type, and schedule.' },
              { Icon: CheckCircle, title: 'Confirm & Go', description: 'Get instant confirmation and ride stress-free.' },
            ].map(({ Icon, title, description }, idx) => (
              <div key={idx} className="text-center transition hover:text-yellow-300">
                <Icon className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-sm sm:text-base">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="px-4 py-16 text-white sm:py-20">
          <h2 className="mb-10 text-3xl font-bold text-center sm:text-4xl">Why Choose Pran Drop Taxi?</h2>
          <div className="grid max-w-6xl gap-8 mx-auto sm:grid-cols-3">
            {[
              { Icon: Car, title: 'Reliable Rides', description: 'On-time pickups and clean vehicles ensure smooth travel.' },
              { Icon: ClipboardList, title: 'Transparent Pricing', description: 'No hidden fees. Know your fare upfront.' },
              { Icon: PhoneCall, title: '24/7 Support', description: 'Always here to help before, during, and after your trip.' },
            ].map(({ Icon, title, description }, idx) => (
              <div key={idx} className="text-center transition hover:text-yellow-300">
                <Icon className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p className="text-sm sm:text-base">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="px-4 py-16 text-white sm:py-20">
          <h2 className="mb-10 text-3xl font-bold text-center text-yellow-300 sm:text-4xl">
            What Our Customers Say
          </h2>

          {loading ? (
            <p className="text-center text-gray-300">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-300">No reviews yet.</p>
          ) : (
            <div className="relative flex flex-col items-center max-w-6xl mx-auto">
              {/* Mobile Top Arrows */}
              <div className="flex items-center justify-between w-full mb-4 sm:hidden">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-2 text-yellow-300 rounded-full hover:bg-yellow-300/20 disabled:opacity-30"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= reviews.length - 1}
                  className="p-2 text-yellow-300 rounded-full hover:bg-yellow-300/20 disabled:opacity-30"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              <div className="relative flex items-center justify-center w-full">
                {/* Left Arrow for desktop */}
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-0 z-10 hidden p-3 text-yellow-300 rounded-full sm:block hover:bg-yellow-300/20 disabled:opacity-30"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                {/* Review Slide */}
                <div className="w-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ x: direction > 0 ? 150 : -150, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: direction > 0 ? -150 : 150, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center"
                    >
                      {reviews
                        .slice(currentIndex, currentIndex + (isMobile ? 1 : 2))
                        .map((review, idx) => (
                          <blockquote
                            key={idx}
                            className="w-full max-w-sm p-6 mx-4 border border-yellow-400 rounded-lg bg-black/20"
                          >
                            <Quote className="w-5 h-5 mb-2 text-yellow-400" />
                            <p className="text-base italic text-gray-100">
                              "{review.review || 'No review text'}"
                            </p>
                            <footer className="mt-4 text-sm font-semibold text-yellow-300">
                              – {review.name || 'Anonymous'}
                            </footer>
                          </blockquote>
                        ))}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Right Arrow for desktop */}
                <button
                  onClick={handleNext}
                  disabled={currentIndex >= reviews.length - (isMobile ? 1 : 2)}
                  className="absolute right-0 z-10 hidden p-3 text-yellow-300 rounded-full sm:block hover:bg-yellow-300/20 disabled:opacity-30"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Home;