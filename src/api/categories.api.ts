import axiosInstance from './axios';
import { API_ENDPOINTS } from '../constants';
import { CategoryDTO, CreateCategoryRequest } from '../types';

export const categoriesApi = {
  getCategories: async (): Promise<CategoryDTO[]> => {
    const response = await axiosInstance.get<CategoryDTO[]>(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },

  getCategoryById: async (id: number): Promise<CategoryDTO> => {
    const response = await axiosInstance.get<CategoryDTO>(`${API_ENDPOINTS.CATEGORIES}/${id}`);
    return response.data;
  },

  createCategory: async (data: CreateCategoryRequest): Promise<CategoryDTO> => {
    const response = await axiosInstance.post<CategoryDTO>(API_ENDPOINTS.CATEGORIES, data);
    return response.data;
  },
};
