const mongoose = require("mongoose");

const testimonySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Testimony = mongoose.model("Testimony", testimonySchema);

module.exports = Testimony;
