const mongoose = require("mongoose");

const dailyReadingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Cycle A", "Cycle B", "Cycle C", "Year I", "Year II"],
    required: true,
  },
  content: { type: String, required: true },
  summary: { type: String },
  readingAudio: { type: String },
  reflectionAudio: { type: String },
  date: { type: Date, required: true },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
});

const DailyReading = mongoose.model("DailyReading", dailyReadingSchema);

module.exports = DailyReading;
