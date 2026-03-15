import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import StarIcon from '@mui/icons-material/Star';

interface RatingDistributionProps {
  distribution: Record<string, number>;
  total: number;
}

const RatingDistribution: React.FC<RatingDistributionProps> = ({ distribution, total }) => {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <Box display="flex" flexDirection="column" gap={0.5}>
      {ratings.map((star) => {
        const count = distribution[star] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <Box key={star} display="flex" alignItems="center" gap={1}>
            <Box display="flex" alignItems="center" gap={0.25} minWidth={32}>
              <Typography variant="body2">{star}</Typography>
              <StarIcon sx={{ fontSize: 14, color: '#faaf00' }} />
            </Box>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                flexGrow: 1,
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#faaf00',
                  borderRadius: 4,
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" minWidth={28} textAlign="right">
              {count}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default RatingDistribution;
