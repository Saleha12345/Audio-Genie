import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:3001/forgot-password', { email });
      setMessage('Reset password email sent. Please check your inbox.');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('User with this email does not exist.');
      } else {
        setMessage('Failed to send reset password email. Please try again later.');
      }
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleForgotPassword}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
