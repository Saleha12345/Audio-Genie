import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import HomePage from './components/HomePage.js';
import Signup from './components/SignUp.js'; 
import SubscriptionPlan from './components/SubscriptionPlans.js';
import Payment from './components/Payment.js';
import MainComponent from './components/MainComponent.js'
import Login from './components/Login.js';
import Pricing from './components/Pricing.js';
import ForgotPassword from './components/ForgetPassword.js';
import { UserProvider } from './components/UserContext.js';
import Admin from './Admin/Admin.js'

function App() {
  return (
    <UserProvider>
    <Router>
      <div>
        <Routes> 
          <Route exact path="/" element={<HomePage/>} /> 
          <Route path="/signup" element={<Signup/>} /> 
          <Route path="/login" element={<Login/>} /> 
          <Route path="/ForgotPassword" element={<ForgotPassword/>} /> 
          <Route path="/SubscriptionPlan" element={<SubscriptionPlan/>} />
          <Route path="/Payment" element={<Payment/>} /> 
          <Route path="/MainComponent" element={<MainComponent/>} /> 
          <Route path="/Pricing" element={<Pricing/>} />
          <Route path="/Admin" element={<Admin/>} /> 
        </Routes>
      </div>
    </Router>
    </UserProvider>
  );
}

export default App;
