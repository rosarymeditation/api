const mongoose = require("mongoose");

const ProductImageSchema = new mongoose.Schema({
  url: { type: String },
});

const ProductImage = mongoose.model("ProductImage", ProductImageSchema);

module.exports = ProductImage;
