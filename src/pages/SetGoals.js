import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { useNavigate } from 'react-router-dom';
import './SetGoals.css'; // Ensure to create and include this CSS file

const SetGoals = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [goals, setGoals] = useState('');
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token.split('.')[1]));
        setUserRole(user.role);

        if (user.role !== 'manager' && user.role !== 'HR') {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user role', error);
        alert('Failed to fetch user role');
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get('/profile');
        setEmployees(res.data);
      } catch (error) {
        console.error('Error fetching employees', error);
        alert('Failed to fetch employees');
      }
    };

    fetchUserRole();
    fetchEmployees();
  }, [navigate]);

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/goals', {
        employee: selectedEmployee,
        goals,
      });
      alert('Goals set successfully');
    } catch (error) {
      console.error('Error setting goals', error);
      alert('Failed to set goals');
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    if (userRole === 'manager') {
      return true;
    } else if (userRole === 'HR') {
      return employee.user.role !== 'HR';
    }
    return false;
  });

  return (
    <div className="set-goals-container">
      <h2>Set Goals for Employees</h2>
      <form onSubmit={handleGoalSubmit}>
        <div className="mb-3">
          <label htmlFor="employee" className="form-label">Select Employee</label>
          <select
            className="form-control"
            id="employee"
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select an employee</option>
            {filteredEmployees.map(employee => (
              <option key={employee._id} value={employee._id}>
                {employee.user.name} ({employee.user.email})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="goals" className="form-label">Goals</label>
          <textarea
            className="form-control"
            id="goals"
            rows="3"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Set Goals</button>
      </form>
    </div>
  );
};

export default SetGoals;
