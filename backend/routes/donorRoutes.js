const express = require('express');
const { getNearbyRequests, acceptRequest, declineBloodRequest } = require('../controllers/donorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/nearby-requests', authMiddleware, getNearbyRequests);
router.post('/accept-request/:id', authMiddleware, acceptRequest);
router.post('/decline-request/:id', authMiddleware, declineBloodRequest); 

module.exports = router;
