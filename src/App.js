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

import { AuthProvider } from './utils/AuthContext'; // ✅ Import global Auth context

// ✅ This wrapper ensures we show/hide layout components like Navbar/Footer
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

// ✅ Main App with AuthProvider wrapped
function App() {
  return (
    <AuthProvider>
      <Router>
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
