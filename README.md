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

## Prerequisites

- Node.js 18+
- npm 9+ (or pnpm/yarn)
- Backend services running (API Gateway on port 8080)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` if your API Gateway runs on a different port:

```env
VITE_API_BASE_URL=http://localhost:8080
```

> **Note:** In dev mode Vite proxies `/api` requests to the backend, so you can also leave `VITE_API_BASE_URL` empty and rely on the Vite proxy in `vite.config.ts`.

### 3. Start the dev server

```bash
npm run dev
```

App is available at http://localhost:3000

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage report |

## Backend Services Required

The frontend expects all services to be accessible via the API Gateway at `http://localhost:8080`.

| Service | Port | Purpose |
|---|---|---|
| API Gateway | 8080 | Single entry point for all API calls |
| User Service | 8081 | Auth, registration, profile |
| Product Service | 8082 | Products, categories |
| Order Service | 8084 | Orders, cart management |
| Payment Service | 8085 | Payment processing |
| Shipping Service | 8086 | Shipment tracking |
| Review Service | 8087 | Product reviews & ratings |
| Service Discovery | 8761 | Eureka (internal use) |

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
├── types/            # TypeScript interfaces for all DTOs
├── utils/            # formatters.ts, validators.ts (Zod schemas)
└── constants/        # API endpoints, app-wide constants
```

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

## Authentication Flow

1. User logs in via `POST /api/v1/users/login` → receives JWT token
2. Token is stored in `localStorage` via Zustand persist middleware
3. Axios request interceptor automatically attaches `Authorization: Bearer <token>` header
4. On 401 response, auth state is cleared and user is redirected to `/login`
5. `ProtectedRoute` wraps authenticated-only pages; `AdminRoute` wraps admin-only pages

## Cart Flow

1. Cart is a PENDING order tracked by `cartOrderId` in the auth store
2. "Add to Cart" creates a new PENDING order on first item, then appends items
3. On checkout the order is confirmed and a payment is initiated

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8080` | API Gateway base URL |

## Running Tests

```bash
# All tests
npm test

# Single file
npx vitest run src/test/components/ProductCard.test.tsx

# With coverage
npm run test:coverage
```

Tests use [MSW](https://mswjs.io/) to intercept HTTP requests — no real backend needed.

## Production Build

```bash
npm run build
# Output in dist/
npm run preview  # preview the build at http://localhost:4173
```
