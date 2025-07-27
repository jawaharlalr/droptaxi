import React from 'react';
import { motion } from 'framer-motion';
import BookingForm from '../components/BookingForm';
import { Car, ClipboardList, PhoneCall, CheckCircle } from 'lucide-react';

function Home() {
  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('taxi.jpg')" }}
    >
      <div className="min-h-screen bg-black/70">

        {/* 🟡 Hero Section */}
        <div className="flex items-center justify-center min-h-screen px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl p-8 mx-auto shadow-xl bg-black/80 sm:p-10 rounded-xl"
          >
            <h1 className="mb-6 text-4xl font-extrabold text-yellow-300 sm:text-5xl drop-shadow-lg">
              Welcome to DropTaxi
            </h1>
            <p className="mb-6 text-lg text-gray-100 sm:text-xl">
              Book your ride easily and travel comfortably with us!
            </p>
            <a
              href="#booking"
              className="inline-block px-8 py-3 font-bold text-black transition bg-yellow-400 rounded-full shadow hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              Book Now
            </a>
          </motion.div>
        </div>

        {/* 🟢 Booking Form Section */}
        <section id="booking" className="px-4 py-16">
          <div className="max-w-4xl p-6 mx-auto shadow-lg bg-black/80 sm:p-10 rounded-xl">
            <h2 className="mb-6 text-3xl font-bold text-center text-yellow-300 sm:text-4xl">
              Book Your Ride
            </h2>
            <BookingForm />
          </div>
        </section>

        {/* 🔵 How It Works Section */}
        <section className="px-4 py-16 text-center text-white" aria-label="How it works">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">How It Works</h2>
          <div className="grid max-w-4xl gap-6 mx-auto sm:grid-cols-3">
            {[
              {
                Icon: Car,
                title: 'Choose Your Ride',
                description: 'Select from a range of clean and comfortable vehicles.',
              },
              {
                Icon: ClipboardList,
                title: 'Enter Trip Details',
                description: 'Fill in pickup and drop locations, trip type, and schedule.',
              },
              {
                Icon: CheckCircle,
                title: 'Confirm & Go',
                description: 'Get instant confirmation and ride stress-free.',
              },
            ].map(({ Icon, title, description }, idx) => (
              <div
                key={idx}
                className="p-4 transition rounded-lg hover:text-yellow-300"
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🟣 Why Choose Us Section */}
        <section className="px-4 py-16 text-center text-white" aria-label="Why choose DropTaxi">
          <h2 className="mb-6 text-3xl font-bold sm:text-4xl">Why Choose DropTaxi?</h2>
          <div className="grid max-w-5xl gap-6 mx-auto sm:grid-cols-3">
            {[
              {
                Icon: Car,
                title: 'Reliable Rides',
                description: 'On-time pickups and clean vehicles ensure smooth travel.',
              },
              {
                Icon: ClipboardList,
                title: 'Transparent Pricing',
                description: 'No hidden fees. Know your fare upfront.',
              },
              {
                Icon: PhoneCall,
                title: '24/7 Support',
                description: 'Always here to help before, during, and after your trip.',
              },
            ].map(({ Icon, title, description }, idx) => (
              <div
                key={idx}
                className="p-4 transition rounded-lg hover:text-yellow-300"
              >
                <Icon className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <h3 className="mb-2 text-xl font-semibold">{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🧡 Testimonials Section */}
        <section className="px-4 py-16 text-center text-white" aria-label="Customer testimonials">
          <h2 className="mb-10 text-3xl font-bold sm:text-4xl">Customer Testimonials</h2>
          <div className="grid max-w-5xl gap-8 mx-auto sm:grid-cols-2">
            {[
              {
                quote: '"Smooth booking and polite driver. Will use again!"',
                author: '– Aarthi S.',
              },
              {
                quote: '"Affordable and safe. The car was very clean."',
                author: '– Karthik M.',
              },
            ].map(({ quote, author }, idx) => (
              <blockquote
                key={idx}
                className="p-6 transition rounded-lg shadow bg-black/60 hover:text-yellow-300"
              >
                <p>{quote}</p>
                <footer className="mt-4 text-sm font-semibold">{author}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
