import { http, HttpResponse } from 'msw';

// Relative, matching the app's VITE_API_BASE_URL=/ — requests are same-origin and
// proxied (Vite in dev, nginx in the container). MSW resolves these against the
// jsdom origin, so the mocks track however the app is actually configured.
const BASE_URL = '';

export const handlers = [
  // Auth
  http.post(`${BASE_URL}/api/v1/users/login`, () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      expiresIn: 3600000,
      username: 'testuser',
      role: 'CUSTOMER',
    });
  }),

  http.post(`${BASE_URL}/api/v1/users/register`, () => {
    return HttpResponse.json(
      {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'CUSTOMER',
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.get(`${BASE_URL}/api/v1/users/me`, () => {
    return HttpResponse.json({
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    });
  }),

  // Products
  http.get(`${BASE_URL}/api/v1/products`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') ?? '0';
    return HttpResponse.json({
      content: [
        {
          id: 1,
          sku: 'PROD-001',
          name: 'Test Product',
          description: 'A test product',
          price: 29.99,
          stockQuantity: 100,
          brand: 'TestBrand',
          categoryId: 1,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          sku: 'PROD-002',
          name: 'Another Product',
          description: 'Another test product',
          price: 49.99,
          stockQuantity: 0,
          brand: 'TestBrand',
          categoryId: 1,
          status: 'OUT_OF_STOCK',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      totalElements: 2,
      totalPages: 1,
      size: 20,
      number: Number(page),
    });
  }),

  http.get(`${BASE_URL}/api/v1/products/:id`, ({ params }) => {
    return HttpResponse.json({
      id: Number(params.id),
      sku: 'PROD-001',
      name: 'Test Product',
      description: 'A test product with a full description',
      price: 29.99,
      stockQuantity: 100,
      brand: 'TestBrand',
      categoryId: 1,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }),

  http.get(`${BASE_URL}/api/v1/products/search`, () => {
    return HttpResponse.json({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 20,
      number: 0,
    });
  }),

  // Categories
  http.get(`${BASE_URL}/api/v1/categories`, () => {
    return HttpResponse.json([
      { id: 1, name: 'Electronics', description: 'Electronic devices', createdAt: new Date().toISOString() },
      { id: 2, name: 'Clothing', description: 'Apparel', createdAt: new Date().toISOString() },
    ]);
  }),

  // Orders
  http.post(`${BASE_URL}/api/v1/orders`, () => {
    return HttpResponse.json(
      {
        orderId: 1,
        customerId: 'testuser',
        orderItems: [],
        orderDate: new Date().toISOString(),
        totalAmount: 0,
        status: 'PENDING',
      },
      { status: 201 }
    );
  }),

  http.get(`${BASE_URL}/api/v1/orders/customer/:customerId`, () => {
    return HttpResponse.json([
      {
        orderId: 1,
        customerId: 'testuser',
        orderItems: [
          { orderItemId: 1, orderId: 1, productId: 1, productName: 'Test Product', productPrice: 29.99, quantity: 2 },
        ],
        orderDate: new Date().toISOString(),
        totalAmount: 59.98,
        status: 'CONFIRMED',
      },
    ]);
  }),

  http.get(`${BASE_URL}/api/v1/orders/:orderId`, ({ params }) => {
    return HttpResponse.json({
      orderId: Number(params.orderId),
      customerId: 'testuser',
      orderItems: [
        { orderItemId: 1, orderId: 1, productId: 1, productName: 'Test Product', productPrice: 29.99, quantity: 2 },
      ],
      orderDate: new Date().toISOString(),
      totalAmount: 59.98,
      status: 'PENDING',
    });
  }),

  // Reviews
  http.get(`${BASE_URL}/api/v1/reviews/product/:productId`, () => {
    return HttpResponse.json([
      {
        id: 1,
        productId: 1,
        customerId: 'testuser',
        rating: 4,
        title: 'Great product',
        body: 'Really liked this product, would recommend',
        status: 'APPROVED',
        helpfulVotes: 5,
        unhelpfulVotes: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }),

  http.get(`${BASE_URL}/api/v1/reviews/product/:productId/summary`, () => {
    return HttpResponse.json({
      productId: 1,
      averageRating: 4.0,
      totalReviews: 1,
      approvedReviews: 1,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 },
    });
  }),

  // Payments
  http.get(`${BASE_URL}/api/v1/payments/customer/:customerId`, () => {
    return HttpResponse.json([]);
  }),

  // Shipments
  http.get(`${BASE_URL}/api/v1/shipments/tracking/:trackingNumber`, ({ params }) => {
    return HttpResponse.json({
      id: 1,
      orderId: 1,
      customerId: 'testuser',
      trackingNumber: params.trackingNumber,
      status: 'SHIPPED',
      carrier: 'FedEx',
      originAddress: '123 Warehouse St',
      destinationAddress: '456 Customer Ave',
      estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: new Date().toISOString(),
    });
  }),
];
