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
    <div className="max-w-4xl p-6 mx-auto">
      <h2 className="mb-6 text-3xl font-bold text-center">Manage Users</h2>

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
              className="flex items-center justify-between p-4 bg-white border rounded shadow"
            >
              <div className="w-full space-y-1">
                {/* Editable Name */}
                <input
                  type="text"
                  value={u.name || ''}
                  onChange={(e) =>
                    handleFieldChange(u.id, 'name', e.target.value)
                  }
                  className="w-full px-2 py-1 border rounded"
                  placeholder="Name"
                />

                {/* Email (readonly) */}
                <p className="text-sm text-gray-700">{u.email}</p>

                {/* Editable Role */}
                <select
                  value={u.role || 'user'}
                  onChange={(e) =>
                    handleFieldChange(u.id, 'role', e.target.value)
                  }
                  className="px-2 py-1 border rounded"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                onClick={() => handleDelete(u.id)}
                className="ml-4 text-red-600 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageUsers;
