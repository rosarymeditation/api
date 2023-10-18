const mongoose = require("mongoose");

const dailyVerseSchema = new mongoose.Schema({
  content: { type: String, required: true },
  verse: { type: String, required: true },
  date: { type: Date, required: true },
  formattedDate: { type: String },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
});

const DailyVerse = mongoose.model("DailyVerse", dailyVerseSchema);

module.exports = DailyVerse;
