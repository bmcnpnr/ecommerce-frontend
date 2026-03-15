import axiosInstance from './axios';
import { API_ENDPOINTS } from '../constants';
import { ProductDTO, CreateProductRequest, UpdateProductRequest, Page } from '../types';

export const productsApi = {
  getProducts: async (page = 0, size = 20): Promise<Page<ProductDTO>> => {
    const response = await axiosInstance.get<Page<ProductDTO>>(API_ENDPOINTS.PRODUCTS, {
      params: { page, size },
    });
    return response.data;
  },

  getProductById: async (id: number): Promise<ProductDTO> => {
    const response = await axiosInstance.get<ProductDTO>(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    return response.data;
  },

  getProductBySku: async (sku: string): Promise<ProductDTO> => {
    const response = await axiosInstance.get<ProductDTO>(`${API_ENDPOINTS.PRODUCTS}/sku/${sku}`);
    return response.data;
  },

  searchProducts: async (q: string, page = 0, size = 20): Promise<Page<ProductDTO>> => {
    const response = await axiosInstance.get<Page<ProductDTO>>(API_ENDPOINTS.PRODUCTS_SEARCH, {
      params: { q, page, size },
    });
    return response.data;
  },

  getProductsByCategory: async (categoryId: number): Promise<ProductDTO[]> => {
    const response = await axiosInstance.get<ProductDTO[]>(
      `${API_ENDPOINTS.PRODUCTS}/category/${categoryId}`
    );
    return response.data;
  },

  createProduct: async (data: CreateProductRequest): Promise<ProductDTO> => {
    const response = await axiosInstance.post<ProductDTO>(API_ENDPOINTS.PRODUCTS, data);
    return response.data;
  },

  updateProduct: async (id: number, data: UpdateProductRequest): Promise<ProductDTO> => {
    const response = await axiosInstance.put<ProductDTO>(`${API_ENDPOINTS.PRODUCTS}/${id}`, data);
    return response.data;
  },

  updateStock: async (id: number, delta: number): Promise<ProductDTO> => {
    const response = await axiosInstance.patch<ProductDTO>(
      `${API_ENDPOINTS.PRODUCTS}/${id}/stock`,
      { delta }
    );
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  },
};
