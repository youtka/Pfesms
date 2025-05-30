import React, { useEffect, useState } from 'react';
import { getToken } from '../services/authService';
import { FaTrash, FaUserShield, FaEdit, FaSyncAlt } from 'react-icons/fa';
import AdminSidebarLayout from './AdminSidebarLayout'; // ✅ important!

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const token = getToken();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:9190/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setUsers)
      .catch(err => console.error('Failed to fetch users:', err));
  };

  const handleToggleActive = (id) => {
    fetch(`http://localhost:9190/api/admin/users/${id}/toggle-active`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchUsers());
  };

  const handleToggleRole = (id) => {
    fetch(`http://localhost:9190/api/admin/users/${id}/toggle-role`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => fetchUsers());
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      fetch(`http://localhost:9190/api/admin/users/${id}/delete`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => fetchUsers());
    }
  };

  const handleEditName = (id, currentName) => {
    const newName = prompt('Enter new full name:', currentName);
    if (newName && newName !== currentName) {
      fetch(`http://localhost:9190/api/admin/users/${id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fullName: newName })
      }).then(() => fetchUsers());
    }
  };

  return (
    <AdminSidebarLayout>
      <div className="container mt-4">
        <h4 className="mb-3">👥 Manage Users</h4>
        <div className="table-responsive shadow-sm border rounded">
          <table className="table table-striped align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.fullName}</td>
                  <td>
                    {user.role === 'ADMIN' ? (
                      <span className="badge bg-primary">Admin</span>
                    ) : (
                      <span className="badge bg-secondary">User</span>
                    )}
                  </td>
                  <td>
                    {user.active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-success me-1"
                      title="Toggle Role"
                      onClick={() => handleToggleRole(user.id)}
                    >
                      <FaUserShield />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning me-1"
                      title="Toggle Active"
                      onClick={() => handleToggleActive(user.id)}
                    >
                      <FaSyncAlt />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      title="Edit Name"
                      onClick={() => handleEditName(user.id, user.fullName)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminUsers;
