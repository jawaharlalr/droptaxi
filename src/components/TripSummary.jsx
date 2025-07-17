import React from 'react';
import { motion } from 'framer-motion';
import {
  Car,
  Timer,
  RefreshCw,
  UserCheck,
  BadgeIndianRupee,
} from 'lucide-react';

const formatRupees = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TripSummary = ({
  distance,
  duration,
  cost,
  tripType,
  returnDistance,
}) => {
  if (!distance || !duration || !cost) return null;

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  return (
    <motion.section
      className="p-4 mt-4 text-black bg-white shadow rounded-xl"
      aria-label="Trip Summary"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ duration: 0.5 }}
    >
      <h3 className="mb-4 text-lg font-bold">Trip Summary</h3>

      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2">
          <RefreshCw className="w-4 h-4 text-black" />
          <span>
            <span className="font-medium transition hover:text-gray-700">
              Trip Type:
            </span>{' '}
            <strong className="capitalize">{tripType}</strong>
            {tripType === 'round' && (
              <span className="ml-1 text-xs italic text-gray-600">
                (distance, time & cost shown for one-way)
              </span>
            )}
          </span>
        </li>

        <li className="flex items-start gap-2">
          <Car className="w-4 h-4 text-black" />
          <span>
            <span className="font-medium transition hover:text-gray-700">
              Distance:
            </span>{' '}
            <strong>
              {distance} km
              {tripType === 'round' && returnDistance
                ? ` + ${returnDistance} km (return)`
                : ''}
            </strong>{' '}
            <span className="text-xs italic text-gray-600">(may vary)</span>
          </span>
        </li>

        <li className="flex items-start gap-2">
          <Timer className="w-4 h-4 text-black" />
          <span>
            <span className="font-medium transition hover:text-gray-700">
              Duration:
            </span>{' '}
            <strong>
              {hours > 0 ? `${hours}h ` : ''}
              {minutes}m
            </strong>{' '}
            <span className="text-xs italic text-gray-600">(may vary)</span>
          </span>
        </li>

        <li className="flex items-start gap-2">
          <BadgeIndianRupee className="w-4 h-4 text-black" />
          <span>
            <span className="font-medium transition hover:text-gray-700">
              Cost:
            </span>{' '}
            <strong>{formatRupees(cost)}</strong>{' '}
            <span className="text-xs italic text-gray-600">(may vary)</span>
          </span>
        </li>

        <li className="flex items-start gap-2">
          <UserCheck className="w-4 h-4 text-black" />
          <span>
            <span className="font-medium transition hover:text-gray-700">
              Driver Bata:
            </span>{' '}
            <strong>₹400/day</strong>{' '}
            <span className="text-xs italic text-gray-600">
              (not included in cost) (extra*)
            </span>
          </span>
        </li>
      </ul>

      <p className="mt-4 text-xs italic font-semibold text-red-700">
        * Toll, Parking, Permit & Hill Charges are not included.
      </p>
    </motion.section>
  );
};

export default TripSummary;
