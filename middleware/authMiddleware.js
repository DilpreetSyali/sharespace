// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  try {
    console.log("🔐 AUTH MIDDLEWARE CHECK");
    console.log("Headers:", Object.keys(req.headers));
    console.log("Auth header:", req.headers.authorization);
    
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log("❌ NO TOKEN FOUND");
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    console.log("✅ Token found, verifying...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      console.log("❌ USER NOT FOUND IN DB");
      return res.status(401).json({ message: 'User not found' });
    }

    console.log("✅ User authenticated:", req.user._id);
    next();

  } catch (err) {
    console.log("❌ AUTH ERROR:", err.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = protect;