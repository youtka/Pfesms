import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaUser, FaSignOutAlt, FaTachometerAlt, FaCog, FaEnvelope
} from 'react-icons/fa';
import './SidebarLayout.css';
import { getCurrentUser } from '../services/authService';

const UserSidebarLayout = ({ children }) => {
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
            <li className={path === '/support' ? 'active' : ''} onClick={() => handleNav('/support')}>
              <FaEnvelope /> <span>Support</span>
            </li>
          </ul>
        </div>

        <div className="bottom-links">
          <li onClick={handleLogout}>
            <FaSignOutAlt /> <span>Logout</span>
          </li>
          <li>
            <FaCog /> <span>Settings</span>
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
