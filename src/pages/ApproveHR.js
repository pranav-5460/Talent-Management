import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';

const ApproveHR = () => {
  const [pendingHRs, setPendingHRs] = useState([]);

  useEffect(() => {
    const fetchPendingHRs = async () => {
      const res = await axiosInstance.get('/api/users/pending-hr');
      setPendingHRs(res.data);
    };
    fetchPendingHRs();
  }, []);

  const handleApproval = async (userId, approve) => {
    try {
      await axiosInstance.post('/api/users/approve-hr', { userId, approve });
      setPendingHRs(pendingHRs.filter(hr => hr._id !== userId));
    } catch (error) {
      console.error(error);
      alert('Error processing approval');
    }
  };

  return (
    <div className="approve-hr-container">
      <h2>Approve HR Requests</h2>
      {pendingHRs.length > 0 ? (
        <ul>
          {pendingHRs.map(hr => (
            <li key={hr._id}>
              {hr.name} ({hr.email})
              <button onClick={() => handleApproval(hr._id, true)} className="btn btn-success btn-sm">Approve</button>
              <button onClick={() => handleApproval(hr._id, false)} className="btn btn-danger btn-sm">Reject</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending HR requests</p>
      )}
    </div>
  );
};

export default ApproveHR;
