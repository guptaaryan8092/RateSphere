const userService = require('../services/userService');

// GET /api/stores
const listStores = async (req, res, next) => {
  try {
    const { name, address, sortBy, order, page, limit } = req.query;
    const userId = req.user?.id; // optional — attach user's own rating

    const result = await userService.listStores({
      name, address, sortBy, order,
      page:  Number(page)  || 1,
      limit: Number(limit) || 10,
      userId,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// GET /api/stores/:id
const getStore = async (req, res, next) => {
  try {
    const store = await userService.getStore(Number(req.params.id));
    if (!store) return res.status(404).json({ success: false, message: 'Store not found.' });
    res.json({ success: true, data: { store } });
  } catch (err) {
    next(err);
  }
};

module.exports = { listStores, getStore };
