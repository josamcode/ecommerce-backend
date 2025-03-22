const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    // Check if user with the same email or phone number already exists
    let userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = new User({
      username, // Now represents the full name
      email,
      password: hashedPassword,
      phoneNumber,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Change the token duration to 30 days
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // ✅ صلاحية 30 يوم بدل ساعة
  });
};

exports.login = async (req, res) => {
  try {
    const { credential, password } = req.body;

    // Find the user by either email or phoneNumber
    const user = await User.findOne({
      $or: [{ email: credential }, { phoneNumber: credential }],
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate an access token
    const accessToken = generateAccessToken(user);

    // Return the token and user details
    res.json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({ states: "success", length: users.length, data: users });
  } catch (error) {
    res.status(500).json({ states: "failed", message: "Server Error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // الحصول على معرف المستخدم من المسار
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
