const { Router } = require('express');
const { body } = require('express-validator');
const { signup, login, logout, changePassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = Router();

const passwordRules = () =>
  body('password')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain at least one special character.');

router.post(
  '/signup',
  [
    body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20–60 characters.'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    passwordRules(),
    body('address').optional().isLength({ max: 400 }).withMessage('Address max 400 characters.'),
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  validate,
  login
);

router.post('/logout', protect, logout);

router.get('/me', protect, getMe);

router.patch(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required.'),
    body('newPassword')
      .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters.')
      .matches(/[A-Z]/).withMessage('Must contain at least one uppercase letter.')
      .matches(/[^A-Za-z0-9]/).withMessage('Must contain at least one special character.'),
  ],
  validate,
  changePassword
);

module.exports = router;
