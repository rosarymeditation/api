const mongoose = require("mongoose");

const prayerTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PrayerType = mongoose.model("PrayerType", prayerTypeSchema);

module.exports = PrayerType;
