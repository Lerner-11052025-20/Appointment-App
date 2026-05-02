const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const c = require('../controllers/appointmentController');

router.get('/public/:shareToken', c.getAppointmentByShareToken);

router.get('/published', protect, c.getPublishedAppointments);
router.get('/published/:id', protect, c.getPublishedAppointmentById);

router.use(protect, authorize('organiser', 'admin'));

router.route('/').get(c.getAppointments).post(c.createAppointment);
router.route('/:id').get(c.getAppointmentById).put(c.updateAppointment).delete(c.deleteAppointment);
router.patch('/:id/publish', c.publishAppointment);
router.patch('/:id/unpublish', c.unpublishAppointment);
router.post('/:id/share', c.generateShareLink);
router.get('/:id/meetings', c.getAppointmentMeetings);

module.exports = router;