const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { createItem, getItems, updateItem, deleteItem } = require("../controllers/itemController");

router.get("/", auth, getItems);
router.post("/", auth, upload.array("images", 5), createItem);
router.put("/:id", auth, upload.array("images", 5), updateItem);
router.delete("/:id", auth, deleteItem);

module.exports = router;