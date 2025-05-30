import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// ✅ Components
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './components/PrivateRoute';
import CategoriesAndNumbers from './components/CategoriesAndNumbers';
import SmsInsights from './components/SmsInsights'; // ✅ import component

import UserDashboard from './components/UserDashboard';
import UserSupport from './components/UserSupport';
import Settings from './components/Settings'; // ✅ Added Settings
import SendSms from './components/SendSms'; // ⬅️ add import
import AdminDashboard from './components/AdminDashboard';
import AdminUsers from './components/AdminUsers';
import AdminLogs from './components/AdminLogs';
import AdminSupport from './components/AdminSupport';

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 👤 User routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <UserDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/support"
          element={
            <PrivateRoute>
              <UserSupport />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
<Route
  path="/sms-insights"
  element={
    <PrivateRoute>
      <SmsInsights />
    </PrivateRoute>
  }
/>


<Route
  path="/send-sms"
  element={
    <PrivateRoute>
      <SendSms />
    </PrivateRoute>
  }
/>
<Route path="/send-sms" element={<SendSms />} />



        {/* 🛡️ Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <PrivateRoute>
              <AdminLogs />
            </PrivateRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <CategoriesAndNumbers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/support"
          element={
            <PrivateRoute>
              <AdminSupport />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
