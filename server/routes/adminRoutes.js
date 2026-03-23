const express = require('express');
const router = express.Router();
const { getStats, createUserOwner, getRentedVehicles, getUsers, getOwners } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getStats);
router.post('/users', protect, admin, createUserOwner);
router.get('/rentals', protect, admin, getRentedVehicles);
router.get('/all-users', protect, admin, getUsers);
router.get('/all-owners', protect, admin, getOwners);

module.exports = router;
