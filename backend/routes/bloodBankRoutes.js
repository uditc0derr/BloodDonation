const express = require('express');
const { getAllRequests, updateStock } = require('../controllers/bloodBankController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all-requests', authMiddleware, getAllRequests);
router.put('/update-stock', authMiddleware, updateStock);

module.exports = router;
