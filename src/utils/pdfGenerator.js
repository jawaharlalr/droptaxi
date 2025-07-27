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

  // Header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Pranav Drop Taxi', 105, 16, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Phone: +91 98849 49171', 105, 22, { align: 'center' });
  doc.text('GST No: 33XXXXXXXXXXZ5', 105, 28, { align: 'center' });

  // Booking Info - Left
  doc.setFontSize(10);
  doc.text(`Booking ID: ${booking.bookingId || booking.id}`, 14, 36);
  doc.text(`Customer Name: ${booking.name}`, 14, 42);
  doc.text(`Phone: ${booking.phone}`, 14, 48);
  doc.text(`Booked Date: ${new Date().toLocaleDateString()}`, 14, 54);

  // Trip Info - Right
  const rightX = 140;
  doc.text(`Trip Type: ${isRound ? 'Round Trip' : 'One Way'}`, rightX, 36);
  doc.text(`Journey Date: ${formatDate(booking.date)}`, rightX, 42);
  if (isRound) {
    doc.text(`Return Date: ${formatDate(booking.returnDate)}`, rightX, 48);
    doc.text(`No of Days: ${noOfDays}`, rightX, 54);
  }

  // Table 1 – Trip Summary
  autoTable(doc, {
    startY: 62,
    head: [['From', 'To', 'Distance (km)', 'Duration', 'Base + Driver Beta']],
    body: [
      [
        booking.source,
        booking.destination,
        `${distance} km`,
        durationText,
        `Rs. ${baseCost} + Rs. ${driverBataPerDay} × ${noOfDays} = Rs. ${driverBataTotal}`
      ],
      [
        { content: 'Subtotal (Base + Bata)', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
        `Rs. ${totalFirst}`
      ]
    ],
    styles: {
      halign: 'center',
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
  });

  const afterTripY = doc.lastAutoTable.finalY + 5;

  // Table 2 – Additional Charges
  autoTable(doc, {
    startY: afterTripY,
    head: [['Toll', 'Parking', 'Hill', 'Permit', 'Total']],
    body: [
      [
        `Rs. ${toll}`,
        `Rs. ${parking}`,
        `Rs. ${hill}`,
        `Rs. ${permit}`,
        `Rs. ${totalSecond}`
      ],
      [
        { content: 'Subtotal (Extras)', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
        `Rs. ${totalSecond}`
      ]
    ],
    styles: {
      halign: 'center',
      textColor: [0, 0, 0],
      fillColor: [255, 255, 255],
      lineColor: [0, 0, 0],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
  });

  const afterExtrasY = doc.lastAutoTable.finalY + 10;

  // Grand Total Summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: Rs. ${total}`, 14, afterExtrasY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Paid: Rs. ${total}`, 14, afterExtrasY + 6);

  // Thank You
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text(`Thank you, ${booking.name}!`, 105, afterExtrasY + 20, { align: 'center' });

  // PAGE 2: Terms and Conditions
  doc.addPage();

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions:', 14, 20);

  const terms = [
    '1. Driver Bata is Rs. 400 per day and is added for outstation trips.',
    '2. Toll, Parking, Permit, and Hill charges are extra based on actuals.',
    '3. Extra hours or kilometers beyond the estimate will be charged separately.',
    '4. Each calendar day is counted as one full trip day.',
    '5. Bookings are confirmed only after official confirmation from our team.',
    '6. If a vehicle is unavailable, a similar or better one will be arranged.',
    '7. Prices may vary based on fuel cost, season, or route changes.',
  ];

  doc.setFont('helvetica', 'normal');
  terms.forEach((point, i) => {
    doc.text(point, 14, 28 + i * 8);
  });

  const safetyStartY = 28 + terms.length * 8 + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Safety & Belongings:', 14, safetyStartY);

  doc.setFont('helvetica', 'normal');
  doc.text(
    'We take your safety seriously, but passengers are responsible for their personal belongings.',
    14,
    safetyStartY + 8
  );
  doc.text(
    'Please check your items before leaving the vehicle. We are not liable for lost or forgotten items.',
    14,
    safetyStartY + 16
  );

  // Save PDF
  doc.save(`${booking.bookingId || booking.id}.pdf`);
};

// Helpers
function getNoOfDays(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff + 1 : 1;
}

function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDuration(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) return `${hrs} hr ${mins} min`;
  return `${mins} min`;
}
