const express = require('express');
const { createRequest, getSeekerRequests } = require('../controllers/seekerController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-request', authMiddleware, createRequest);
router.get('/my-requests', authMiddleware, getSeekerRequests);

module.exports = router;
