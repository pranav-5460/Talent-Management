import React, { useState } from 'react';
import axiosInstance from '../services/axios';
import './JobPosting.css'; // Ensure to include your CSS file

const JobPosting = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/jobs', { title, description });
      setTitle('');
      setDescription('');
      setSuccessMessage('Job posted successfully. Post another if you would like.');
      setTimeout(() => setSuccessMessage(''), 5000); // Clear the message after 5 seconds
    } catch (error) {
      console.error('Error posting job', error);
      alert('Failed to post job');
    }
  };

  return (
    <div className="job-posting-container">
      <h2>Post a Job</h2>
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Job Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Job Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Post Job</button>
      </form>
    </div>
  );
};

export default JobPosting;
