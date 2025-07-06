import React, { useEffect, useState } from 'react';
import AdminSidebarLayout from './AdminSidebarLayout';
import { getToken } from '../services/authService';
import { FaUsers, FaUserCheck, FaEnvelope, FaShieldAlt, FaTrophy, FaChartLine, FaCalendarAlt, FaEye } from 'react-icons/fa';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalSmsSent: 0,
    topUsers: [],
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
      <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1 fw-bold text-dark">Dashboard Overview</h1>
                <p className="text-muted mb-0">Welcome back! Here's what's happening with your platform today.</p>
              </div>
              <div className="d-flex align-items-center">
                <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill">
                  <FaCalendarAlt className="me-2" />
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="row g-4 mb-5">
          {[
            {
              icon: <FaUsers />,
              label: 'Total Users',
              value: stats.totalUsers,
              color: 'primary',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              change: '+12%',
              changeType: 'positive'
            },
            {
              icon: <FaUserCheck />,
              label: 'Active Users',
              value: stats.activeUsers,
              color: 'success',
              gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
              change: '+8%',
              changeType: 'positive'
            },
            {
              icon: <FaEnvelope />,
              label: 'Total SMS Sent',
              value: stats.totalSmsSent,
              color: 'info',
              gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              change: '+23%',
              changeType: 'positive'
            },
            {
              icon: <FaChartLine />,
              label: 'Growth Rate',
              value: '94.2%',
              color: 'warning',
              gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              change: '+5.2%',
              changeType: 'positive'
            }
          ].map((card, i) => (
            <div key={i} className="col-xl-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                  style={{ background: card.gradient }}
                ></div>
                <div className="card-body position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 shadow-sm"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: card.gradient
                      }}
                    >
                      {React.cloneElement(card.icon, { size: 20, className: 'text-white' })}
                    </div>
                    <span className={`badge bg-${card.changeType === 'positive' ? 'success' : 'danger'} bg-opacity-10 text-${card.changeType === 'positive' ? 'success' : 'danger'}`} style={{ color: 'white' }}>
                      {card.change}
                    </span>
                  </div>
                  <h3 className="fw-bold mb-1" style={{ color: 'white' }}>{card.value}</h3>
                  <p className="text-muted mb-0 small" style={{ color: 'white' }}>{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* All Users Card */}
          <div className="col-xl-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-semibold" style={{ color: 'white' }}>
                    <FaUsers className="me-2 text-primary" />
                    All Users
                  </h5>
                  <button className="btn btn-sm btn-outline-primary">
                    <FaEye className="me-1" />
                    View All
                  </button>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-4">User</th>
                        <th className="border-0">Status</th>
                        <th className="border-0">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((u, i) => (
                        <tr key={i}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: '40px', height: '40px' }}
                              >
                                {u.email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="fw-medium">{u.email}</div>
                                <small className="text-muted">Member since 2024</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge rounded-pill ${u.active ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                              {u.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            {u.role === 'ADMIN' ?
                              <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                                <FaShieldAlt className="me-1" />
                                Admin
                              </span> :
                              <span className="text-muted">User</span>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Showing {(userPage - 1) * perPage + 1} to {Math.min(userPage * perPage, users.length)} of {users.length} users
                  </small>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={userPage === 1}
                      onClick={() => setUserPage(userPage - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={userPage * perPage >= users.length}
                      onClick={() => setUserPage(userPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Users Card */}
          <div className="col-xl-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-semibold" style={{ color: 'white' }}>
                  <FaTrophy className="me-2 text-warning" />
                  Top Performers
                </h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {(stats.topUsers || []).slice(0, 5).map((user, index) => (
                    <div key={index} className="list-group-item border-0 px-0 py-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ width: '32px', height: '32px', fontSize: '12px' }}
                        >
                          #{index + 1}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-medium small">{user.email}</div>
                          <div className="progress mt-1" style={{ height: '4px' }}>
                            <div
                              className="progress-bar bg-warning"
                              style={{ width: `${Math.min((user.smsCount / Math.max(...(stats.topUsers || []).map(u => u.smsCount), 1)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="badge bg-warning bg-opacity-10 text-warning ms-2">
                          {user.smsCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-semibold" style={{ color: 'white' }}>
                  <FaChartLine className="me-2 text-info" />
                  Recent Activity
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="border-0 ps-4">User</th>
                        <th className="border-0">Action</th>
                        <th className="border-0">Description</th>
                        <th className="border-0">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLogs.map((log, i) => (
                        <tr key={i}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div
                                className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: '32px', height: '32px' }}
                              >
                                {log.userEmail.charAt(0).toUpperCase()}
                              </div>
                              <span className="fw-medium">{log.userEmail}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                              {log.action}
                            </span>
                          </td>
                          <td>
                            <span className="text-muted">{log.description}</span>
                          </td>
                          <td>
                            <small className="text-muted">{log.timestamp}</small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="card-footer bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Showing {(logPage - 1) * perPage + 1} to {Math.min(logPage * perPage, logs.length)} of {logs.length} activities
                  </small>
                  <div className="btn-group" role="group">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={logPage === 1}
                      onClick={() => setLogPage(logPage - 1)}
                    >
                      Previous
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      disabled={logPage * perPage >= logs.length}
                      onClick={() => setLogPage(logPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminDashboard;