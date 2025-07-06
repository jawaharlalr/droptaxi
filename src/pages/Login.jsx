import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../utils/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FcGoogle } from 'react-icons/fc'; // Google icon

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🔒 Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/');
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ Save user to Firestore if not exists
  const saveUserToFirestore = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || '',
        email: user.email,
        role: 'user',
        createdAt: serverTimestamp()
      });
    }
  };

  // 📧 Email/Password Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(result.user);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  // 🟦 Google Login
  const handleGoogleLogin = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await saveUserToFirestore(result.user);
      navigate('/');
    } catch (err) {
      setError('Google login failed');
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 border rounded shadow">
      <h2 className="mb-4 text-xl font-bold text-center">Login</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border"
          required
        />
        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-black rounded"
        >
          Login with Email
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="mb-2 text-sm text-gray-600">or</p>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full gap-3 px-4 py-2 text-black transition bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-100"
        >
          <FcGoogle size={20} />
          <span className="font-medium">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
