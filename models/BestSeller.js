const mongoose = require("mongoose");

const bestSellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    images: [{ type: String, required: false }],
    colors: [{ type: String, required: false }],
    sizes: [{ type: String, required: false }],
    category: { type: String, required: true },
    productCollection: { type: String, required: false },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BestSeller", bestSellerSchema);
