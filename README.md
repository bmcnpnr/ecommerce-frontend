# Ecommerce Frontend

A production-ready React + TypeScript frontend for the ecommerce microservices platform.

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 18 + TypeScript |
| Component Library | Material UI v6 |
| Build Tool | Vite 6 |
| Routing | React Router v6 |
| Data Fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| State (auth/cart) | Zustand v5 |
| HTTP Client | Axios |
| Testing | Vitest + Testing Library + MSW |

---

## Running via Docker Compose (recommended)

The frontend is part of the `ecommerce-platform` stack. This is the easiest way to run the entire system.

### Start the full stack

```bash
cd ecommerce-platform
docker compose up --build
```

This builds and starts every service — databases, Kafka, all microservices, the API gateway, and the frontend — in the correct dependency order.

### Accessing the application

| URL | What you get |
|---|---|
| `http://localhost:3000` | **Frontend** (React app) |
| `http://localhost:8080` | API Gateway (direct access) |
| `http://localhost:8761` | Eureka Service Discovery dashboard |

> The frontend container runs nginx on port 80 and is mapped to **port 3000** on your host.
> Open `http://localhost:3000` in your browser once all services are healthy.

### How API calls work in Docker

The browser talks **only** to the frontend container. nginx proxies every `/api/...` request to `api-gateway:8080` inside the Docker network — the browser never needs to reach the gateway directly.

```
Browser → http://localhost:3000/api/v1/...
             └─ nginx (frontend container)
                   └─ http://api-gateway:8080/api/v1/...
                         └─ routed to the correct microservice
```

### Start only the frontend (assumes backend already running)

```bash
docker compose up --build frontend
```

### Rebuild after code changes

```bash
docker compose build frontend
docker compose up frontend
```

### Stop the stack

```bash
docker compose down
# To also remove volumes (wipes all database data):
docker compose down -v
```

### Environment variable at build time

By default `VITE_API_BASE_URL=/` is baked into the image so nginx handles the proxy.
To point the build at a different backend (e.g. a public domain):

```bash
docker compose build --build-arg VITE_API_BASE_URL=https://api.example.com frontend
```

---

## Local Development (without Docker)

### Prerequisites

- Node.js 18+
- npm 9+
- Backend services running locally (API Gateway on port 8080)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

The default `.env` points at `http://localhost:8080`. Edit if your gateway runs elsewhere.

### 3. Start the dev server

```bash
npm run dev
```

App is available at `http://localhost:3000`.

In dev mode, Vite proxies all `/api` requests to `http://localhost:8080` (configured in `vite.config.ts`), so you do not need CORS headers on the backend.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 3000, HMR enabled) |
| `npm run build` | Type-check and build for production (`dist/`) |
| `npm run preview` | Preview the production build at `http://localhost:4173` |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Vitest browser UI |
| `npm run test:coverage` | Run tests with coverage report |

---

## Backend Services

All API calls go through the API Gateway. Individual service ports are only relevant when running outside Docker.

| Service | Internal Port | Purpose |
|---|---|---|
| API Gateway | 8080 | Single entry point — all frontend traffic |
| User Service | 8081 | Auth, registration, profile |
| Product Service | 8082 | Products, categories |
| Order Service | 8084 | Orders, cart management |
| Payment Service | 8085 | Payment processing |
| Shipping Service | 8086 | Shipment tracking |
| Review Service | 8087 | Product reviews & ratings |
| Service Discovery | 8761 | Eureka (internal only) |

---

## Application Structure

