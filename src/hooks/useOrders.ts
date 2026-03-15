import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';
import { AddItemRequest, OrderStatus } from '../types';
import { useAuthStore } from '../store/authStore';

export const useOrder = (orderId: number | null) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersApi.getOrderById(orderId!),
    enabled: orderId !== null && orderId > 0,
  });
};

export const useCustomerOrders = () => {
  const { username } = useAuthStore();

  return useQuery({
    queryKey: ['orders', 'customer', username],
    queryFn: () => ordersApi.getOrdersByCustomer(username!),
    enabled: !!username,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { username } = useAuthStore();

  return useMutation({
    mutationFn: () => ordersApi.createOrder(username!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'customer', username] });
    },
  });
};

export const useAddOrderItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: number; data: AddItemRequest }) =>
      ordersApi.addItem(orderId, data),
    onSuccess: (_data, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  const { username } = useAuthStore();

  return useMutation({
    mutationFn: (orderId: number) => ordersApi.confirmOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'customer', username] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus }) =>
      ordersApi.updateOrderStatus(orderId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  const { username } = useAuthStore();

  return useMutation({
    mutationFn: (orderId: number) => ordersApi.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders', 'customer', username] });
    },
  });
};
