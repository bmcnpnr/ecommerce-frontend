import axiosInstance from './axios';
import { API_ENDPOINTS } from '../constants';
import { LoginRequest, LoginResponse, RegisterRequest, UserDTO, UpdateUserRequest } from '../types';

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(API_ENDPOINTS.LOGIN, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<UserDTO> => {
    const response = await axiosInstance.post<UserDTO>(API_ENDPOINTS.REGISTER, data);
    return response.data;
  },

  getMe: async (username: string): Promise<UserDTO> => {
    const response = await axiosInstance.get<UserDTO>(`${API_ENDPOINTS.ME}`, {
      headers: { 'X-Username': username },
    });
    return response.data;
  },

  getUserById: async (id: number): Promise<UserDTO> => {
    const response = await axiosInstance.get<UserDTO>(`${API_ENDPOINTS.USERS}/${id}`);
    return response.data;
  },

  updateUser: async (id: number, data: UpdateUserRequest): Promise<UserDTO> => {
    const response = await axiosInstance.put<UserDTO>(`${API_ENDPOINTS.USERS}/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.USERS}/${id}`);
  },
};
