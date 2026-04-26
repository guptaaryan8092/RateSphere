const storeModel = require('../models/storeModel');
const ratingModel = require('../models/ratingModel');

/**
 * Get store owner dashboard data:
 *  - their stores with avg rating
 *  - list of users who rated (paginated)
 */
const getOwnerDashboard = async (ownerId, query = {}) => {
  const stores = await storeModel.findByOwnerId(ownerId);

  if (!stores.length) {
    return { stores: [], raters: [], total: 0, page: 1, totalPages: 0 };
  }

  // For simplicity, show raters for the first (or only) store
  const storeId = stores[0].id;
  const ratersData = await ratingModel.getRatersForStore(storeId, {
    page:  Number(query.page)  || 1,
    limit: Number(query.limit) || 10,
  });

  return { stores, ...ratersData };
};

module.exports = { getOwnerDashboard };
