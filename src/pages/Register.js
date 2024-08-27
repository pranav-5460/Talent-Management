import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/users/register', formData);
      console.log(res.data);
      // If the user is HR, show a message that approval is pending
      if (formData.role === 'HR') {
        alert('HR registration is pending approval. You will receive an email once approved.');
        navigate('/login');
      } else {
        // Automatically log in the user and navigate to the profile creation page
        const loginRes = await axiosInstance.post('/users/login', { email: formData.email, password: formData.password });
        localStorage.setItem('token', loginRes.data.token);
        navigate('/profile');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-image"></div>
      <div className="register-form">
        <h2>Create a new account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" id="name" name="name" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" name="email" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" name="password" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select className="form-control" id="role" name="role" onChange={handleChange} value={formData.role}>
              <option value="employee">Employee</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <div className="mt-3 text-center">
          <p>Already have an account? <a href="/login">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
