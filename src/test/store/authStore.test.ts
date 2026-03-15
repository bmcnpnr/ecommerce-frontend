import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      username: null,
      role: null,
      expiresIn: null,
      isAuthenticated: false,
      cartOrderId: null,
    });
  });

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
  });

  it('login sets auth state correctly', () => {
    useAuthStore.getState().login({
      token: 'my-token',
      username: 'john',
      role: 'CUSTOMER',
      expiresIn: 3600000,
    });
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('my-token');
    expect(state.username).toBe('john');
    expect(state.role).toBe('CUSTOMER');
  });

  it('logout clears auth state and cart', () => {
    useAuthStore.setState({ token: 'tok', username: 'john', isAuthenticated: true, cartOrderId: 42 });
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.token).toBeNull();
    expect(state.cartOrderId).toBeNull();
  });

  it('setCartOrderId stores cart order id', () => {
    useAuthStore.getState().setCartOrderId(7);
    expect(useAuthStore.getState().cartOrderId).toBe(7);
  });

  it('clearCart removes cart order id', () => {
    useAuthStore.setState({ cartOrderId: 99 });
    useAuthStore.getState().clearCart();
    expect(useAuthStore.getState().cartOrderId).toBeNull();
  });
});
