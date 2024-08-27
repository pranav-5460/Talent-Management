import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-moment';
import moment from 'moment';
import './Dashboard.css'; // Ensure to include your CSS file

const Dashboard = () => {
  const [performance, setPerformance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = JSON.parse(atob(base64));
        const profileId = jsonPayload.profile;

        console.log('User ID:', jsonPayload.id);
        console.log('Profile ID:', profileId);

        const res = await axiosInstance.get(`/performance/${profileId}`);
        console.log('Performance Data:', res.data);
        setPerformance(res.data);
      } catch (error) {
        console.error('Error fetching performance', error);
        setError(error.response?.data?.message || 'Error fetching performance data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerformance();
  }, []);

  const handleCompletionChange = async (goalId, newCompletion) => {
    try {
      console.log('Updating goal completion:', { goalId, newCompletion }); // Debugging: Log goal update
      await axiosInstance.put(`/goals/completion/${goalId}`, { completionPercentage: newCompletion });
      setPerformance((prevPerformance) => ({
        ...prevPerformance,
        goals: prevPerformance.goals.map((goal) =>
          goal._id === goalId ? { ...goal, completionPercentage: newCompletion } : goal
        ),
      }));
    } catch (error) {
      console.error('Error updating goal completion', error);
      alert('Error updating goal completion');
    }
  };

  const getChartData = () => {
    if (!performance || !performance.reviews) {
      return {};
    }

    const sortedReviews = performance.reviews
      .filter(review => moment(review.date).isAfter(moment().subtract(30, 'days')))
      .sort((a, b) => moment(a.date) - moment(b.date));

    const data = {
      labels: sortedReviews.map(review => moment(review.date).format('YYYY-MM-DD')),
      datasets: [
        {
          label: 'Average Rating',
          data: sortedReviews.map(review => review.rating),
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        },
      ],
    };

    return data;
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      {performance ? (
        <>
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Goal</th>
                <th>Review</th>
                <th>Rating</th>
                <th>Completion</th>
              </tr>
            </thead>
            <tbody>
              {performance.goals.map((goal) => (
                <tr key={goal._id}>
                  <td>{goal.goals}</td>
                  <td>
                    {performance.reviews && performance.reviews.length > 0 ? (
                      performance.reviews
                        .filter(review => review.goal && review.goal._id === goal._id)
                        .map(review => {
                          console.log('Review:', review.feedback); // Log each review
                          return <div key={review._id}>{review.feedback}</div>;
                        })
                    ) : (
                      'No reviews'
                    )}
                  </td>
                  <td>
                    {performance.reviews && performance.reviews.length > 0 ? (
                      performance.reviews
                        .filter(review => review.goal && review.goal._id === goal._id)
                        .map(review => {
                          console.log('Rating:', review.rating); // Log each rating
                          return <div key={review._id}>{review.rating}</div>;
                        })
                    ) : (
                      'No rating'
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      value={goal.completionPercentage}
                      onChange={(e) => handleCompletionChange(goal._id, e.target.value)}
                      min="0"
                      max="100"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="chart-container">
            <h3>Average Rating Over Time (Last 30 Days)</h3>
            <Line data={getChartData()} />
          </div>
        </>
      ) : (
        <p>No performance data available</p>
      )}
    </div>
  );
};

export default Dashboard;
