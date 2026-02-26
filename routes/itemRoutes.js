const express = require("express");
const router = express.Router();

const { createItem, getItems, updateItem, deleteItem } = require("../controllers/itemController");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// ✅ min 1 photo, max 5 photos
router.post("/", protect, upload.array("images", 5), createItem);

router.get("/", protect, getItems);
router.put("/:id", protect, upload.array("images", 5), updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;