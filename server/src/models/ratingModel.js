const db = require('../config/db');

// ── Find ─────────────────────────────────────────────────────────────────────

const findByUserAndStore = async (userId, storeId) => {
  const { rows } = await db.query(
    'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
    [userId, storeId]
  );
  return rows[0] || null;
};

const findById = async (id) => {
  const { rows } = await db.query('SELECT * FROM ratings WHERE id = $1', [id]);
  return rows[0] || null;
};

// ── Create / Update ───────────────────────────────────────────────────────────

const createRating = async ({ userId, storeId, rating }) => {
  const { rows } = await db.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, storeId, rating]
  );
  return rows[0];
};

const updateRating = async (id, rating) => {
  const { rows } = await db.query(
    `UPDATE ratings
     SET rating = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [rating, id]
  );
  return rows[0];
};

// ── Owner Dashboard: users who rated this store ───────────────────────────────

const getRatersForStore = async (storeId, { page = 1, limit = 10 } = {}) => {
  const offset = (page - 1) * limit;
  const { rows } = await db.query(
    `SELECT r.id, r.rating, r.created_at, r.updated_at,
            u.id AS user_id, u.name AS user_name, u.email AS user_email
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [storeId, limit, offset]
  );

  const { rows: countRows } = await db.query(
    'SELECT COUNT(*) FROM ratings WHERE store_id = $1',
    [storeId]
  );

  return {
    raters: rows,
    total: Number(countRows[0].count),
    page,
    limit,
    totalPages: Math.ceil(Number(countRows[0].count) / limit),
  };
};

// ── Stats ────────────────────────────────────────────────────────────────────

const countRatings = async () => {
  const { rows } = await db.query('SELECT COUNT(*) FROM ratings');
  return Number(rows[0].count);
};

const getAverageForStore = async (storeId) => {
  const { rows } = await db.query(
    'SELECT ROUND(AVG(rating)::numeric, 2) AS avg FROM ratings WHERE store_id = $1',
    [storeId]
  );
  return rows[0]?.avg ?? null;
};

module.exports = {
  findByUserAndStore,
  findById,
  createRating,
  updateRating,
  getRatersForStore,
  countRatings,
  getAverageForStore,
};
