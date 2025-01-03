const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  banner: { type: String },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  address: {
    street: { type: String },
    addressLine2: { type: String }, // Optional second line for address (e.g., apartment, suite)
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },
    purposes,
  },
  bio: { type: String },
  verifyCode: { type: String },
  hasDeleted: { type: Boolean, default: false },
  codeExpiry: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
