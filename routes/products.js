const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// Models
const Product = require("../models/Product");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../public/images/products");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const fileExtension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${fileExtension}`);
  },
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Helper function to delete images
const deleteImages = (images) => {
  images.forEach((imagePath) => {
    const filePath = path.join(__dirname, "../public", imagePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
};

// Create a new product
router.post("/", upload.array("images", 10), async (req, res) => {
  const productData = req.body;
  const imagePaths = req.files.map((file) => `${file.filename}`);

  try {
    if (!productData.name || !productData.price) {
      return res.status(400).json({
        status: "error",
        message: "Product name and price are required",
      });
    }

    if (req.body.category) {
      req.body.category = JSON.parse(req.body.category);
    }

    const newProduct = new Product({ ...productData, images: imagePaths });
    await newProduct.save();
    res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      status: "error",
      message: error.message || "Error creating product",
    });
  }
});

// Get all products from all categories
router.get("/", async (req, res) => {
  try {
    const allProducts = await Product.find({});

    res.json({
      status: "success",
      totalProducts: allProducts.length,
      data: allProducts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error fetching products" });
  }
});

// Get product by ID (from any category)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// Update product by ID (from any category)
router.put("/:id", upload.array("images", 10), async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  const updatedData = req.body;

  try {
    // Parse category if provided
    if (req.body.category) {
      updatedData.category = JSON.parse(req.body.category);
    }

    // Find product
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Handle images
    const newImages = req.files.map((file) => `${file.filename}`);
    const existingImages = req.body.existingImages ? 
      (Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages]) : 
      [];

    // Combine existing and new images
    updatedData.images = [...existingImages, ...newImages];

    // Delete any images that were removed
    if (product.images && product.images.length > 0) {
      const imagesToDelete = product.images.filter(
        (oldImage) => !updatedData.images.includes(oldImage)
      );
      if (imagesToDelete.length > 0) {
        deleteImages(imagesToDelete);
      }
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found or update failed" });
    }

    res.status(200).json({ status: "success", data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
});

// Delete product by ID (from any category)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete product images from server
    if (product.images && product.images.length > 0) {
      deleteImages(product.images);
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
