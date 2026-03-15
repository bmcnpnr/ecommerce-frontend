import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const updateProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  defaultShippingAddress: z.string().optional(),
  defaultBillingAddress: z.string().optional(),
});

export const createProductSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.number().min(0.01, 'Price must be at least 0.01'),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be at least 0'),
  brand: z.string().optional(),
  categoryId: z.number().optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0.01).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  brand: z.string().optional(),
  categoryId: z.number().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'OUT_OF_STOCK']).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  parentCategoryId: z.number().optional(),
});

export const createReviewSchema = z.object({
  productId: z.number(),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be at most 255 characters'),
  body: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(2000, 'Review must be at most 2000 characters'),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(3).max(255).optional(),
  body: z.string().min(10).max(2000).optional(),
});

export const stockUpdateSchema = z.object({
  delta: z.number().int('Delta must be an integer'),
});

export const trackingSearchSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required'),
});

export const checkoutAddressSchema = z.object({
  shippingAddress: z.string().min(5, 'Shipping address is required'),
  billingAddress: z.string().min(5, 'Billing address is required'),
});

export const paymentSchema = z.object({
  method: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'DIGITAL_WALLET']),
  cardLastFour: z.string().length(4, 'Must be exactly 4 digits').optional().or(z.literal('')),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type CreateProductFormData = z.infer<typeof createProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type CreateReviewFormData = z.infer<typeof createReviewSchema>;
export type UpdateReviewFormData = z.infer<typeof updateReviewSchema>;
export type StockUpdateFormData = z.infer<typeof stockUpdateSchema>;
export type TrackingSearchFormData = z.infer<typeof trackingSearchSchema>;
export type CheckoutAddressFormData = z.infer<typeof checkoutAddressSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
