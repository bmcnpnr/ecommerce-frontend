import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../utils/renderWithProviders';
import ProductCard from '../../components/product/ProductCard';
import { ProductDTO } from '../../types';

const mockProduct: ProductDTO = {
  id: 1,
  sku: 'PROD-001',
  name: 'Test Product',
  description: 'A nice test product',
  price: 29.99,
  stockQuantity: 50,
  brand: 'TestBrand',
  categoryId: 1,
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const outOfStockProduct: ProductDTO = {
  ...mockProduct,
  id: 2,
  status: 'OUT_OF_STOCK',
  stockQuantity: 0,
};

describe('ProductCard', () => {
  it('renders product name and price', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText(/29\.99/)).toBeInTheDocument();
  });

  it('renders brand name when provided', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/TestBrand/i)).toBeInTheDocument();
  });

  it('shows Add to Cart button for in-stock product', () => {
    const onAddToCart = vi.fn();
    renderWithProviders(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = vi.fn();
    renderWithProviders(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('disables Add to Cart for out-of-stock product', () => {
    const onAddToCart = vi.fn();
    renderWithProviders(<ProductCard product={outOfStockProduct} onAddToCart={onAddToCart} />);
    const addBtn = screen.queryByRole('button', { name: /add to cart/i });
    // Either button is disabled or shows "Out of Stock"
    if (addBtn) {
      expect(addBtn).toBeDisabled();
    } else {
      expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    }
  });

  it('shows loading state while adding to cart', () => {
    renderWithProviders(<ProductCard product={mockProduct} isAddingToCart={true} />);
    // When adding to cart, button text changes to "Adding..." and is disabled
    expect(screen.getByRole('button', { name: /adding/i })).toBeDisabled();
  });

  it('renders average rating when provided', () => {
    renderWithProviders(<ProductCard product={mockProduct} averageRating={4.5} reviewCount={12} />);
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });
});
