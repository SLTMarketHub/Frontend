import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as sellersService from '../services/admin/sellers';
import { axiosInstance } from '../services/axiosInstance';

// Mock axiosInstance
vi.mock('../services/axiosInstance', () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => { store[key] = value.toString(); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
global.localStorage = localStorageMock;

describe('Sellers Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('getAllSellers', () => {
    it('should fetch and transform sellers successfully', async () => {
      const mockPartnerships = [
        {
          _id: '123',
          name: 'Test Seller',
          status: 'active',
          contactMedium: [
            { type: 'Email', characteristic: { emailAddress: 'seller@example.com' } },
            { type: 'Phone', characteristic: { phoneNumber: '1234567890' } }
          ],
          validFor: { startDateTime: '2024-01-01T00:00:00Z' }
        }
      ];

      axiosInstance.get.mockResolvedValue({ data: mockPartnerships });

      const result = await sellersService.getAllSellers();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: '123',
        name: 'Test Seller',
        email: 'seller@example.com',
        status: 'approved', // active maps to approved
      });
    });

    it('should return empty array on error', async () => {
      axiosInstance.get.mockRejectedValue(new Error('API Error'));

      const result = await sellersService.getAllSellers();

      expect(result).toEqual([]);
    });

    it('should use cached status if available', async () => {
      // Set up cache
      localStorage.setItem('seller_status_cache', JSON.stringify({
        '123': { status: 'approved', timestamp: new Date().toISOString() }
      }));

      const mockPartnerships = [
        {
          _id: '123',
          name: 'Test Seller',
          status: null, // No status from API
        }
      ];

      axiosInstance.get.mockResolvedValue({ data: mockPartnerships });

      const result = await sellersService.getAllSellers();

      expect(result[0].status).toBe('approved'); // Should use cached status
    });
  });

  describe('getSellersStats', () => {
    it('should calculate seller statistics correctly', async () => {
      const mockSellers = [
        { status: 'pending' },
        { status: 'pending' },
        { status: 'approved' },
        { status: 'approved' },
        { status: 'approved' },
        { status: 'rejected' },
      ];

      // Mock getAllSellers to return mock data
      vi.spyOn(sellersService, 'getAllSellers').mockResolvedValue(mockSellers);

      const stats = await sellersService.getSellersStats();

      expect(stats).toEqual({
        total: 6,
        pending: 2,
        approved: 3,
        rejected: 1,
      });
    });

    it('should return zero stats on error', async () => {
      vi.spyOn(sellersService, 'getAllSellers').mockRejectedValue(new Error('Error'));

      const stats = await sellersService.getSellersStats();

      expect(stats).toEqual({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
      });
    });
  });

  describe('getSeller', () => {
    it('should fetch individual seller by ID', async () => {
      const mockPartnership = {
        _id: '123',
        name: 'Individual Seller',
        status: 'active',
      };

      axiosInstance.get.mockResolvedValue({ data: mockPartnership });

      const result = await sellersService.getSeller('123');

      expect(result.id).toBe('123');
      expect(result.name).toBe('Individual Seller');
      expect(axiosInstance.get).toHaveBeenCalledWith('partnershipManagement/v4/partnership/123');
    });

    it('should throw error if seller not found', async () => {
      axiosInstance.get.mockRejectedValue(new Error('Not found'));

      await expect(sellersService.getSeller('999')).rejects.toThrow('Not found');
    });
  });

  describe('approveSeller', () => {
    it('should approve seller and cache status', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { status: 'active' } });

      await sellersService.approveSeller('123');

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        'partnershipManagement/v4/partnership/123',
        { status: 'active' }
      );

      // Check cache was updated
      const cache = JSON.parse(localStorage.getItem('seller_status_cache'));
      expect(cache['123'].status).toBe('approved');
    });

    it('should throw error on API failure', async () => {
      axiosInstance.patch.mockRejectedValue(new Error('API Error'));

      await expect(sellersService.approveSeller('123')).rejects.toThrow('API Error');
    });
  });

  describe('rejectSeller', () => {
    it('should reject seller with reason and cache status', async () => {
      const reason = 'Incomplete documents';
      axiosInstance.patch.mockResolvedValue({ data: { status: 'rejected' } });

      await sellersService.rejectSeller('123', reason);

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        'partnershipManagement/v4/partnership/123',
        { status: 'rejected', statusReason: reason }
      );

      // Check cache was updated
      const cache = JSON.parse(localStorage.getItem('seller_status_cache'));
      expect(cache['123'].status).toBe('rejected');
    });

    it('should use empty reason if not provided', async () => {
      axiosInstance.patch.mockResolvedValue({ data: { status: 'rejected' } });

      await sellersService.rejectSeller('123');

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        'partnershipManagement/v4/partnership/123',
        { status: 'rejected', statusReason: '' }
      );
    });
  });
});
