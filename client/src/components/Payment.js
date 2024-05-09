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
  const [cardNumberError, setCardNumberError] = useState('');
  const [expiryDateError, setExpiryDateError] = useState('');
  const [cvvError, setCVVError] = useState('');

  const handleCardNumberChange = (e) => {
    const newCardNumber = e.target.value;
    setCardNumber(newCardNumber);

    // Detect card type based on the entered card number
    const cardTypeInfo = creditCardType(newCardNumber);
    if (cardTypeInfo.length > 0) {
      setCardType(cardTypeInfo[0].niceType);
      setCardNumberError('');
    } else {
      setCardType('');
      setCardNumberError('Card type could not be detected');
    }
  };

  const handleCardholderNameChange = (e) => {
    const newCardholderName = e.target.value;
    setCardholderName(newCardholderName);
  };
  const handleExpiryDateChange = (e) => {
    const newExpiryDate = e.target.value;
    if (!/^\d{0,2}\/?\d{0,2}$/.test(newExpiryDate)) {
      setExpiryDateError('Expiry date should be in MM/YY format and contain numbers only');
      return;
    }
    setExpiryDate(newExpiryDate);
    const currentDate = new Date();
    const [month, year] = newExpiryDate.split('/');
    const expiry = new Date(`20${year}`, month - 1);
    if (expiry < currentDate) {
      setExpiryDateError('Expiry date cannot be in the past');
    } else {
      setExpiryDateError('');
    }
  };

  const handleCVVChange = (e) => {
    const newCVV = e.target.value;
    if (!/^\d+$/.test(newCVV)) {
      setCVVError('CVV should contain numbers only');
      return;
    }
    setCVV(newCVV);
    if (newCVV.length < 3) {
      setCVVError('CVV must be 3 digits');
    } else {
      setCVVError('');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
      setCardNumberError('Card number is required');
      setExpiryDateError('Expiry date is required');
      setCVVError('CVV is required');
      return;
    }

    if (cardNumberError || expiryDateError || cvvError) {
      return;
    }

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
          {cardNumberError && <p className="error-message">{cardNumberError}</p>}
        </label>
        <label>
          Cardholder Name:
          <input type="text" value={cardholderName} onChange={handleCardholderNameChange} />
        </label>
        <label>
          Expiry Date (MM/YY):
          <input type="text" value={expiryDate} onChange={handleExpiryDateChange} maxLength="5" />
          {expiryDateError && <p className="error-message">{expiryDateError}</p>}
        </label>
        <label>
          CVV:
          <input type="text" value={cvv} onChange={handleCVVChange} maxLength="3" />
          {cvvError && <p className="error-message">{cvvError}</p>}
        </label>
        <p>Card Type: {cardType}</p>
        <button type="submit">Submit Payment and Complete Signup</button>
      </form>
    </div>
  );
};

export default Payment;
