import { messaging, getToken, db } from './firebase'; // ensure db is exported from firebase.js
import { doc, setDoc } from 'firebase/firestore';

/**
 * Requests notification permission and stores the token in Firestore under the admin's UID.
 * @param {string} uid - The admin's UID
 */
export const requestAdminNotificationPermission = async (uid) => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BNJ31WkbwhZ5evHqTtmnfOgwFOSCRjQ3G-W2PUNHI5cZ99Pc_Sc7m7WBF-6VDEh4GUq5bkUy7BoAEcny2wrszrQ',
    });

    if (token) {
      console.log('✅ Admin token:', token);

      // Save to Firestore under admin_tokens/{uid}
      await setDoc(doc(db, 'admin_tokens', uid), { token });
    } else {
      console.warn('🔒 Notification permission not granted');
    }
  } catch (err) {
    console.error('❌ Error getting token:', err);
  }
};
