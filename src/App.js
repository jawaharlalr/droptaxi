import React from 'react';
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

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  // ❌ Hide layout on these pages
  const hideLayoutRoutes = [
    '/admin',
    '/admin-login',
    '/login',
    '/my-bookings',
  ];

  // Hide layout if the route matches or starts with '/admin/'
  const shouldHideLayout =
    hideLayoutRoutes.includes(path) || path.startsWith('/admin/');

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      {children}
      {!shouldHideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Login */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Dashboard Pages */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
