import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../../store/authStore';
import { useOrder, useConfirmOrder } from '../../hooks/useOrders';
import { useCreatePayment, useProcessPayment } from '../../hooks/usePayments';
import { useCurrentUser } from '../../hooks/useAuth';
import { useSnackbar } from '../../components/common/SnackbarProvider';
import { formatCurrency } from '../../utils/formatters';
import { checkoutAddressSchema, paymentSchema, CheckoutAddressFormData, PaymentFormData } from '../../utils/validators';
import { PaymentMethod } from '../../types';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STEPS = ['Review & Addresses', 'Payment', 'Confirm Order'];

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cartOrderId, setCartOrderId, username } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const [activeStep, setActiveStep] = useState(0);
  const [orderComplete, setOrderComplete] = useState(false);
  const [finalOrderId, setFinalOrderId] = useState<number | null>(null);
  const [addressData, setAddressData] = useState<CheckoutAddressFormData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);

  const { data: cartOrder, isLoading: orderLoading } = useOrder(cartOrderId);
  const { data: currentUser } = useCurrentUser();
  const confirmOrderMutation = useConfirmOrder();
  const createPaymentMutation = useCreatePayment();
  const processPaymentMutation = useProcessPayment();

  const addressForm = useForm<CheckoutAddressFormData>({
    resolver: zodResolver(checkoutAddressSchema),
    defaultValues: {
      shippingAddress: currentUser?.defaultShippingAddress || '',
      billingAddress: currentUser?.defaultBillingAddress || '',
    },
  });

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: 'CREDIT_CARD',
      cardLastFour: '',
    },
  });

  const watchedMethod = paymentForm.watch('method');
  const isCardPayment = watchedMethod === 'CREDIT_CARD' || watchedMethod === 'DEBIT_CARD';

  const handleAddressSubmit = (data: CheckoutAddressFormData) => {
    setAddressData(data);
    setActiveStep(1);
  };

  const handlePaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data);
    setActiveStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!cartOrderId || !username || !addressData || !paymentData || !cartOrder) return;

    try {
      // Confirm order
      const confirmedOrder = await confirmOrderMutation.mutateAsync(cartOrderId);

      // Create payment
      const payment = await createPaymentMutation.mutateAsync({
        orderId: confirmedOrder.orderId,
        customerId: username,
        amount: confirmedOrder.totalAmount,
        currency: 'USD',
        method: paymentData.method as PaymentMethod,
        cardLastFour: isCardPayment && paymentData.cardLastFour ? paymentData.cardLastFour : undefined,
      });

      // Process payment
      await processPaymentMutation.mutateAsync(payment.id);

      setFinalOrderId(confirmedOrder.orderId);
      setCartOrderId(null);
      setOrderComplete(true);
      showSnackbar('Order placed successfully!', 'success');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to place order', 'error');
    }
  };

  if (orderLoading) return <LoadingSpinner message="Loading checkout..." />;

  if (!cartOrderId || !cartOrder || cartOrder.orderItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <EmptyState
          title="Your cart is empty"
          description="Add some products before checking out."
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
        />
      </Container>
    );
  }

  if (orderComplete) {
    return (
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }} elevation={2}>
          <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Order Placed!
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Your order #{finalOrderId} has been placed and payment is being processed.
          </Typography>
          <Box display="flex" gap={2} justifyContent="center">
            <Button variant="contained" onClick={() => navigate(`/orders/${finalOrderId}`)}>
              View Order
            </Button>
            <Button variant="outlined" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  const OrderSummary = () => (
    <Paper sx={{ p: 2 }} elevation={1}>
      <Typography variant="h6" fontWeight={700} mb={2}>Order Summary</Typography>
      <Table size="small">
        <TableBody>
          {cartOrder.orderItems.map((item) => (
            <TableRow key={item.orderItemId}>
              <TableCell sx={{ border: 'none', py: 0.5 }}>
                <Typography variant="body2">{item.productName} × {item.quantity}</Typography>
              </TableCell>
              <TableCell align="right" sx={{ border: 'none', py: 0.5 }}>
                <Typography variant="body2">{formatCurrency(item.productPrice * item.quantity)}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Divider sx={{ my: 1 }} />
      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
        <Typography variant="subtitle1" fontWeight={700} color="primary.main">
          {formatCurrency(cartOrder.totalAmount)}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>Checkout</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Step 1: Addresses */}
          {activeStep === 0 && (
            <Paper sx={{ p: 3 }} elevation={1}>
              <Typography variant="h6" fontWeight={600} mb={3}>Shipping & Billing Addresses</Typography>

              <Box component="form" onSubmit={addressForm.handleSubmit(handleAddressSubmit)} display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Shipping Address *"
                  fullWidth
                  multiline
                  rows={2}
                  {...addressForm.register('shippingAddress')}
                  error={!!addressForm.formState.errors.shippingAddress}
                  helperText={addressForm.formState.errors.shippingAddress?.message}
                />
                <TextField
                  label="Billing Address *"
                  fullWidth
                  multiline
                  rows={2}
                  {...addressForm.register('billingAddress')}
                  error={!!addressForm.formState.errors.billingAddress}
                  helperText={addressForm.formState.errors.billingAddress?.message}
                />
                <Box display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" size="large">
                    Continue to Payment
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Step 2: Payment */}
          {activeStep === 1 && (
            <Paper sx={{ p: 3 }} elevation={1}>
              <Typography variant="h6" fontWeight={600} mb={3}>Payment Method</Typography>

              <Box component="form" onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} display="flex" flexDirection="column" gap={3}>
                <Controller
                  name="method"
                  control={paymentForm.control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Select Payment Method</FormLabel>
                      <RadioGroup {...field}>
                        <FormControlLabel value="CREDIT_CARD" control={<Radio />} label="Credit Card" />
                        <FormControlLabel value="DEBIT_CARD" control={<Radio />} label="Debit Card" />
                        <FormControlLabel value="BANK_TRANSFER" control={<Radio />} label="Bank Transfer" />
                        <FormControlLabel value="DIGITAL_WALLET" control={<Radio />} label="Digital Wallet" />
                      </RadioGroup>
                    </FormControl>
                  )}
                />

                {isCardPayment && (
                  <TextField
                    label="Last 4 digits of card"
                    fullWidth
                    {...paymentForm.register('cardLastFour')}
                    error={!!paymentForm.formState.errors.cardLastFour}
                    helperText={paymentForm.formState.errors.cardLastFour?.message}
                    slotProps={{ htmlInput: { maxLength: 4, pattern: '[0-9]*' } }}
                    sx={{ maxWidth: 200 }}
                  />
                )}

                <Box display="flex" gap={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={() => setActiveStep(0)}>Back</Button>
                  <Button type="submit" variant="contained" size="large">
                    Review Order
                  </Button>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Step 3: Confirm */}
          {activeStep === 2 && (
            <Paper sx={{ p: 3 }} elevation={1}>
              <Typography variant="h6" fontWeight={600} mb={3}>Confirm Your Order</Typography>

              <Box display="flex" flexDirection="column" gap={2} mb={3}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Shipping Address</Typography>
                  <Typography variant="body2">{addressData?.shippingAddress}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Billing Address</Typography>
                  <Typography variant="body2">{addressData?.billingAddress}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="text.secondary">Payment Method</Typography>
                  <Typography variant="body2">
                    {paymentData?.method.replace(/_/g, ' ')}
                    {paymentData?.cardLastFour ? ` ending in ${paymentData.cardLastFour}` : ''}
                  </Typography>
                </Box>
              </Box>

              {(confirmOrderMutation.isError || createPaymentMutation.isError || processPaymentMutation.isError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {(confirmOrderMutation.error as Error)?.message ||
                    (createPaymentMutation.error as Error)?.message ||
                    (processPaymentMutation.error as Error)?.message ||
                    'Failed to place order'}
                </Alert>
              )}

              <Box display="flex" gap={2} justifyContent="flex-end">
                <Button variant="outlined" onClick={() => setActiveStep(1)} disabled={confirmOrderMutation.isPending || createPaymentMutation.isPending}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  color="success"
                  onClick={handlePlaceOrder}
                  disabled={confirmOrderMutation.isPending || createPaymentMutation.isPending || processPaymentMutation.isPending}
                  startIcon={
                    (confirmOrderMutation.isPending || createPaymentMutation.isPending || processPaymentMutation.isPending)
                      ? <CircularProgress size={20} color="inherit" />
                      : null
                  }
                >
                  {confirmOrderMutation.isPending || createPaymentMutation.isPending || processPaymentMutation.isPending
                    ? 'Placing Order...'
                    : 'Place Order'}
                </Button>
              </Box>
            </Paper>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <OrderSummary />
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
