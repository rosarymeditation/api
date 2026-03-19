const mongoose = require("mongoose");

const psalmSchema = new mongoose.Schema({
  title: { type: String, required: true },
  verse: { type: String, required: true },
  verseNum: { type: Number,  },
  content: { type: String, required: true },
  audioUrl: { type: String },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
});

const Psalm = mongoose.model("Psalm", psalmSchema);

module.exports = Psalm;
