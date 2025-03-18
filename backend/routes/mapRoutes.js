const express = require('express');
const { getNearbyDonors, getNearbyBloodBanks } = require('../controllers/mapController');

const router = express.Router();

router.get('/nearby-donors', getNearbyDonors);
router.get('/nearby-bloodbanks', getNearbyBloodBanks);

module.exports = router;
