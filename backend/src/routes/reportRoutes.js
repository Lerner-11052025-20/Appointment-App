const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const report = require('../controllers/reportController');

router.use(protect, authorize('organiser', 'admin'));

router.get('/overview', report.getReportOverview);
router.get('/peak-hours', report.getPeakBookingHours);
router.get('/provider-utilization', report.getProviderUtilization);
router.get('/resource-utilization', report.getResourceUtilization);
router.get('/trends', report.getBookingTrends);
router.get('/appointment-performance', report.getAppointmentPerformance);

module.exports = router;
