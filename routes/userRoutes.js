// routes/userRoutes.js
const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const {
  registerUser,
  loginUser,
  getAllUsers,
} = require("../controllers/userController");

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Admin
router.get("/", auth, adminOnly, getAllUsers);

module.exports = router;