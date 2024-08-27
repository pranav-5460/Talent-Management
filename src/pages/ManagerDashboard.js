import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './ManagerDashboard.css'; // Ensure to include your CSS file

const ManagerDashboard = () => {
  const [newEmployees, setNewEmployees] = useState([]);
  const [oldEmployees, setOldEmployees] = useState([]);
  const [hrMembers, setHRMembers] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Employees/HR',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/profile'); // Ensure this matches your backend route
        categorizeUsers(res.data);
        prepareChartData(res.data);
      } catch (error) {
        console.error('Error fetching users', error);
        setError(error.response?.data?.message || 'Error fetching user data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/profile/${id}`);
      const updatedUsers = [...newEmployees, ...oldEmployees, ...hrMembers].filter(user => user._id !== id);
      categorizeUsers(updatedUsers);
      prepareChartData(updatedUsers);
    } catch (error) {
      console.error('Error deleting user', error);
      alert('Error deleting user');
    }
  };

  const categorizeUsers = async (data) => {
    try {
      const res = await axiosInstance.get('/employees/categorized');
      const categorizedData = res.data;
      const hrMembers = data.filter(user => user.user.role === 'HR');
      setNewEmployees(categorizedData.newEmployees);
      setOldEmployees(categorizedData.oldEmployees);
      setHRMembers(hrMembers);
    } catch (error) {
      console.error('Error categorizing users', error);
    }
  };

  const prepareChartData = (data) => {
    const roles = ['employee', 'HR'];
    const roleCounts = roles.map(role => data.filter(user => user.user && user.user.role === role).length);
    setChartData({
      labels: roles,
      datasets: [
        {
          label: 'Number of Employees/HR',
          data: roleCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    });
  };

  const isNewEmployee = (joinDate) => {
    const currentDate = new Date();
    const joinedDate = new Date(joinDate);
    const diffInTime = currentDate - joinedDate;
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    return diffInDays <= 30; // Consider new if joined within the last 30 days
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="manager-dashboard-container">
      <h2>Manager Dashboard</h2>
      <Bar data={chartData} />

      <h3>HR Members</h3>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hrMembers.map(user => (
            <tr key={user._id}>
              <td>{user.user?.name || 'N/A'}</td>
              <td>{user.user?.email || 'N/A'}</td>
              <td>{user.user?.role || 'HR'}</td>
              <td>
                <button onClick={() => handleDelete(user._id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>New Employees</h3>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newEmployees.map(user => (
            <tr key={user._id}>
              <td>{user.user?.name || 'N/A'}</td>
              <td>{user.user?.email || 'N/A'}</td>
              <td>{user.user?.role || 'employee'}</td>
              <td>New</td>
              <td>
                <button onClick={() => handleDelete(user._id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Old Employees</h3>
      <table className="table mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {oldEmployees.map(user => (
            <tr key={user._id}>
              <td>{user.user?.name || 'N/A'}</td>
              <td>{user.user?.email || 'N/A'}</td>
              <td>{user.user?.role || 'employee'}</td>
              <td>Old</td>
              <td>
                <button onClick={() => handleDelete(user._id)} className="btn btn-danger btn-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerDashboard;
