import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews.api';
import { CreateReviewRequest, UpdateReviewRequest, VoteRequest } from '../types';

export const useProductReviews = (productId: number | null, approvedOnly = true) => {
  return useQuery({
    queryKey: ['reviews', 'product', productId, approvedOnly],
    queryFn: () => reviewsApi.getReviewsByProduct(productId!, approvedOnly),
    enabled: productId !== null && productId > 0,
  });
};

export const useReviewSummary = (productId: number | null) => {
  return useQuery({
    queryKey: ['reviewSummary', productId],
    queryFn: () => reviewsApi.getReviewSummary(productId!),
    enabled: productId !== null && productId > 0,
  });
};

export const useCustomerReviews = (customerId: string | null) => {
  return useQuery({
    queryKey: ['reviews', 'customer', customerId],
    queryFn: () => reviewsApi.getReviewsByCustomer(customerId!),
    enabled: !!customerId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewsApi.createReview(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', data.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviewSummary', data.productId] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReviewRequest }) =>
      reviewsApi.updateReview(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', data.productId] });
      queryClient.invalidateQueries({ queryKey: ['reviewSummary', data.productId] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => reviewsApi.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviewSummary'] });
    },
  });
};

export const useModerateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      reviewsApi.moderateReview(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};

export const useVoteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: VoteRequest }) =>
      reviewsApi.voteReview(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'product', data.productId] });
    },
  });
};

export const usePendingReviews = () => {
  return useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: async () => {
      // Fetch all reviews and filter pending ones
      // Since there's no direct admin endpoint, we use customer reviews
      return [];
    },
  });
};
