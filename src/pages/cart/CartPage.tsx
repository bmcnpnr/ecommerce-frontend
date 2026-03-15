import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useOrder, useDeleteOrder, useCreateOrder, useAddOrderItem } from '../../hooks/useOrders';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters';
import { OrderItemDTO } from '../../types';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartOrderId, setCartOrderId, username } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [removingItem, setRemovingItem] = useState<OrderItemDTO | null>(null);

  const { data: cartOrder, isLoading } = useOrder(cartOrderId);
  const deleteOrderMutation = useDeleteOrder();
  const createOrderMutation = useCreateOrder();
  const addItemMutation = useAddOrderItem();

  const handleClearCart = async () => {
    if (!cartOrderId) return;
    try {
      await deleteOrderMutation.mutateAsync(cartOrderId);
      setCartOrderId(null);
      setConfirmClearOpen(false);
      showSnackbar('Cart cleared', 'success');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to clear cart', 'error');
    }
  };

  // Removing an item requires cancel + recreate (backend limitation)
  const handleRemoveItem = async () => {
    if (!removingItem || !cartOrderId || !username) return;
    try {
      // Get all other items
      const otherItems = cartOrder?.orderItems.filter((i) => i.orderItemId !== removingItem.orderItemId) || [];

      // Delete current order
      await deleteOrderMutation.mutateAsync(cartOrderId);
      setCartOrderId(null);

      if (otherItems.length === 0) {
        showSnackbar('Item removed from cart', 'success');
        setRemovingItem(null);
        return;
      }

      // Create new order
      const newOrder = await createOrderMutation.mutateAsync();
      const newOrderId = newOrder.orderId;
      setCartOrderId(newOrderId);

      // Re-add remaining items
      for (const item of otherItems) {
        await addItemMutation.mutateAsync({
          orderId: newOrderId,
          data: { productId: item.productId, quantity: item.quantity },
        });
      }

      showSnackbar('Item removed from cart', 'success');
      setRemovingItem(null);
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to remove item', 'error');
    }
  };

  if (isLoading) return <LoadingSpinner message="Loading cart..." />;

  const items = cartOrder?.orderItems || [];
  const isEmpty = !cartOrderId || items.length === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Shopping Cart
      </Typography>

      {isEmpty ? (
        <EmptyState
          title="Your cart is empty"
          description="Add some products to your cart to get started!"
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
          icon={<ShoppingBagIcon sx={{ fontSize: 64 }} />}
        />
      ) : (
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          <Box flexGrow={1}>
            <Alert severity="info" sx={{ mb: 2 }}>
              Note: Individual item removal requires recreating the order. Removing an item will
              briefly recreate your cart.
            </Alert>

            <TableContainer component={Paper} elevation={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Total</TableCell>
                    <TableCell align="center">Remove</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.orderItemId}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {item.productName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {item.productId}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {formatCurrency(item.productPrice)}
                      </TableCell>
                      <TableCell align="center">{item.quantity}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight={600}>
                          {formatCurrency(item.productPrice * item.quantity)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => setRemovingItem(item)}
                          disabled={deleteOrderMutation.isPending || createOrderMutation.isPending || addItemMutation.isPending}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setConfirmClearOpen(true)}
                disabled={deleteOrderMutation.isPending}
              >
                Clear Cart
              </Button>
            </Box>
          </Box>

          {/* Order Summary */}
          <Paper elevation={1} sx={{ p: 3, width: { xs: '100%', md: 320 }, flexShrink: 0, alignSelf: 'flex-start' }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Order Summary
            </Typography>
            <Box display="flex" flexDirection="column" gap={1} mb={2}>
              {items.map((item) => (
                <Box key={item.orderItemId} display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    {item.productName} × {item.quantity}
                  </Typography>
                  <Typography variant="body2">
                    {formatCurrency(item.productPrice * item.quantity)}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatCurrency(cartOrder?.totalAmount || 0)}
              </Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Box>
      )}

      <ConfirmDialog
        open={confirmClearOpen}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart?"
        onConfirm={handleClearCart}
        onCancel={() => setConfirmClearOpen(false)}
        isLoading={deleteOrderMutation.isPending}
      />

      <ConfirmDialog
        open={removingItem !== null}
        title="Remove Item"
        message={`Remove "${removingItem?.productName}" from your cart?`}
        onConfirm={handleRemoveItem}
        onCancel={() => setRemovingItem(null)}
        isLoading={deleteOrderMutation.isPending || createOrderMutation.isPending || addItemMutation.isPending}
        severity="warning"
      />
    </Container>
  );
};

export default CartPage;
