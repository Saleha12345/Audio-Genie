import React, { useState } from 'react';
import { Rating } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
const Feedback= () => {
  const [category, setCategory] = useState('Quality'); // State to store the selected category
  const [rating, setRating] = useState(0); // State to store the rating value
  const [feedback, setFeedback] = useState(''); // State to store the feedback text

  // Function to handle category selection change
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Function to handle rating change
  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  // Function to handle feedback text change
  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send feedback data to the backend endpoint
      const response = await axios.post('http://localhost:3001/submit-feedback', {
        category,
        rating,
        feedback
      });
      console.log(response.data); // Log the response from the backend
      alert('Feedback submitted successfully!'); // Show success message to the user
      // Reset form fields after successful submission
      setCategory('Quality');
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Handle error (e.g., show error message to the user)
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Feedback Form</h2>
        {/* Dropdown menu for selecting the category */}
        <TextField
          select
          label="Category"
          value={category}
          onChange={handleCategoryChange}
          variant="outlined"
          fullWidth
          margin="normal"
        >
          <MenuItem value="Quality">Quality Feedback</MenuItem>
          <MenuItem value="Issue">Report an Issue</MenuItem>
          <MenuItem value="FeatureRequest">Feature Request</MenuItem>
          {/* Add more categories as needed */}
        </TextField>
      </div>
      <div>
        {/* Star rating component for rating the quality of separated voices */}
        <Rating
          name="rating"
          value={rating}
          onChange={handleRatingChange}
          precision={0.5} // Optional: Change precision for half-star ratings
        />
      </div>
      <div>
        {/* Text field for entering feedback */}
        <TextField
          id="feedback"
          label="Feedback"
          multiline
          rows={4}
          value={feedback}
          onChange={handleFeedbackChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
      </div>
      {/* Submit button */}
      <div>
        <Button variant="contained" color="primary" type="submit">
          Submit Feedback
        </Button>
      </div>
    </form>
  );
};

export default Feedback;
