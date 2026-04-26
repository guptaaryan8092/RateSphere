const { Pool } = require('pg');

// Use SSL for cloud providers (Neon, Supabase, Railway, etc.)
const isCloud = process.env.DB_HOST && !process.env.DB_HOST.includes('localhost') && process.env.DB_HOST !== '127.0.0.1';

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME     || 'ratesphere',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 10,                 // max pool connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: isCloud ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle DB client', err);
  process.exit(-1);
});

// Helper: run a query with values
const query = (text, params) => pool.query(text, params);

// Helper: get a client for transactions
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
