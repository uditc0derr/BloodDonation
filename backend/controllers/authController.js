const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Register User (Donor, Seeker, Blood Bank)
const registerUser = async (req, res) => {
  const { name, email, phoneNumber, password, role, location } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) return res.status(400).json({ message: 'Email or Phone Number already in use' });

    const user = await User.create({ name, email, phoneNumber, password, role, location });

    res.status(201).json({ 
      _id: user.id, 
      name: user.name, 
      email: user.email, 
      phoneNumber: user.phoneNumber, 
      role: user.role, 
      location: user.location,
      token: generateToken(user.id) 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login User (Using Email or Phone Number)
const loginUser = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ 
      _id: user.id, 
      name: user.name, 
      email: user.email, 
      phoneNumber: user.phoneNumber,
      role: user.role, 
      location: user.location,
      token: generateToken(user.id) 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password'); // Exclude password
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile };
