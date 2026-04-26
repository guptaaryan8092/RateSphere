const db = require('../config/db');

// ── Find ─────────────────────────────────────────────────────────────────────

const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0] || null;
};

// ── Create ───────────────────────────────────────────────────────────────────

const createUser = async ({ name, email, password, address, role = 'user' }) => {
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, address, role, created_at`,
    [name, email, password, address, role]
  );
  return rows[0];
};

// ── Update ───────────────────────────────────────────────────────────────────

const updatePassword = async (id, hashedPassword) => {
  const { rows } = await db.query(
    'UPDATE users SET password = $1 WHERE id = $2 RETURNING id',
    [hashedPassword, id]
  );
  return rows[0];
};

// ── Admin: list with filter / sort / pagination ───────────────────────────────

const listUsers = async ({ name, email, role, address, sortBy = 'created_at', order = 'DESC', page = 1, limit = 10 }) => {
  const allowed = ['name', 'email', 'role', 'created_at'];
  const sortCol = allowed.includes(sortBy) ? sortBy : 'created_at';
  const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
  const offset = (page - 1) * limit;

  const conditions = [];
  const values = [];
  let idx = 1;

  if (name)    { conditions.push(`name ILIKE $${idx++}`);    values.push(`%${name}%`); }
  if (email)   { conditions.push(`email ILIKE $${idx++}`);   values.push(`%${email}%`); }
  if (role)    { conditions.push(`role = $${idx++}`);         values.push(role); }
  if (address) { conditions.push(`address ILIKE $${idx++}`); values.push(`%${address}%`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const dataQ = `
    SELECT id, name, email, address, role, created_at
    FROM users
    ${where}
    ORDER BY ${sortCol} ${sortOrder}
    LIMIT $${idx++} OFFSET $${idx++}
  `;
  const countQ = `SELECT COUNT(*) FROM users ${where}`;

  const [data, count] = await Promise.all([
    db.query(dataQ, [...values, limit, offset]),
    db.query(countQ, values),
  ]);

  return {
    users: data.rows,
    total: Number(count.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(Number(count.rows[0].count) / limit),
  };
};

// ── Stats ────────────────────────────────────────────────────────────────────

const countUsers = async () => {
  const { rows } = await db.query('SELECT COUNT(*) FROM users');
  return Number(rows[0].count);
};

module.exports = { findById, findByEmail, createUser, updatePassword, listUsers, countUsers };
