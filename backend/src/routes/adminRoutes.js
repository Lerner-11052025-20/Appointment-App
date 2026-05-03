const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const admin = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard', admin.getAdminDashboard);
router.get('/users', admin.getAllUsers);
router.get('/users/:id', admin.getUserById);
router.patch('/users/:id/status', admin.updateUserStatus);
router.patch('/users/:id/role', admin.updateUserRole);
router.get('/providers', admin.getProviders);
router.get('/activity', admin.getPlatformActivity);

module.exports = router;
