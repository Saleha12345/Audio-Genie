import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';

const Subscription = ({ userId }) => {
  const [currentSubscription, setCurrentSubscription] = useState('');
  const [newSubscription, setNewSubscription] = useState('');
  const [isCancellationConfirmed, setIsCancellationConfirmed] = useState(false);
  const { signupDetails, setSignupDetails } = useUser();


  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      console.log(signupDetails)
      const { email } = signupDetails;
      console.log(email);

      const response = await axios.post('http://localhost:3001/getsubscription', { email });
      if (response.status === 200) {
        console.log('Subscription:', response.data);
        setCurrentSubscription(response.data);
      }

    } catch (error) {
      console.error('Error fetching current subscription:', error);
    }
  };

  const handleUpdatePlan = async () => {
    try {
      const { email } = signupDetails;
      console.log(newSubscription);
      const response = await fetch('http://localhost:3001/update-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, newPlan: newSubscription })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
      } else {
        throw new Error('Failed to update plan');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };


  const handleCancelSubscription = async () => {
    const isConfirmed = window.confirm('Are you sure you want to cancel your subscription? You will not be able to use our system services');
    if (isConfirmed) {
    try {
      const { email } = signupDetails;
      const response = await fetch('http://localhost:3001/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email})
      });
      if (response.ok) {
        setIsCancellationConfirmed(true);
      } 
    } catch (error) {
      console.error('Error canceling subscription:', error);
    }
  }
  };

  return (
    <div>
      <h2>Manage Subscription</h2>
      <p>Current Plan: {currentSubscription}</p>

      <label htmlFor="newSubscription">Select New Plan:</label>
      <select id="newSubscription" value={newSubscription} onChange={(e) => setNewSubscription(e.target.value)}>
        <option value="Basic">Basic</option>
        <option value="Standard">Standard</option>
        <option value="Premium">Premium</option>
      </select>

      <button onClick={handleUpdatePlan}style={{marginLeft:'20PX'}}>Update Plan</button>

      {isCancellationConfirmed ? (
        <p>Your subscription has been cancelled.</p>
      ) : (
       
        <button onClick={handleCancelSubscription} 
        style={{ marginLeft: '20px', backgroundColor: 'red', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>Cancel Subscription</button>
    
        
      )}
    </div>
  );
};

export default Subscription;