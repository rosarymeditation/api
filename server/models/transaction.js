const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  refId: { type: String },
  total: { type: String },
  delivery: { type: String },
  subTotal: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
