const storeModel = require('../models/storeModel');

const listStores = (filters) => storeModel.listStores(filters);
const getStore   = (id)      => storeModel.findById(id);

module.exports = { listStores, getStore };
