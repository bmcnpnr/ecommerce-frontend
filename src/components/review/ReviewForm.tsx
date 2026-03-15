import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createReviewSchema, CreateReviewFormData } from '../../utils/validators';

interface ReviewFormProps {
  productId: number;
  onSubmit: (data: CreateReviewFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateReviewFormData>;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSubmit,
  isLoading = false,
  initialData,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      productId,
      rating: initialData?.rating || 5,
      title: initialData?.title || '',
      body: initialData?.body || '',
    },
  });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} display="flex" flexDirection="column" gap={2}>
      <Typography variant="subtitle1" fontWeight={600}>
        {initialData ? 'Edit Review' : 'Write a Review'}
      </Typography>

      <Box>
        <Typography variant="body2" gutterBottom>
          Rating *
        </Typography>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <Rating
              value={field.value}
              onChange={(_, value) => field.onChange(value || 1)}
              size="large"
            />
          )}
        />
        {errors.rating && (
          <Typography variant="caption" color="error">
            {errors.rating.message}
          </Typography>
        )}
      </Box>

      <TextField
        label="Title"
        fullWidth
        {...register('title')}
        error={!!errors.title}
        helperText={errors.title?.message}
        disabled={isLoading}
      />

      <TextField
        label="Review"
        fullWidth
        multiline
        rows={4}
        {...register('body')}
        error={!!errors.body}
        helperText={errors.body?.message}
        disabled={isLoading}
      />

      <Box display="flex" gap={2}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {isLoading ? 'Submitting...' : initialData ? 'Update Review' : 'Submit Review'}
        </Button>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ReviewForm;
