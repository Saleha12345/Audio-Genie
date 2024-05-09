// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [signupDetails, setSignupDetails] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    planType: '',
    price: '',
  });

  return (
    <UserContext.Provider value={{ signupDetails, setSignupDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
