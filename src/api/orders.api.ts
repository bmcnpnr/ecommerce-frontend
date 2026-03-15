import axiosInstance from './axios';
import { API_ENDPOINTS } from '../constants';
import { OrderDTO, AddItemRequest, OrderStatus } from '../types';

export const ordersApi = {
  createOrder: async (customerId: string): Promise<OrderDTO> => {
    const response = await axiosInstance.post<OrderDTO>(API_ENDPOINTS.ORDERS, null, {
      params: { customerId },
    });
    return response.data;
  },

  getOrderById: async (orderId: number): Promise<OrderDTO> => {
    const response = await axiosInstance.get<OrderDTO>(`${API_ENDPOINTS.ORDERS}/${orderId}`);
    return response.data;
  },

  getOrdersByCustomer: async (customerId: string): Promise<OrderDTO[]> => {
    const response = await axiosInstance.get<OrderDTO[]>(
      `${API_ENDPOINTS.ORDERS}/customer/${customerId}`
    );
    return response.data;
  },

  addItem: async (orderId: number, data: AddItemRequest): Promise<OrderDTO> => {
    const response = await axiosInstance.post<OrderDTO>(
      `${API_ENDPOINTS.ORDERS}/${orderId}/items`,
      data
    );
    return response.data;
  },

  confirmOrder: async (orderId: number): Promise<OrderDTO> => {
    const response = await axiosInstance.post<OrderDTO>(
      `${API_ENDPOINTS.ORDERS}/${orderId}/confirm`
    );
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: OrderStatus): Promise<OrderDTO> => {
    const response = await axiosInstance.patch<OrderDTO>(
      `${API_ENDPOINTS.ORDERS}/${orderId}/status`,
      null,
      { params: { status } }
    );
    return response.data;
  },

  deleteOrder: async (orderId: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.ORDERS}/${orderId}`);
  },
};
