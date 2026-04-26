const { Router } = require('express');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { getOwnerDashboard } = require('../controllers/storeController');

const router = Router();

router.use(protect, requireRole('owner'));

router.get('/dashboard', getOwnerDashboard);

module.exports = router;
