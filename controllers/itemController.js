const Item = require('../models/itemModel');
const { predictCondition } = require('../services/conditionService');

// POST /api/items
const createItem = async (req, res) => {
  const {
    title,
    description,
    category,
    usage_years,
    defects,
    usage_type,
    isFree,
    price,
    location
  } = req.body;

  try {
    const condition = await predictCondition({
      usage_years,
      defects,
      usage_type
    });

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
    res.status(500).json({ message: "Condition service unavailable" });
  }
};
const getItems = async (req, res) => {
  const query = {};

  if (!req.user || req.user.role !== 'admin') {
    query.status = 'available';
  }

  if (req.query.category) query.category = req.query.category;
  if (req.query.location) query.location = req.query.location;
  if (req.query.condition) query.condition = req.query.condition;

  const items = await Item.find(query).populate('owner', 'email');
  res.json(items);
};

