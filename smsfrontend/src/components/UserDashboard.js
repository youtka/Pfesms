import React, { useEffect, useState } from 'react';
import UserSidebarLayout from './UserSidebarLayout';
import { getToken } from '../services/authService';
import { FaChartBar, FaSms, FaListAlt, FaTags } from 'react-icons/fa';
import './Dashboard.css';

import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const UserDashboard = () => {
  const [stats, setStats] = useState({
    totalSmsSent: 0,
    totalCategories: 0,
    totalNumbers: 0,
    totalAiMessages: 0,
    messagesPerCategory: {},
    messagesPerDay: {}
  });
  const [loading, setLoading] = useState(true);

  // ✅ Modify chart labels: replace ObjectId with "Manual"
  const categoryChartData = Object.entries(stats.messagesPerCategory || {}).map(
    ([name, value]) => {
      const displayName = /^[0-9a-f]{24}$/.test(name) ? 'Manual' : name;
      return { name: displayName, value };
    }
  );

  const dayChartData = Object.entries(stats.messagesPerDay || {}).map(
    ([date, count]) => ({ date, count })
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const token = getToken();
    fetch('http://localhost:9190/api/statistics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched Data:', data);
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch stats', err);
        setLoading(false);
      });
  }, []);

  return (
    <UserSidebarLayout>
      <div className="container mt-4">
        <h2 className="mb-4">
          <FaChartBar className="me-2" />
          Your Dashboard
        </h2>

        <div className="row g-3">
          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FaSms size={24} className="mb-2 text-primary" />
                <h5 className="card-title">Total SMS Sent</h5>
                <p className="card-text fs-4 fw-bold">
                  {loading ? 'Loading...' : stats.totalSmsSent}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FaTags size={24} className="mb-2 text-success" />
                <h5 className="card-title">Categories</h5>
                <p className="card-text fs-4 fw-bold">
                  {loading ? 'Loading...' : stats.totalCategories}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FaListAlt size={24} className="mb-2 text-danger" />
                <h5 className="card-title">Phone Numbers</h5>
                <p className="card-text fs-4 fw-bold">
                  {loading ? 'Loading...' : stats.totalNumbers}
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <FaChartBar size={24} className="mb-2 text-warning" />
                <h5 className="card-title">AI Messages</h5>
                <p className="card-text fs-4 fw-bold">
                  {loading ? 'Loading...' : stats.totalAiMessages}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-3 mt-4">
          {/* Pie Chart - Messages per Category */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Messages per Category</h5>
                {categoryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryChartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label
                      >
                        {categoryChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center">No data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Bar Chart - Messages per Day */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-center">Messages per Day</h5>
                {dayChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dayChartData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center">No data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserSidebarLayout>
  );
};

export default UserDashboard;
