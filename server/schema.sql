-- =============================================================
-- RateSphere Database Schema
-- =============================================================

-- Drop existing tables (safe re-run)
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS stores  CASCADE;
DROP TABLE IF EXISTS users   CASCADE;

-- ── Users ──────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL CHECK(char_length(name) >= 20),
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   TEXT         NOT NULL,
  address    VARCHAR(400),
  role       VARCHAR(20)  NOT NULL DEFAULT 'user'
               CHECK(role IN ('admin', 'user', 'owner')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Stores ─────────────────────────────────────────────────────────────────
CREATE TABLE stores (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(60)  NOT NULL CHECK(char_length(name) >= 20),
  email      VARCHAR(255) NOT NULL UNIQUE,
  address    VARCHAR(400),
  owner_id   INT          REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Ratings ────────────────────────────────────────────────────────────────
CREATE TABLE ratings (
  id         SERIAL      PRIMARY KEY,
  user_id    INT         NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  store_id   INT         NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  rating     SMALLINT    NOT NULL CHECK(rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, store_id)
);

-- ── Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX idx_ratings_store  ON ratings(store_id);
CREATE INDEX idx_ratings_user   ON ratings(user_id);
CREATE INDEX idx_stores_owner   ON stores(owner_id);
CREATE INDEX idx_users_email    ON users(email);
CREATE INDEX idx_users_role     ON users(role);
