const userModel = require('../models/userModel');
const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');
const authService = require('./authService');

// ── Dashboard ─────────────────────────────────────────────────────────────────

const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    userModel.countUsers(),
    storeModel.countStores(),
    ratingModel.countRatings(),
  ]);
  return { totalUsers, totalStores, totalRatings };
};

// ── Users ─────────────────────────────────────────────────────────────────────

const listUsers = (filters) => userModel.listUsers(filters);

const createUser = async ({ name, email, password, address, role }) => {
  return authService.register({ name, email, password, address, role });
};

// ── Stores ─────────────────────────────────────────────────────────────────────

const listStores = (filters) => storeModel.listStores(filters);

const createStore = ({ name, email, address, owner_id }) =>
  storeModel.createStore({ name, email, address, owner_id });

module.exports = { getDashboardStats, listUsers, createUser, listStores, createStore };
