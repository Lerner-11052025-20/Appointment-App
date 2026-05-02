const express = require('express');
const router = express.Router();
const { getProviders, getOrganiserStats, getAdminStats } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/providers', authorize('organiser', 'admin'), getProviders);
router.get('/organiser-stats', authorize('organiser'), getOrganiserStats);
router.get('/admin-stats', authorize('admin'), getAdminStats);

module.exports = router;
