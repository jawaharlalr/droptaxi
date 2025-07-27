import React from "react";
import { motion } from "framer-motion";
import {
  Car,
  ShieldCheck,
  Clock,
  Globe2,
  PhoneCall,
  UserCheck,
} from "lucide-react";

export default function AboutUs() {
  return (
    // Full-page background wrapper
    <div className="bg-[#0f0f0f] min-h-screen w-full text-white">
      <div className="px-4 py-12 pt-24 mx-auto max-w-7xl">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-yellow-400">
            About Pranav Drop Taxi
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-300">
            At <span className="font-semibold text-white">Pranav Drop Taxi</span>,
            we provide safe, reliable, and affordable taxi services across Tamil
            Nadu and beyond. Whether you're booking a one-way ride or a
            round-trip, we make travel seamless with punctual drivers and
            well-maintained vehicles.
          </p>
        </motion.div>

        {/* Features */}
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
              className="p-6 transition-shadow duration-300 shadow-lg bg-black/30 backdrop-blur-md rounded-xl hover:shadow-yellow-500/20"
              whileHover={{ scale: 1.03 }}
            >
              <div className="mb-4">{icon}</div>
              <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm text-gray-300">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Service Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-yellow-400">
            Why Choose Us?
          </h2>
          <p className="max-w-2xl mx-auto text-gray-300">
            We’ve helped thousands of customers reach their destinations safely
            and comfortably. Whether you're traveling for business or leisure,
            Pranav Drop Taxi is your go-to ride.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
