const ratingModel = require('../models/ratingModel');

const submitRating = async ({ userId, storeId, rating }) => {
  const existing = await ratingModel.findByUserAndStore(userId, storeId);
  if (existing) {
    const err = new Error('You have already rated this store. Use PUT to update.');
    err.statusCode = 409;
    throw err;
  }
  return ratingModel.createRating({ userId, storeId, rating });
};

const updateRating = async (ratingId, userId, rating) => {
  const existing = await ratingModel.findById(ratingId);
  if (!existing) {
    const err = new Error('Rating not found.');
    err.statusCode = 404;
    throw err;
  }
  if (existing.user_id !== userId) {
    const err = new Error('You can only update your own ratings.');
    err.statusCode = 403;
    throw err;
  }
  return ratingModel.updateRating(ratingId, rating);
};

module.exports = { submitRating, updateRating };
