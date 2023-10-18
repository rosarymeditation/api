const mongoose = require("mongoose");

const affirmationSchema = new mongoose.Schema({
  content: { type: String, required: true },
  date: { type: Date, required: true },
  formattedDate: { type: String },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
});

const Affirmation = mongoose.model("Affirmation", affirmationSchema);

module.exports = Affirmation;
