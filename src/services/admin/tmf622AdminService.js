// TMF622 Product Ordering Management Admin Service
import { apiClient } from '../authService';

const API_BASE = '/tmf-api/productOrdering/v1';

class TMF622AdminService {
  // ============ PRODUCT ORDER ENDPOINTS ============
  /**
   * List all product orders
   * @param {Object} params - Query parameters
   * @returns {Promise} Product order list
   */
  async listProductOrders(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/productOrder`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching product orders:', error);
      throw error;
    }
  }

  /**
   * Get product order by ID
   * @param {string} orderId - Product order ID
   * @returns {Promise} Product order details
   */
  async getProductOrder(orderId) {
    try {
      const response = await apiClient.get(`${API_BASE}/productOrder/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product order:', error);
      throw error;
    }
  }

  /**
   * Create new product order
   * @param {Object} orderData - Product order data
   * @returns {Promise} Created product order
   */
  async createProductOrder(orderData) {
    try {
      const response = await apiClient.post(`${API_BASE}/productOrder`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating product order:', error);
      throw error;
    }
  }

  /**
   * Update product order
   * @param {string} orderId - Product order ID
   * @param {Object} orderData - Product order data to update
   * @returns {Promise} Updated product order
   */
  async updateProductOrder(orderId, orderData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/productOrder/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      console.error('Error updating product order:', error);
      throw error;
    }
  }

  /**
   * Delete product order
   * @param {string} orderId - Product order ID
   * @returns {Promise} Deletion result
   */
  async deleteProductOrder(orderId) {
    try {
      await apiClient.delete(`${API_BASE}/productOrder/${orderId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting product order:', error);
      throw error;
    }
  }

  // ============ CANCEL PRODUCT ORDER ENDPOINTS ============
  /**
   * List all cancel product order requests
   * @param {Object} params - Query parameters
   * @returns {Promise} Cancel order request list
   */
  async listCancelProductOrders(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/cancelProductOrder`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching cancel product orders:', error);
      throw error;
    }
  }

  /**
   * Get cancel product order request by ID
   * @param {string} cancelId - Cancel order ID
   * @returns {Promise} Cancel order request details
   */
  async getCancelProductOrder(cancelId) {
    try {
      const response = await apiClient.get(`${API_BASE}/cancelProductOrder/${cancelId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cancel product order:', error);
      throw error;
    }
  }

  /**
   * Create cancel product order request
   * @param {Object} cancelData - Cancel order request data
   * @returns {Promise} Created cancel order request
   */
  async createCancelProductOrder(cancelData) {
    try {
      const response = await apiClient.post(`${API_BASE}/cancelProductOrder`, cancelData);
      return response.data;
    } catch (error) {
      console.error('Error creating cancel product order:', error);
      throw error;
    }
  }

  // ============ HUB ENDPOINTS ============
  /**
   * Register hub for product order notifications
   * @param {Object} hubData - Hub registration data
   * @returns {Promise} Registration result
   */
  async registerHub(hubData) {
    try {
      const response = await apiClient.post(`${API_BASE}/hub`, hubData);
      return response.data;
    } catch (error) {
      console.error('Error registering hub:', error);
      throw error;
    }
  }

  /**
   * Unregister hub
   * @param {string} hubId - Hub ID
   * @returns {Promise} Unregistration result
   */
  async unregisterHub(hubId) {
    try {
      await apiClient.delete(`${API_BASE}/hub/${hubId}`);
      return { success: true };
    } catch (error) {
      console.error('Error unregistering hub:', error);
      throw error;
    }
  }

  /**
   * Update hub
   * @param {string} hubId - Hub ID
   * @param {Object} hubData - Hub data to update
   * @returns {Promise} Updated hub
   */
  async updateHub(hubId, hubData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/hub/${hubId}`, hubData);
      return response.data;
    } catch (error) {
      console.error('Error updating hub:', error);
      throw error;
    }
  }

  // ============ ORDER STATISTICS & REPORTING ============
  /**
   * Get order statistics
   * @param {Object} params - Query parameters (dateFrom, dateTo, etc.)
   * @returns {Promise} Order statistics
   */
  async getOrderStatistics(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/productOrder/statistics`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching order statistics:', error);
      // Return mock data for development
      return {
        totalOrders: 1234,
        pendingOrders: 56,
        completedOrders: 1089,
        cancelledOrders: 89,
        totalRevenue: 45678900,
        averageOrderValue: 37058,
        ordersByStatus: {
          acknowledged: 12,
          inProgress: 44,
          pending: 56,
          held: 8,
          cancelled: 89,
          completed: 1089,
          failed: 3,
          partial: 15
        },
        topProducts: [
          { id: 'prod_1', name: 'Samsung Galaxy S24', orderCount: 234 },
          { id: 'prod_2', name: 'Apple iPhone 15', orderCount: 189 },
          { id: 'prod_3', name: 'Sony WH-1000XM5', orderCount: 156 }
        ]
      };
    }
  }

  /**
   * Bulk update orders
   * @param {Array} orderIds - Array of order IDs
   * @param {Object} updates - Update data
   * @returns {Promise} Bulk update result
   */
  async bulkUpdateOrders(orderIds, updates) {
    try {
      const response = await apiClient.post(`${API_BASE}/productOrder/bulk`, {
        orderIds,
        updates
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating orders:', error);
      throw error;
    }
  }

  /**
   * Export orders to file
   * @param {Object} params - Export parameters
   * @returns {Promise} Export job details
   */
  async exportOrders(params = {}) {
    try {
      const response = await apiClient.post(`${API_BASE}/productOrder/export`, params);
      return response.data;
    } catch (error) {
      console.error('Error exporting orders:', error);
      throw error;
    }
  }

  /**
   * Get order audit trail
   * @param {string} orderId - Order ID
   * @returns {Promise} Order audit trail
   */
  async getOrderAuditTrail(orderId) {
    try {
      const response = await apiClient.get(`${API_BASE}/productOrder/${orderId}/audit`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order audit trail:', error);
      throw error;
    }
  }
}

export default new TMF622AdminService();
