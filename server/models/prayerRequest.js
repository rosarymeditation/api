const mongoose = require("mongoose");

const prayerRequestSchema = new mongoose.Schema({
  content: { type: String, required: true },
  name: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // Expires after 30 days (30 * 24 * 60 * 60 = 2592000 seconds)
  },
});

const PrayerRequest = mongoose.model("PrayerRequest", prayerRequestSchema);

module.exports = PrayerRequest;
