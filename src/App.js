import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import Contact from './pages/Contact';
import LoginPage from './pages/LoginPage';

import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import ManageUsers from './admin/ManageUsers';
import AdminBookings from './admin/AdminBookings/AdminBookings';

import { AuthProvider, useAuth } from './utils/AuthContext';
import { requestAdminNotificationPermission } from './utils/fcmHelpers'; // ✅ Import FCM helper

// ✅ Layout wrapper to hide Navbar/Footer on certain pages
const LayoutWrapper = ({ children }) => {
  const { pathname } = useLocation();

  const hideLayoutRoutes = [
    '/my-bookings',
    '/login',
    '/admin',
    '/admin-login',
  ];

  const shouldHideLayout =
    hideLayoutRoutes.includes(pathname) || pathname.startsWith('/admin/');

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideLayout && <Navbar />}
      <div className="flex-grow">{children}</div>
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

// ✅ Hook to register Service Worker + request token for admin
const NotificationManager = () => {
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
        })
        .catch((err) => {
          console.error('❌ Service Worker registration failed:', err);
        });
    }
  }, []);

  useEffect(() => {
    if (user?.uid && isAdmin && !loading) {
      requestAdminNotificationPermission(user.uid);
    }
  }, [user, isAdmin, loading]);

  return null; // nothing visible
};

// ✅ Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <NotificationManager />
        <LayoutWrapper>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
          </Routes>
        </LayoutWrapper>
      </Router>
    </AuthProvider>
  );
}

export default App;
