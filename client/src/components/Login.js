import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import image from '../img/talking.jpg';
import { useUser } from './UserContext';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { useGoogleLogin } from '@react-oauth/google';

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
  const { setSignupDetails } = useUser();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', { email, password });
      const userData = response.data.userData;
      setSignupDetails(userData);
      setLoginSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setShowModal(true);
      } else if (error.response && error.response.status === 401) {
        alert('Incorrect password. Please try again.');
      } else {
        setError('Invalid email or password');
      }
    }
  };

  const handleGoogleLoginSuccess = (tokenResponse) => {
    console.log('Google Sign-In successful, token:', tokenResponse);
    axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`)
      .then((response) => {
        const profile = response.data;
        console.log('Google profile data:', profile);
        setSignupDetails({
          username: profile.name,
          email: profile.email,
          googleId: profile.sub,
          country: 'Pakistan',
        });
        setLoginSuccess(true);
      })
      .catch((error) => {
        console.error('Error fetching Google profile data', error);
        setError('Failed to sign in with Google');
      });
  };

  const handleGoogleLoginError = (errorResponse) => {
    console.error('Google Sign-In failed', errorResponse);
    setError('Failed to sign in with Google');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
  });

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
          <Button
            variant="outlined"
            startIcon={<GoogleIcon sx={{ color: '#0040B5' }} />}
            onClick={googleLogin}
            sx={{
              height: '50px',
              color: '#4285F4',
              borderColor: '#0040B5',
              '&:hover': {
                borderColor: '#357ae8',
                backgroundColor: '#f1f3f4',
              },
              backgroundColor: '#fff',
            }}
            className="google-btn"
          >
            Login with Google
          </Button>
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
