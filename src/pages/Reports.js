import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { Line, Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';
import { useNavigate, Link } from 'react-router-dom';
import './Reports.css'; // Import the CSS file

const Reports = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [performance, setPerformance] = useState(null);
  const [performances, setPerformances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token.split('.')[1]));
        setUserRole(user.role);

        if (user.role !== 'manager') {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error fetching user role', error);
        setError('Failed to fetch user role');
      }
    };

    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get('/profile');
        setEmployees(res.data);
      } catch (error) {
        console.error('Error fetching employees', error);
        setError('Failed to fetch employees');
      }
    };

    fetchUserRole();
    fetchEmployees();
  }, [navigate]);

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        const res = await axiosInstance.get('/performance');
        setPerformances(res.data);
      } catch (error) {
        console.error('Error fetching performances:', error);
        setError(error.response?.data?.message || 'Error fetching performance data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerformances();
  }, []);

  const fetchPerformance = async (employeeId) => {
    try {
      const res = await axiosInstance.get(`/performance/${employeeId}`);
      console.log('Performance Data:', res.data);
      setPerformance(res.data);
      setError(''); // Clear any previous error
    } catch (error) {
      console.error('Error fetching performance', error);
      if (error.response && error.response.status === 404) {
        setError('No performance found');
        setPerformance(null); // Clear previous performance data
      } else {
        setError('Failed to fetch performance');
      }
    }
  };

  const handleEmployeeSelect = (e) => {
    setSelectedEmployee(e.target.value);
    fetchPerformance(e.target.value);
  };

  const getEmployeePerformanceData = () => {
    if (!performance || !performance.reviews) {
      return {};
    }

    const sortedReviews = performance.reviews
      .filter(review => moment(review.date).isAfter(moment().subtract(30, 'days')))
      .sort((a, b) => moment(a.date) - moment(b.date));

    return {
      labels: sortedReviews.map(review => moment(review.date).format('YYYY-MM-DD')),
      datasets: [
        {
          label: 'Employee Performance Over Time',
          data: sortedReviews.map(review => review.rating),
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };
  };

  const getMonthlyRatingsData = () => {
    const filteredPerformances = performances.filter(perf =>
      perf.reviews.some(review => moment(review.date).isSame(moment(), 'month'))
    );

    const labels = filteredPerformances.map(perf => perf.employee?.name || 'Unknown');
    const data = filteredPerformances.map(perf => {
      const monthlyReviews = perf.reviews.filter(review =>
        moment(review.date).isSame(moment(), 'month')
      );
      const totalRating = monthlyReviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / monthlyReviews.length;
      return averageRating;
    });

    const sortedData = labels.map((label, index) => ({
      label,
      data: data[index],
    })).sort((a, b) => b.data - a.data);

    return {
      labels: sortedData.map(item => item.label),
      datasets: [
        {
          label: 'Employee Ratings for the Month',
          data: sortedData.map(item => item.data),
          backgroundColor: 'rgba(153,102,255,0.4)',
          borderColor: 'rgba(153,102,255,1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <label htmlFor="employee" className="form-label">Select Employee</label>
        <select
          className="form-control"
          id="employee"
          value={selectedEmployee}
          onChange={handleEmployeeSelect}
        >
          <option value="">Select an employee</option>
          {employees.map(employee => (
            <option key={employee._id} value={employee._id}>
              {employee.user.name} ({employee.user.email})
            </option>
          ))}
        </select>
      </div>
      <div className="chart-container">
        {performance ? (
          <>
            <div className="chart-container">
              <h3>Employee Performance Over Time (Last 30 Days)</h3>
              <Line data={getEmployeePerformanceData()} />
              <table className="table">
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
                          <Link to={`/review-performance/${selectedEmployee}/${goal._id}`} className="btn btn-success btn-sm">Review</Link>
                        </td>
                        <td>
                          {performance.reviews.filter(review => review.goal._id === goal._id).map(review => (
                            <div key={review._id}>
                              <p>{review.feedback}</p>
                            </div>
                          ))}
                        </td>
                        <td>
                          {performance.reviews.filter(review => review.goal._id === goal._id).map(review => (
                            <div key={review._id}>
                              <p>{review.rating}</p>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No goals on record</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          selectedEmployee && !error && <p>No performance found</p>
        )}
      </div>
      <div className="chart-container mt-4">
        <h3>Monthly Employee Ratings</h3>
        <Bar data={getMonthlyRatingsData()} />
      </div>
    </div>
  );
};

export default Reports;
