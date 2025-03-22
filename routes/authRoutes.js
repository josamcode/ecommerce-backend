const express = require("express");
const {
  register,
  login,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

module.exports = router;
