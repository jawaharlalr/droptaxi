// src/utils/generateBookingId.js

export function generateBookingId(name = '', phone = '') {
  const now = new Date();

  const lastFourDigits = (phone || '').toString().slice(-4);
  const cleanName = (name || 'User').replace(/\s+/g, '').slice(0, 10); // Trim whitespace & limit length
  const hrs = now.getHours().toString().padStart(2, '0');
  const mins = now.getMinutes().toString().padStart(2, '0');

  return `PV${lastFourDigits}-${cleanName}-${hrs}${mins}`;
}
