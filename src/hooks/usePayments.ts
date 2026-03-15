import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/payments.api';
import { CreatePaymentRequest } from '../types';
import { useAuthStore } from '../store/authStore';

export const usePaymentByOrder = (orderId: number | null) => {
  return useQuery({
    queryKey: ['payment', 'order', orderId],
    queryFn: () => paymentsApi.getPaymentByOrder(orderId!),
    enabled: orderId !== null && orderId > 0,
    retry: false,
  });
};

export const useCustomerPayments = () => {
  const { username } = useAuthStore();

  return useQuery({
    queryKey: ['payments', 'customer', username],
    queryFn: () => paymentsApi.getPaymentsByCustomer(username!),
    enabled: !!username,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentsApi.createPayment(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment', 'order', data.orderId] });
    },
  });
};

export const useProcessPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => paymentsApi.processPayment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment', 'order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const useRefundPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => paymentsApi.refundPayment(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payment', 'order', data.orderId] });
    },
  });
};