```
src/
├── api/              # Axios API clients (one file per service)
├── components/
│   ├── common/       # Reusable UI (EmptyState, LoadingSpinner, etc.)
│   ├── layout/       # Navbar, Sidebar, Footer
│   ├── product/      # ProductCard, ProductGrid, RatingStars, StockBadge
│   ├── order/        # OrderCard, OrderItemRow, OrderStatusChip
│   └── review/       # ReviewCard, ReviewForm, ReviewSummary, RatingDistribution
├── hooks/            # React Query hooks (useProducts, useOrders, useCart, etc.)
├── layouts/          # Route layouts (MainLayout, AuthLayout, AdminLayout)
├── pages/
│   ├── auth/         # LoginPage, RegisterPage
│   ├── home/         # HomePage
│   ├── products/     # ProductListPage, ProductDetailPage
│   ├── cart/         # CartPage
│   ├── checkout/     # CheckoutPage
│   ├── orders/       # OrderListPage, OrderDetailPage
│   ├── tracking/     # TrackingPage (public)
│   ├── profile/      # ProfilePage
│   └── admin/        # AdminDashboard, AdminProductsPage, AdminCategoriesPage,
│                     #   AdminOrdersPage, AdminReviewsPage
├── routes/           # AppRouter, ProtectedRoute, AdminRoute
├── store/            # Zustand authStore (token, username, role, cartOrderId)
├── test/             # Vitest tests, MSW mocks, test utilities
├── theme/            # MUI theme configuration
├── types/            # TypeScript interfaces for all backend DTOs
├── utils/            # formatters.ts, validators.ts (Zod schemas)
└── constants/        # API endpoints, app-wide constants
```

---

## Implemented Screens

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page with featured products |
| `/login` | Guest only | Login with username/password |
| `/register` | Guest only | Create new account |
| `/products` | Public | Browse and search products with category filter |
| `/products/:id` | Public | Product detail with reviews and ratings |
| `/cart` | Auth | Shopping cart (PENDING order) |
| `/checkout` | Auth | Confirm order, enter addresses, initiate payment |
| `/orders` | Auth | Order history |
| `/orders/:id` | Auth | Order detail with items and payment/shipment status |
| `/tracking` | Public | Enter tracking number to track shipment |
| `/tracking/:number` | Public | Direct tracking page with pre-filled number |
| `/profile` | Auth | View and edit user profile |
| `/admin` | Admin | Admin dashboard |
| `/admin/products` | Admin | Create, edit, delete products and manage stock |
| `/admin/categories` | Admin | Manage product categories |
| `/admin/orders` | Admin | View and update all orders |
| `/admin/reviews` | Admin | Moderate (approve/reject) product reviews |

---

## Authentication Flow

1. User logs in via `POST /api/v1/users/login` → receives JWT token
2. Token is stored in `localStorage` via Zustand persist middleware
3. Axios request interceptor attaches `Authorization: Bearer <token>` to every request
4. On 401 response, auth state is cleared and user is redirected to `/login`
5. `ProtectedRoute` wraps authenticated-only pages; `AdminRoute` wraps admin-only pages

## Cart Flow

1. Cart is a PENDING order tracked by `cartOrderId` in the auth store
2. "Add to Cart" creates a new PENDING order on first item, then appends items
3. On checkout the order is confirmed and a payment is initiated

---

## Environment Variables

| Variable | Dev default | Docker default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | `/` | API base URL baked in at build time. Use `/` for Docker (nginx proxy). |

---

## Running Tests

```bash
# All tests (watch mode)
npm test

# Run once
npx vitest run

# Single file
npx vitest run src/test/components/ProductCard.test.tsx

# With coverage
npm run test:coverage
```

Tests use [MSW](https://mswjs.io/) to intercept HTTP requests — no running backend required.

---

## Docker Details

### Dockerfile stages

| Stage | Base image | What it does |
|---|---|---|
| `builder` | `node:20-alpine` | Installs deps, runs `npm run build` |
| final | `nginx:1.27-alpine` | Serves `dist/` and proxies `/api` |

### nginx behaviour

- `/api/...` → proxied to `http://api-gateway:8080` (Docker internal DNS)
- `/actuator/...` → proxied to `http://api-gateway:8080`
- All other routes → `index.html` (SPA fallback)
- Static assets (JS/CSS/fonts) → 1-year cache with `immutable` header
- Gzip enabled for text, JS, CSS, JSON
