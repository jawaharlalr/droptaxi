import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import MyBookings from './pages/MyBookings';
import About from './pages/About';
import Contact from './pages/Contact';

import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import ManageUsers from './admin/ManageUsers';
import AdminBookings from './admin/AdminBookings';

import { AuthProvider } from './utils/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Layout wrapper to conditionally hide Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const hideLayoutRoutes = ['/login', '/admin', '/my-bookings'];
  const shouldHideLayout = hideLayoutRoutes.includes(path) || path.startsWith('/admin/');

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
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Protected User Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
