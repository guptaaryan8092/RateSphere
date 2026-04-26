const { Router } = require('express');
const authRoutes  = require('./auth');
const adminRoutes = require('./admin');
const userRoutes  = require('./user');    // store browsing
const storeRoutes = require('./store');   // owner dashboard
const ratingRoutes = require('./rating');

const router = Router();

router.use('/auth',    authRoutes);
router.use('/admin',   adminRoutes);
router.use('/stores',  userRoutes);
router.use('/owner',   storeRoutes);
router.use('/ratings', ratingRoutes);

module.exports = router;
