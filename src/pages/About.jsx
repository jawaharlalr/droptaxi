import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  ShieldCheck,
  Clock,
  Globe2,
  PhoneCall,
  UserCheck,
  Home,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f] text-white">
      {/* Top Row with Home Button */}
      <div className="flex justify-end px-4 pt-6 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black transition bg-yellow-400 rounded-full hover:bg-yellow-300"
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-4 py-12 mx-auto max-w-7xl">
        {/* About Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-3xl font-bold text-yellow-400 sm:text-4xl">
            About Pranav Drop Taxi
          </h1>
          <p className="max-w-3xl mx-auto text-base text-gray-300 sm:text-lg">
            At <span className="font-semibold text-white">Pranav Drop Taxi</span>, we provide safe, reliable, and affordable taxi services across Tamil Nadu and beyond. Whether you're booking a one-way ride or a round-trip, we make travel seamless with punctual drivers and well-maintained vehicles.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
        >
          {[
            {
              icon: <Car className="w-8 h-8 text-yellow-400" />,
              title: "Comfortable Rides",
              desc: "Clean and well-maintained vehicles for a smooth journey.",
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-yellow-400" />,
              title: "Safety First",
              desc: "Trusted drivers with verified backgrounds and safe driving.",
            },
            {
              icon: <Clock className="w-8 h-8 text-yellow-400" />,
              title: "On-Time Pickup",
              desc: "Punctual pickups every time. Your time matters.",
            },
            {
              icon: <PhoneCall className="w-8 h-8 text-yellow-400" />,
              title: "24/7 Support",
              desc: "We’re here to assist you anytime, anywhere.",
            },
            {
              icon: <Globe2 className="w-8 h-8 text-yellow-400" />,
              title: "Wide Coverage",
              desc: "We cover major cities, towns, and districts across South India.",
            },
            {
              icon: <UserCheck className="w-8 h-8 text-yellow-400" />,
              title: "Easy Booking",
              desc: "Book online in minutes — no hassle, no delays.",
            },
          ].map(({ icon, title, desc }, i) => (
            <motion.div
              key={i}
              className="p-6 transition duration-300 shadow-lg rounded-xl bg-black/30 backdrop-blur-md hover:shadow-yellow-500/20"
              whileHover={{ scale: 1.03 }}
            >
              <div className="mb-4">{icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-white sm:text-xl">{title}</h3>
              <p className="text-sm text-gray-300">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="mb-4 text-2xl font-bold text-yellow-400 sm:text-3xl">
            Why Choose Us?
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-gray-300 sm:text-base">
            We’ve helped countless customers reach their destinations safely and comfortably. Whether you're traveling for business or leisure, Pranav Drop Taxi is your go-to ride.
          </p>
        </motion.div>

        {/* Back to Top Button (Inline) */}
        {showTopButton && (
          <div className="mt-12 text-center">
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black transition bg-yellow-400 rounded-full hover:bg-yellow-300"
            >
              <ChevronUp className="w-4 h-4" />
              Back to Top
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
}
