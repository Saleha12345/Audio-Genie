import React, { useState } from 'react';
import { Rating } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
const Feedback = () => {
  const [category, setCategory] = useState('Quality');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/submit-feedback', {
        category,
        rating,
        feedback
      });
      console.log(response.data);
      alert('Feedback submitted successfully!');
      setCategory('Quality');
      setRating(0);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Feedback Form</h2>
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
        </TextField>
      </div>
      <div>
        <Rating
          name="rating"
          value={rating}
          onChange={handleRatingChange}
          precision={0.5}
        />
      </div>
      <div>
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
      <div>
        <Button variant="contained" color="primary" type="submit">
          Submit Feedback
        </Button>
      </div>
    </form>
  );
};

export default Feedback;
