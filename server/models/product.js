const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: String },
  slug: { type: String },
  serial: { type: String },
  createdAt: { type: Date, default: Date.now },
  productImages: [
    { type: mongoose.Schema.Types.ObjectId, ref: "ProductImage" },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
