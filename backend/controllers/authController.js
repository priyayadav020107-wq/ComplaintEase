const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: signs a JWT containing the user's id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route   POST /api/auth/register
// @desc    Create a new user account
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // role is intentionally NOT taken from req.body - it always defaults to "user".
    // Promote someone to admin directly in the database if needed.
    const user = await User.create({ name, email, password });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during registration", error: error.message });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate a user and return a token
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // password has `select: false` on the schema, so it must be explicitly requested
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error during login", error: error.message });
  }
};

// @route   GET /api/auth/me
// @desc    Get the currently logged-in user's profile
// @access  Private
const getMe = async (req, res) => {
  return res.status(200).json(req.user);
};

// @route   PUT /api/auth/me
// @desc    Update the current user's name, email and/or password
// @access  Private
const updateMe = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ message: "An account with this email already exists" });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (password) user.password = password; // hashed by the pre-save hook on User

    const updated = await user.save();

    return res.status(200).json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

module.exports = { registerUser, loginUser, getMe, updateMe };
