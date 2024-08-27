import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axios';
import './Employees.css'; // Import the CSS file

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState('');
  const baseURL = 'http://localhost:5000'; // Base URL for your backend server

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserRole(user.role);

        const res = await axiosInstance.get('/profile');
        setEmployees(res.data);
      } catch (error) {
        console.error('Error fetching employees', error);
        alert('Failed to fetch employees');
      }
    };
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/profile/${id}`);
      setEmployees(employees.filter(employee => employee._id !== id));
    } catch (error) {
      console.error('Error deleting employee', error);
      alert('Error deleting employee');
    }
  };

  const canDelete = (employeeRole) => {
    if (currentUserRole === 'manager') {
      return true;
    } else if (currentUserRole === 'HR' && employeeRole !== 'HR') {
      return true;
    }
    return false;
  };

  return (
    <div className="applications-container">
      <h2>Employees</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee._id}>
              <td>
                {employee.picture ? (
                  <img src={employee.picture.startsWith('/uploads/') ? `${baseURL}${employee.picture}` : `${baseURL}/uploads/${employee.picture}`} alt="Profile" className="img-circle" />
                ) : (
                  'No Picture'
                )}
              </td>
              <td>{employee.user.name}</td>
              <td>{employee.user.email}</td>
              <td>{employee.user.role}</td>
              <td className="button-group">
                <Link to={`/employee/${employee._id}`} className="btn btn-primary btn-sm">View</Link>
                {canDelete(employee.user.role) && (
                  <button onClick={() => handleDelete(employee._id)} className="btn btn-danger btn-sm">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
