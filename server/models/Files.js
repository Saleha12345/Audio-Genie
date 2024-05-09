const mongoose = require("mongoose");
const audioFileSchema = new mongoose.Schema({
  name: String,
  date: Date,
  type: String,
  email: String,
  content: Buffer 
});

const AudioFile = mongoose.model("AudioFile", audioFileSchema);

module.exports = AudioFile;
