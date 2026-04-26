const bcrypt = require('bcryptjs');
const { signToken } = require('../config/jwt');
const userModel = require('../models/userModel');

const SALT_ROUNDS = 12;

const hashPassword = (plain) => bcrypt.hash(plain, SALT_ROUNDS);

const comparePassword = (plain, hashed) => bcrypt.compare(plain, hashed);

/**
 * Register a new user.
 * @param {{ name, email, password, address, role }} data
 */
const register = async ({ name, email, password, address, role = 'user' }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    const err = new Error('Email already in use.');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await hashPassword(password);
  const user = await userModel.createUser({ name, email, password: hashed, address, role });
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user, token };
};

/**
 * Login — verify credentials, return token + user.
 */
const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid credentials.');
    err.statusCode = 401;
    throw err;
  }

  const match = await comparePassword(password, user.password);
  if (!match) {
    const err = new Error('Invalid credentials.');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const { password: _p, ...safeUser } = user;
  return { user: safeUser, token };
};

/**
 * Change password — verify old, save new.
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await userModel.findByEmail(
    (await userModel.findById(userId)).email
  );

  const match = await comparePassword(currentPassword, user.password);
  if (!match) {
    const err = new Error('Current password is incorrect.');
    err.statusCode = 400;
    throw err;
  }

  const hashed = await hashPassword(newPassword);
  return userModel.updatePassword(userId, hashed);
};

module.exports = { hashPassword, register, login, changePassword };
