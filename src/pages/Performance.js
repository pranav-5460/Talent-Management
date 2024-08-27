import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axios';

const Performance = () => {
  const { employeeId } = useParams();
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await axiosInstance.get(`/performance/${employeeId}`);
        setPerformance(res.data);
      } catch (error) {
        console.error('Error fetching performance', error);
        alert('Failed to fetch performance');
      }
    };
    fetchPerformance();
  }, [employeeId]);

  if (!performance) {
    return <div>Loading...</div>;
  }

  return (
    <div className="performance-container">
      <h2>Performance Details</h2>
      <h3>Goals</h3>
      <ul>
        {performance.goals.map(goal => (
          <li key={goal._id}>{goal.goals}</li>
        ))}
      </ul>
      <h3>Reviews</h3>
      <ul>
        {performance.reviews.map(review => (
          <li key={review._id}>{review.feedback} (Date: {new Date(review.date).toLocaleDateString()})</li>
        ))}
      </ul>
    </div>
  );
};

export default Performance;
