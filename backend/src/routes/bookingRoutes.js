const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', authorize('customer'), bookingController.createBooking);
router.get('/my', authorize('customer'), bookingController.getMyBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/cancel', authorize('customer', 'organiser', 'admin'), bookingController.cancelBooking);
router.patch('/:id/reschedule', authorize('customer'), bookingController.rescheduleBooking);
router.patch('/:id/status', authorize('organiser', 'admin'), bookingController.updateBookingStatus);

module.exports = router;