import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ReviewPerformance.css'; // Ensure to include your CSS file

const ReviewPerformance = () => {
  const { employeeId, goalId } = useParams();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(3); // Default rating value
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const res = await axiosInstance.get(`/goals/${goalId}`);
        setGoal(res.data);
      } catch (error) {
        console.error('Error fetching goal', error);
        setError('Failed to fetch goal');
      }
    };
    fetchGoal();
  }, [goalId]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous error
    try {
      await axiosInstance.post(`/performance/${employeeId}/review`, {
        feedback,
        rating,
        goalId,
      });
      alert('Feedback submitted successfully');
      navigate('/performance-reports'); // Redirect to the performance reports page
    } catch (error) {
      console.error('Error submitting feedback', error);
      setError('Failed to submit feedback');
    }
  };

  return (
    <div className="review-performance-container">
      <h2>Review Performance</h2>
      {goal && (
        <div className="goal-details">
          <h3>Goal: {goal.goals}</h3>
          <p>Completion Percentage: {goal.completionPercentage}%</p>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleFeedbackSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="rating" className="form-label">Rating (1-5)</label>
          <input
            type="number"
            className="form-control"
            id="rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback" className="form-label">Feedback</label>
          <textarea
            className="form-control"
            id="feedback"
            rows="3"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">Submit Feedback</button>
      </form>
    </div>
  );
};

export default ReviewPerformance;
