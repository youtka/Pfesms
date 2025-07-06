import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser, FaSignOutAlt, FaTachometerAlt, FaCog,
  FaUsers, FaFileAlt, FaBars, FaEnvelope
} from 'react-icons/fa';
import './SidebarLayout.css';
import { getCurrentUser } from '../services/authService';

const AdminSidebarLayout = ({ children }) => {
  const [user, setUser] = useState({ fullName: '...' });
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    getCurrentUser()
      .then(data => setUser(data))
      .catch(err => console.error('User fetch failed:', err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNav = (label, path) => {
    navigate(path);
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="top">
          <div className="brand">
            <FaBars className="menu-icon" />
            <span className="brand-name">SMS Admin</span>
          </div>
          <ul className="nav-links">
            <li className={path === '/admin/dashboard' ? 'active' : ''} onClick={() => handleNav('Dashboard', '/admin/dashboard')}>
              <FaTachometerAlt /> <span>Dashboard</span>
            </li>
            <li className={path === '/admin/users' ? 'active' : ''} onClick={() => handleNav('Users', '/admin/users')}>
              <FaUsers /> <span>Users</span>
            </li>
            <li className={path === '/admin/logs' ? 'active' : ''} onClick={() => handleNav('Logs', '/admin/logs')}>
              <FaFileAlt /> <span>Logs</span>
            </li>
            <li className={path === '/admin/support' ? 'active' : ''} onClick={() => handleNav('Support', '/admin/support')}>
              <FaEnvelope /> <span>Support</span>
            </li>
          </ul>
        </div>

        <div className="bottom-links">
          <li onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </li>

        </div>
      </div>

      <div className="main-content">
        <div className="user-info">
          <FaUser className="me-2" />
          {user.fullName}
        </div>
        {children}
      </div>
    </div>
  );
};

export default AdminSidebarLayout;
