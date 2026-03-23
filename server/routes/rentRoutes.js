const express = require('express');
const router = express.Router();
const { requestRent, respondRent, getMyRequests } = require('../controllers/rentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestRent);
router.put('/:id/status', protect, respondRent);
router.get('/my-requests', protect, getMyRequests);

module.exports = router;
