const mongoose = require("mongoose");
const { use } = require("../routes/products");

const orderSchema = new mongoose.Schema({
  userInfo: {
    name: String,
    email: String,
    phone: String,
    country: String,
    city: String,
    state: String,
    street: String,
    userId: mongoose.Schema.Types.ObjectId,
  },
  cart: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      quantity: Number,
      price: Number,
      image: String,
    },
  ],
  paymentMethod: {
    type: String,
    enum: ["cash_on_delivery", "credit_card"],
    default: "delivery",
  },
  discountCode: String,
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "placed", "shipped", "delivered"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
