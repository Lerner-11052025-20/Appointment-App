const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:appointmentId', availabilityController.getAvailability);

module.exports = router;