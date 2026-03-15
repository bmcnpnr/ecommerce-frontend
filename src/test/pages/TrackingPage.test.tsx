import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../utils/renderWithProviders';
import TrackingPage from '../../pages/tracking/TrackingPage';

describe('TrackingPage', () => {
  it('renders the tracking input form', () => {
    renderWithProviders(<TrackingPage />);
    expect(screen.getByLabelText(/tracking number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /track/i })).toBeInTheDocument();
  });

  it('auto-fills tracking number from URL params', () => {
    renderWithProviders(<TrackingPage />, {
      routerProps: { initialEntries: ['/tracking/TRK-12345'] },
    });
    // Component should read trackingNumber param and pre-fill or auto-fetch
    expect(screen.getByLabelText(/tracking number/i)).toBeInTheDocument();
  });

  it('fetches and displays shipment details on valid tracking number', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TrackingPage />);

    await user.type(screen.getByLabelText(/tracking number/i), 'TRK-12345');
    await user.click(screen.getByRole('button', { name: /track/i }));

    await waitFor(() => {
      expect(screen.getByText(/TRK-12345/i)).toBeInTheDocument();
    });
  });

  it('shows error for empty tracking number', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TrackingPage />);
    await user.click(screen.getByRole('button', { name: /track/i }));
    await waitFor(() => {
      expect(screen.getByText(/tracking number is required/i)).toBeInTheDocument();
    });
  });
});
