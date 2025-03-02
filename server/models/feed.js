const mongoose = require("mongoose");

const feedSchema = new mongoose.Schema({
  content: { type: String, required: true },
  url: { type: String },
  hasUpdated: { type: Boolean, default: false },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeedStatus",
    required: true,
  },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "FeedComment" }],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedLike",
    },
  ],
});

const Feed = mongoose.model("Feed", feedSchema);

module.exports = Feed;
