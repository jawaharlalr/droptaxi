export const sendWhatsAppUpdate = async (booking, status) => {
  const phone = booking.phone?.replace(/[^0-9]/g, '');
  if (!phone || !booking.name) return;

  const bookingCode = booking.bookingId || booking.id;
  const message = `Hi ${booking.name},%0AYour Booking Id: ${bookingCode} is ${status}.%0AThank you!`;
  const url = `https://wa.me/91${phone}?text=${message}`;
  window.open(url, '_blank');
};
