import { useAuthStore } from '../store/authStore';
import { useOrder } from './useOrders';
import { useCreateOrder, useAddOrderItem } from './useOrders';
import { useSnackbar } from '../components/common/SnackbarProvider';

export const useCart = () => {
  const { cartOrderId, setCartOrderId, username } = useAuthStore();
  const { data: cartOrder, isLoading } = useOrder(cartOrderId);
  const createOrderMutation = useCreateOrder();
  const addItemMutation = useAddOrderItem();
  const { showSnackbar } = useSnackbar();

  const addToCart = async (productId: number, quantity: number) => {
    try {
      let orderId = cartOrderId;

      if (!orderId) {
        if (!username) {
          showSnackbar('Please login to add items to cart', 'warning');
          return;
        }
        const newOrder = await createOrderMutation.mutateAsync();
        orderId = newOrder.orderId;
        setCartOrderId(orderId);
      }

      await addItemMutation.mutateAsync({ orderId, data: { productId, quantity } });
      showSnackbar('Item added to cart!', 'success');
    } catch (error) {
      showSnackbar(error instanceof Error ? error.message : 'Failed to add item', 'error');
    }
  };

  const itemCount = cartOrder?.orderItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return {
    cartOrder,
    cartOrderId,
    isLoading,
    addToCart,
    isAdding: createOrderMutation.isPending || addItemMutation.isPending,
    itemCount,
  };
};
