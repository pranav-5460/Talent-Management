import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axios';
import './Profile.css'; // Ensure to include your CSS file

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    qualifications: '',
    designation: '',
    certifications: '',
    picture: '',
  });
  const [initialProfileData, setInitialProfileData] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const baseURL = 'http://localhost:5000'; // Base URL for your backend server

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(atob(token.split('.')[1]));
        if (user.role === 'manager') {
          navigate('/manager-dashboard');
        } else {
          const res = await axiosInstance.get('/profile/me');
          const profileComplete = res.data.qualifications && res.data.designation && res.data.certifications && res.data.picture;

          const profile = {
            name: res.data.user.name,
            email: res.data.user.email,
            qualifications: res.data.qualifications,
            designation: res.data.designation,
            certifications: res.data.certifications,
            picture: res.data.picture,
          };

          setProfileData(profile);
          setInitialProfileData(profile);
          const imagePath = res.data.picture ? (res.data.picture.startsWith('/uploads/') ? `${baseURL}${res.data.picture}` : `${baseURL}/uploads/${res.data.picture}`) : null;
          setImagePreview(imagePath);
          setIsProfileComplete(profileComplete);
        }
      } catch (error) {
        console.error('Error fetching profile', error);
        alert('Failed to fetch profile');
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there are any changes
    if (JSON.stringify(profileData) === JSON.stringify(initialProfileData) && !file) {
      alert('No changes made');
      return;
    }

    const formData = new FormData();
    formData.append('qualifications', profileData.qualifications);
    formData.append('designation', profileData.designation);
    formData.append('certifications', profileData.certifications);
    if (file) {
      formData.append('picture', file);
    }

    try {
      const res = await axiosInstance.put('/profile/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully');

      // Update the state with the latest profile data
      setProfileData(res.data);
      setInitialProfileData(res.data);
      const imagePath = res.data.picture ? (res.data.picture.startsWith('/uploads/') ? `${baseURL}${res.data.picture}` : `${baseURL}/uploads/${res.data.picture}`) : null;
      setImagePreview(imagePath);
      setIsEditable(false);
      setIsProfileComplete(true);

      // Mark profile as complete in backend
      await axiosInstance.put('/auth/profile-setup', { userId: res.data.user });

      // Fetch the updated user data to get the role
      const updatedUserRes = await axiosInstance.get('/profile/me');
      const updatedUser = updatedUserRes.data;

      // Navigate based on user role
      if (updatedUser.user.role === 'HR') {
        navigate('/hr-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleCancelClick = () => {
    setIsEditable(false);
    setProfileData(initialProfileData); // Reset changes
    const imagePath = initialProfileData.picture ? (initialProfileData.picture.startsWith('/uploads/') ? `${baseURL}${initialProfileData.picture}` : `${baseURL}/uploads/${initialProfileData.picture}`) : null;
    setImagePreview(imagePath);
    setFile(null);
  };

  return (
    <div className="profile-container">
      <h2>{isProfileComplete ? 'Your Profile' : 'Complete Your Profile'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 text-center">
          <label htmlFor="picture" className="form-label">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
            ) : (
              <img src="/path/to/default-image.png" alt="Profile" className="img-thumbnail" style={{ width: '150px', height: '150px' }} />
            )}
            <input
              type="file"
              className="form-control"
              id="picture"
              name="picture"
              onChange={handleFileChange}
              disabled={!isEditable}
              style={{ display: 'none' }}
            />
          </label>
          {isEditable && <p>Upload a different photo...</p>}
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={profileData.name}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={profileData.email}
            readOnly
          />
        </div>
        <div className="mb-3">
          <label htmlFor="qualifications" className="form-label">Qualifications</label>
          <input
            type="text"
            className="form-control"
            id="qualifications"
            name="qualifications"
            value={profileData.qualifications}
            readOnly={!isEditable}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="designation" className="form-label">Designation</label>
          <input
            type="text"
            className="form-control"
            id="designation"
            name="designation"
            value={profileData.designation}
            readOnly={!isEditable}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="certifications" className="form-label">Certifications</label>
          <input
            type="text"
            className="form-control"
            id="certifications"
            name="certifications"
            value={profileData.certifications}
            readOnly={!isEditable}
            onChange={handleChange}
          />
        </div>
        {isEditable ? (
          <>
            <button type="submit" className="btn btn-primary w-100">{isProfileComplete ? 'Save' : 'Complete Profile'}</button>
            <button type="button" className="btn btn-secondary w-100 mt-2" onClick={handleCancelClick}>Cancel</button>
          </>
        ) : (
          <button type="button" className="btn btn-secondary w-100" onClick={handleEditClick}>Edit Profile</button>
        )}
      </form>
    </div>
  );
};

export default Profile;
