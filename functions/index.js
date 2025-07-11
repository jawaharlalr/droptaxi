// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendAdminNotification = functions.firestore
  .document('bookings/{id}')
  .onCreate(async (snap) => {
    const booking = snap.data();

    // 🔥 Optional: Fetch token dynamically from Firestore
    const tokenDoc = await admin.firestore().doc(`admin_tokens/${booking.userId}`).get();
    const adminToken = tokenDoc.exists ? tokenDoc.data().token : null;

    if (!adminToken) {
      console.warn('⚠️ No admin FCM token found');
      return;
    }

    const message = {
      notification: {
        title: 'New Booking Received!',
        body: `${booking.name} - ${booking.source} ➝ ${booking.destination}`,
      },
      token: adminToken,
    };

    try {
      await admin.messaging().send(message);
      console.log('✅ Push sent to admin');
    } catch (error) {
      console.error('❌ Failed to send push:', error);
    }
  });
