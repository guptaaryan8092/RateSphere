const storeService = require('../services/storeService');

// GET /api/owner/dashboard
const getOwnerDashboard = async (req, res, next) => {
  try {
    const data = await storeService.getOwnerDashboard(req.user.id, req.query);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOwnerDashboard };
