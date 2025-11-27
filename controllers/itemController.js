const Item = require('../models/itemModel');

// POST /api/items
const createItem = async (req, res) => {
  const { title, description, category, condition, isFree, price, location } = req.body;

  try {
    const item = await Item.create({
      owner: req.user._id,
      title,
      description,
      category,
      condition,
      isFree,
      price,
      location
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/items
const getItems = async (req, res) => {
  try {
    const query = { status: 'available' };

    if (req.query.category) query.category = req.query.category;
    if (req.query.location) query.location = req.query.location;
    if (req.query.condition) query.condition = req.query.condition;

    const items = await Item.find(query).populate('owner', 'name email');
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

    const fields = ['title', 'description', 'category', 'condition', 'isFree', 'price', 'location', 'status'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) item[f] = req.body[f];
    });

    const updated = await item.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
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


module.exports = { createItem, getItems, updateItem, deleteItem  };
