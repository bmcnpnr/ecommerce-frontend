import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../utils/renderWithProviders';
import ProtectedRoute from '../../routes/ProtectedRoute';
import AdminRoute from '../../routes/AdminRoute';

const SecuredContent = () => <div>Protected Content</div>;

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to /login', () => {
    renderWithProviders(
      <ProtectedRoute>
        <SecuredContent />
      </ProtectedRoute>,
      { authenticated: false, routerProps: { initialEntries: ['/orders'] } }
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children for authenticated users', () => {
    renderWithProviders(
      <ProtectedRoute>
        <SecuredContent />
      </ProtectedRoute>,
      { authenticated: true }
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  it('redirects non-admin authenticated users to /', () => {
    renderWithProviders(
      <AdminRoute>
        <SecuredContent />
      </AdminRoute>,
      { authenticated: true, isAdmin: false }
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated users to /login', () => {
    renderWithProviders(
      <AdminRoute>
        <SecuredContent />
      </AdminRoute>,
      { authenticated: false }
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children for admin users', () => {
    renderWithProviders(
      <AdminRoute>
        <SecuredContent />
      </AdminRoute>,
      { authenticated: true, isAdmin: true }
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
