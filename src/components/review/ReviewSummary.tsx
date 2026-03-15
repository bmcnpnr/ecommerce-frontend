import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { ReviewSummaryDTO } from '../../types';
import RatingStars from '../product/RatingStars';
import RatingDistribution from './RatingDistribution';

interface ReviewSummaryProps {
  summary: ReviewSummaryDTO | undefined;
  isLoading?: boolean;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ summary, isLoading = false }) => {
  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={120} height={48} />
        <Skeleton variant="text" width={200} />
        <Skeleton variant="rectangular" height={100} sx={{ mt: 1 }} />
      </Box>
    );
  }

  if (!summary) return null;

  return (
    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3} alignItems="flex-start">
      <Box textAlign="center" minWidth={120}>
        <Typography variant="h2" fontWeight={700} color="primary.main">
          {summary.averageRating.toFixed(1)}
        </Typography>
        <RatingStars value={summary.averageRating} size="medium" />
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {summary.approvedReviews} review{summary.approvedReviews !== 1 ? 's' : ''}
        </Typography>
      </Box>
      <Box flexGrow={1}>
        <RatingDistribution
          distribution={summary.ratingDistribution}
          total={summary.approvedReviews}
        />
      </Box>
    </Box>
  );
};

export default ReviewSummary;
