import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axios';
import './EmployeeDetails.css'; // Import the CSS file

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const baseURL = 'http://localhost:5000'; // Base URL for your backend server

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axiosInstance.get(`/profile/${id}`);
        setEmployee(res.data);
      } catch (error) {
        console.error('Error fetching employee details', error);
        alert('Failed to fetch employee details');
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <div className="employee-details-container">
      <h2>Employee Details</h2>
      <div className="profile-picture">
        {employee.picture ? (
          <img src={`${baseURL}/uploads/${employee.picture}`} alt="Profile" className="img-circle" />
        ) : (
          <p className="no-picture">No Picture</p>
        )}
      </div>
      <div className="profile-details">
        <p><strong>Name:</strong> {employee.user.name}</p>
        <p><strong>Email:</strong> {employee.user.email}</p>
        <p><strong>Role:</strong> {employee.user.role}</p>
        <p><strong>Qualifications:</strong> {employee.qualifications}</p>
        <p><strong>Certifications:</strong> {employee.certifications}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>
      </div>
    </div>
  );
};

export default EmployeeDetails;
