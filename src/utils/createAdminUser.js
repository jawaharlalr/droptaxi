// utils/createAdminUser.js
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export const createAdminUserDocument = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.warn('No user is logged in');
    return;
  }

  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      email: user.email,
      role: 'admin',
      createdAt: new Date(),
    });

    console.log('✅ Admin user document created in Firestore');
  } catch (error) {
    console.error('❌ Failed to create admin user document:', error);
  }
};
