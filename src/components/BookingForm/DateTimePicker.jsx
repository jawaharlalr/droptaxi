import React from 'react';

const DateTimePicker = ({ tripType, date, returnDate, setDate, setReturnDate }) => {
  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Pickup Date */}
      <div className="flex flex-col">
        <label htmlFor="pickup-date" className="text-sm mb-1 text-gray-300">
          Pickup Date
        </label>
        <input
          id="pickup-date"
          type="date"
          min={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      {/* Return Date – only for round trip */}
      {tripType === 'roundtrip' && (
        <div className="flex flex-col">
          <label htmlFor="return-date" className="text-sm mb-1 text-gray-300">
            Return Date
          </label>
          <input
            id="return-date"
            type="date"
            min={date || today} // return date must be after pickup
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            required
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600"
          />
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
