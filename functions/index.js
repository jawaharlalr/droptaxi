const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendAdminNotification = functions.firestore
  .document('bookings/{id}')
  .onCreate(async (snap) => {
    const booking = snap.data();

    try {
      // ✅ Fetch all admin tokens
      const snapshot = await admin.firestore().collection('admin_tokens').get();
      const tokens = snapshot.docs.map(doc => doc.data().token).filter(Boolean);

      if (tokens.length === 0) {
        console.warn('⚠️ No admin FCM token found');
        return;
      }

      const message = {
        notification: {
          title: '🚖 New Booking Received!',
          body: `${booking.name}: ${booking.source} ➝ ${booking.destination}`,
        },
      };

      // ✅ Send push to all tokens
      const response = await admin.messaging().sendToDevice(tokens, message);

      console.log(`✅ Notifications sent: ${response.successCount}, ❌ Failed: ${response.failureCount}`);
    } catch (error) {
      console.error('❌ Failed to send admin notification:', error);
    }
  });
