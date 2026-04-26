const { Router } = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { getDashboard, listUsers, createUser, listStores, createStore } = require('../controllers/adminController');

const router = Router();

// All admin routes require auth + admin role
router.use(protect, requireRole('admin'));

router.get('/dashboard', getDashboard);

router.get('/users', listUsers);
router.post(
  '/users',
  [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20–60 characters.'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    body('password')
      .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters.')
      .matches(/[A-Z]/).withMessage('Must contain at least one uppercase letter.')
      .matches(/[^A-Za-z0-9]/).withMessage('Must contain at least one special character.'),
    body('role').isIn(['admin', 'user', 'owner']).withMessage('Role must be admin, user, or owner.'),
    body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 characters.'),
  ],
  validate,
  createUser
);

router.get('/stores', listStores);
router.post(
  '/stores',
  [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Store name must be 20–60 characters.'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 characters.'),
    body('owner_id').optional().isInt({ min: 1 }).withMessage('Invalid owner_id.'),
  ],
  validate,
  createStore
);

module.exports = router;
