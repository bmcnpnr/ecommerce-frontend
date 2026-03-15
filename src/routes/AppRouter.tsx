import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import LoadingSpinner from '../components/common/LoadingSpinner';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const HomePage = lazy(() => import('../pages/home/HomePage'));
const ProductListPage = lazy(() => import('../pages/products/ProductListPage'));
const ProductDetailPage = lazy(() => import('../pages/products/ProductDetailPage'));
const CartPage = lazy(() => import('../pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('../pages/checkout/CheckoutPage'));
const OrderListPage = lazy(() => import('../pages/orders/OrderListPage'));
const OrderDetailPage = lazy(() => import('../pages/orders/OrderDetailPage'));
const TrackingPage = lazy(() => import('../pages/tracking/TrackingPage'));
const ProfilePage = lazy(() => import('../pages/profile/ProfilePage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminProductsPage = lazy(() => import('../pages/admin/AdminProductsPage'));
const AdminCategoriesPage = lazy(() => import('../pages/admin/AdminCategoriesPage'));
const AdminOrdersPage = lazy(() => import('../pages/admin/AdminOrdersPage'));
const AdminReviewsPage = lazy(() => import('../pages/admin/AdminReviewsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Admin routes */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
        </Route>

        {/* Main routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/tracking/:trackingNumber" element={<TrackingPage />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
