import React, { useEffect, useState } from 'react';
import UserSidebarLayout from './UserSidebarLayout';
import { getToken } from '../services/authService';
import { FaChartBar, FaSms, FaListAlt, FaTags, FaRocket, FaCalendarAlt, FaChartLine, FaUser } from 'react-icons/fa';
import './Dashboard.css';

import {
  PieChart, Pie, Cell,
  ResponsiveContainer,
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend
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

  // Twilio config check not needed anymore
  // const [hasTwilioConfig, setHasTwilioConfig] = useState(true);

  const categoryChartData = Object.entries(stats.messagesPerCategory || {}).map(
    ([name, value]) => {
      const displayName = /^[0-9a-f]{24}$/.test(name) ? 'Manual' : name;
      return { name: displayName, value };
    }
  );

  const dayChartData = Object.entries(stats.messagesPerDay || {}).map(
    ([date, count]) => ({ date, count })
  );

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];

  useEffect(() => {
    const token = getToken();

    // يمكنك تحيد هاد الكود ديال Twilio config check:
    /*
    fetch('http://localhost:9190/api/twilio/get-my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.sid && data.authToken && data.fromNumber) {
          setHasTwilioConfig(true);
        } else {
          setHasTwilioConfig(false);
        }
      })
      .catch(() => setHasTwilioConfig(false));
    */

    // fetch stats
    fetch('http://localhost:9190/api/statistics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
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
      <div className="container-fluid px-4 py-4" style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        {/* ✅ ALERT HAYED: Twilio config alert removed */}

        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="h3 mb-1 fw-bold text-dark">
                  <FaUser className="me-2 text-primary" />
                  Your Dashboard
                </h1>
                <p className="text-muted mb-0">Track your messaging performance and insights</p>
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

        <div className="row g-4 mb-5">
          {[{
            icon: <FaSms />, label: 'Total SMS Sent', value: stats.totalSmsSent,
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', change: '+12%'
          }, {
            icon: <FaTags />, label: 'Categories', value: stats.totalCategories,
            gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', change: '+3'
          }, {
            icon: <FaListAlt />, label: 'Phone Numbers', value: stats.totalNumbers,
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', change: '+8'
          }, {
            icon: <FaRocket />, label: 'AI Messages', value: stats.totalAiMessages,
            gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', change: '+24%'
          }].map((card, i) => (
            <div key={i} className="col-xl-3 col-md-6">
              <div className="card border-0 shadow-sm h-100 position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{ background: card.gradient }}></div>
                <div className="card-body position-relative text-white">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center justify-content-center rounded-3 shadow-sm" style={{ width: '48px', height: '48px', background: card.gradient }}>
                      {React.cloneElement(card.icon, { size: 20, className: 'text-white' })}
                    </div>
                    <span className="badge bg-white text-dark fw-bold">{card.change}</span>
                  </div>
                  <h3 className="fw-bold mb-1">{card.value}</h3>
                  <p className="mb-0">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold"><FaTags className="me-2 text-primary" />Messages by Category</h5>
                <div className="badge bg-primary bg-opacity-10 text-primary">Distribution</div>
              </div>
              <div className="card-body">
                {loading ? <div>Loading...</div> : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryChartData} dataKey="value" nameKey="name" outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {categoryChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Messages']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-semibold"><FaChartLine className="me-2 text-success" />Daily Activity</h5>
                <div className="badge bg-success bg-opacity-10 text-success">Trends</div>
              </div>
              <div className="card-body">
                {loading ? <div>Loading...</div> : (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dayChartData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#11998e" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#11998e" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e6ed" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#11998e" fill="url(#colorCount)" />
                    </AreaChart>
                  </ResponsiveContainer>
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
