const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [{ type: String, required: true }],
    colors: [{ type: String }],
    sizes: [{ type: String }],
    brand: { type: String },
    category: { type: [String] },
    productCollection: { type: String, required: false },
    stock: { type: Number, required: true, min: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
