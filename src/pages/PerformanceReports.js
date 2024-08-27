import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { Link, useNavigate } from 'react-router-dom';
import './PerformanceReports.css'; // Ensure to create and include this CSS file

const PerformanceReports = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [performance, setPerformance] = useState(null);
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

  const fetchPerformance = async (employeeId) => {
    try {
      console.log(`Fetching performance for employee ID: ${employeeId}`);
      const res = await axiosInstance.get(`/performance/${employeeId}`);
      setPerformance(res.data);
    } catch (error) {
      console.error('Error fetching performance', error);
      alert('Failed to fetch performance');
    }
  };

  const handleEmployeeSelect = (e) => {
    setSelectedEmployee(e.target.value);
    fetchPerformance(e.target.value);
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
    <div className="performance-reports-container">
      <h2>Reports</h2>
      <div className="mb-3">
        <label htmlFor="employee" className="form-label">Select Employee</label>
        <select
          className="form-control"
          id="employee"
          value={selectedEmployee}
          onChange={handleEmployeeSelect}
        >
          <option value="">Select an employee</option>
          {filteredEmployees.map(employee => (
            <option key={employee._id} value={employee._id}>
              {employee.user.name} ({employee.user.email})
            </option>
          ))}
        </select>
      </div>
      {performance && (
        <div className="performance-details">
          <h3>Goals and Reviews</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Completion Percentage</th>
                <th>Actions</th>
                <th>Feedback</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {performance.goals && performance.goals.length > 0 ? (
                performance.goals.map(goal => (
                  <tr key={goal._id}>
                    <td>{goal.goals}</td>
                    <td>{goal.completionPercentage}%</td>
                    <td>
                      <Link to={`/review-performance/${selectedEmployee}/${goal._id}`} className="btn btn-success text-white">Review</Link>
                    </td>
                    <td>
                      {performance.reviews.filter(review => review.goal && review.goal._id === goal._id).map(review => (
                        <div key={review._id}>{review.feedback} - {review.completionPercentage}%</div>
                      ))}
                    </td>
                    <td>
                      {performance.reviews.filter(review => review.goal && review.goal._id === goal._id).map(review => (
                        <div key={review._id}>{review.rating}</div>
                      ))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No performance on record</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PerformanceReports;
