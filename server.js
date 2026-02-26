const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// ✅ routes (IMPORTANT: require directly, NOT inside { })
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

connectDB();

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ DEBUG: Log all requests to /api/items
app.use("/api/items", (req, res, next) => {
  if (req.method === "POST") {
    console.log("=== REQUEST TO /api/items ===");
    console.log("Method:", req.method);
    console.log("Content-Type:", req.get("content-type"));
    console.log("Headers:", req.headers);
  }
  next();
});

// ✅ serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ routes
app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/feedback", feedbackRoutes);

// ✅ health check
app.get("/", (req, res) => {
  res.send("ShareSpace API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));