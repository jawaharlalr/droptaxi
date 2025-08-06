import React from 'react';
import BookingExpand from './BookingExpand';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { generateInvoicePDF } from '../../utils/pdfGenerator';
import { FiChevronDown, FiChevronUp, FiTrash2, FiFileText } from 'react-icons/fi';

const BookingRow = ({
  booking: b,
  editValues,
  setEditValues,
  expandedId,
  setExpandedId,
  fetchBookings,
  handleDelete,
}) => {
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

  const isExpanded = expandedId === b.id;
  const v = editValues[b.id] || {};
  const totalCost = toNum(v.cost) + toNum(v.toll) + toNum(v.parking) + toNum(v.hill) + toNum(v.permit);
  const isRoundTrip = !!b.returnDate;
  const noOfDays = getNoOfDays(b.date, b.returnDate);
  const DRIVER_BATA_PER_DAY = 400;

  const updateStatus = async (status) => {
    try {
      await updateDoc(doc(db, 'bookings', b.id), { status });
      fetchBookings();
    } catch (err) {
      console.error('❌ Failed to update status in Firestore:', err);
      alert('Failed to update status.');
      return;
    }

    try {
      const msg = `Hi ${b.name},\nYour Booking ID: ${b.bookingId || b.id} is ${status}.\nThank You!`;
      const phoneWithCountryCode = `91${b.phone}`;
      const waURL = `https://wa.me/${phoneWithCountryCode}?text=${encodeURIComponent(msg)}`;
      window.open(waURL, '_blank');
    } catch (err) {
      console.error('⚠️ Failed to open WhatsApp:', err);
    }
  };

  const handleGenerateInvoice = async () => {
    try {
      generateInvoicePDF(b);
    } catch (err) {
      console.error('❌ Failed to generate invoice:', err);
      alert('Failed to generate invoice.');
    }
  };

  const getFareColor = () => {
    switch (b.status) {
      case 'completed':
        return 'text-green-500';
      case 'confirmed':
        return 'text-yellow-500';
      default:
        return 'text-red-500';
    }
  };

  return (
    <>
      <tr className="text-white transition bg-black border-b border-yellow-500">
        <td className="px-3 py-2 text-sm font-semibold">{b.index}</td>

        <td className="px-3 py-2">
          <div className="text-sm font-medium">{b.name}</div>
          {b.bookingId && <div className="text-xs text-gray-400">ID: {b.bookingId}</div>}
        </td>

        <td className="px-3 py-2">{b.phone}</td>

        <td className="px-3 py-2">
          <div>{b.source?.displayName || '-'}</div>
          <div className="text-xs text-center text-gray-400">to</div>
          <div>{b.destination?.displayName || '-'}</div>
        </td>

        <td className="px-3 py-2 text-xs leading-5">
          <div><b>Booked:</b> {formatDate(b.createdAt)}</div>
          <div><b>Type:</b> {isRoundTrip ? 'Round Trip' : 'One Way'}</div>
          <div><b>Journey:</b> {formatDate(b.date)}</div>
          {isRoundTrip && <div><b>Return:</b> {formatDate(b.returnDate)}</div>}
          <div><b>Bata:</b> ₹{DRIVER_BATA_PER_DAY} × {noOfDays} day{noOfDays > 1 ? 's' : ''}</div>
        </td>

        <td className="px-3 py-2">{b.vehicleType}</td>

        <td className="px-3 py-2">
          <select
            value={b.status || ''}
            onChange={(e) => updateStatus(e.target.value)}
            className="px-2 py-1 text-xs text-black bg-yellow-100 border border-yellow-300 rounded"
          >
            <option value="">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>

        <td className={`px-3 py-2 font-semibold ${getFareColor()}`}>
          ₹{b.totalCost || totalCost}
        </td>

        <td className="px-3 py-2 space-y-1">
          <button
            onClick={() => setExpandedId(isExpanded ? null : b.id)}
            className="flex items-center justify-center w-full gap-1 px-2 py-1 text-xs font-medium text-black bg-yellow-400 rounded hover:bg-yellow-500"
          >
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />} {isExpanded ? 'Collapse' : 'Expand'}
          </button>

          <button
            onClick={() => handleDelete(b.id)}
            className="flex items-center justify-center w-full gap-1 px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            <FiTrash2 /> Delete
          </button>

          {b.status === 'completed' && (
            <button
              onClick={handleGenerateInvoice}
              className="flex items-center justify-center w-full gap-1 px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
            >
              <FiFileText /> Create Invoice
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
