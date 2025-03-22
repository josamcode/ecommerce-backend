const express = require("express");
const BestSeller = require("../models/BestSeller");

const router = express.Router();

// Get all best-selling products
router.get("/best-sellers", async (req, res) => {
  try {
    const products = await BestSeller.find().sort({ sold: -1 }).limit(8);
    res.json({
      status: "success",
      totalProducts: products.length,
      data: products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error fetching products" });
  }
});

// Add a new best-selling product
router.post("/best-sellers", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      images,
      colors,
      sizes,
      sold,
      stock,
      brand,
      category,
      productCollection,
      rating,
      reviewsCount,
    } = req.body;

    const newProduct = new BestSeller({
      name,
      description,
      price,
      image,
      images: images || [],
      colors: colors || [],
      sizes: sizes || [],
      sold,
      stock,
      brand,
      category,
      productCollection: productCollection || "",
      rating: rating || 0,
      reviewsCount: reviewsCount || 0,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a best-selling product
router.put("/best-sellers/:id", async (req, res) => {
  try {
    const updatedProduct = await BestSeller.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a best-selling product
router.delete("/best-sellers/:id", async (req, res) => {
  try {
    const deletedProduct = await BestSeller.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
