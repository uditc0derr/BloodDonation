const User = require('../models/User');
const Request = require('../models/Request');
const { calculateDistance, findNearbyUsers } = require('../utils/mapService');

// Get nearby donors
const getNearbyDonors = async (req, res) => {
  const { latitude, longitude, bloodGroup } = req.query;

  if (!latitude || !longitude || !bloodGroup) {
    return res.status(400).json({ message: 'Latitude, longitude, and blood group are required' });
  }

  try {
    const donors = await User.find({ role: 'donor', bloodGroup }).select('name bloodGroup location');

    const nearbyDonors = findNearbyUsers(donors, { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }, 5000); // 5 km radius

    res.json(nearbyDonors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get nearby blood banks
const getNearbyBloodBanks = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    const bloodBanks = await User.find({ role: 'blood_bank' }).select('name bloodStock location');

    const nearbyBloodBanks = findNearbyUsers(bloodBanks, { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }, 10000); // 10 km radius

    res.json(nearbyBloodBanks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getNearbyDonors, getNearbyBloodBanks };
