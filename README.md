# Slooze Food App 🍽️

A full-stack role-based food ordering platform built with NestJS, GraphQL, Next.js, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | NestJS + Apollo GraphQL + Prisma ORM |
| Frontend | Next.js 15 + TypeScript + Tailwind CSS + Apollo Client |
| Database | PostgreSQL (Docker) |
| Auth | JWT + Passport |

## Setup

### Prerequisites
- Node.js 18+
- Docker Desktop (for PostgreSQL)

### 1. Clone & configure environment

Create `backend/.env` with these exact values:

```env
DATABASE_URL="postgresql://postgres:slooze123@localhost:5433/slooze?schema=public"
JWT_SECRET="slooze-super-secret-jwt-key-change-this-in-production"
FRONTEND_URL="http://localhost:3001"
```

> ⚠️ Port is `5433` (not 5432) — Docker maps `5433` on your machine to `5432` inside the container.

### 2. Start the database

```bash
cd backend
docker compose up -d
```

### 3. Start the backend

```bash
# Still inside /backend
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run start:dev
# Running on http://localhost:3000
```

### 4. Start the frontend

```bash
cd ../frontend
npm install
npm run dev
# Running on http://localhost:3001
```

### 5. Open the app

Visit [**http://localhost:3001**](http://localhost:3001)

Use the **"Dev: Switch Role"** button (bottom right corner) to instantly log in as any demo account — no manual login needed.

## Demo Accounts

| Role    | Email               | Password    | Country |
|---------|---------------------|-------------|---------|
| Admin   | admin@slooze.com    | admin123    | India   |
| Manager | manager@slooze.com  | manager123  | America |
| Member  | member@slooze.com   | member123   | India   |

## Role Permissions (RBAC)

| Feature                       | Admin | Manager | Member |
|------------------------------ |-------|---------|--------|
| View restaurants & menu       | ✅    | ✅      | ✅    |
| Create an order               | ✅    | ✅      | ✅    |
| Checkout & confirm an order   | ✅    | ✅      | ❌    |
| Cancel an order               | ✅    | ✅      | ❌    |
| Add / Modify / Delete payments| ✅    | ❌      | ❌    |


## Country-Based Access (Re-BAC)

Users only see and can order from restaurants in their own country. This is enforced at the **backend GraphQL resolver level** — not just the UI.

- Admin + Member → see Indian restaurants (₹ pricing)
- Manager → sees American restaurants ($ pricing)
- Attempting to order cross-country returns `403 Forbidden`

## Features

### Core
- 🔐 JWT authentication with role-based guards on every resolver
- 🍴 Restaurant browser filtered by user's country
- 🛒 Cart UI with add/remove items and quantity controls
- 📦 Order creation with optional special instructions
- ✅ Checkout and cancel orders (Admin + Manager only)
- 💳 Payment method management (Admin only) — add, edit, set default, delete

### UX & Polish
- 🧾 Order receipt modal — click any order to view a full receipt
- 📊 Order breakdown bar chart on dashboard
- 🔍 Filter orders by status (All / Pending / Confirmed / Cancelled)
- ⏳ Order status timeline (PENDING → CONFIRMED stepper)
- ⚡ Confirm dialog before cancelling orders or deleting payments
- ⌨️ Keyboard shortcuts — press `D`, `R`, `O` to navigate, `?` for help
- 👤 Dev role switcher — instantly switch between demo accounts
- 💰 Currency-aware pricing — ₹ for India, $ for America
- 🌀 Loading skeletons on all data pages
- 🚫 Branded 404 page

### Performance
- Apollo cache updates after mutations — instant UI, zero extra network calls
- `cache-and-network` fetch policy on dashboard for always-fresh data
- N+1 query fix in order creation — single batch DB query for menu items
- 30-second auto-polling on dashboard for real-time order status

## Project Structure

```
slooze-food-app/
├── backend/
│   ├── src/
│   │   ├── auth/          # JWT strategy, guards, decorators
│   │   ├── orders/        # Order resolver, service, DTOs
│   │   ├── payments/      # Payment resolver, service, DTOs
│   │   ├── restaurants/   # Restaurant resolver, service
│   │   ├── users/         # Users module
│   │   └── prisma/        # Prisma service
│   └── prisma/
│       ├── schema.prisma
│       └── seed.ts        # 4 restaurants, 13 menu items, 3 demo users
└── frontend/
    ├── src/
    │   ├── app/           # Next.js app router pages
    │   ├── components/    # UI, layout, feature components
    │   ├── graphql/       # All GraphQL queries & mutations
    │   └── lib/           # Auth helpers, currency utils
```

## GraphQL API

Explore the full API at [**http://localhost:3000/graphql**](http://localhost:3000/graphql) (Apollo Sandbox).

Key mutations:
```graphql
mutation { login(input: { email: "", password: "" }) { accessToken role country } }
mutation { createOrder(input: { restaurantId: "", items: [] }) { id status totalAmount } }
mutation { checkoutOrder(orderId: "") { id status } }      # Admin + Manager only
mutation { cancelOrder(orderId: "") { id status } }        # Admin + Manager only
mutation { addPayment(input: { type: CARD, last4: "" }) { id } }  # Admin only
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `D` | Go to Dashboard |
| `R` | Go to Restaurants |
| `O` | Go to Orders |
| `?` | Show shortcuts hint |
