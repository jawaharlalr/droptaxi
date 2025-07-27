import React from 'react';
import clsx from 'clsx'; // If not already installed: npm install clsx

const TripTypeSelector = ({ tripType, setTripType }) => {
  return (
    <div className="flex gap-3">
      {['oneway', 'roundtrip'].map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => setTripType(type)}
          className={clsx(
            'px-4 py-2 rounded-md font-medium text-sm transition border',
            tripType === type
              ? 'bg-yellow-400 text-black border-yellow-400'
              : 'bg-gray-800 text-white border-gray-600 hover:border-yellow-400'
          )}
        >
          {type === 'oneway' ? 'One Way' : 'Round Trip'}
        </button>
      ))}
    </div>
  );
};

export default TripTypeSelector;
