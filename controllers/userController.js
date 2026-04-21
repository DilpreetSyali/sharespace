const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const makeAuthResponse = (user) => ({
  token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" }),
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  collegeID: user.collegeID,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, collegeID } = req.body;

    if (!name || !email || !password || !collegeID) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (await User.findOne({ email: normalizedEmail })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: role || "student",
      collegeID: collegeID.trim(),
    });

    return res.status(201).json(makeAuthResponse(user));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Signup failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.json(makeAuthResponse(user));
  } catch (error) {
    return res.status(500).json({ message: error.message || "Login failed" });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

module.exports = { registerUser, loginUser, getAllUsers };