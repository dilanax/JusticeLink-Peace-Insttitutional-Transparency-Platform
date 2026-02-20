const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  topic: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Session", sessionSchema);