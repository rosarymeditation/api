const mongoose = require("mongoose");

const feedLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming there's a User model
    required: true,
  },
  feed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feed",
    required: true,
  },
});

const FeedLike = mongoose.model("FeedLike", feedLikeSchema);

module.exports = FeedLike;
