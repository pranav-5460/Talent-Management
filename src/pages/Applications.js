import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import './Applications.css'; // Import the CSS file

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [hrRequests, setHRRequests] = useState([]); // State for HR requests
  const baseURL = 'http://localhost:5000'; // Base URL for your backend server

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axiosInstance.get('/applications');
        setApplications(res.data);
      } catch (error) {
        console.error('Error fetching applications', error);
        alert('Failed to fetch applications');
      }
    };

    const fetchHRRequests = async () => {
      try {
        const res = await axiosInstance.get('/auth/pending-hr');
        setHRRequests(res.data);
      } catch (error) {
        console.error('Error fetching HR requests', error);
        alert('Failed to fetch HR requests');
      }
    };

    fetchApplications();
    fetchHRRequests(); // Fetch HR requests
  }, []);

  const handleApproveApplication = async (id) => {
    try {
      await axiosInstance.put(`/applications/${id}/approve`, { approve: true });
      setApplications(applications.map(app => app._id === id ? { ...app, status: 'Approved' } : app));
    } catch (error) {
      console.error('Error approving application', error);
      alert('Failed to approve application');
    }
  };

  const handleRejectApplication = async (id) => {
    try {
      await axiosInstance.put(`/applications/${id}/approve`, { approve: false });
      setApplications(applications.filter(app => app._id !== id));
    } catch (error) {
      console.error('Error rejecting application', error);
      alert('Failed to reject application');
    }
  };

  const handleApproveHR = async (id) => {
    try {
      await axiosInstance.put('/auth/approve-hr', { userId: id, approve: true });
      setHRRequests(hrRequests.map(req => req._id === id ? { ...req, status: 'Approved' } : req));
    } catch (error) {
      console.error('Error approving HR request', error);
      alert('Failed to approve HR request');
    }
  };

  const handleRejectHR = async (id) => {
    try {
      await axiosInstance.put('/auth/approve-hr', { userId: id, approve: false });
      setHRRequests(hrRequests.filter(req => req._id !== id));
    } catch (error) {
      console.error('Error rejecting HR request', error);
      alert('Failed to reject HR request');
    }
  };

  return (
    <div className="applications-container">
      <h2>Applications</h2>
      {applications.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app._id}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td><a href={`${baseURL}/uploads/${app.resume}`} target="_blank" rel="noopener noreferrer">View Resume</a></td>
                <td>{app.status}</td>
                <td className="button-group">
                  {app.status === 'Pending' && (
                    <>
                      <button className="btn btn-success" onClick={() => handleApproveApplication(app._id)}>Approve</button>
                      <button className="btn btn-danger" onClick={() => handleRejectApplication(app._id)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No current applications</p>
      )}

      <h2>HR Registration Requests</h2>
      {hrRequests.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hrRequests.map(req => (
              <tr key={req._id}>
                <td>{req.name}</td>
                <td>{req.email}</td>
                <td className="button-group">
                  {req.status !== 'Approved' && (
                    <>
                      <button className="btn btn-success" onClick={() => handleApproveHR(req._id)}>Approve</button>
                      <button className="btn btn-danger" onClick={() => handleRejectHR(req._id)}>Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-data">No pending HR registration requests</p>
      )}
    </div>
  );
};

export default Applications;
