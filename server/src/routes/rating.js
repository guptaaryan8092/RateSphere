const { Router } = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { submitRating, updateRating } = require('../controllers/ratingController');

const router = Router();

const ratingRule = body('rating')
  .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.');

// Only normal users can rate
router.post(
  '/',
  protect,
  requireRole('user'),
  [body('storeId').isInt({ min: 1 }).withMessage('Valid storeId required.'), ratingRule],
  validate,
  submitRating
);

router.put(
  '/:id',
  protect,
  requireRole('user'),
  [ratingRule],
  validate,
  updateRating
);

module.exports = router;
