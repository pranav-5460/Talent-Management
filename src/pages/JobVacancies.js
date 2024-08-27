import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../services/axios';
import './JobVacancies.css'; // Make sure to import the CSS file

const JobVacancies = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get('/jobs');
        setJobs(res.data);
      } catch (error) {
        console.error('Error fetching jobs', error);
        alert('Failed to fetch jobs');
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="job-vacancies-container">
      {jobs.map(job => (
        <div key={job._id} className="job-vacancy">
          <h3>{job.title}</h3>
          <p>{job.description}</p>
          <Link to={`/apply-job/${job._id}`} className="btn btn-primary">Apply</Link>
        </div>
      ))}
    </div>
  );
};

export default JobVacancies;
