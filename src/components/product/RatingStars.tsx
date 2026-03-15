import React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

interface RatingStarsProps {
  value: number;
  count?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  readOnly?: boolean;
  onChange?: (value: number | null) => void;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  count,
  size = 'small',
  showCount = false,
  readOnly = true,
  onChange,
}) => {
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Rating
        value={value}
        precision={0.5}
        size={size}
        readOnly={readOnly}
        onChange={(_, newValue) => onChange?.(newValue)}
      />
      {showCount && count !== undefined && (
        <Typography variant="body2" color="text.secondary">
          ({count})
        </Typography>
      )}
    </Box>
  );
};

export default RatingStars;
