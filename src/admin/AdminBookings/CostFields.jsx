import React from 'react';

const CostFields = ({ b, v, setEditValues }) => {
  // ✅ Force inputs to always have black text on white background
  const inputCls =
    "w-full border px-2 py-1 rounded text-xs text-black bg-white focus:outline-none focus:ring-2 focus:ring-yellow-500";

  const isDisabled = b.status === 'completed';

  const handleInputChange = (field, value) => {
    setEditValues((prev) => ({
      ...prev,
      [b.id]: { ...prev[b.id], [field]: value },
    }));
  };

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {/* Distance */}
      <label className="text-xs">
        <span className="block mb-0.5 font-medium">Distance (km)</span>
        <input
          type="number"
          value={v.distance || ''}
          onChange={(e) => handleInputChange('distance', e.target.value)}
          className={inputCls}
          min="0"
          disabled={isDisabled}
        />
      </label>

      {/* Duration */}
      <label className="col-span-2 text-xs md:col-span-2">
        <span className="block mb-0.5 font-medium">Duration</span>
        <div className="flex gap-2">
          {/* Hours */}
          <input
            type="number"
            value={Math.floor((+v.duration || 0) / 60)}
            onChange={(e) => {
              const hrs = +e.target.value;
              const mins = (+v.duration || 0) % 60;
              handleInputChange('duration', hrs * 60 + mins);
            }}
            className={inputCls}
            min="0"
            disabled={isDisabled}
          />
          <span className="self-center text-xs">hrs</span>

          {/* Minutes */}
          <input
            type="number"
            value={(+v.duration || 0) % 60}
            onChange={(e) => {
              const mins = +e.target.value;
              const hrs = Math.floor((+v.duration || 0) / 60);
              handleInputChange('duration', hrs * 60 + mins);
            }}
            className={inputCls}
            min="0"
            max="59"
            disabled={isDisabled}
          />
          <span className="self-center text-xs">mins</span>
        </div>
      </label>

      {/* Cost breakdown fields */}
      {['cost', 'toll', 'parking', 'hill', 'permit'].map((key) => (
        <label key={key} className="text-xs">
          <span className="block mb-0.5 font-medium capitalize">{key} ₹</span>
          <input
            type="number"
            value={v[key] || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className={inputCls}
            min="0"
            disabled={isDisabled}
          />
        </label>
      ))}
    </div>
  );
};

export default CostFields;
