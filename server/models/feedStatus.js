const mongoose = require("mongoose");

const feedStatusSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const FeedStatus = mongoose.model("FeedStatus", feedStatusSchema);

module.exports = FeedStatus;
