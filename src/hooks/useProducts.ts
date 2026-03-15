import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import { CreateProductRequest, UpdateProductRequest } from '../types';

export const useProducts = (page = 0, size = 20) => {
  return useQuery({
    queryKey: ['products', page, size],
    queryFn: () => productsApi.getProducts(page, size),
    staleTime: 2 * 60 * 1000,
  });
};

export const useProduct = (id: number | null) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id!),
    enabled: id !== null && id > 0,
  });
};

export const useProductSearch = (q: string, page = 0, size = 20) => {
  return useQuery({
    queryKey: ['products', 'search', q, page, size],
    queryFn: () => productsApi.searchProducts(q, page, size),
    enabled: q.length > 0,
    staleTime: 60 * 1000,
  });
};

export const useProductsByCategory = (categoryId: number | null) => {
  return useQuery({
    queryKey: ['products', 'category', categoryId],
    queryFn: () => productsApi.getProductsByCategory(categoryId!),
    enabled: categoryId !== null && categoryId > 0,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductRequest) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, delta }: { id: number; delta: number }) =>
      productsApi.updateStock(id, delta),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
