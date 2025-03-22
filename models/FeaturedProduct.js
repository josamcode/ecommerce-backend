const mongoose = require("mongoose");

const FeaturedProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    images: [{ type: String, required: false }],
    category: { type: String, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    stock: { type: Number, required: true, min: 0 },
    specifications: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeaturedProduct", FeaturedProductSchema);