import React, { useState } from 'react';
import axiosInstance from '../services/axios';
import { useParams } from 'react-router-dom';

const ApplyJob = () => {
  const { jobId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    isCurrentEmployee: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      isCurrentEmployee: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('phone', formData.phone);
    form.append('resume', formData.resume);
    form.append('isCurrentEmployee', formData.isCurrentEmployee);

    try {
      await axiosInstance.post(`/jobs/${jobId}/apply`, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Application submitted successfully');
    } catch (error) {
      console.error('Error submitting application', error);
      alert('Failed to submit application');
    }
  };

  return (
    <div className="apply-job-container">
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="resume" className="form-label">Resume</label>
          <input
            type="file"
            className="form-control"
            id="resume"
            name="resume"
            onChange={handleFileChange}
            required
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isCurrentEmployee"
            name="isCurrentEmployee"
            checked={formData.isCurrentEmployee}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="isCurrentEmployee">I am a current employee</label>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default ApplyJob;
