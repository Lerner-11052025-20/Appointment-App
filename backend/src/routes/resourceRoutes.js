const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const c = require('../controllers/resourceController');

router.use(protect, authorize('organiser', 'admin'));

router.route('/').get(c.getResources).post(c.createResource);
router.route('/:id').get(c.getResourceById).put(c.updateResource).delete(c.deleteResource);

module.exports = router;