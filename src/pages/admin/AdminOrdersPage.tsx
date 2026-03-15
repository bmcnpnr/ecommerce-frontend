import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders.api';
import { useUpdateOrderStatus } from '../../hooks/useOrders';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import OrderStatusChip from '../../components/order/OrderStatusChip';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { OrderStatus } from '../../types';
import { useAuthStore } from '../../store/authStore';

const ORDER_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { username } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const updateStatusMutation = useUpdateOrderStatus();

  // Fetch own customer orders as admin for demonstration
  // In a real system, there would be a GET /orders admin endpoint
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders', 'customer', username],
    queryFn: () => ordersApi.getOrdersByCustomer(username!),
    enabled: !!username,
  });

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ orderId, status });
      showSnackbar('Order status updated!', 'success');
    } catch (err) {
      showSnackbar(err instanceof Error ? err.message : 'Failed to update status', 'error');
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={3}>
        Order Management
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Showing orders for the current user. A production admin API would list all customer orders.
      </Alert>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as Error).message}
        </Alert>
      )}

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Update Status</TableCell>
              <TableCell align="center">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
              : (orders || []).map((order) => (
                  <TableRow key={order.orderId} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>#{order.orderId}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.customerId}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDateTime(order.orderDate)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.orderItems.length}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <OrderStatusChip status={order.status} />
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value as OrderStatus)}
                          disabled={updateStatusMutation.isPending}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Order">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => navigate(`/orders/${order.orderId}`)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && (!orders || orders.length === 0) && (
        <Box textAlign="center" py={4}>
          <Typography color="text.secondary">No orders found.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default AdminOrdersPage;
