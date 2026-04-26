const { Router } = require('express');
const { protect } = require('../middleware/authMiddleware');
const { listStores, getStore } = require('../controllers/userController');

const router = Router();

// Store listing is accessible to logged-in users (optional auth for user_rating attachment)
router.get('/', protect, listStores);
router.get('/:id', protect, getStore);

module.exports = router;
