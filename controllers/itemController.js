const Item = require("../models/itemModel");

function buildImageUrls(req) {
  if (!req.files || !req.files.length) return [];
  return req.files.map((f) => `/uploads/${f.filename}`);
}

const createItem = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { title, description, category, condition, isFree, price, location } = req.body;

    if (!title || !category || !location) {
      return res.status(400).json({
        message: "title, category and location are required",
      });
    }

    const images = buildImageUrls(req);

    console.log("IMAGE URLS:", images);

    const item = await Item.create({
      owner: req.user._id,
      collegeID: req.user.collegeID,
      title: String(title).trim(),
      description: description ? String(description).trim() : "",
      category: String(category).trim(),
      condition: condition || "good",
      isFree: isFree === "true" || isFree === true,
      price: Number(isFree === "true" || isFree === true ? 0 : price || 0),
      location: String(location).trim(),
      images,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error("CREATE ITEM ERROR:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const getItems = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    // Show available items OR items owned by current user (regardless of status)
    const query = {
      $or: [
        { status: "available" },
        { owner: userId }
      ],
      collegeID: req.user?.collegeID
    };

    if (req.query.category) query.category = req.query.category;
    if (req.query.location) query.location = req.query.location;
    if (req.query.condition) query.condition = req.query.condition;

    const items = await Item.find(query).populate("owner", "name email collegeID");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to edit this item" });
    }

    const fields = ["title", "description", "category", "condition", "location", "status"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) item[f] = req.body[f];
    });

    if (req.body.isFree !== undefined) {
      item.isFree = req.body.isFree === "true" || req.body.isFree === true;
    }

    if (req.body.price !== undefined) {
      item.price = Number(req.body.price || 0);
    }

    const newImages = buildImageUrls(req);
    if (newImages.length) item.images = [...(item.images || []), ...newImages];

    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this item" });
    }

    await item.deleteOne();
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createItem, getItems, updateItem, deleteItem };