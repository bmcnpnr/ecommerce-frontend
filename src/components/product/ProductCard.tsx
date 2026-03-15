import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { ProductDTO } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import StockBadge from './StockBadge';
import RatingStars from './RatingStars';

interface ProductCardProps {
  product: ProductDTO;
  onAddToCart?: (product: ProductDTO) => void;
  isAddingToCart?: boolean;
  averageRating?: number;
  reviewCount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  isAddingToCart = false,
  averageRating,
  reviewCount,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="div"
        sx={{
          height: 200,
          bgcolor: 'grey.100',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 64,
          color: 'grey.400',
        }}
        onClick={handleCardClick}
      >
        🛍️
      </CardMedia>
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
            onClick={handleCardClick}
            noWrap
          >
            {product.name}
          </Typography>
        </Box>

        {product.brand && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {product.brand}
          </Typography>
        )}

        {averageRating !== undefined && (
          <RatingStars value={averageRating} count={reviewCount} showCount size="small" />
        )}

        <Typography variant="h6" color="primary.main" fontWeight={700} mt={1}>
          {formatCurrency(product.price)}
        </Typography>

        <Box mt={1}>
          <StockBadge status={product.status} stockQuantity={product.stockQuantity} />
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={() => onAddToCart?.(product)}
          disabled={product.status !== 'ACTIVE' || isAddingToCart}
          size="small"
        >
          {isAddingToCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <Card sx={{ height: '100%' }}>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="40%" />
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2 }}>
      <Skeleton variant="rectangular" height={36} width="100%" />
    </CardActions>
  </Card>
);

export default ProductCard;
