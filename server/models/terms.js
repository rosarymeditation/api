const mongoose = require("mongoose");

const termsSchema = new mongoose.Schema({
  eula: { type: String },
  privacy: { type: String },
  term: { type: String },
  language: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Language",
    required: true,
  },
});

const Terms = mongoose.model("Terms", termsSchema);

module.exports = Terms;
