import axiosInstance from './axios';
import { API_ENDPOINTS } from '../constants';
import { ReviewDTO, ReviewSummaryDTO, CreateReviewRequest, UpdateReviewRequest, VoteRequest } from '../types';

export const reviewsApi = {
  createReview: async (data: CreateReviewRequest): Promise<ReviewDTO> => {
    const response = await axiosInstance.post<ReviewDTO>(API_ENDPOINTS.REVIEWS, data);
    return response.data;
  },

  getReviewById: async (id: number): Promise<ReviewDTO> => {
    const response = await axiosInstance.get<ReviewDTO>(`${API_ENDPOINTS.REVIEWS}/${id}`);
    return response.data;
  },

  getReviewsByProduct: async (productId: number, approvedOnly = true): Promise<ReviewDTO[]> => {
    const response = await axiosInstance.get<ReviewDTO[]>(
      `${API_ENDPOINTS.REVIEWS}/product/${productId}`,
      { params: { approvedOnly } }
    );
    return response.data;
  },

  getReviewSummary: async (productId: number): Promise<ReviewSummaryDTO> => {
    const response = await axiosInstance.get<ReviewSummaryDTO>(
      `${API_ENDPOINTS.REVIEWS}/product/${productId}/summary`
    );
    return response.data;
  },

  getReviewsByCustomer: async (customerId: string): Promise<ReviewDTO[]> => {
    const response = await axiosInstance.get<ReviewDTO[]>(
      `${API_ENDPOINTS.REVIEWS}/customer/${customerId}`
    );
    return response.data;
  },

  updateReview: async (id: number, data: UpdateReviewRequest): Promise<ReviewDTO> => {
    const response = await axiosInstance.put<ReviewDTO>(`${API_ENDPOINTS.REVIEWS}/${id}`, data);
    return response.data;
  },

  deleteReview: async (id: number): Promise<void> => {
    await axiosInstance.delete(`${API_ENDPOINTS.REVIEWS}/${id}`);
  },

  moderateReview: async (id: number, status: string): Promise<ReviewDTO> => {
    const response = await axiosInstance.patch<ReviewDTO>(
      `${API_ENDPOINTS.REVIEWS}/${id}/moderate`,
      null,
      { params: { status } }
    );
    return response.data;
  },

  voteReview: async (id: number, data: VoteRequest): Promise<ReviewDTO> => {
    const response = await axiosInstance.post<ReviewDTO>(
      `${API_ENDPOINTS.REVIEWS}/${id}/vote`,
      data
    );
    return response.data;
  },
};
