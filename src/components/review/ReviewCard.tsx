import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { ReviewDTO } from '../../types';
import { formatRelativeTime } from '../../utils/formatters';
import RatingStars from '../product/RatingStars';
import { REVIEW_STATUS_COLORS } from '../../constants';

interface ReviewCardProps {
  review: ReviewDTO;
  showStatus?: boolean;
  showActions?: boolean;
  currentUsername?: string | null;
  onVote?: (id: number, helpful: boolean) => void;
  onEdit?: (review: ReviewDTO) => void;
  onDelete?: (id: number) => void;
  onModerate?: (id: number, status: string) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  showStatus = false,
  showActions = false,
  currentUsername,
  onVote,
  onEdit,
  onDelete,
  onModerate,
}) => {
  const isOwner = currentUsername === review.customerId;

  return (
    <Card variant="outlined">
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography variant="subtitle2" fontWeight={600}>
                {review.customerId}
              </Typography>
              {showStatus && (
                <Chip
                  label={review.status}
                  color={REVIEW_STATUS_COLORS[review.status]}
                  size="small"
                />
              )}
            </Box>
            <RatingStars value={review.rating} size="small" />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {formatRelativeTime(review.createdAt)}
          </Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {review.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {review.body}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            {onVote && (
              <>
                <Tooltip title="Helpful">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <IconButton size="small" onClick={() => onVote(review.id, true)}>
                      <ThumbUpIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">{review.helpfulVotes}</Typography>
                  </Box>
                </Tooltip>
                <Tooltip title="Not helpful">
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <IconButton size="small" onClick={() => onVote(review.id, false)}>
                      <ThumbDownIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">{review.unhelpfulVotes}</Typography>
                  </Box>
                </Tooltip>
              </>
            )}
          </Box>

          <Box display="flex" gap={1}>
            {showActions && isOwner && (
              <>
                {onEdit && (
                  <Chip
                    label="Edit"
                    size="small"
                    variant="outlined"
                    onClick={() => onEdit(review)}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
                {onDelete && (
                  <Chip
                    label="Delete"
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => onDelete(review.id)}
                    sx={{ cursor: 'pointer' }}
                  />
                )}
              </>
            )}
            {onModerate && (
              <>
                <Chip
                  label="Approve"
                  size="small"
                  color="success"
                  variant="outlined"
                  onClick={() => onModerate(review.id, 'APPROVED')}
                  sx={{ cursor: 'pointer' }}
                />
                <Chip
                  label="Reject"
                  size="small"
                  color="error"
                  variant="outlined"
                  onClick={() => onModerate(review.id, 'REJECTED')}
                  sx={{ cursor: 'pointer' }}
                />
              </>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
