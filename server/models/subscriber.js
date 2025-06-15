const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  emailVerificationCode: { type: String },
  planType: { type: String },
  isValid: { type: Boolean, default: false },
  codeExpiry: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const Subscriber = mongoose.model("Subscriber", userSchema);

module.exports = Subscriber;
