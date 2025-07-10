import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signOut,
  signInWithRedirect,
  getRedirectResult,
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

  // Check Google redirect login result
  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result?.user) {
          setUser(result.user);
        }
      } catch (err) {
        console.error('Redirect login error:', err);
      }
    };

    checkRedirect();
  }, []);

  // Set user and admin info
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
          setIsAdmin(userSnap.data().role === 'admin');
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
        console.error('Error reading user data:', err);
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Google login using redirect
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('Logout error:', err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
