// TMF622 Product ordering Management API Service
import { apiClient } from '../authService';
import { mockOrders } from '../../utils/mockData';
import { API_CONFIG, API_RESOURCES } from '../../config/api.config';

const ORDER_API = API_CONFIG.ENDPOINTS.PRODUCT_ORDERING;

class OrderManagementService {
  /**
   * List all orders with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} Order list response
   */
  async listOrders(params = {}) {
    try {
      const response = await apiClient.get(`${ORDER_API}${API_RESOURCES.ORDER.PRODUCT_ORDER}`, { params });
      return {
        items: response.data,
        total: response.data.length
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      // Fallback to mock data
      let orders = [...mockOrders];
      
      // Apply filters
      if (params.status) {
        orders = orders.filter(o => o.state === params.status);
      }
      if (params.customerId) {
        orders = orders.filter(o => o.customerId === params.customerId);
      }
      if (params.sellerId) {
        orders = orders.filter(o => o.sellerId === params.sellerId);
      }
      if (params.dateFrom) {
        orders = orders.filter(o => new Date(o.orderDate) >= new Date(params.dateFrom));
      }
      if (params.dateTo) {
        orders = orders.filter(o => new Date(o.orderDate) <= new Date(params.dateTo));
      }
      
      return {
        items: orders,
        total: orders.length
      };
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Promise} Order details
   */
  async getOrder(orderId) {
    try {
      const response = await apiClient.get(`${ORDER_API}${API_RESOURCES.ORDER.PRODUCT_ORDER}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      // Fallback to mock data
      const order = mockOrders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    }
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional update data
   * @returns {Promise} Updated order
   */
  async updateOrderStatus(orderId, status, additionalData = {}) {
    try {
      const response = await apiClient.patch(`${ORDER_API}${API_RESOURCES.ORDER.PRODUCT_ORDER}/${orderId}`, {
        state: status,
        ...additionalData,
        stateChangeDate: new Date().toISOString(),
        stateChangeReason: additionalData.reason
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  /**
   * Process refund for order
   * @param {string} orderId - Order ID
   * @param {Object} refundData - Refund details
   * @returns {Promise} Refund result
   */
  async processRefund(orderId, refundData) {
    try {
      const response = await apiClient.post(`${ORDER_API}${API_RESOURCES.ORDER.PRODUCT_ORDER}/${orderId}/refund`, {
        amount: refundData.amount,
        reason: refundData.reason,
        refundType: refundData.type || 'full',
        processedBy: 'admin',
        processedDate: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }

  /**
   * Cancel order
   * @param {string} orderId - Order ID
   * @param {Object} cancelData - Cancellation details
   * @returns {Promise} Cancelled order
   */
  async cancelOrder(orderId, cancelData) {
    try {
      const response = await apiClient.post(`${ORDER_API}${API_RESOURCES.ORDER.CANCEL_ORDER}`, {
        relatedProductOrder: { id: orderId },
        cancellationReason: cancelData.reason,
        requestedBy: cancelData.requestedBy || 'admin',
        effectiveCancellationDate: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  /**
   * Get order statistics
   * @returns {Promise} Order statistics
   */
  async getOrderStats() {
    try {
      const response = await apiClient.get(`${ORDER_API}/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order stats:', error);
      // Fallback stats
      return {
        totalOrders: 4567,
        pendingOrders: 234,
        completedOrders: 3890,
        cancelledOrders: 443,
        totalRevenue: 567890000,
        averageOrderValue: 124345,
        todayOrders: 87,
        weekGrowth: 12.5
      };
    }
  }

  /**
   * Get order disputes
   * @param {Object} params - Query parameters
   * @returns {Promise} Dispute list
   */
  async getDisputes(params = {}) {
    try {
      const response = await apiClient.get(`${ORDER_API}/disputes`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching disputes:', error);
      // Mock disputes
      return [
        {
          id: 'dispute_1',
          orderId: 'ORD001',
          type: 'Product not as described',
          status: 'open',
          createdAt: '2025-03-17T14:30:00Z',
          customerName: 'Kamal Perera',
          amount: 95000
        },
        {
          id: 'dispute_2',
          orderId: 'ORD005',
          type: 'Item not received',
          status: 'investigating',
          createdAt: '2025-03-16T09:15:00Z',
          customerName: 'Nimal Silva',
          amount: 45000
        },
        {
          id: 'dispute_3',
          orderId: 'ORD008',
          type: 'Damaged product',
          status: 'resolved',
          createdAt: '2025-03-15T11:45:00Z',
          customerName: 'Priya Fernando',
          amount: 32000
        }
      ];
    }
  }

  /**
   * Resolve dispute
   * @param {string} disputeId - Dispute ID
   * @param {Object} resolution - Resolution details
   * @returns {Promise} Resolution result
   */
  async resolveDispute(disputeId, resolution) {
    try {
      const response = await apiClient.patch(`${ORDER_API}/disputes/${disputeId}`, {
        status: 'resolved',
        resolution: resolution.resolution,
        resolvedBy: 'admin',
        resolvedDate: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  }

  getMockDisputes() {
    return {
      items: [
        {
          id: 'disp_1',
          orderId: 'ORD-2025-0225',
          customer: 'Anura Dissanayake',
          seller: 'Electronics Pro',
          reason: 'Product not as described',
          status: 'open',
          createdAt: '2025-03-16T14:30:00Z',
          amount: 45000
        },
        {
          id: 'disp_2',
          orderId: 'ORD-2025-0218',
          customer: 'Malini Fernando',
          seller: 'Fashion Hub',
          reason: 'Item not received',
          status: 'under_review',
          createdAt: '2025-03-15T10:15:00Z',
          amount: 12500
        }
      ],
      totalCount: 2
    };
  }

  getMockOrdersByDay() {
    return [
      { date: '2025-03-12', orders: 145, revenue: 5234000 },
      { date: '2025-03-13', orders: 168, revenue: 6123000 },
      { date: '2025-03-14', orders: 152, revenue: 5567000 },
      { date: '2025-03-15', orders: 189, revenue: 7234000 },
      { date: '2025-03-16', orders: 143, revenue: 4987000 },
      { date: '2025-03-17', orders: 176, revenue: 6543000 },
      { date: '2025-03-18', orders: 162, revenue: 5876000 }
    ];
  }

  getMockTopProducts() {
    return [
      { name: 'Samsung Galaxy S24', orders: 234, revenue: 22230000 },
      { name: 'Apple iPhone 15', orders: 189, revenue: 20790000 },
      { name: 'Dell XPS 15', orders: 87, revenue: 49290000 },
      { name: 'Sony WH-1000XM5', orders: 145, revenue: 12687500 },
      { name: 'Nike Air Max', orders: 267, revenue: 7609500 }
    ];
  }

  getMockRevenueByCategory() {
    return [
      { name: 'Electronics', value: 45678900 },
      { name: 'Fashion', value: 23456700 },
      { name: 'Home & Garden', value: 15678900 },
      { name: 'Sports', value: 12345600 },
      { name: 'Books', value: 8765400 }
    ];
  }
}

export default new OrderManagementService();
