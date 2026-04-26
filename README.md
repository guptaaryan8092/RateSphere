# RateSphere — Store Rating Platform

A production-ready, full-stack **Store Rating Platform** where users can discover and rate stores.  
Built with **React + Tailwind CSS** on the frontend and **Node.js / Express / PostgreSQL** on the backend.

---

## ✨ Features

| Role | Capabilities |
|------|-------------|
| **Admin** | Dashboard stats, create/list users & stores with filters/sort/pagination |
| **User** | Browse stores, search by name & address, submit & update ratings (1–5 ⭐) |
| **Store Owner** | View own store stats, average rating, and list of raters |

**All roles:** Change password, responsive dark/light mode UI

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS v3, Axios, React Router v6 |
| Backend | Node.js 18+, Express 4, JWT (HTTP-only cookies), bcryptjs |
| Database | PostgreSQL with raw SQL (`pg` pool) |
| Validation | `express-validator` (backend) + custom hooks (frontend) |
| Notifications | `react-hot-toast` |

---

## 📁 Project Structure

```
RateSphere/
├── server/                   # Express API
│   ├── src/
│   │   ├── config/           # DB pool, JWT helpers
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/        # auth, role, validate, error
│   │   ├── models/           # Raw SQL queries
│   │   ├── routes/           # Express routers
│   │   └── services/         # Business logic
│   ├── schema.sql            # Full PostgreSQL schema
│   ├── seed.sql              # Sample data
│   ├── .env.example
│   └── package.json
│
└── client/                   # React + Vite frontend
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # Auth + Theme context
    │   ├── hooks/            # useDebounce
    │   ├── pages/            # Page components
    │   ├── services/         # Axios API calls
    │   └── utils/            # validators, formatters
    ├── .env
    └── package.json
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm

### 1. Clone & Install

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE ratesphere;
```

Apply the schema and seed data:

```bash
# From server directory
psql -U postgres -d ratesphere -f schema.sql
psql -U postgres -d ratesphere -f seed.sql
```

### 3. Configure Environment

**Backend** (`server/.env`):
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ratesphere
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
```

**Frontend** (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Run Locally

```bash
# Terminal 1 — Backend
cd server
npm run dev     # nodemon, port 5000

# Terminal 2 — Frontend
cd client
npm run dev     # Vite, port 5173
```

Visit: **http://localhost:5173**

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ratesphere.com` | `Admin@1234` |
| User | Register via `/signup` | — |
| Owner | `owner1@example.com` | `Owner@1234` |

> **Note:** The seed.sql uses bcrypt hashes. After seeding, use the passwords above to log in. If login fails for seeded accounts, re-hash them using the provided auth endpoints.

---

## 📡 API Reference

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | Public | Register user |
| POST | `/api/auth/login` | Public | Login, set JWT cookie |
| POST | `/api/auth/logout` | Auth | Clear cookie |
| GET | `/api/auth/me` | Auth | Get current user |
| PATCH | `/api/auth/password` | Auth | Change password |
| GET | `/api/admin/dashboard` | Admin | Stats |
| GET | `/api/admin/users` | Admin | List users (filter/sort/page) |
| POST | `/api/admin/users` | Admin | Create user |
| GET | `/api/admin/stores` | Admin | List stores (sort/page) |
| POST | `/api/admin/stores` | Admin | Create store |
| GET | `/api/stores` | User | List/search stores |
| GET | `/api/stores/:id` | User | Store detail |
| POST | `/api/ratings` | User | Submit rating |
| PUT | `/api/ratings/:id` | User | Update rating |
| GET | `/api/owner/dashboard` | Owner | Own store & rater data |

---

## ✅ Validation Rules

| Field | Rule |
|-------|------|
| name | 20–60 characters |
| email | Valid RFC email format |
| password | 8–16 chars, ≥1 uppercase, ≥1 special character |
| address | Max 400 characters |
| rating | Integer 1–5 |

---

## 🎨 Frontend Pages

| Route | Page | Role |
|-------|------|------|
| `/login` | Login | Public |
| `/signup` | Sign Up | Public |
| `/admin` | Admin Dashboard | Admin |
| `/dashboard` | Store Listing | User |
| `/owner` | Owner Dashboard | Owner |
| `/profile` | Profile / Change Password | All |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 rounds)
- JWT stored in **HTTP-only cookies** (XSS-safe)
- Role-based middleware on all protected routes
- Input sanitized via `express-validator`
- CORS restricted to frontend origin

---

## 📦 Production Build

```bash
cd client
npm run build   # Output: client/dist/
```

Serve the `dist/` folder with any static host (Nginx, Vercel, Netlify).  
Set `NODE_ENV=production` in the server `.env`.
