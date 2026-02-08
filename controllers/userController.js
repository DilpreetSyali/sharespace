const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  const { name, email, password, role, collegeID } = req.body;

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    collegeID
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({
    token,
    user: { id: user._id, name, email, role }
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({
    token,
    user: { id: user._id, name: user.name, email, role: user.role }
  });
};

/* 🔥 ADMIN */
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

module.exports = { registerUser, loginUser, getAllUsers };
