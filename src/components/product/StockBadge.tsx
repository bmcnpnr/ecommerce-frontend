import React from 'react';
import Chip from '@mui/material/Chip';
import { ProductStatus } from '../../types';
import { PRODUCT_STATUS_COLORS } from '../../constants';

interface StockBadgeProps {
  status: ProductStatus;
  stockQuantity?: number;
}

const STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: 'In Stock',
  INACTIVE: 'Unavailable',
  OUT_OF_STOCK: 'Out of Stock',
};

const StockBadge: React.FC<StockBadgeProps> = ({ status, stockQuantity }) => {
  const label =
    status === 'ACTIVE' && stockQuantity !== undefined
      ? `In Stock (${stockQuantity})`
      : STATUS_LABELS[status];

  return (
    <Chip
      label={label}
      color={PRODUCT_STATUS_COLORS[status]}
      size="small"
      variant="outlined"
    />
  );
};

export default StockBadge;
