import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { productsApi } from '../../api/products.api';

describe('productsApi', () => {
  describe('getProducts', () => {
    it('returns paginated product list', async () => {
      const result = await productsApi.getProducts(0, 20);
      expect(result.content).toHaveLength(2);
      expect(result.totalElements).toBe(2);
    });

    it('returns empty page when no products', async () => {
      server.use(
        http.get('/api/v1/products', () => {
          return HttpResponse.json({
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: 20,
            number: 0,
          });
        })
      );
      const result = await productsApi.getProducts(0, 20);
      expect(result.content).toHaveLength(0);
    });
  });

  describe('getProductById', () => {
    it('returns a single product by id', async () => {
      const result = await productsApi.getProductById(1);
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Product');
    });

    it('throws 404 for unknown product', async () => {
      server.use(
        http.get('/api/v1/products/:id', () => {
          return HttpResponse.json(
            { status: 404, error: 'Not Found', message: 'Product not found' },
            { status: 404 }
          );
        })
      );
      await expect(productsApi.getProductById(9999)).rejects.toThrow();
    });
  });

  describe('searchProducts', () => {
    it('returns empty results for unknown query', async () => {
      // Explicitly register the search handler to ensure correct path matching
      server.use(
        http.get('/api/v1/products/search', () => {
          return HttpResponse.json({
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: 20,
            number: 0,
          });
        })
      );
      const result = await productsApi.searchProducts('nonexistent', 0, 20);
      expect(result.content).toHaveLength(0);
    });
  });
});
