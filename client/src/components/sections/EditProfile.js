import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaPencilAlt } from 'react-icons/fa';
import '../../styles/EditPassword.css';

const EditProfile = () => {
  const { signupDetails, setSignupDetails } = useUser();
  const [editedUserData, setEditedUserData] = useState({
    username: signupDetails.username,
    email: signupDetails.email,
    password: signupDetails.password,
    newPassword: '',
  });
  const [changesMade, setChangesMade] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const isUserDataChanged = Object.keys(editedUserData).some(
      key => editedUserData[key] !== signupDetails[key]
    );
    setChangesMade(isUserDataChanged);
  }, [editedUserData, signupDetails]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEdit = (fieldName) => {
    setEditingField(fieldName);
    if (fieldName === 'password') {
      setEditedUserData(prevState => ({
        ...prevState,
        newPassword: '',
        password: signupDetails.password,
      }));
    }
  };

  const handleUpdate = async () => {
    try {

      const { username, email, newPassword } = editedUserData;
      const response = await axios.post('http://localhost:3001/update', { username, newPassword, email });

      if (response.status === 200) {
        alert('Profile updated successfully!');
        setEditedUserData({
          ...editedUserData,
          password: newPassword,
          newPassword: '',
        });
        setEditingField(null);
        setUpdateSuccess(true);
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div>
      <h2 style={{ marginTop: '20px', marginBottom: '20px' }}>Edit Profile</h2>
      <div className="user-field-container">
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={editedUserData.username}
          onChange={handleInputChange}
          disabled={editingField !== 'username'}
        />
        <a href="#" className="edit-icon" onClick={() => handleEdit('username')}>
          <FaPencilAlt />
        </a>
      </div>
      <div className="user-field-container">
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={editedUserData.email}
          onChange={handleInputChange}
          disabled={editingField !== 'email'}
        />
        <a href="#" className="edit-icon" onClick={() => handleEdit('email')}>
          <FaPencilAlt />
        </a>
      </div>
      <div>
        <label>Current Password:</label>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={editedUserData.password}
            onChange={handleInputChange}
          />
          {showPassword ? (
            <FaEyeSlash onClick={togglePasswordVisibility} />
          ) : (
            <FaEye onClick={togglePasswordVisibility} />
          )}
        </div>
      </div>
      <div>
        <label>New Password:</label>
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            value={updateSuccess ? '' : editedUserData.newPassword}
            onChange={handleInputChange}
          />
          {showPassword ? (
            <FaEyeSlash onClick={togglePasswordVisibility} />
          ) : (
            <FaEye onClick={togglePasswordVisibility} />
          )}
        </div>
      </div>
      <button onClick={handleUpdate} disabled={!changesMade} style={{ padding: '15px', width: '100%', marginTop: '20px' }}>
        Update
      </button>
    </div>
  );
};

export default EditProfile;
