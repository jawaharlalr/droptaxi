// src/components/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen text-black bg-white">
      <AdminSidebar />
      <main className="flex-1 p-4 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
