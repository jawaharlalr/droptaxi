import { messaging, getToken, db } from './firebase';
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
      console.log('✅ Admin token obtained:', token);

      // 🔐 Save token under `admin_tokens/{uid}`
      await setDoc(doc(db, 'admin_tokens', uid), {
        token,
        updatedAt: new Date().toISOString(),
      });

      console.log(`📦 Token stored for admin UID: ${uid}`);
    } else {
      console.warn('🔒 Notification permission not granted or dismissed by user.');
    }
  } catch (err) {
    console.error('❌ Error getting token or storing it in Firestore:', err);
  }
};
