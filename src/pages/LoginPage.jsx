import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in with email:', email);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Login failed: ' + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || '',
          email: user.email,
          role: 'user',
          createdAt: new Date(),
        });
      }

      console.log('Google login successful:', user.email);
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error.message);
      alert('Google login failed: ' + error.message);
    }
  };

  if (loading) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center">Login to Pranav Drop Taxi</h2>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute text-gray-500 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">or</div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full gap-3 py-2 transition-colors border rounded-lg hover:bg-gray-100"
        >
          <FcGoogle size={20} />
          <span className="font-medium">Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
