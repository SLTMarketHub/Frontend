import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as productsService from '../services/admin/products';
import { axiosInstance } from '../services/axiosInstance';

vi.mock('../services/axiosInstance', () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe('Products Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should fetch and transform products successfully', async () => {
      const mockProducts = [
        {
          _id: 'prod123',
          name: 'Test Product',
          lifecycleStatus: 'Active',
          productPrice: [{ price: { value: 1000 } }],
          category: [{ name: 'Electronics' }],
        }
      ];

      axiosInstance.get.mockResolvedValue({ data: mockProducts });

      const result = await productsService.getAllProducts();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'prod123',
        name: 'Test Product',
        status: 'approved',
        price: 1000,
      });
    });

    it('should return empty array on error', async () => {
      axiosInstance.get.mockRejectedValue(new Error('API Error'));

      const result = await productsService.getAllProducts();

      expect(result).toEqual([]);
    });
  });

  describe('getProductsStats', () => {
    it('should calculate product statistics correctly', async () => {
      const mockProducts = [
        { status: 'pending' },
        { status: 'pending' },
        { status: 'approved' },
        { status: 'rejected' },
      ];

      vi.spyOn(productsService, 'getAllProducts').mockResolvedValue(mockProducts);

      const stats = await productsService.getProductsStats();

      expect(stats.total).toBe(4);
      expect(stats.pending).toBe(2);
      expect(stats.approved).toBe(1);
      expect(stats.rejected).toBe(1);
    });
  });

  describe('approveProduct', () => {
    it('should approve product successfully', async () => {
      axiosInstance.patch.mockResolvedValue({ 
        data: { id: 'prod123', lifecycleStatus: 'Active' } 
      });

      await productsService.approveProduct('prod123');

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        'productCatalog/v5/productOffering/prod123',
        { lifecycleStatus: 'Active' }
      );
    });

    it('should throw error on API failure', async () => {
      axiosInstance.patch.mockRejectedValue(new Error('API Error'));

      await expect(productsService.approveProduct('prod123')).rejects.toThrow();
    });
  });

  describe('rejectProduct', () => {
    it('should reject product with reason', async () => {
      const reason = 'Poor quality images';
      axiosInstance.patch.mockResolvedValue({ data: { lifecycleStatus: 'Retired' } });

      await productsService.rejectProduct('prod123', reason);

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        'productCatalog/v5/productOffering/prod123',
        { lifecycleStatus: 'Retired', statusReason: reason }
      );
    });
  });

  describe('bulkApproveProducts', () => {
    it('should approve multiple products', async () => {
      const ids = ['prod1', 'prod2', 'prod3'];
      axiosInstance.patch.mockResolvedValue({ data: { lifecycleStatus: 'Active' } });

      const result = await productsService.bulkApproveProducts(ids);

      expect(result.successful).toHaveLength(3);
      expect(result.failed).toHaveLength(0);
      expect(axiosInstance.patch).toHaveBeenCalledTimes(3);
    });

    it('should handle partial failures', async () => {
      const ids = ['prod1', 'prod2', 'prod3'];
      axiosInstance.patch
        .mockResolvedValueOnce({ data: { lifecycleStatus: 'Active' } })
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValueOnce({ data: { lifecycleStatus: 'Active' } });

      const result = await productsService.bulkApproveProducts(ids);

      expect(result.successful).toHaveLength(2);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0].id).toBe('prod2');
    });
  });

  describe('bulkRejectProducts', () => {
    it('should reject multiple products', async () => {
      const ids = ['prod1', 'prod2'];
      const reason = 'Bulk rejection';
      axiosInstance.patch.mockResolvedValue({ data: { lifecycleStatus: 'Retired' } });

      const result = await productsService.bulkRejectProducts(ids, reason);

      expect(result.successful).toHaveLength(2);
      expect(result.failed).toHaveLength(0);
    });
  });

  describe('getCategories', () => {
    it('should fetch product categories', async () => {
      const mockCategories = [
        { id: 'cat1', name: 'Electronics', productCount: 100 },
        { id: 'cat2', name: 'Clothing', productCount: 50 },
      ];

      axiosInstance.get.mockResolvedValue({ data: mockCategories });

      const result = await productsService.getCategories();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Electronics');
    });

    it('should return empty array on error', async () => {
      axiosInstance.get.mockRejectedValue(new Error('API Error'));

      const result = await productsService.getCategories();

      expect(result).toEqual([]);
    });
  });
});
