import React from 'react';
import Chip from '@mui/material/Chip';
import { OrderStatus } from '../../types';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../../constants';

interface OrderStatusChipProps {
  status: OrderStatus;
  size?: 'small' | 'medium';
}

const OrderStatusChip: React.FC<OrderStatusChipProps> = ({ status, size = 'small' }) => {
  return (
    <Chip
      label={ORDER_STATUS_LABELS[status] || status}
      color={ORDER_STATUS_COLORS[status] || 'default'}
      size={size}
    />
  );
};

export default OrderStatusChip;
