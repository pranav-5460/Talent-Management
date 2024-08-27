import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import './HRDashboard.css';

const HRDashboard = () => {
  const [newEmployees, setNewEmployees] = useState([]);
  const [oldEmployees, setOldEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get('/employees/categorized');
        setNewEmployees(res.data.newEmployees);
        setOldEmployees(res.data.oldEmployees);
      } catch (error) {
        console.error('Error fetching employees', error);
        setError(error.response?.data?.message || 'Error fetching employee data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="hr-dashboard-container">
      <h2>HR Dashboard</h2>

      <h3>New Employees</h3>
      {newEmployees.length > 0 ? (
        <div className="employees-container">
          {newEmployees.map((employee) => (
            <div key={employee._id} className="employee-card">
              <h4>{employee.name}</h4>
              <p>Email: {employee.email}</p>
              <p>Join Date: {new Date(employee.joinDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No new employees</p>
      )}

      <h3>Old Employees</h3>
      {oldEmployees.length > 0 ? (
        <div className="employees-container">
          {oldEmployees.map((employee) => (
            <div key={employee._id} className="employee-card">
              <h4>{employee.name}</h4>
              <p>Email: {employee.email}</p>
              <p>Join Date: {new Date(employee.joinDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No old employees</p>
      )}
    </div>
  );
};

export default HRDashboard;