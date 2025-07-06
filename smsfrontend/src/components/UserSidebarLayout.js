import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser, FaSignOutAlt, FaTachometerAlt, FaCog,
  FaEnvelope, FaListUl, FaBrain
} from 'react-icons/fa';
import './SidebarLayout.css';
import { getCurrentUser } from '../services/authService';

const UserSidebarLayout = ({ children }) => {
  const [user, setUser] = useState({ fullName: '...' });
  const [hasNewSupportMsg, setHasNewSupportMsg] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    getCurrentUser()
      .then(data => setUser(data))
      .catch(err => console.error('User fetch failed:', err));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const checkNewMessages = () => {
      fetch('http://localhost:9190/api/support/new', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setHasNewSupportMsg(data.hasNew))
        .catch(() => setHasNewSupportMsg(false));
    };

    checkNewMessages();
    const interval = setInterval(checkNewMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNav = (path) => {
    navigate(path);
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="top">
          <div className="brand">
            <FaUser className="menu-icon" />
            <span className="brand-name">SMS User</span>
          </div>
          <ul className="nav-links">
            <li className={path === '/dashboard' ? 'active' : ''} onClick={() => handleNav('/dashboard')}>
              <FaTachometerAlt /> <span>Dashboard</span>
            </li>
            <li className={path === '/categories' ? 'active' : ''} onClick={() => handleNav('/categories')}>
              <FaListUl /> <span>Categories</span>
            </li>
            <li className={path === '/send-sms' ? 'active' : ''} onClick={() => handleNav('/send-sms')}>
              <FaEnvelope /> <span>Send SMS</span>
            </li>
            <li className={path === '/sms-insights' ? 'active' : ''} onClick={() => handleNav('/sms-insights')}>
              <FaBrain /> <span>AI Insights</span>
            </li>
            <li className={path === '/support' ? 'active' : ''} onClick={() => handleNav('/support')}>
              <FaEnvelope /> <span>Support</span>
              {hasNewSupportMsg && <span className="notif-badge">1</span>}
            </li>
            <li className={path === '/settings' ? 'active' : ''} onClick={() => handleNav('/settings')}>
              <FaCog /> <span>Settings</span>
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

export default UserSidebarLayout;