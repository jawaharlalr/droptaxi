import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (booking) => {
  const doc = new jsPDF();

  const toNum = (n) => (+n ? +n : 0);
  const baseCost = toNum(booking.cost);
  const toll = toNum(booking.tollCharges);
  const parking = toNum(booking.parkingCharges);
  const hill = toNum(booking.hillCharges);
  const permit = toNum(booking.permitCharges);
  const distance = toNum(booking.distance);
  const duration = toNum(booking.duration);

  const isRound = !!booking.returnDate;
  const noOfDays = isRound ? getNoOfDays(booking.date, booking.returnDate) : 1;
  const driverBataPerDay = 400;
  const driverBataTotal = driverBataPerDay * noOfDays;

  const totalFirst = baseCost + driverBataTotal;
  const totalSecond = toll + parking + hill + permit;
  const total = totalFirst + totalSecond;

  const durationText = formatDuration(duration);

  // Header: Company
  doc.setFontSize(16);
  doc.text('Pranav Drop Taxi', 105, 16, { align: 'center' });

  doc.setFontSize(12);
  doc.text('GST No: 33XXXXXXXXXXZ5', 105, 22, { align: 'center' });
  doc.text('Phone: +91 98765 43210', 105, 28, { align: 'center' });

  // Left section
  doc.setFontSize(10);
  doc.text(`Booking ID: ${booking.bookingId || booking.id}`, 14, 36);
  doc.text(`Customer Name: ${booking.name}`, 14, 42);
  doc.text(`Phone: ${booking.phone}`, 14, 48);
  doc.text(`Booked Date: ${new Date().toLocaleDateString()}`, 14, 54);

  // Right section
  const rightX = 140;
  doc.text(`Trip Type: ${isRound ? 'Round Trip' : 'One Way'}`, rightX, 36);
  doc.text(`Journey Date: ${booking.date}`, rightX, 42);
  if (isRound) {
    doc.text(`Return Date: ${booking.returnDate}`, rightX, 48);
    doc.text(`No of Days: ${noOfDays}`, rightX, 54);
  }

  // Table 1 – Trip Summary
  autoTable(doc, {
    startY: 62,
    head: [['From', 'To', 'Distance (km)', 'Duration', 'Base + Driver Bata']],
    body: [
      [
        booking.source,
        booking.destination,
        `${distance} km`,
        durationText,
        `Rs ${baseCost} + Rs ${driverBataPerDay} x ${noOfDays} = Rs ${driverBataTotal}`
      ],
    ],
  });

  // Table 2 – Additional Charges
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 5,
    head: [['Toll', 'Parking', 'Hill', 'Permit', 'Total']],
    body: [
      [
        `Rs ${toll}`,
        `Rs ${parking}`,
        `Rs ${hill}`,
        `Rs ${permit}`,
        `Rs ${totalSecond}`
      ],
    ],
  });

  // Summary
  doc.setFontSize(12);
  const ySummary = doc.lastAutoTable.finalY + 10;
  doc.text(`Grand Total: Rs ${total}`, 14, ySummary);
  doc.text(`Paid: Rs ${total}`, 14, ySummary + 6);

  // Thank You
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text(`Thank you, ${booking.name}!`, 105, ySummary + 20, { align: 'center' });

  doc.save(`Invoice-${booking.bookingId || booking.id}.pdf`);
};

function getNoOfDays(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff + 1 : 1;
}

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs} hr ${mins} min`;
  return `${mins} min`;
}
