const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  tier: {
    type: String,
    enum: [
      "Platinum Patron",
      "Gold Benefactor",
      "Silver Champion",
      "Bronze Supporter",
    ],
  },
  intentions: {
    type: String,
    trim: true,
    maxlength: 500, // Limit the intention to 500 characters
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;
