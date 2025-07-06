import React, { useEffect, useState } from 'react';
import { getToken } from '../services/authService';
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
      <div className="container-fluid px-4 py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                <i className="bi bi-people text-white fs-4"></i>
              </div>
              <div>
                <h2 className="mb-0 fw-bold text-dark">Manage Users</h2>
                <p className="text-muted mb-0">Monitor and manage user accounts across the platform</p>
              </div>
            </div>
          </div>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
              <i className="bi bi-person-x fs-1 text-muted"></i>
            </div>
            <h5 className="text-muted">No Users Found</h5>
            <p className="text-muted">User accounts will appear here once they register on the platform.</p>
          </div>
        ) : (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <div className="row align-items-center">
                <div className="col">
                  <h6 className="mb-0 fw-semibold">
                    <i className="bi bi-person-lines-fill me-2"></i>
                    User Management
                  </h6>
                </div>
                <div className="col-auto">
                  <span className="badge bg-primary bg-gradient">
                    {users.length} Total Users
                  </span>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0 fw-semibold text-dark py-3">
                        <i className="bi bi-envelope me-2"></i>Email
                      </th>
                      <th className="border-0 fw-semibold text-dark py-3">
                        <i className="bi bi-person-badge me-2"></i>Full Name
                      </th>
                      <th className="border-0 fw-semibold text-dark py-3">
                        <i className="bi bi-shield-check me-2"></i>Role
                      </th>
                      <th className="border-0 fw-semibold text-dark py-3">
                        <i className="bi bi-power me-2"></i>Status
                      </th>
                      <th className="border-0 fw-semibold text-dark py-3 text-end">
                        <i className="bi bi-gear me-2"></i>Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-0">
                        <td className="py-3 border-0">
                          <div className="d-flex align-items-center">
                            <div className="bg-info bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                              <i className="bi bi-at text-white"></i>
                            </div>
                            <span className="fw-medium">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 border-0">
                          <div className="d-flex align-items-center">
                            <div className="bg-secondary bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                              <i className="bi bi-person text-white"></i>
                            </div>
                            <span className="fw-medium">{user.fullName}</span>
                          </div>
                        </td>
                        <td className="py-3 border-0">
                          {user.role === 'ADMIN' ? (
                            <span className="badge bg-primary bg-gradient px-3 py-2">
                              <i className="bi bi-shield-fill-check me-1"></i>Admin
                            </span>
                          ) : (
                            <span className="badge bg-secondary bg-gradient px-3 py-2">
                              <i className="bi bi-person-circle me-1"></i>User
                            </span>
                          )}
                        </td>
                        <td className="py-3 border-0">
                          {user.active ? (
                            <span className="badge bg-success bg-gradient px-3 py-2">
                              <i className="bi bi-check-circle me-1"></i>Active
                            </span>
                          ) : (
                            <span className="badge bg-danger bg-gradient px-3 py-2">
                              <i className="bi bi-x-circle me-1"></i>Inactive
                            </span>
                          )}
                        </td>
                        <td className="py-3 border-0 text-end">
                          <div className="btn-group" role="group">
                            <button
                              className="btn btn-sm btn-outline-success"
                              title="Toggle Role"
                              onClick={() => handleToggleRole(user.id)}
                            >
                              <i className="bi bi-shield-check"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              title="Toggle Active"
                              onClick={() => handleToggleActive(user.id)}
                            >
                              <i className="bi bi-arrow-clockwise"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Edit Name"
                              onClick={() => handleEditName(user.id, user.fullName)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                              onClick={() => handleDelete(user.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminUsers;