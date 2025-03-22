const express = require("express");
const Order = require("../models/Order");

const router = express.Router();

// Create Order
router.post("/", async (req, res) => {
  try {
    const { userInfo, cart, paymentMethod, discountCode, totalPrice } =
      req.body;

    const newOrder = new Order({
      userInfo,
      cart,
      paymentMethod,
      discountCode,
      totalPrice,
      status: "placed", // Setting the order as placed by default
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Order Error:", error);
    res.status(500).json({ message: "Server error while placing order" });
  }
});

// Get All Orders (for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(201).json({
      status: "success",
      totalOrders: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

// Update User Info, Cart, or Order Status
router.put("/:id", async (req, res) => {
  const { userInfo, cart, status } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { userInfo, cart, status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order" });
  }
});

// Delete Order
router.delete("/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order" });
  }
});

module.exports = router;
