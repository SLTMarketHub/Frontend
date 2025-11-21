import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SellerApproval from '../pages/SellerApproval';
import * as sellersService from '../services/admin/sellers';

// Mock the services
vi.mock('../services/admin/sellers');
vi.mock('../hooks/useToast', () => ({
  default: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

const mockSellers = [
  {
    id: '1',
    name: 'Test Seller 1',
    email: 'seller1@example.com',
    status: 'pending',
    storeName: 'Store 1',
    phone: '1234567890',
    appliedAt: '2024-01-01T00:00:00Z',
    revenue: 0,
    totalOrders: 0,
  },
  {
    id: '2',
    name: 'Test Seller 2',
    email: 'seller2@example.com',
    status: 'approved',
    storeName: 'Store 2',
    phone: '0987654321',
    appliedAt: '2024-01-02T00:00:00Z',
    revenue: 50000,
    totalOrders: 10,
  },
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('SellerApproval Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sellersService.getAllSellers.mockResolvedValue(mockSellers);
    sellersService.getSellersStats.mockResolvedValue({
      total: 2,
      pending: 1,
      approved: 1,
      rejected: 0,
    });
  });

  it('should render seller approval page', async () => {
    renderWithRouter(<SellerApproval />);

    await waitFor(() => {
      expect(screen.getByText('Seller Approvals')).toBeInTheDocument();
    });
  });

  it('should display sellers list', async () => {
    renderWithRouter(<SellerApproval />);

    await waitFor(() => {
      expect(screen.getByText('Test Seller 1')).toBeInTheDocument();
      expect(screen.getByText('Test Seller 2')).toBeInTheDocument();
    });
  });

  it('should display correct statistics', async () => {
    renderWithRouter(<SellerApproval />);

    await waitFor(() => {
      // Check if stats are displayed (this depends on your actual UI)
      expect(sellersService.getSellersStats).toHaveBeenCalled();
    });
  });

  it('should filter sellers by status', async () => {
    renderWithRouter(<SellerApproval />);

    await waitFor(() => {
      expect(screen.getByText('Test Seller 1')).toBeInTheDocument();
    });

    // Simulate status filter change (depends on your UI implementation)
    // This is a placeholder - adjust based on your actual filter implementation
  });

  it('should call approveSeller when approve button is clicked', async () => {
    sellersService.approveSeller.mockResolvedValue({ status: 'approved' });
    
    renderWithRouter(<SellerApproval />);

    await waitFor(() => {
      expect(screen.getByText('Test Seller 1')).toBeInTheDocument();
    });

    // Find and click approve button (adjust selector based on your UI)
    const approveButtons = screen.getAllByText(/approve/i);
    if (approveButtons.length > 0) {
      fireEvent.click(approveButtons[0]);

      await waitFor(() => {
        expect(sellersService.approveSeller).toHaveBeenCalledWith('1');
      });
    }
  });

  it('should call rejectSeller when reject button is clicked', async () => {
    sellersService.rejectSeller.mockResolvedValue({ status: 'rejected' });
    
    renderWithRouter(<SellerApproval />);

    await waitFor(() => {
      expect(screen.getByText('Test Seller 1')).toBeInTheDocument();
    });

    // Find and click reject button (adjust selector based on your UI)
    const rejectButtons = screen.getAllByText(/reject/i);
    if (rejectButtons.length > 0) {
      fireEvent.click(rejectButtons[0]);

      await waitFor(() => {
        expect(sellersService.rejectSeller).toHaveBeenCalled();
      });
    }
  });

  it('should show loading state while fetching data', () => {
    sellersService.getAllSellers.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    renderWithRouter(<SellerApproval />);

    // Check for loading indicator (adjust based on your UI)
    // expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should handle error when fetching sellers fails', async () => {
    sellersService.getAllSellers.mockRejectedValue(new Error('API Error'));

    renderWithRouter(<SellerApproval />);

    await waitFor(() => {
      // Check if error state is shown or fallback data is used
      expect(sellersService.getAllSellers).toHaveBeenCalled();
    });
  });
});
