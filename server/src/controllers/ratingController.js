const ratingService = require('../services/ratingService');

// POST /api/ratings
const submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const newRating = await ratingService.submitRating({
      userId: req.user.id,
      storeId: Number(storeId),
      rating: Number(rating),
    });
    res.status(201).json({ success: true, message: 'Rating submitted.', data: { rating: newRating } });
  } catch (err) {
    next(err);
  }
};

// PUT /api/ratings/:id
const updateRating = async (req, res, next) => {
  try {
    const updated = await ratingService.updateRating(
      Number(req.params.id),
      req.user.id,
      Number(req.body.rating)
    );
    res.json({ success: true, message: 'Rating updated.', data: { rating: updated } });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitRating, updateRating };
