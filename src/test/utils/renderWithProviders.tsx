import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from '../../theme/theme';
import { SnackbarProvider } from '../../components/common/SnackbarProvider';
import { useAuthStore } from '../../store/authStore';

interface RenderConfig extends Omit<RenderOptions, 'wrapper'> {
  routerProps?: MemoryRouterProps;
  authenticated?: boolean;
  isAdmin?: boolean;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(ui: React.ReactElement, config: RenderConfig = {}) {
  const { routerProps, authenticated = false, isAdmin = false, ...renderOptions } = config;

  // Set auth state if needed
  if (authenticated) {
    useAuthStore.setState({
      token: 'mock-token',
      username: 'testuser',
      role: isAdmin ? 'ADMIN' : 'CUSTOMER',
      expiresIn: Date.now() + 3600000,
      isAuthenticated: true,
    });
  } else {
    useAuthStore.setState({
      token: null,
      username: null,
      role: null,
      expiresIn: null,
      isAuthenticated: false,
    });
  }

  const queryClient = createTestQueryClient();

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider>
          <MemoryRouter {...routerProps}>{children}</MemoryRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export { createTestQueryClient };
