const mongoose = require("mongoose");

const politicianSchema = new mongoose.Schema({
  name: String,
  party: String,
  district: String
});

module.exports = mongoose.model("Politician", politicianSchema);