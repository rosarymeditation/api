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
      "Grateful Heart",
      "Faithful Supporter",
      "Blessing Giver",
      "Divine Patron",
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
