const express = require('express');
const router = express.Router();
const { getVehicles, addVehicle } = require('../controllers/vehicleController');
const { protect, owner } = require('../middleware/authMiddleware');

router.get('/', getVehicles); // open to public or just logged in users
router.post('/', protect, owner, addVehicle);

module.exports = router;
