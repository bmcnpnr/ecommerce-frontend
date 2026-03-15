import React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Skeleton from '@mui/material/Skeleton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useNavigate } from 'react-router-dom';
import { useCustomerOrders } from '../../hooks/useOrders';
import OrderCard from '../../components/order/OrderCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorAlert from '../../components/common/ErrorAlert';

const OrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useCustomerOrders();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Orders
      </Typography>

      {error && <ErrorAlert error={error as Error} />}

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="You haven't placed any orders. Start shopping!"
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
          icon={<ShoppingBagIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Grid container spacing={2}>
          {orders
            .slice()
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .map((order) => (
              <Grid key={order.orderId} size={{ xs: 12, sm: 6, md: 4 }}>
                <OrderCard order={order} />
              </Grid>
            ))}
        </Grid>
      )}
    </Container>
  );
};

export default OrderListPage;
