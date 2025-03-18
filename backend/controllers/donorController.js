const User = require('../models/User');
const Request = require('../models/Request');

// Get all nearby donation requests
const getNearbyRequests = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
    const requests = await Request.find({
      status: 'pending',
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] },
          $maxDistance: 5000, // 5 km radius
        },
      },
    }).populate('seeker', 'name bloodGroup');

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Accept a blood donation request
const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request || request.status !== 'pending') {
      return res.status(400).json({ message: 'Request not available' });
    }

    request.matchedDonor = req.user._id;
    request.status = 'matched';
    await request.save();

    res.json({ message: 'Request accepted successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Decline a blood donation request
const declineBloodRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request || request.status !== 'pending') {
      return res.status(400).json({ message: 'Request not available' });
    }

    request.status = 'declined';
    await request.save();

    res.json({ message: 'Request declined successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getNearbyRequests, acceptRequest, declineBloodRequest };
