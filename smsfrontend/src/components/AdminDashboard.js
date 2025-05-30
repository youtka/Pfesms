import React, { useEffect, useState } from 'react';
import AdminSidebarLayout from './AdminSidebarLayout';
import { getToken } from '../services/authService';
import { FaUsers, FaUserCheck, FaEnvelope, FaRobot, FaShieldAlt } from 'react-icons/fa';
import './Dashboard.css'; // If you’re styling cards

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMessages: 0,
    aiMessages: 0,
  });

  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [logPage, setLogPage] = useState(1);
  const perPage = 5;

  const token = getToken();

  useEffect(() => {
    fetch('http://localhost:9190/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);

    fetch('http://localhost:9190/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(console.error);

    fetch('http://localhost:9190/api/admin/logs', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(console.error);
  }, []);

  const paginatedUsers = users.slice((userPage - 1) * perPage, userPage * perPage);
  const paginatedLogs = logs.slice((logPage - 1) * perPage, logPage * perPage);

  return (
    <AdminSidebarLayout>
      <div className="container mt-4">
        <h2 className="mb-4"><FaUsers className="me-2" />Welcome to the Admin Dashboard</h2>

        <div className="row g-3 mb-4">
          {[{
            icon: <FaUsers />,
            label: 'Total Users',
            value: stats.totalUsers,
            color: 'text-primary'
          }, {
            icon: <FaUserCheck />,
            label: 'Active Users',
            value: stats.activeUsers,
            color: 'text-success'
          }, {
            icon: <FaEnvelope />,
            label: 'Total Messages',
            value: stats.totalMessages,
            color: 'text-info'
          }, {
            icon: <FaRobot />,
            label: 'AI Messages',
            value: stats.aiMessages,
            color: 'text-warning'
          }].map((card, i) => (
            <div key={i} className="col-md-3">
              <div className="card text-center shadow-sm">
                <div className="card-body">
                  {React.cloneElement(card.icon, { size: 24, className: `mb-2 ${card.color}` })}
                  <h5 className="card-title">{card.label}</h5>
                  <p className="fs-4 fw-bold">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <h5 className="mt-4">All Users</h5>
        <div className="table-responsive mb-3 rounded shadow-sm border">
          <table className="table table-striped mb-0 table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Active</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u, i) => (
                <tr key={i}>
                  <td>{u.email}</td>
                  <td>
                    {u.active ? (
                      <span className="badge bg-success">Active</span>
                    ) : (
                      <span className="badge bg-danger">Inactive</span>
                    )}
                  </td>
                  <td>{u.role === 'ADMIN' ? <FaShieldAlt className="text-primary" /> : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end mb-4">
          <button className="btn btn-sm btn-outline-secondary me-2" disabled={userPage === 1} onClick={() => setUserPage(userPage - 1)}>Prev</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={userPage * perPage >= users.length} onClick={() => setUserPage(userPage + 1)}>Next</button>
        </div>

        {/* Logs Table */}
        <h5>User Activity Logs</h5>
        <div className="table-responsive rounded shadow-sm border">
          <table className="table table-sm table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Email</th>
                <th>Action</th>
                <th>Description</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log, i) => (
                <tr key={i}>
                  <td>{log.userEmail}</td>
                  <td>{log.action}</td>
                  <td>{log.description}</td>
                  <td>{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-sm btn-outline-secondary me-2" disabled={logPage === 1} onClick={() => setLogPage(logPage - 1)}>Prev</button>
          <button className="btn btn-sm btn-outline-secondary" disabled={logPage * perPage >= logs.length} onClick={() => setLogPage(logPage + 1)}>Next</button>
        </div>
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminDashboard;
