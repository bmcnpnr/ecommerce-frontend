import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useNavigate } from 'react-router-dom';
import { OrderDTO } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import OrderStatusChip from './OrderStatusChip';

interface OrderCardProps {
  order: OrderDTO;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardActionArea onClick={() => navigate(`/orders/${order.orderId}`)}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Order #{order.orderId}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(order.orderDate)}
              </Typography>
            </Box>
            <OrderStatusChip status={order.status} />
          </Box>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
          </Typography>
          <Typography variant="h6" color="primary.main" fontWeight={700} mt={0.5}>
            {formatCurrency(order.totalAmount)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default OrderCard;
