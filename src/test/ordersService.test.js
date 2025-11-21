import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as ordersService from '../services/admin/orders';
import { axiosInstance } from '../services/axiosInstance';

vi.mock('../services/axiosInstance', () => ({
  axiosInstance: {
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

describe('Orders Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should fetch and transform orders successfully', async () => {
      const mockOrders = {
        productOrder: [
          {
            _id: 'order123',
            externalId: 'ORD-001',
            state: 'acknowledged',
            relatedParty: [
              { role: 'customer', name: 'John Doe' },
              { role: 'seller', name: 'Test Seller' }
            ],
            orderDate: '2024-01-01T00:00:00Z',
            productOrderItem: [
              { productOffering: { price: [{ price: { value: 1000 } }] }, quantity: 2 }
            ]
          }
        ]
      };

      axiosInstance.get.mockResolvedValue({ data: mockOrders });

      const result = await ordersService.getAllOrders();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'order123',
        customer: 'John Doe',
        seller: 'Test Seller',
        status: 'confirmed',
      });
    });

    it('should return empty array on error', async () => {
      axiosInstance.get.mockRejectedValue(new Error('API Error'));

      const result = await ordersService.getAllOrders();

      expect(result).toEqual([]);
    });
  });

  describe('getOrdersStats', () => {
    it('should calculate order statistics correctly', async () => {
      const mockOrders = [
        { status: 'pending', total: 1000 },
        { status: 'completed', total: 2000 },
        { status: 'completed', total: 3000 },
        { status: 'cancelled', total: 500 },
      ];

      vi.spyOn(ordersService, 'getAllOrders').mockResolvedValue(mockOrders);

      const stats = await ordersService.getOrdersStats();

      expect(stats.total).toBe(4);
      expect(stats.pending).toBe(1);
      expect(stats.completed).toBe(2);
      expect(stats.cancelled).toBe(1);
      expect(stats.revenue).toBe(5000); // 1000 + 2000 + 3000 - 500
    });
  });

  describe('getOrder', () => {
    it('should fetch individual order by ID', async () => {
      const mockOrder = {
        _id: 'order123',
        state: 'inProgress',
        relatedParty: [{ role: 'customer', name: 'Jane Doe' }],
      };

      axiosInstance.get.mockResolvedValue({ data: mockOrder });

      const result = await ordersService.getOrder('order123');

      expect(result.id).toBe('order123');
      expect(result.status).toBe('processing');
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      axiosInstance.patch.mockResolvedValue({ 
        data: { state: 'completed' } 
      });

      await ordersService.updateOrderStatus('order123', 'completed');

      expect(axiosInstance.patch).toHaveBeenCalledWith(
        'productOrdering/v1/productOrder/order123',
        { state: 'completed' }
      );
    });
  });

  describe('processRefund', () => {
    it('should create refund trouble ticket', async () => {
      const orderId = 'order123';
      const amount = 1000;
      const reason = 'Customer request';

      axiosInstance.post.mockResolvedValue({ 
        data: { id: 'ticket123', type: 'refund' }
      });

      const result = await ordersService.processRefund(orderId, amount, reason);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        'customerBill/v5/troubleTicket',
        expect.objectContaining({
          type: 'refund',
          description: expect.stringContaining(reason),
        })
      );
      expect(result.id).toBe('ticket123');
    });

    it('should throw error on API failure', async () => {
      axiosInstance.post.mockRejectedValue(new Error('API Error'));

      await expect(
        ordersService.processRefund('order123', 1000, 'Test')
      ).rejects.toThrow();
    });
  });

  describe('resolveDispute', () => {
    it('should update dispute ticket with resolution', async () => {
      const orderId = 'order123';
      const resolution = 'Customer satisfied with replacement';

      axiosInstance.post.mockResolvedValue({ 
        data: { id: 'ticket456', status: 'resolved' }
      });

      const result = await ordersService.resolveDispute(orderId, resolution);

      expect(axiosInstance.post).toHaveBeenCalledWith(
        'customerBill/v5/troubleTicket',
        expect.objectContaining({
          type: 'dispute',
          resolution: resolution,
        })
      );
      expect(result.id).toBe('ticket456');
    });
  });
});
