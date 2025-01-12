const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  refId: { type: String },
  total: { type: String },
  delivery: { type: String },
  fullname: { type: String },
  email: { type: String },
  address: { type: String },
  subTotal: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
