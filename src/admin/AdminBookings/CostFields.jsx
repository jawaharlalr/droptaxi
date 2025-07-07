import React from 'react';

const CostFields = ({ b, v, setEditValues }) => {
  const inputCls = `w-full border px-2 py-1 rounded text-xs`;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <label className="text-xs">
        <span className="block mb-0.5">Distance (km)</span>
        <input
          type="number"
          value={v.distance}
          onChange={(e) =>
            setEditValues((prev) => ({
              ...prev,
              [b.id]: { ...prev[b.id], distance: e.target.value },
            }))
          }
          className={inputCls}
          min="0"
          disabled={b.status === 'completed'}
        />
      </label>

      <label className="col-span-2 text-xs md:col-span-2">
        <span className="block mb-0.5">Duration</span>
        <div className="flex gap-2">
          <input
            type="number"
            value={Math.floor((+v.duration || 0) / 60)}
            onChange={(e) => {
              const hrs = +e.target.value;
              const mins = (+v.duration || 0) % 60;
              const total = hrs * 60 + mins;
              setEditValues((prev) => ({
                ...prev,
                [b.id]: { ...prev[b.id], duration: total },
              }));
            }}
            className={inputCls}
            min="0"
            disabled={b.status === 'completed'}
          />
          <span className="self-center text-xs">hrs</span>
          <input
            type="number"
            value={(+v.duration || 0) % 60}
            onChange={(e) => {
              const mins = +e.target.value;
              const hrs = Math.floor((+v.duration || 0) / 60);
              const total = hrs * 60 + mins;
              setEditValues((prev) => ({
                ...prev,
                [b.id]: { ...prev[b.id], duration: total },
              }));
            }}
            className={inputCls}
            min="0"
            max="59"
            disabled={b.status === 'completed'}
          />
          <span className="self-center text-xs">mins</span>
        </div>
      </label>

      {['cost', 'toll', 'parking', 'hill', 'permit'].map((key) => (
        <label key={key} className="text-xs">
          <span className="block mb-0.5">{key[0].toUpperCase() + key.slice(1)} ₹</span>
          <input
            type="number"
            value={v[key]}
            onChange={(e) =>
              setEditValues((prev) => ({
                ...prev,
                [b.id]: { ...prev[b.id], [key]: e.target.value },
              }))
            }
            className={inputCls}
            min="0"
            disabled={b.status === 'completed'}
          />
        </label>
      ))}
    </div>
  );
};

export default CostFields;
