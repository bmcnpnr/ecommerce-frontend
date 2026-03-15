export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  // Auth / Users
  LOGIN: '/api/v1/users/login',
  REGISTER: '/api/v1/users/register',
  ME: '/api/v1/users/me',
  USERS: '/api/v1/users',

  // Products
  PRODUCTS: '/api/v1/products',
  PRODUCTS_SEARCH: '/api/v1/products/search',

  // Categories
  CATEGORIES: '/api/v1/categories',

  // Orders
  ORDERS: '/api/v1/orders',

  // Payments
  PAYMENTS: '/api/v1/payments',

  // Shipments
  SHIPMENTS: '/api/v1/shipments',

  // Reviews
  REVIEWS: '/api/v1/reviews',
} as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PAID: 'primary',
  SHIPPED: 'secondary',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

export const PAYMENT_STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  COMPLETED: 'success',
  FAILED: 'error',
  REFUNDED: 'default',
};

export const SHIPMENT_STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'primary',
  OUT_FOR_DELIVERY: 'secondary',
  DELIVERED: 'success',
  RETURNED: 'error',
};

export const PRODUCT_STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  OUT_OF_STOCK: 'error',
};

export const REVIEW_STATUS_COLORS: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
};

export const PAYMENT_METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'DIGITAL_WALLET', label: 'Digital Wallet' },
] as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  TRACKING: '/tracking',
  TRACKING_NUMBER: '/tracking/:trackingNumber',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_REVIEWS: '/admin/reviews',
  NOT_FOUND: '*',
} as const;
