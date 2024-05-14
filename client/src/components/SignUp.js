import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Signup.css';
import { Link, useNavigate } from 'react-router-dom';
import image from '../img/talk.png';
import { useUser } from './UserContext';
import {CountryDropdown} from 'react-country-region-selector';

const Signup = () => {
  const { setSignupDetails } = useUser();
  const history = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [isEmailValid, setIsEmailValid] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState('');
  const [inputValue, setInputValue] = useState('');
  

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    if (newPassword.length >= 8 && /\d/.test(newPassword)) {
      setPassword(newPassword);
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
    setInputValue(newPassword);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsEmailValid(e.target.checkValidity());
  };

  const handleCountryChange = (val) => {
    setCountry(val);
    console.log(val);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    if (!isPasswordValid || !isEmailValid || !country) {
      return;
    }
    console.log(country);
    setSignupDetails({ username, email, password, country });
    history('/SubscriptionPlan');
  };

  const handleGoogleSignIn = async () => {
    // Handle Google sign-in here if needed
  };

  return (
    <div className="signup-container">
      <div className="left-half">
        <img src={image} alt="Left Half Image" className="left-image" />
      </div>
      <div className="right-half signup-form">
        <h2>Create Your Account</h2>
        <form onSubmit={(event) => handleSignup(event)}>
          <label>
            Full Name:
            <input type="text" placeholder='John Doe' value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Email Address:
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              value={email}
              onChange={handleEmailChange}
              className={isEmailValid ? '' : 'error'}
            />
          </label>
          {!isEmailValid && (
            <p className="error-message">Please enter a valid email address</p>
          )}
          <label>
            Password:
            <input
              type="password"
              placeholder="Password"
              value={inputValue}
              onChange={handlePasswordChange}
              className={isPasswordValid ? '' : 'error'}
            />
          </label>
          {!isPasswordValid && (
            <p className="error-message">Password must be at least 8 characters and contain at least 1 number</p>
          )}
          <label className='country-selector-container'>
        Country:
        <CountryDropdown
          country={country}
          value={country}
          onChange={handleCountryChange}
        />
      </label>
          <button type="submit"> Continue to Subscription Plan</button>
          <button onClick={handleGoogleSignIn} className="google-btn">
            <i className="fab fa-google"></i>   Continue with Google
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;