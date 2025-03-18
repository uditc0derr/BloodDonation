const User = require('../models/User');
const Request = require('../models/Request');

// Get all blood requests in the system
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find({ status: 'pending' }).populate('seeker', 'name bloodGroup');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update blood bank stock
const updateStock = async (req, res) => {
  const { bloodStock } = req.body; // Example: { A+: 5, O-: 3 }

  try {
    const bloodBank = await User.findById(req.user._id);
    if (!bloodBank || bloodBank.role !== 'blood_bank') {
      return res.status(403).json({ message: 'Access Denied' });
    }

    bloodBank.bloodStock = bloodStock;
    await bloodBank.save();

    res.json({ message: 'Blood stock updated successfully', bloodStock });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getAllRequests, updateStock };
