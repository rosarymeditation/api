const mongoose = require("mongoose");

const prayerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  url: { type: String },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PrayerType",
  },
});

const Prayer = mongoose.model("Prayer", prayerSchema);

module.exports = Prayer;
