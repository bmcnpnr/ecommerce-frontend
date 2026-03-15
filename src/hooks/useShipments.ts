import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shipmentsApi } from '../api/shipments.api';
import { UpdateShipmentStatusRequest } from '../types';

export const useShipmentByOrder = (orderId: number | null) => {
  return useQuery({
    queryKey: ['shipment', 'order', orderId],
    queryFn: () => shipmentsApi.getShipmentByOrder(orderId!),
    enabled: orderId !== null && orderId > 0,
    retry: false,
  });
};

export const useShipmentByTracking = (trackingNumber: string | null) => {
  return useQuery({
    queryKey: ['shipment', 'tracking', trackingNumber],
    queryFn: () => shipmentsApi.getShipmentByTracking(trackingNumber!),
    enabled: !!trackingNumber,
    retry: false,
  });
};

export const useShipmentHistory = (shipmentId: number | null) => {
  return useQuery({
    queryKey: ['shipment', 'history', shipmentId],
    queryFn: () => shipmentsApi.getShipmentHistory(shipmentId!),
    enabled: shipmentId !== null && shipmentId > 0,
  });
};

export const useUpdateShipmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateShipmentStatusRequest }) =>
      shipmentsApi.updateShipmentStatus(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shipment', 'order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['shipment', 'history', data.id] });
    },
  });
};
