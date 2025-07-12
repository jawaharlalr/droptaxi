import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setIsAdmin(data.role === 'admin');
        } else {
          await setDoc(userRef, {
            name: currentUser.displayName || '',
            email: currentUser.email || '',
            role: 'user',
            createdAt: serverTimestamp(),
          });
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('Error fetching or creating user:', err);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);

      return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
          if (currentUser) {
            unsub();
            resolve(currentUser);
          }
        });
      });
    } catch (error) {
      console.error('Google sign-in error:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);

      return new Promise((resolve) => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
          if (!currentUser) {
            setUser(null);
            setIsAdmin(false);
            unsub();
            resolve();
          }
        });
      });
    } catch (error) {
      console.error('Logout error:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
