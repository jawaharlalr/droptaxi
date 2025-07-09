import React from 'react';
import BookingExpand from './BookingExpand';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { generateInvoicePDF } from '../../utils/pdfGenerator';

/**
 * BookingRow – one row in AdminBookings table
 * Displays booking meta, status selector, cost, and actions
 */
const BookingRow = ({
  booking: b,
  editValues,
  setEditValues,
  expandedId,
  setExpandedId,
  fetchBookings,
  handleDelete,
}) => {
  /** ――― Helpers ――― */
  const toNum = (n) => (+n ? +n : 0);
  const formatDate = (d) => {
    if (!d) return '-';
    const dateObj = d?.toDate?.() || new Date(d);
    return isNaN(dateObj.getTime())
      ? '-'
      : new Intl.DateTimeFormat('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }).format(dateObj);
  };
  const getNoOfDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end || start);
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff + 1 : 1;
  };

  /** ――― Derived values ――― */
  const isExpanded = expandedId === b.id;
  const v = editValues[b.id] || {};
  const totalCost = toNum(v.cost) + toNum(v.toll) + toNum(v.parking) + toNum(v.hill) + toNum(v.permit);
  const isRoundTrip = !!b.returnDate;
  const noOfDays = getNoOfDays(b.date, b.returnDate);
  const DRIVER_BATA_PER_DAY = 400;

  /** ――― Actions ――― */
  const updateStatus = async (status) => {
    try {
      await updateDoc(doc(db, 'bookings', b.id), { status });
      fetchBookings();
    } catch {
      alert('Failed to update status.');
    }
  };

  /** ――― Render ――― */
  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="px-3 py-2">{b.index}</td>

        <td className="px-3 py-2">
          <div className="text-sm font-medium">{b.name}</div>
          {b.bookingId && <div className="text-xs text-gray-500">ID: {b.bookingId}</div>}
        </td>

        <td className="px-3 py-2">{b.phone}</td>

        <td className="px-3 py-2">
          <div>{b.source}</div>
          <div className="text-xs text-center text-gray-500">to</div>
          <div>{b.destination}</div>
        </td>

        <td className="px-3 py-2 text-xs leading-5">
          <div><b>Booked:</b> {formatDate(b.createdAt)}</div>
          <div><b>Type:</b> {isRoundTrip ? 'Round Trip' : 'One Way'}</div>
          <div><b>Journey:</b> {formatDate(b.date)}</div>
          {isRoundTrip && <div><b>Return:</b> {formatDate(b.returnDate)}</div>}
          <div><b>Bata:</b> Rs {DRIVER_BATA_PER_DAY} × {noOfDays} day{noOfDays > 1 ? 's' : ''}</div>
        </td>

        <td className="px-3 py-2">{b.vehicleType}</td>

        <td className="px-3 py-2">
          <select
            value={b.status || ''}
            onChange={(e) => updateStatus(e.target.value)}
            className="px-2 py-1 text-xs border rounded"
          >
            <option value="">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>

        <td className="px-3 py-2 font-semibold text-blue-700">Rs {b.totalCost || totalCost}</td>

        <td className="px-3 py-2 space-y-1">
          <button
            onClick={() => setExpandedId(isExpanded ? null : b.id)}
            className="block text-xs text-blue-600 underline"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={() => handleDelete(b.id)}
            className="block text-xs text-red-600 underline"
          >
            Delete
          </button>
          {b.status === 'completed' && (
            <button
              onClick={() => generateInvoicePDF(b)}
              className="block text-xs text-green-600 underline"
            >
              Create Invoice
            </button>
          )}
        </td>
      </tr>

      {isExpanded && (
        <BookingExpand
          b={b}
          v={v}
          editValues={editValues}
          setEditValues={setEditValues}
          fetchBookings={fetchBookings}
        />
      )}
    </>
  );
};

export default BookingRow;
