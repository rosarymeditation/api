const mongoose = require("mongoose");

const prayerRequestCounterSchema = new mongoose.Schema({
  randomToken: { type: String },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PrayerRequest",
  },
});

const PrayerRequestCounter = mongoose.model(
  "PrayerRequestCounter",
  prayerRequestCounterSchema
);

module.exports = PrayerRequestCounter;
