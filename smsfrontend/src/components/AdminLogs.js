import React, { useEffect, useState } from 'react';
import { getToken } from '../services/authService';
import AdminSidebarLayout from './AdminSidebarLayout';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const token = getToken();
    fetch('http://localhost:9190/api/admin/logs', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.reverse()); // newest first
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch logs', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const paginatedLogs = logs.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminSidebarLayout>
      <div className="container-fluid px-4 py-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex align-items-center mb-4">
              <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px'}}>
                <i className="bi bi-clipboard-data text-white fs-4"></i>
              </div>
              <div>
                <h2 className="mb-0 fw-bold text-dark">User Activity Logs</h2>
                <p className="text-muted mb-0">Monitor and track user activities across the platform</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading activity logs...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-5">
            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{width: '80px', height: '80px'}}>
              <i className="bi bi-inbox fs-1 text-muted"></i>
            </div>
            <h5 className="text-muted">No Activity Logs Available</h5>
            <p className="text-muted">User activity logs will appear here once users start interacting with the platform.</p>
          </div>
        ) : (
          <>
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 py-3">
                <div className="row align-items-center">
                  <div className="col">
                    <h6 className="mb-0 fw-semibold">
                      <i className="bi bi-list-ul me-2"></i>
                      Activity Overview
                    </h6>
                  </div>
                  <div className="col-auto">
                    <span className="badge bg-primary bg-gradient">
                      {logs.length} Total Logs
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
                          <i className="bi bi-person-circle me-2"></i>User Email
                        </th>
                        <th className="border-0 fw-semibold text-dark py-3">
                          <i className="bi bi-activity me-2"></i>Action
                        </th>
                        <th className="border-0 fw-semibold text-dark py-3">
                          <i className="bi bi-info-circle me-2"></i>Description
                        </th>
                        <th className="border-0 fw-semibold text-dark py-3">
                          <i className="bi bi-clock me-2"></i>Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedLogs.map((log) => (
                        <tr key={log.id} className="border-0">
                          <td className="py-3 border-0">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                                <i className="bi bi-person text-white"></i>
                              </div>
                              <span className="fw-medium">{log.userEmail}</span>
                            </div>
                          </td>
                          <td className="py-3 border-0">
                            <span className="badge bg-success bg-gradient px-3 py-2">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 border-0 text-muted">{log.description}</td>
                          <td className="py-3 border-0">
                            <div className="d-flex align-items-center text-muted">
                              <i className="bi bi-calendar3 me-2"></i>
                              <small>{formatDate(log.timestamp)}</small>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-muted">
                Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, logs.length)} of {logs.length} entries
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <i className="bi bi-chevron-left me-1"></i>
                  Previous
                </button>
                <button
                  className="btn btn-outline-primary d-flex align-items-center"
                  disabled={page * perPage >= logs.length}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                  <i className="bi bi-chevron-right ms-1"></i>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminLogs;