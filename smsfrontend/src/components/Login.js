import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import illustration from '../assets/logoicon.png';

function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9190/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const token = await response.text();

      if (response.ok) {
        localStorage.setItem('token', token);

        // ✅ Decode the token to check if admin
        const decoded = jwtDecode(token);
        console.log("📦 Decoded Token:", decoded); // debug

        const isAdmin = decoded.isAdmin === true;
        alert('✅ Logged in successfully!');

        // ✅ Navigate by role
        navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
      } else {
        alert('❌ Login failed: ' + token);
      }
    } catch (error) {
      alert('🚨 Error: ' + error.message);
    }
  };

  return (
    <div className="row vh-100">
      <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-primary text-white p-5">
        <img src={illustration} alt="SMS CRM" className="img-fluid mb-4" style={{ maxWidth: 300 }} />
        <h3>SMS Camping CRM</h3>
        <p className="text-light text-center">Send text online without worrying about phone bills.</p>
      </div>

      <div className="col-md-6 d-flex align-items-center justify-content-center">
        <form className="w-75" onSubmit={handleSubmit}>
          <h4 className="mb-4">Login to Your Account</h4>
          <div className="form-group mb-3">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>

          <button className="btn btn-primary w-100">Log In</button>
          <p className="mt-3 text-center">
            Don’t have an account? <a href="/register">Sign Up</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
