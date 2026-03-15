// ===== AUTH =====
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
  username: string;
  role: UserRole;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}

// ===== USER =====
export type UserRole = 'CUSTOMER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface UserDTO {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: UserRole;
  status: UserStatus;
  defaultShippingAddress?: string;
  defaultBillingAddress?: string;
  createdAt: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  defaultShippingAddress?: string;
  defaultBillingAddress?: string;
}

// ===== PRODUCT =====
export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';

export interface ProductDTO {
  id: number;
  sku: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  brand?: string;
  categoryId?: number;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  description?: string;
  price: number;
  stockQuantity: number;
  brand?: string;
  categoryId?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  brand?: string;
  categoryId?: number;
  status?: ProductStatus;
}

export interface StockUpdateRequest {
  delta: number;
}

// ===== PAGINATION =====
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// ===== CATEGORY =====
export interface CategoryDTO {
  id: number;
  name: string;
  description?: string;
  parentCategoryId?: number;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentCategoryId?: number;
}

// ===== ORDER =====
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemDTO {
  orderItemId: number;
  orderId: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export interface OrderDTO {
  orderId: number;
  customerId: string;
  orderItems: OrderItemDTO[];
  orderDate: string;
  billingAddress?: string;
  shippingAddress?: string;
  totalAmount: number;
  status: OrderStatus;
}

export interface AddItemRequest {
  productId: number;
  quantity: number;
}

// ===== PAYMENT =====
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'DIGITAL_WALLET';

export interface PaymentDTO {
  id: number;
  orderId: number;
  customerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  transactionId?: string;
  failureReason?: string;
  cardLastFour?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentRequest {
  orderId: number;
  customerId: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  cardLastFour?: string;
}

// ===== SHIPMENT =====
export type ShipmentStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'RETURNED';

export interface ShipmentDTO {
  id: number;
  orderId: number;
  customerId: string;
  trackingNumber: string;
  status: ShipmentStatus;
  carrier?: string;
  originAddress: string;
  destinationAddress: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  createdAt: string;
}

export interface ShipmentEventDTO {
  id: number;
  shipmentId: number;
  eventDescription: string;
  newStatus: ShipmentStatus;
  location?: string;
  eventTimestamp: string;
}

export interface CreateShipmentRequest {
  orderId: number;
  customerId: string;
  originAddress: string;
  destinationAddress: string;
  carrier?: string;
  estimatedDelivery?: string;
}

export interface UpdateShipmentStatusRequest {
  status: ShipmentStatus;
  location?: string;
  description?: string;
}

// ===== REVIEW =====
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ReviewDTO {
  id: number;
  productId: number;
  customerId: string;
  rating: number;
  title: string;
  body: string;
  status: ReviewStatus;
  helpfulVotes: number;
  unhelpfulVotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummaryDTO {
  productId: number;
  averageRating: number;
  totalReviews: number;
  approvedReviews: number;
  ratingDistribution: Record<string, number>;
}

export interface CreateReviewRequest {
  productId: number;
  rating: number;
  title: string;
  body: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  body?: string;
}

export interface VoteRequest {
  helpful: boolean;
}

// ===== API ERROR =====
export interface FieldError {
  field: string;
  message: string;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: FieldError[];
}

// ===== CART STORE =====
export interface CartState {
  cartOrderId: number | null;
  setCartOrderId: (id: number | null) => void;
  clearCart: () => void;
}
