const Item = require('../models/itemModel');

// helper that turns any files uploaded by multer into public URLs
function buildImageUrls(req) {
  if (!req.files || !req.files.length) {
    console.log("ℹ️ No files uploaded");
    return [];
  }

  return req.files.map((f) => `/uploads/${f.filename}`);
}

// POST /api/items
const createItem = async (req, res) => {
  try {
    const { title, description, category, condition, isFree, price, location } = req.body;

    console.log("=== CREATE ITEM REQUEST ===");
    console.log("Body:", req.body);
    console.log("Files:", req.files?.length || 0);
    console.log("Files details:", req.files?.map(f => ({ name: f.originalname, size: f.size, mimetype: f.mimetype })));
    console.log("User:", req.user);
    console.log("===========================");

    // ✅ simple validation (clear errors)
    if (!title || !category || !location) {
      return res.status(400).json({ 
        message: 'title, category and location are required',
        details: { title: !!title, category: !!category, location: !!location }
      });
    }

    if (!req.user?.collegeID) {
      return res.status(400).json({
        message: 'User collegeID missing. Check userModel/register.',
        user: req.user
      });
    }

    // Images are optional now
    const images = buildImageUrls(req);

    const item = await Item.create({
      owner: req.user._id,
      collegeID: req.user.collegeID,
      title: String(title).trim(),
      description: description ? String(description).trim() : '',
      category: String(category).trim(),
      condition: condition || 'good',
      isFree: isFree === 'true' || isFree === true,
      price: Number(isFree === 'true' || isFree === true ? 0 : price || 0),
      location: String(location).trim(),
      images,
    });

    console.log("✅ Item created:", item._id);
    res.status(201).json(item);
  } catch (err) {
    console.error("❌ CREATE ITEM ERROR:", err.message);
    console.error("Stack:", err.stack);
    
    // Send detailed error response
    let errorMessage = err.message || 'Server error';
    if (err.message.includes('ENOENT')) {
      errorMessage = 'File system error: uploads directory issue. Admin should check server.';
    }
    if (err.message.includes('ValidationError')) {
      errorMessage = err.message;
    }
    
    res.status(500).json({ message: errorMessage });
  }
};

// GET /api/items
const getItems = async (req, res) => {
  try {
    const query = { status: 'available' };

    if (req.user?.collegeID) query.collegeID = req.user.collegeID;

    if (req.query.category) query.category = req.query.category;
    if (req.query.location) query.location = req.query.location;
    if (req.query.condition) query.condition = req.query.condition;

    const items = await Item.find(query).populate('owner', 'name email collegeID');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/items/:id
const updateItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to edit this item' });
    }

    const fields = ['title', 'description', 'category', 'condition', 'location', 'status'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) item[f] = req.body[f];
    });

    if (req.body.isFree !== undefined)
      item.isFree = req.body.isFree === 'true' || req.body.isFree === true;
    if (req.body.price !== undefined) item.price = Number(req.body.price || 0);

    const newImages = buildImageUrls(req);
    if (newImages.length) item.images = [...(item.images || []), ...newImages];

    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

// DELETE /api/items/:id
const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createItem, getItems, updateItem, deleteItem };