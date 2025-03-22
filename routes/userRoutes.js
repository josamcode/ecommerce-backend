const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // For hashing passwords
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Existing /me route
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// New /change-password route
router.post("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both currentPassword and newPassword are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate(
      { _id: req.user.id },
      { password: hashedNewPassword }
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// New /edit-profile route
router.put("/edit-profile", authMiddleware, async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;

    // Validate input
    if (!username || !email) {
      return res
        .status(400)
        .json({ message: "Username and email are required" });
    }

    // Fetch the user from the database
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the email is already in use by another user
    const existingUserWithEmail = await User.findOne({
      email,
      _id: { $ne: req.user.id }, // Exclude the current user
    });

    if (existingUserWithEmail) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Update user information
    user.username = username;
    user.email = email;
    user.phoneNumber = phoneNumber || user.phoneNumber; // Optional field

    await user.save();

    // Respond with success message
    res.json({ message: "Profile updated successfully", user: user.toJSON() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
