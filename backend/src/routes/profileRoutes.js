const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const {
  getMyProfile,
  updateMyProfile,
  getMyProfileAppointments,
  getMyProfileAppointmentDetails
} = require('../controllers/profileController');

router.use(protect, authorize('customer'));

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.get('/appointments', getMyProfileAppointments);
router.get('/appointments/:bookingId', getMyProfileAppointmentDetails);

module.exports = router;