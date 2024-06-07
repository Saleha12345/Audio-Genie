import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import creditCardType from 'credit-card-type';
import { useUser } from './UserContext';

import "../styles/Payment.css";

const Payment = () => {
  const history = useNavigate();
  const { signupDetails } = useUser();
  const { username, email, password, country, plan, price } = signupDetails;
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [cardType, setCardType] = useState('');

  const handleCardNumberChange = (e) => {
    const newCardNumber = e.target.value;
    setCardNumber(newCardNumber);
    const cardTypeInfo = creditCardType(newCardNumber);
    if (cardTypeInfo.length > 0) {
      setCardType(cardTypeInfo[0].niceType);
    } else {
      setCardType('');
    }
  };

  const handleCardholderNameChange = (e) => {
    const newCardholderName = e.target.value;
    setCardholderName(newCardholderName);
  };

  const handleExpiryDateChange = (e) => {
    const newExpiryDate = e.target.value;
    setExpiryDate(newExpiryDate);
  };

  const handleCVVChange = (e) => {
    const newCVV = e.target.value;
    setCVV(newCVV);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentData = {
      username,
      email,
      password,
      country,
      plan,
      price,
      cardNumber,
      cardholderName,
      expiryDate,
      cvv
    };

    console.log(paymentData)
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      history(`/MainComponent`);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="payment-form-container">
      <h2> Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Card Number:
          <input type="text" value={cardNumber} onChange={handleCardNumberChange} maxLength="16" />
        </label>
        <label>
          Cardholder Name:
          <input type="text" value={cardholderName} onChange={handleCardholderNameChange} />
        </label>
        <label>
          Expiry Date:
          <input type="text" value={expiryDate} onChange={handleExpiryDateChange} maxLength="5" />
        </label>
        <label>
          CVV:
          <input type="text" value={cvv} onChange={handleCVVChange} maxLength="3" />
        </label>
        <p>Card Type: {cardType}</p>
        <button type="submit">Submit Payment and Complete Signup</button>
      </form>
    </div>
  );
};

export default Payment;
