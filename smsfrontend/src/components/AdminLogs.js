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
      <div className="container mt-4">
        <h4 className="mb-4">📋 User Activity Logs</h4>

        {loading ? (
          <p>Loading...</p>
        ) : logs.length === 0 ? (
          <p>No logs available.</p>
        ) : (
          <div className="table-responsive shadow-sm border rounded">
            <table className="table table-striped table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>User Email</th>
                  <th>Action</th>
                  <th>Description</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.userEmail}</td>
                    <td>{log.action}</td>
                    <td>{log.description}</td>
                    <td>{formatDate(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="d-flex justify-content-end mt-3">
          <button
            className="btn btn-sm btn-outline-secondary me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={page * perPage >= logs.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </AdminSidebarLayout>
  );
};

export default AdminLogs;
