const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  country: String,
  plan:String,
  price:String,
  cardNumber:String,
  expiryDate:String,
  cvv:String,
  registrationDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
