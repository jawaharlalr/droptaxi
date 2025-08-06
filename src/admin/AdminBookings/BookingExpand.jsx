import React from 'react';
import CostFields from './CostFields';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const BookingExpand = ({ b, v, editValues, setEditValues, fetchBookings }) => {
  const toNum = (n) => (+n ? +n : 0);
  const totalCost =
    toNum(v.cost) + toNum(v.toll) + toNum(v.parking) + toNum(v.hill) + toNum(v.permit);

  const isModified = () => {
    return (
      toNum(v.distance) !== toNum(b.distance) ||
      toNum(v.duration) !== toNum(b.duration) ||
      toNum(v.cost) !== toNum(b.cost) ||
      toNum(v.toll) !== toNum(b.tollCharges) ||
      toNum(v.parking) !== toNum(b.parkingCharges) ||
      toNum(v.hill) !== toNum(b.hillCharges) ||
      toNum(v.permit) !== toNum(b.permitCharges)
    );
  };

  const saveCharges = async () => {
    try {
      await updateDoc(doc(db, 'bookings', b.id), {
        distance: +v.distance,
        duration: +v.duration,
        cost: +v.cost,
        tollCharges: +v.toll,
        parkingCharges: +v.parking,
        hillCharges: +v.hill,
        permitCharges: +v.permit,
        totalCost,
      });
    } catch (err) {
      console.error('❌ Failed to update charges in Firestore:', err);
      alert('Failed to save charges.');
      return;
    }

    try {
      fetchBookings();
    } catch (err) {
      console.error('⚠️ Failed to refresh bookings after saving:', err);
    }
  };

  return (
    <tr className="text-white bg-black border-b border-yellow-600">
      <td colSpan={9} className="px-4 py-4">
        <CostFields b={b} v={v} setEditValues={setEditValues} />
        <div className="mt-3 text-sm font-medium">
          Calculated Total Cost:{' '}
          <span className="font-bold text-yellow-400">₹{totalCost}</span>
        </div>
        <div className="mt-3">
          <button
            onClick={saveCharges}
            disabled={!isModified()}
            className={`px-4 py-1.5 text-sm rounded font-semibold transition ${
              isModified()
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            Save Fare Details
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BookingExpand;
