import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (booking, headerImageBase64) => {
  const doc = new jsPDF();

  const toNum = (n) => (!isNaN(+n) ? +n : 0);
  const formatRs = (n) => `Rs. ${toNum(n).toLocaleString('en-IN')}`;

  const baseCost = toNum(booking.cost);
  const toll = toNum(booking.tollCharges);
  const parking = toNum(booking.parkingCharges);
  const hill = toNum(booking.hillCharges);
  const permit = toNum(booking.permitCharges);
  const distance = Math.round(toNum(booking.distance));
  const duration = Math.round(toNum(booking.duration));

  const isRound = !!booking.returnDate;
  const noOfDays = isRound ? getNoOfDays(booking.date, booking.returnDate) : 1;
  const driverBataPerDay = 400;
  const driverBataTotal = driverBataPerDay * noOfDays;

  const totalFirst = baseCost + driverBataTotal;
  const totalSecond = toll + parking + hill + permit;
  const total = totalFirst + totalSecond;

  const durationText = formatDuration(duration);

  // ===== HEADER BACKGROUND =====
  const headerHeight = 40;
  doc.setFillColor(0, 0, 0);
  doc.rect(0, 0, 215, headerHeight, 'F');

  // ===== LOGO ON LEFT (original size) =====
  const logoWidth = 30;  // Original width
  const logoHeight = 40; // Original height
  const logoX = 46;
  const logoY = 0;
  doc.addImage(headerImageBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // ===== HEADER TEXT (centered) =====
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Pranav Drop Taxi', 105, 17, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Phone: +91 98849 49171', 105, 25, { align: 'center' });
  doc.text('GST No: 33XXXXXXXXXXZ5', 105, 30, { align: 'center' });

  doc.setTextColor(0, 0, 0); // Reset text color to black

  // ===== Booking Info (Left) =====
  doc.setFontSize(10);
  const contentStartY = 46;
  doc.text(`Booking ID: ${booking.bookingId || booking.id}`, 14, contentStartY);
  doc.text(`Customer Name: ${booking.name || '-'}`, 14, contentStartY + 6);
  doc.text(`Phone: ${booking.phone || '-'}`, 14, contentStartY + 12);
  doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, contentStartY + 18);

  // ===== Trip Info (Right) =====
  const rightX = 140;
  doc.text(`Trip Type: ${isRound ? 'Round Trip' : 'One Way'}`, rightX, contentStartY);
  doc.text(`Journey Date: ${formatDate(booking.date)}`, rightX, contentStartY + 6);
  if (isRound) {
    doc.text(`Return Date: ${formatDate(booking.returnDate)}`, rightX, contentStartY + 12);
    doc.text(`Trip Days: ${noOfDays}`, rightX, contentStartY + 18);
  }

  // ===== Table 1: Trip Summary =====
  autoTable(doc, {
    startY: contentStartY + 28,
    head: [['From', 'To', 'Distance', 'Duration', 'Base Fare + Driver Bata']],
    body: [
      [
        booking.source?.displayName || booking.source?.formattedAddress || '-',
        booking.destination?.displayName || booking.destination?.formattedAddress || '-',
        `${distance} km`,
        durationText,
        `${formatRs(baseCost)} + ${formatRs(driverBataPerDay)} × ${noOfDays} = ${formatRs(driverBataTotal)}`
      ],
      [
        { content: 'Subtotal (Base + Bata)', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
        formatRs(totalFirst)
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
      fillColor: [240, 240, 240],
      fontStyle: 'bold',
    },
  });

  const afterTripY = doc.lastAutoTable.finalY + 5;

  // ===== Table 2: Additional Charges =====
  autoTable(doc, {
    startY: afterTripY,
    head: [['Toll', 'Parking', 'Hill', 'Permit', 'Total']],
    body: [
      [
        formatRs(toll),
        formatRs(parking),
        formatRs(hill),
        formatRs(permit),
        formatRs(totalSecond)
      ],
      [
        { content: 'Subtotal (Extras)', colSpan: 4, styles: { halign: 'right', fontStyle: 'bold' } },
        formatRs(totalSecond)
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
      fillColor: [240, 240, 240],
      fontStyle: 'bold',
    },
  });

  const afterExtrasY = doc.lastAutoTable.finalY + 10;

  // ===== Grand Total =====
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${formatRs(total)}`, 14, afterExtrasY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Amount Paid: ${formatRs(total)}`, 14, afterExtrasY + 6);

  // ===== Thank You =====
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text(`Thank you, ${booking.name || 'Customer'}!`, 105, afterExtrasY + 20, { align: 'center' });

  // ===== Save PDF =====
  const fileName = `${booking.bookingId || booking.id || 'invoice'}.pdf`;
  doc.save(fileName);
};

// ===== Helper Functions =====
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
