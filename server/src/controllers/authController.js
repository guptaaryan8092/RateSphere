const authService = require('../services/authService');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;
    const { user, token } = await authService.register({ name, email, password, address, role: 'user' });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(201).json({ success: true, message: 'Account created successfully.', data: { user, token } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });
    res.cookie('token', token, COOKIE_OPTIONS);
    res.json({ success: true, message: 'Login successful.', data: { user, token } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = (_req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
  res.json({ success: true, message: 'Logged out successfully.' });
};

// PATCH /api/auth/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user.id, { currentPassword, newPassword });
    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const userModel = require('../models/userModel');
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, logout, changePassword, getMe };
