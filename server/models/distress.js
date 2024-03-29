const mongoose = require("mongoose");

const distressSchema = new mongoose.Schema({
  content: { type: String, required: true },
  title: { type: String },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
  url: { type: String },
});

const Distress = mongoose.model("Distress", distressSchema);

module.exports = Distress;
