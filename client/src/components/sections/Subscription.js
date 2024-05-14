import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useUser } from "../UserContext";

const Subscription = ({ userId }) => {
  const [currentSubscription, setCurrentSubscription] = useState("");
  const [newSubscription, setNewSubscription] = useState("");
  const [isCancellationConfirmed, setIsCancellationConfirmed] = useState(false);
  const { signupDetails, setSignupDetails } = useUser();

  useEffect(() => {
    // Fetch current user subscription when component mounts
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      // Extract email from signupDetails
      console.log(signupDetails);
      const { email } = signupDetails;
      console.log(email);

      const response = await axios.post(
        "http://localhost:3001/getsubscription",
        { email }
      );
      if (response.status === 200) {
        // Access the data received from the backend
        console.log("Subscription:", response.data);
        setCurrentSubscription(response.data);
      }
    } catch (error) {
      console.error("Error fetching current subscription:", error);
    }
  };

  const handleUpdatePlan = async () => {
    try {
      const { email } = signupDetails;
      console.log(newSubscription);
      const response = await fetch("http://localhost:3001/update-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, newPlan: newSubscription }), // Assuming userEmail holds the user's email
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        window.alert("Plan updated successfully!");
        // Handle success, maybe update UI or show a success message
      } else {
        throw new Error("Failed to update plan");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      // Handle error, show error message to the user or retry
      window.alert("Failed to update plan. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch("http://localhost:3001/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupDetails),
      });
    } catch (error) {
      console.error("Error canceling subscription:", error);
      window.alert("Failed to cancel subscription! Please try again.");
    }
  };

  return (
    <div>
      <h2 style={{marginTop:'20px'}}>Manage Subscription</h2>
      <div
        style={{ alignItems: "end", marginTop: "30px", marginBottom: "20px" }}
      >
        <strong>Current Plan:</strong> {currentSubscription}
      </div>
      <Box sx={{ minWidth: 120 }} style={{ marginBottom: "20px", marginTop:'40px' }}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              style={{  fontSize: "16px", color: "black" }}
            >
              Subscription Plan
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newSubscription}
              label="Subscription"
              onChange={(e) => setNewSubscription(e.target.value)}
            >
              <MenuItem value="Basic">Basic</MenuItem>
              <MenuItem value="Standard">Standard</MenuItem>
              <MenuItem value="Premium">Premium</MenuItem>
            </Select>

          </FormControl>
        </Box>

      {/* <label htmlFor="newSubscription">Select New Plan:</label>

      <select
        id="newSubscription"
        value={newSubscription}
        onChange={(e) => setNewSubscription(e.target.value)}
      >
        <option value="Basic">Basic</option>
        <option value="Standard">Standard</option>
        <option value="Premium">Premium</option>
      </select> */}

      <button onClick={handleUpdatePlan} style={{padding:'10px', width:'160px'}}>   Update Plan   </button>

      {isCancellationConfirmed ? (
        <p>Your subscription has been cancelled.</p>
      ) : (
        <div>
          <button onClick={handleCancelSubscription}  style={{marginTop:'10px', backgroundColor:'red', padding:'10px'}}>
            Cancel Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscription;
