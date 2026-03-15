import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useProduct } from '../../hooks/useProducts';
import { useProductReviews, useReviewSummary, useCreateReview, useUpdateReview, useDeleteReview, useVoteReview } from '../../hooks/useReviews';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../../api/categories.api';
import { formatCurrency, formatDate } from '../../utils/formatters';
import StockBadge from '../../components/product/StockBadge';
import RatingStars from '../../components/product/RatingStars';
import ReviewCard from '../../components/review/ReviewCard';
import ReviewSummary from '../../components/review/ReviewSummary';
import ReviewForm from '../../components/review/ReviewForm';
import ErrorAlert from '../../components/common/ErrorAlert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import { ReviewDTO } from '../../types';
import { CreateReviewFormData } from '../../utils/validators';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const { isAuthenticated, username } = useAuth();
  const { addToCart, isAdding } = useCart();
  const { showSnackbar } = useSnackbar();

  const [quantity, setQuantity] = useState(1);
  const [editingReview, setEditingReview] = useState<ReviewDTO | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: product, isLoading: productLoading, error: productError } = useProduct(productId);
  const { data: reviews, isLoading: reviewsLoading } = useProductReviews(productId);
  const { data: reviewSummary, isLoading: summaryLoading } = useReviewSummary(productId);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
    staleTime: 10 * 60 * 1000,
  });

  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();
  const voteReviewMutation = useVoteReview();

  const categoryName = product?.categoryId
    ? categories?.find((c) => c.id === product.categoryId)?.name
    : null;

  const userReview = reviews?.find((r) => r.customerId === username);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
    }
  };

  const handleCreateReview = async (data: CreateReviewFormData) => {
    try {
      await createReviewMutation.mutateAsync(data);
      showSnackbar('Review submitted successfully!', 'success');
      setShowReviewForm(false);
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to submit review', 'error');
    }
  };

  const handleUpdateReview = async (data: CreateReviewFormData) => {
    if (!editingReview) return;
    try {
      await updateReviewMutation.mutateAsync({ id: editingReview.id, data });
      showSnackbar('Review updated!', 'success');
      setEditingReview(null);
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to update review', 'error');
    }
  };

  const handleDeleteReview = async () => {
    if (!deletingReviewId) return;
    try {
      await deleteReviewMutation.mutateAsync(deletingReviewId);
      showSnackbar('Review deleted!', 'success');
      setDeletingReviewId(null);
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to delete review', 'error');
    }
  };

  const handleVote = (reviewId: number, helpful: boolean) => {
    voteReviewMutation.mutate({ id: reviewId, data: { helpful } });
  };

  if (productLoading) return <LoadingSpinner message="Loading product..." />;
  if (productError) return <Container sx={{ py: 4 }}><ErrorAlert error={productError as Error} /></Container>;
  if (!product) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">Home</Link>
        <Link component={RouterLink} to="/products" color="inherit">Products</Link>
        {categoryName && (
          <Link component={RouterLink} to={`/products?categoryId=${product.categoryId}`} color="inherit">
            {categoryName}
          </Link>
        )}
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.100',
              fontSize: 120,
              borderRadius: 2,
            }}
            elevation={0}
          >
            🛍️
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box>
            {product.brand && (
              <Typography variant="body2" color="text.secondary" fontWeight={500} mb={0.5}>
                {product.brand}
              </Typography>
            )}
            <Typography variant="h4" fontWeight={700} mb={1}>
              {product.name}
            </Typography>

            {reviewSummary && reviewSummary.approvedReviews > 0 && (
              <Box mb={2}>
                <RatingStars
                  value={reviewSummary.averageRating}
                  count={reviewSummary.approvedReviews}
                  showCount
                  size="medium"
                />
              </Box>
            )}

            <Typography variant="h4" color="primary.main" fontWeight={700} mb={2}>
              {formatCurrency(product.price)}
            </Typography>

            <Box mb={2}>
              <StockBadge status={product.status} stockQuantity={product.stockQuantity} />
            </Box>

            {product.description && (
              <Typography variant="body1" color="text.secondary" mb={3}>
                {product.description}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="body2" fontWeight={500}>Quantity:</Typography>
              <TextField
                type="number"
                size="small"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stockQuantity, Number(e.target.value))))}
                slotProps={{ htmlInput: { min: 1, max: product.stockQuantity } }}
                sx={{ width: 80 }}
                disabled={product.status !== 'ACTIVE'}
              />
            </Box>

            <Button
              variant="contained"
              size="large"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAddToCart}
              disabled={product.status !== 'ACTIVE' || isAdding}
              sx={{ minWidth: 200 }}
            >
              {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
            </Button>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="body2" color="text.secondary">
                <strong>SKU:</strong> {product.sku}
              </Typography>
              {categoryName && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Category:</strong> {categoryName}
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary">
                <strong>Added:</strong> {formatDate(product.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box mt={6}>
        <Divider sx={{ mb: 4 }} />
        <Typography variant="h5" fontWeight={700} mb={3}>
          Customer Reviews
        </Typography>

        <ReviewSummary summary={reviewSummary} isLoading={summaryLoading} />

        <Divider sx={{ my: 4 }} />

        {/* Review Form */}
        {isAuthenticated && (
          <Box mb={4}>
            {!userReview && !showReviewForm && (
              <Button
                variant="outlined"
                onClick={() => setShowReviewForm(true)}
                sx={{ mb: 3 }}
              >
                Write a Review
              </Button>
            )}

            {showReviewForm && !userReview && (
              <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
                <ReviewForm
                  productId={productId}
                  onSubmit={handleCreateReview}
                  isLoading={createReviewMutation.isPending}
                  onCancel={() => setShowReviewForm(false)}
                />
              </Paper>
            )}

            {userReview && editingReview?.id === userReview.id && (
              <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
                <ReviewForm
                  productId={productId}
                  onSubmit={handleUpdateReview}
                  isLoading={updateReviewMutation.isPending}
                  initialData={{ productId, rating: userReview.rating, title: userReview.title, body: userReview.body }}
                  onCancel={() => setEditingReview(null)}
                />
              </Paper>
            )}
          </Box>
        )}

        {!isAuthenticated && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Please <Link component={RouterLink} to="/login">sign in</Link> to write a review.
          </Alert>
        )}

        {reviewsLoading ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
            ))}
          </Box>
        ) : reviews && reviews.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showActions={isAuthenticated}
                currentUsername={username}
                onVote={isAuthenticated ? handleVote : undefined}
                onEdit={isAuthenticated ? (r) => { setEditingReview(r); setShowReviewForm(false); } : undefined}
                onDelete={isAuthenticated ? (rid) => setDeletingReviewId(rid) : undefined}
              />
            ))}
          </Box>
        ) : (
          <EmptyState
            title="No reviews yet"
            description="Be the first to review this product!"
          />
        )}
      </Box>

      <ConfirmDialog
        open={deletingReviewId !== null}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={handleDeleteReview}
        onCancel={() => setDeletingReviewId(null)}
        isLoading={deleteReviewMutation.isPending}
      />
    </Container>
  );
};

export default ProductDetailPage;
