const mongoose = require("mongoose");

const feedCommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  feed: { type: mongoose.Schema.Types.ObjectId, ref: "Feed", required: true },
  createdAt: { type: Date, default: Date.now },
});

const FeedComment = mongoose.model("FeedComment", feedCommentSchema);

module.exports = FeedComment;
