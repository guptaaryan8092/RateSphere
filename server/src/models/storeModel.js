const db = require('../config/db');

// ── Find ─────────────────────────────────────────────────────────────────────

const findById = async (id) => {
  const { rows } = await db.query(
    `SELECT s.*, u.name AS owner_name,
            ROUND(AVG(r.rating)::numeric, 2) AS avg_rating,
            COUNT(r.id) AS rating_count
     FROM stores s
     LEFT JOIN users u ON u.id = s.owner_id
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.id = $1
     GROUP BY s.id, u.name`,
    [id]
  );
  return rows[0] || null;
};

const findByOwnerId = async (ownerId) => {
  const { rows } = await db.query(
    `SELECT s.*, ROUND(AVG(r.rating)::numeric, 2) AS avg_rating, COUNT(r.id) AS rating_count
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [ownerId]
  );
  return rows;
};

// ── Create ───────────────────────────────────────────────────────────────────

const createStore = async ({ name, email, address, owner_id }) => {
  const { rows } = await db.query(
    `INSERT INTO stores (name, email, address, owner_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, email, address, owner_id]
  );
  return rows[0];
};

// ── List with search / sort / pagination ──────────────────────────────────────

const listStores = async ({ name, address, sortBy = 'created_at', order = 'DESC', page = 1, limit = 10, userId }) => {
  const allowed = ['name', 'address', 'avg_rating', 'created_at'];
  const sortCol = allowed.includes(sortBy) ? sortBy : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;

  const conditions = [];
  const values = [];
  let idx = 1;

  if (name)    { conditions.push(`s.name ILIKE $${idx++}`);    values.push(`%${name}%`); }
  if (address) { conditions.push(`s.address ILIKE $${idx++}`); values.push(`%${address}%`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Include user's own rating if userId supplied
  const userRatingJoin = userId
    ? `LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $${idx++}`
    : '';
  const userRatingCol = userId ? `, ur.rating AS user_rating, ur.id AS user_rating_id` : '';
  if (userId) values.push(userId);

  const dataQ = `
    SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
           u.name AS owner_name,
           ROUND(AVG(r.rating)::numeric, 2) AS avg_rating,
           COUNT(r.id) AS rating_count
           ${userRatingCol}
    FROM stores s
    LEFT JOIN users u ON u.id = s.owner_id
    LEFT JOIN ratings r ON r.store_id = s.id
    ${userRatingJoin}
    ${where}
    GROUP BY s.id, u.name ${userId ? ', ur.rating, ur.id' : ''}
    ORDER BY ${sortCol === 'avg_rating' ? 'avg_rating' : `s.${sortCol}`} ${sortOrder} NULLS LAST
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  const countQ = `SELECT COUNT(DISTINCT s.id) FROM stores s ${where}`;

  const [data, count] = await Promise.all([
    db.query(dataQ, [...values, limit, offset]),
    db.query(countQ, conditions.length ? values.slice(0, conditions.length) : []),
  ]);

  return {
    stores: data.rows,
    total: Number(count.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(Number(count.rows[0].count) / limit),
  };
};

// ── Stats ────────────────────────────────────────────────────────────────────

const countStores = async () => {
  const { rows } = await db.query('SELECT COUNT(*) FROM stores');
  return Number(rows[0].count);
};

module.exports = { findById, findByOwnerId, createStore, listStores, countStores };
