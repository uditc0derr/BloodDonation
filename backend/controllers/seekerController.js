const Request = require('../models/Request');

// Create a new blood request
const createRequest = async (req, res) => {
  const { bloodGroup, location } = req.body;

  if (!bloodGroup || !location) {
    return res.status(400).json({ message: 'Blood group and location are required' });
  }

  try {
    const newRequest = await Request.create({
      seeker: req.user._id,
      bloodGroup,
      location,
    });

    res.status(201).json({ message: 'Blood request created', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get seeker's own requests
const getSeekerRequests = async (req, res) => {
  try {
    const requests = await Request.find({ seeker: req.user._id }).populate('matchedDonor', 'name');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createRequest, getSeekerRequests };
