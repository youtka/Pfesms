import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import illustration from '../assets/loginicon3.png';

function Register() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate(); // 👈 import useNavigate

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:9190/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.text();

      if (response.ok) {
        alert('✅ Registered successfully!');
        navigate('/'); // 👈 move to login page
      } else {
        alert('❌ Registration failed: ' + result);
      }
    } catch (error) {
      alert('🚨 Error: ' + error.message);
    }
  };

  return (
    <div className="row vh-100">
      {/* Left Side */}
      <div className="col-md-6 d-flex flex-column justify-content-center align-items-center bg-primary text-white p-5">
        <img src={illustration} alt="SMS CRM" className="img-fluid mb-4" style={{ maxWidth: 300 }} />
        <h3>SMS Camping CRM</h3>
        <p className="text-light text-center">Send text online without worrying about phone bills.</p>
      </div>

      {/* Right Side */}
      <div className="col-md-6 d-flex align-items-center justify-content-center">
        <form className="w-75" onSubmit={handleSubmit}>
          <h4 className="mb-4">Sign Up for an Account</h4>
          <div className="form-group mb-3">
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className="form-control"
              placeholder="Full Name"
              required
            />
          </div>
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
          <div className="form-group mb-2">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
              minLength={8}
            />
          </div>
          <small className="text-danger d-block mb-3">
            {form.password.length < 8 && form.password !== ''
              ? 'Your password is not strong enough. Use at least 8 characters'
              : ''}
          </small>

          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" required />
            <label className="form-check-label">
              By creating an account you agree to the <a href="#">Terms</a> & <a href="#">Privacy</a>
            </label>
          </div>

          <button className="btn btn-primary w-100">Sign Up</button>
          <p className="mt-3 text-center">
            Already have an account? <a href="/">Log In</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
