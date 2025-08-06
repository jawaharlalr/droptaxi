import React, { useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { useAuth } from '../utils/AuthContext';
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';

const ManageUsers = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = async (id, field, value) => {
    try {
      await updateDoc(doc(db, 'users', id), { [field]: value });
      fetchUsers();
    } catch (err) {
      alert('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and all related bookings?')) return;
    try {
      const bookingsRef = collection(db, 'bookings');
      const bookingsSnapshot = await getDocs(bookingsRef);
      const userBookings = bookingsSnapshot.docs.filter(doc => doc.data().userId === userId);

      for (const booking of userBookings) {
        await deleteDoc(doc(db, 'bookings', booking.id));
      }

      await deleteDoc(doc(db, 'users', userId));
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete user and related bookings');
    }
  };

  useEffect(() => {
    if (!authLoading && user && isAdmin) fetchUsers();
    else if (!authLoading && (!user || !isAdmin)) {
      setError('Access denied. Admins only.');
      setLoading(false);
    }
  }, [user, isAdmin, authLoading]);

  if (authLoading) return <p className="mt-10 text-center">Checking access...</p>;

  const admins = users.filter((u) => u.role === 'admin');
  const regularUsers = users.filter((u) => u.role !== 'admin');

  const renderUserTable = (title, userList, startIndex = 1) => (
    <div className="mb-10">
      <h3 className="mb-3 text-xl font-semibold text-black">{title}</h3>
      <div className="overflow-x-auto border border-black rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-black uppercase bg-yellow-400">
            <tr>
              <th className="px-4 py-2">S.No.</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((u, index) => (
              <tr key={u.id} className="border-t border-black even:bg-gray-100">
                <td className="px-4 py-2">{startIndex + index}</td>
                <td className="px-4 py-2">
                  <span className="text-gray-800">{u.name || '—'}</span>
                </td>
                <td className="px-4 py-2 text-gray-600">{u.email}</td>
                <td className="px-4 py-2">
                  <select
                    value={u.role || 'user'}
                    onChange={(e) =>
                      handleFieldChange(u.id, 'role', e.target.value)
                    }
                    className="w-full px-2 py-1 text-sm border border-black rounded"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    <FiTrash2 size={14} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl min-h-screen p-6 mx-auto text-black bg-white">
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <h2 className="text-3xl font-bold">Manage Users</h2>
        <Link
          to="/admin/dashboard"
          className="inline-block px-4 py-2 text-sm font-medium text-black transition border border-black rounded hover:bg-black hover:text-white"
        >
          Back to Dashboard
        </Link>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading users...</p>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded">{error}</div>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-600">No users found.</p>
      ) : (
        <>
          {admins.length > 0 && renderUserTable('Admins', admins)}
          {regularUsers.length > 0 && renderUserTable('Users', regularUsers, admins.length + 1)}
        </>
      )}
    </div>
  );
};

export default ManageUsers;
