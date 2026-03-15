import axiosInstance from './axios';
import { API_ENDPOINTS } from '../constants';
import { PaymentDTO, CreatePaymentRequest } from '../types';

export const paymentsApi = {
  createPayment: async (data: CreatePaymentRequest): Promise<PaymentDTO> => {
    const response = await axiosInstance.post<PaymentDTO>(API_ENDPOINTS.PAYMENTS, data);
    return response.data;
  },

  getPaymentById: async (id: number): Promise<PaymentDTO> => {
    const response = await axiosInstance.get<PaymentDTO>(`${API_ENDPOINTS.PAYMENTS}/${id}`);
    return response.data;
  },

  getPaymentByOrder: async (orderId: number): Promise<PaymentDTO> => {
    const response = await axiosInstance.get<PaymentDTO>(
      `${API_ENDPOINTS.PAYMENTS}/order/${orderId}`
    );
    return response.data;
  },

  getPaymentsByCustomer: async (customerId: string): Promise<PaymentDTO[]> => {
    const response = await axiosInstance.get<PaymentDTO[]>(
      `${API_ENDPOINTS.PAYMENTS}/customer/${customerId}`
    );
    return response.data;
  },

  processPayment: async (id: number): Promise<PaymentDTO> => {
    const response = await axiosInstance.post<PaymentDTO>(`${API_ENDPOINTS.PAYMENTS}/${id}/process`);
    return response.data;
  },

  refundPayment: async (id: number): Promise<PaymentDTO> => {
    const response = await axiosInstance.post<PaymentDTO>(`${API_ENDPOINTS.PAYMENTS}/${id}/refund`);
    return response.data;
  },
};
