import React from 'react';
import clsx from 'clsx'; // Make sure clsx is installed: npm install clsx

const vehicleOptions = [
  {
    type: 'sedan',
    label: 'Sedan (4+1)',
    image: '/images/sedan.png',
    pricing: { oneway: 14, roundtrip: 13 },
    minKm: { oneway: 250, roundtrip: 150 },
  },
  {
    type: 'muv',
    label: 'MUV (7+1)',
    image: '/images/muv.png',
    pricing: { oneway: 18, roundtrip: 17 },
    minKm: { oneway: 250, roundtrip: 150 },
  },
  {
    type: 'innova',
    label: 'Innova (7+1)',
    image: '/images/innova.png',
    pricing: { oneway: 19, roundtrip: 18 },
    minKm: { oneway: 250, roundtrip: 150 },
  },
];

const VehicleSelector = ({ vehicleType, setVehicleType, tripType }) => {
  return (
    <div className="grid sm:grid-cols-3 gap-3">
      {vehicleOptions.map((v) => {
        const isSelected = vehicleType === v.type;
        const rate = v.pricing[tripType] ?? v.pricing.oneway;
        const minKm = v.minKm[tripType] ?? v.minKm.oneway;

        return (
          <div
            key={v.type}
            onClick={() => setVehicleType(v.type)}
            className={clsx(
              'cursor-pointer border rounded-md p-3 bg-gray-800 text-white transition hover:shadow-md text-center',
              isSelected ? 'border-yellow-400 ring-2 ring-yellow-400' : 'border-gray-700'
            )}
          >
            <img
              src={v.image}
              alt={v.label}
              className="h-16 max-w-[80px] mx-auto object-contain mb-2"
            />
            <h3 className="text-base font-semibold mb-1 text-yellow-300">
              {v.label}
            </h3>
            <p className="text-sm text-gray-300 mb-1">
              ₹{rate}/km ({tripType === 'roundtrip' ? 'Round Trip' : 'One Way'})
            </p>
            <p className="text-xs text-gray-400">Min {minKm} km</p>
          </div>
        );
      })}
    </div>
  );
};

export default VehicleSelector;
