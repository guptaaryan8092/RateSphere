const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'change_me';
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a JWT payload
 * @param {object} payload - { id, email, role }
 * @returns {string} signed token
 */
const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });

/**
 * Verify and decode a JWT
 * @param {string} token
 * @returns {object} decoded payload
 */
const verifyToken = (token) => jwt.verify(token, SECRET);

module.exports = { signToken, verifyToken };
