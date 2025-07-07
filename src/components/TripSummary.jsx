import React from 'react';

const formatRupees = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

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
    <section
      className="p-4 mt-4 text-black bg-white shadow rounded-xl"
      aria-label="Trip Summary"
    >
      <h3 className="mb-2 text-lg font-bold">Trip Summary</h3>

      <ul className="space-y-1 text-sm">
        <li>
          <span className="font-medium">Trip Type:</span>{' '}
          <strong className="capitalize">{tripType}</strong>
        </li>

        <li>
          <span className="font-medium">Estimated Distance:</span>{' '}
          <strong>
            {distance} km
            {tripType === 'round' && returnDistance
              ? ` + ${returnDistance} km (return)`
              : ''}
          </strong>{' '}
          <span className="text-xs italic text-gray-600">(may vary)</span>
        </li>

        <li>
          <span className="font-medium">Estimated Duration:</span>{' '}
          <strong>
            {hours > 0 ? `${hours}h ` : ''}
            {minutes}m
          </strong>{' '}
          <span className="text-xs italic text-gray-600">(may vary)</span>
        </li>

        <li>
          <span className="font-medium">Estimated Cost:</span>{' '}
          <strong>{formatRupees(cost)}</strong>{' '}
          <span className="text-xs italic text-gray-600">(May vary)</span>
        </li>

        <li>
          <span className="font-medium">Driver Bata:</span>{' '}
          <strong>₹400/day</strong>{' '}
          <span className="text-xs italic text-gray-600">
            (not included in cost) extra*
          </span>
        </li>
      </ul>

      <p className="mt-3 text-xs italic font-semibold text-red-700">
        * Toll, Parking, Permit & Hill Charges are not included.
      </p>
    </section>
  );
};

export default TripSummary;
