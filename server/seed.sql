-- =============================================================
-- RateSphere Seed Data
-- Generated bcrypt hashes (12 rounds) for the passwords below:
--   admin@ratesphere.com  → Admin@1234
--   alice@example.com     → Alice@1234
--   bob@example.com       → Bobbo@1234
--   charlie@example.com   → Charlie@1
--   owner1@example.com    → Owner@1234
--   owner2@example.com    → Owner@5678
-- =============================================================

-- ── Users ──────────────────────────────────────────────────────────────────
INSERT INTO users (name, email, password, address, role) VALUES
(
  'System Administrator Account',
  'admin@ratesphere.com',
  '$2a$12$syHQRU.mZxwu51F3k4uWqeaymF.7F2CuLR368TjTEM4j7hWlQjR5e',
  '123 Admin Street, Tech City, TC 10001',
  'admin'
),
(
  'Alice Johnson Normal User',
  'alice@example.com',
  '$2a$12$wPWBKE3k0xRRoOL2LdsrXeqBPs2B7jtKPJD0hNJSo5OhEYCK75Tgm',
  '456 Maple Avenue, Springfield, SP 20002',
  'user'
),
(
  'Bob Williams Regular Member',
  'bob@example.com',
  '$2a$12$hZLMy0JasazALWfdDxLhJuzeuz5vzk3Jva2puS8ifjjRzhtJaWdA.',
  '789 Oak Lane, Riverside, RS 30003',
  'user'
),
(
  'Charlie Brown Platform User',
  'charlie@example.com',
  '$2a$12$/CEL1V87BiiXnQuJ7AECluqljJxk3mwcrhiYeqmdUyCJEvEhhdNma',
  '321 Pine Road, Lakewood, LW 40004',
  'user'
),
(
  'First Store Owner Profile',
  'owner1@example.com',
  '$2a$12$jo02W3wbPP3X/Z8YhCyhbO7aVRvZP4Q/fKw9w/WF4mIU2UT22xEYm',
  '100 Business Blvd, Commerce City, CC 50005',
  'owner'
),
(
  'Second Store Owner Business',
  'owner2@example.com',
  '$2a$12$hrsHxDnaECvC/ppvckQHGOBA5tlFKzasnuqdljOuUrjFlILdqchaa',
  '200 Enterprise Ave, Market Town, MT 60006',
  'owner'
);

-- ── Stores ─────────────────────────────────────────────────────────────────
INSERT INTO stores (name, email, address, owner_id) VALUES
(
  'The Coffee Corner Cafe Shop',
  'coffee@corner.com',
  '10 Brew Street, Caffeine City, CC 11111',
  5
),
(
  'Tech Gadgets and Electronics Hub',
  'info@techgadgets.com',
  '20 Silicon Valley Road, Techville, TV 22222',
  5
),
(
  'Fresh Farm Organic Grocery Store',
  'hello@freshfarm.com',
  '30 Green Lane, Farmington, FG 33333',
  6
),
(
  'Sports Planet Athletics Superstore',
  'contact@sportsplanet.com',
  '40 Champion Drive, Athletica, AT 44444',
  6
);

-- ── Ratings ────────────────────────────────────────────────────────────────
-- user IDs: alice=2, bob=3, charlie=4 | store IDs: 1-4
INSERT INTO ratings (user_id, store_id, rating) VALUES
(2, 1, 5),
(3, 1, 4),
(4, 1, 3),
(2, 2, 4),
(3, 2, 5),
(4, 3, 2),
(2, 3, 4),
(3, 4, 5),
(4, 4, 4);
