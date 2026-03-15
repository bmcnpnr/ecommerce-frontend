import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '../../api/reviews.api';
import { useModerateReview } from '../../hooks/useReviews';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import ReviewCard from '../../components/review/ReviewCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import RateReviewIcon from '@mui/icons-material/RateReview';

const AdminReviewsPage: React.FC = () => {
  const { showSnackbar } = useSnackbar();
  const [productIdInput, setProductIdInput] = useState('');
  const [productId, setProductId] = useState<number | null>(null);
  const moderateMutation = useModerateReview();

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ['reviews', 'admin', 'product', productId],
    queryFn: () => reviewsApi.getReviewsByProduct(productId!, false),
    enabled: productId !== null,
  });

  const pendingReviews = reviews?.filter((r) => r.status === 'PENDING') || [];
  const allReviews = reviews || [];

  const handleSearch = () => {
    const id = Number(productIdInput);
    if (id > 0) {
      setProductId(id);
    }
  };

  const handleModerate = async (reviewId: number, status: string) => {
    try {
      await moderateMutation.mutateAsync({ id: reviewId, status });
      showSnackbar(`Review ${status.toLowerCase()}!`, 'success');
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to moderate review', 'error');
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Review Moderation
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Enter a product ID to view and moderate its reviews. Use the Approve/Reject buttons to moderate pending reviews.
      </Alert>

      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <Box display="flex" gap={2}>
          <TextField
            label="Product ID"
            type="number"
            size="small"
            value={productIdInput}
            onChange={(e) => setProductIdInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch}>
            Load Reviews
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error).message}
        </Alert>
      )}

      {isLoading && <LoadingSpinner message="Loading reviews..." />}

      {productId && !isLoading && (
        <>
          {pendingReviews.length > 0 && (
            <Box mb={4}>
              <Typography variant="h6" fontWeight={600} mb={2} color="warning.main">
                Pending Reviews ({pendingReviews.length})
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {pendingReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    showStatus
                    onModerate={handleModerate}
                  />
                ))}
              </Box>
            </Box>
          )}

          {allReviews.length > 0 ? (
            <Box>
              <Typography variant="h6" fontWeight={600} mb={2}>
                All Reviews for Product #{productId} ({allReviews.length})
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {allReviews
                  .filter((r) => r.status !== 'PENDING')
                  .map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      showStatus
                      onModerate={review.status === 'PENDING' ? handleModerate : undefined}
                    />
                  ))}
              </Box>
            </Box>
          ) : (
            <EmptyState
              title="No reviews found"
              description={`No reviews for product #${productId}`}
              icon={<RateReviewIcon sx={{ fontSize: 64 }} />}
            />
          )}
        </>
      )}

      {!productId && !isLoading && (
        <EmptyState
          title="Enter a product ID"
          description="Search for a product's reviews to start moderating."
          icon={<RateReviewIcon sx={{ fontSize: 64 }} />}
        />
      )}
    </Box>
  );
};

export default AdminReviewsPage;
