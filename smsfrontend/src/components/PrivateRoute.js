import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService'; // ✅ تعديل المسار

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
