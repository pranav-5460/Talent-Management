import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios';
import './Login.css';

const Login = ({ setIsAuthenticated, setUserRole }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/login', formData); // Update the endpoint if necessary
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.role);
      setIsAuthenticated(true);
      setUserRole(res.data.role);

      if (res.data.role === 'manager') {
        navigate('/manager-dashboard');
      } else if (res.data.role === 'HR' && !res.data.isProfileSetup) {
        navigate('/profile');
      } else if (res.data.role === 'HR') {
        navigate('/hr-dashboard');
      } else if (!res.data.isProfileSetup) {
        navigate('/profile');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image"></div>
      <div className="login-form">
        <h2>Login to your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="mt-3 text-center">
          <p>Don't have an account? <a href="/register">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
