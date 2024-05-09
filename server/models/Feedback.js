const mongoose = require('mongoose');

// Define the schema for feedback data
const feedbackSchema = new mongoose.Schema({
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create a Mongoose model based on the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
