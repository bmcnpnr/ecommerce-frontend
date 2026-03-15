import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useDeleteOrder, useUpdateOrderStatus } from '../../hooks/useOrders';
import { usePaymentByOrder } from '../../hooks/usePayments';
import { useShipmentByOrder, useShipmentHistory } from '../../hooks/useShipments';
import { useAuthStore } from '../../store/authStore';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import OrderStatusChip from '../../components/order/OrderStatusChip';
import OrderItemRow from '../../components/order/OrderItemRow';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorAlert from '../../components/common/ErrorAlert';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { PAYMENT_STATUS_COLORS, SHIPMENT_STATUS_COLORS } from '../../constants';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);
  const navigate = useNavigate();
  const { cartOrderId, setCartOrderId } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { data: order, isLoading: orderLoading, error: orderError } = useOrder(orderId);
  const { data: payment, isLoading: paymentLoading } = usePaymentByOrder(orderId);
  const { data: shipment } = useShipmentByOrder(orderId);
  const { data: shipmentHistory } = useShipmentHistory(shipment?.id ?? null);
  const deleteOrderMutation = useDeleteOrder();
  const updateStatusMutation = useUpdateOrderStatus();

  const canCancel = order?.status === 'PENDING' || order?.status === 'CONFIRMED';

  const handleCancelOrder = async () => {
    if (!orderId) return;
    try {
      await deleteOrderMutation.mutateAsync(orderId);
      if (cartOrderId === orderId) {
        setCartOrderId(null);
      }
      showSnackbar('Order cancelled', 'success');
      setCancelDialogOpen(false);
      navigate('/orders');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to cancel order', 'error');
    }
  };

  if (orderLoading) return <LoadingSpinner message="Loading order details..." />;
  if (orderError) return <Container sx={{ py: 4 }}><ErrorAlert error={orderError as Error} /></Container>;
  if (!order) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Order #{order.orderId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Placed on {formatDateTime(order.orderDate)}
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <OrderStatusChip status={order.status} size="medium" />
          {canCancel && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setCancelDialogOpen(true)}
            >
              Cancel Order
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order Items */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper elevation={1} sx={{ mb: 3 }}>
            <Box p={2}>
              <Typography variant="h6" fontWeight={600} mb={2}>Order Items</Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <OrderItemRow key={item.orderItemId} item={item} />
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography fontWeight={700}>Total</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={700} color="primary.main">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Shipment Timeline */}
          {shipmentHistory && shipmentHistory.length > 0 && (
            <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LocalShippingIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>Shipment Timeline</Typography>
              </Box>
              <Timeline sx={{ p: 0 }}>
                {shipmentHistory.map((event, index) => (
                  <TimelineItem key={event.id}>
                    <TimelineOppositeContent sx={{ m: 'auto 0', flex: 0.3 }} variant="caption" color="text.secondary">
                      {formatDateTime(event.eventTimestamp)}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color="primary" variant={index === 0 ? 'filled' : 'outlined'} />
                      {index < shipmentHistory.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: 1 }}>
                      <Typography variant="body2" fontWeight={600}>{event.newStatus}</Typography>
                      <Typography variant="caption" color="text.secondary">{event.eventDescription}</Typography>
                      {event.location && (
                        <Typography variant="caption" display="block" color="text.secondary">
                          Location: {event.location}
                        </Typography>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Paper>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Addresses */}
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>Addresses</Typography>
            {order.shippingAddress && (
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  Shipping Address
                </Typography>
                <Typography variant="body2">{order.shippingAddress}</Typography>
              </Box>
            )}
            {order.billingAddress && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  Billing Address
                </Typography>
                <Typography variant="body2">{order.billingAddress}</Typography>
              </Box>
            )}
            {!order.shippingAddress && !order.billingAddress && (
              <Typography variant="body2" color="text.secondary">No address information</Typography>
            )}
          </Paper>

          {/* Payment */}
          <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <PaymentIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Payment</Typography>
            </Box>
            {paymentLoading ? (
              <Skeleton variant="rectangular" height={60} />
            ) : payment ? (
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={payment.status}
                    color={PAYMENT_STATUS_COLORS[payment.status]}
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Method</Typography>
                  <Typography variant="body2">{payment.method.replace(/_/g, ' ')}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">Amount</Typography>
                  <Typography variant="body2" fontWeight={600}>{formatCurrency(payment.amount)}</Typography>
                </Box>
                {payment.cardLastFour && (
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="body2" color="text.secondary">Card</Typography>
                    <Typography variant="body2">**** {payment.cardLastFour}</Typography>
                  </Box>
                )}
                {payment.failureReason && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    {payment.failureReason}
                  </Alert>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No payment information</Typography>
            )}
          </Paper>

          {/* Shipment */}
          <Paper elevation={1} sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocalShippingIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>Shipment</Typography>
            </Box>
            {shipment ? (
              <Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={shipment.status.replace(/_/g, ' ')}
                    color={SHIPMENT_STATUS_COLORS[shipment.status]}
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" color="text.secondary">Tracking #</Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => navigate(`/tracking/${shipment.trackingNumber}`)}
                  >
                    {shipment.trackingNumber}
                  </Typography>
                </Box>
                {shipment.carrier && (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">Carrier</Typography>
                    <Typography variant="body2">{shipment.carrier}</Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No shipment information yet</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={cancelDialogOpen}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${orderId}? This action cannot be undone.`}
        confirmLabel="Cancel Order"
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelDialogOpen(false)}
        isLoading={deleteOrderMutation.isPending}
      />
    </Container>
  );
};

export default OrderDetailPage;
