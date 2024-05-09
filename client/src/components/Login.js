import React, { useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import '../styles/Login.css';
import image from '../img/talking.jpg';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const history = useNavigate();
  var { signupDetails, setSignupDetails } = useUser();

  const handleSubmit = async (event) => {

    event.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin1234') {
      history('/admin');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });

      signupDetails = response.data.userData;

      console.log(signupDetails);
      setSignupDetails(signupDetails);
      setLoginSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 403) {

        setShowModal(true);
      }
      if (error.response.status === 401) {
        alert('Incorrect password. Please try again.');
      }
      else {
        setError('Invalid email or password');
      }
    }
  };

  if (loginSuccess) {
    history(`/MainComponent`);
  }

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="login-container">
      <div className="left-half">
        <img src={image} alt="Left Half Image" className="left-image" />
      </div>
      <div className="right-half login-form">
        <h2>Log In</h2>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="form-group">
            <label>
              <i className="fas fa-envelope"></i>
              Email:
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              Password:
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Log In</button>
          {error && <p>{error}</p>}
        </form>
        <Modal
          open={showModal}
          onClose={closeModal}
          aria-labelledby="account-suspended-title"
          aria-describedby="account-suspended-description"
        >
          <Box sx={style}>
            <h2 id="account-suspended-title">Account Suspended</h2>
            <p id="account-suspended-description">
              Your account is suspended. Please contact support for assistance.
            </p>
            <Button onClick={closeModal}>Close</Button>
          </Box>
        </Modal>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link> | <Link to="/ForgotPassword">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};


export default Login;
