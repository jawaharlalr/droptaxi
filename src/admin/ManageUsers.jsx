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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
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

  return (
    <div className="max-w-5xl min-h-screen p-6 mx-auto text-black bg-white">
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <h2 className="text-3xl font-bold">Manage Users</h2>
        <Link
          to="/admin/dashboard"
          className="inline-block px-4 py-2 text-sm font-medium text-black transition bg-white border border-black rounded hover:bg-black hover:text-white"
        >
          Dashboard
        </Link>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <div className="p-4 text-red-700 bg-red-100 rounded">{error}</div>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-4">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded shadow-sm"
            >
              <div className="w-full space-y-2">
                {/* Editable Name */}
                <input
                  type="text"
                  value={u.name || ''}
                  onChange={(e) =>
                    handleFieldChange(u.id, 'name', e.target.value)
                  }
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded"
                  placeholder="Name"
                />

                {/* Email (readonly) */}
                <p className="text-sm text-gray-600">{u.email}</p>

                {/* Editable Role */}
                <select
                  value={u.role || 'user'}
                  onChange={(e) =>
                    handleFieldChange(u.id, 'role', e.target.value)
                  }
                  className="px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                onClick={() => handleDelete(u.id)}
                className="flex items-center gap-2 px-3 py-2 ml-4 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
              >
                <FiTrash2 size={16} /> Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageUsers;
