import axiosInstance from './axios';
import { API_ENDPOINTS } from '../constants';
import { ShipmentDTO, ShipmentEventDTO, CreateShipmentRequest, UpdateShipmentStatusRequest } from '../types';

export const shipmentsApi = {
  createShipment: async (data: CreateShipmentRequest): Promise<ShipmentDTO> => {
    const response = await axiosInstance.post<ShipmentDTO>(API_ENDPOINTS.SHIPMENTS, data);
    return response.data;
  },

  getShipmentByOrder: async (orderId: number): Promise<ShipmentDTO> => {
    const response = await axiosInstance.get<ShipmentDTO>(
      `${API_ENDPOINTS.SHIPMENTS}/order/${orderId}`
    );
    return response.data;
  },

  getShipmentByTracking: async (trackingNumber: string): Promise<ShipmentDTO> => {
    const response = await axiosInstance.get<ShipmentDTO>(
      `${API_ENDPOINTS.SHIPMENTS}/tracking/${trackingNumber}`
    );
    return response.data;
  },

  updateShipmentStatus: async (
    id: number,
    data: UpdateShipmentStatusRequest
  ): Promise<ShipmentDTO> => {
    const response = await axiosInstance.patch<ShipmentDTO>(
      `${API_ENDPOINTS.SHIPMENTS}/${id}/status`,
      data
    );
    return response.data;
  },

  getShipmentHistory: async (id: number): Promise<ShipmentEventDTO[]> => {
    const response = await axiosInstance.get<ShipmentEventDTO[]>(
      `${API_ENDPOINTS.SHIPMENTS}/${id}/history`
    );
    return response.data;
  },
};
