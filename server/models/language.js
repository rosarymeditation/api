const mongoose = require("mongoose");

const languageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String },
});

const Language = mongoose.model("Language", languageSchema);

module.exports = Language;
