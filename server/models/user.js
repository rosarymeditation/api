const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  banner: { type: String },
  bio: { type: String },
  verifyCode: { type: String },
  hasDeleted: { type: Boolean, default: false },
  codeExpiry: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
