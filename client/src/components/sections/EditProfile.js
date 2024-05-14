// Import useState hook
import React, { useState } from 'react';
import { useUser } from '../UserContext';
import { useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaPencilAlt } from 'react-icons/fa'; // Import eye and pencil icons from react-icons library
import '../../styles/EditPassword.css';

const EditProfile = () => {
  const { signupDetails, setSignupDetails } = useUser();

  // Initialize state variables to hold edited user data and flag for changes
  const [editedUserData, setEditedUserData] = useState({
    username: signupDetails.username,
    email: signupDetails.email,
    password: signupDetails.password,
    newPassword: '', // New password field
  });
  const [changesMade, setChangesMade] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [editingField, setEditingField] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false); // State to track update success

  // Effect to check for changes in user data
  useEffect(() => {
    const isUserDataChanged = Object.keys(editedUserData).some(
      key => editedUserData[key] !== signupDetails[key]
    );
    setChangesMade(isUserDataChanged);
  }, [editedUserData, signupDetails]);

  // Function to handle changes in input fields
  const handleInputChange = e => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  // Function to handle toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle edit action
  const handleEdit = (fieldName) => {
    setEditingField(fieldName); // Set the field currently being edited
    // If editing current password, set new password field to the new password
    if (fieldName === 'password') {
      setEditedUserData(prevState => ({
        ...prevState,
        newPassword: '', // Clear new password
        password: signupDetails.password, // Set current password
      }));
    }
  };

  // Function to handle update button click
  const handleUpdate = async () => {
    try {
      // Extract only the required fields for update
      const { username, email , newPassword } = editedUserData;

      // Make a POST request to the server to update user profile
      const response = await axios.post('http://localhost:3001/update', { username, newPassword, email });

      if (response.status === 200) {
        // Show success alert
        alert('Profile updated successfully!');
        // Clear new password field
        setEditedUserData({
          ...editedUserData,
          password: newPassword, // Update password field
          newPassword: '', // Clear new password field
        });
        
        // Reset editing field
        setEditingField(null);
        // Set update success flag
        setUpdateSuccess(true);
      } else {
        // Show error alert
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <div>
      <h2 style={{ marginTop:'20px', marginBottom:'20px'}}>Edit Profile</h2>
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
      <button onClick={handleUpdate} disabled={!changesMade} style={{padding:'15px', width:'100%', marginTop:'20px'}}> 
        Update
      </button>
    </div>
  );
};

export default EditProfile;
