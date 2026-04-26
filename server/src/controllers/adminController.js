const adminService = require('../services/adminService');

// GET /api/admin/dashboard
const getDashboard = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users
const listUsers = async (req, res, next) => {
  try {
    const { name, email, role, address, sortBy, order, page, limit } = req.query;
    const result = await adminService.listUsers({
      name, email, role, address, sortBy, order,
      page:  Number(page)  || 1,
      limit: Number(limit) || 10,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/users
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;
    const { user } = await adminService.createUser({ name, email, password, address, role });
    res.status(201).json({ success: true, message: 'User created.', data: { user } });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/stores
const listStores = async (req, res, next) => {
  try {
    const { name, address, sortBy, order, page, limit } = req.query;
    const result = await adminService.listStores({
      name, address, sortBy, order,
      page:  Number(page)  || 1,
      limit: Number(limit) || 10,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// POST /api/admin/stores
const createStore = async (req, res, next) => {
  try {
    const { name, email, address, owner_id } = req.body;
    const store = await adminService.createStore({ name, email, address, owner_id });
    res.status(201).json({ success: true, message: 'Store created.', data: { store } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboard, listUsers, createUser, listStores, createStore };
