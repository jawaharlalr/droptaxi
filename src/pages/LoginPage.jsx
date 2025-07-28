import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react'; // ✅ Home icon

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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

  return (
    <div
      className="relative min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('taxi.jpg')" }}
    >
      {/* ✅ Home Icon Button */}
      <Link
        to="/"
        className="absolute flex items-center gap-1 px-3 py-2 text-sm font-medium text-black transition bg-white rounded-md shadow top-4 right-4 hover:bg-gray-200"
      >
        <Home size={18} />
        Home
      </Link>

      <div className="flex items-center justify-center min-h-screen px-4 bg-black/70">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md p-8 text-white shadow-2xl sm:p-10 bg-black/80 rounded-xl"
        >
          <h2 className="mb-6 text-3xl font-bold text-center text-yellow-300">
            Login to Pranav Drop Taxi
          </h2>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              
              <label className="block mb-1 font-medium text-yellow-200">Email</label>
              <input
                type="email"
                placeholder='Enter Your Email'
                className="w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-yellow-200">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter Your Password'
                  className="w-full px-4 py-2 pr-10 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-600 transform -translate-y-1/2 cursor-pointer right-3 top-1/2"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 font-bold text-black transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-300"
            >
              Login
            </button>
          </form>

          <div className="my-4 text-center text-gray-400">or</div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full gap-3 py-2 transition-colors border rounded-lg hover:bg-yellow-100/20"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-white">Continue with Google</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
