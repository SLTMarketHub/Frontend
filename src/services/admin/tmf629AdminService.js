// TMF629 Customer Management Admin Service
import { apiClient } from '../authService';

const API_BASE = '/tmf-api/customer/v5';

class TMF629AdminService {
  // ============ CUSTOMER ENDPOINTS ============
  /**
   * List all customers
   * @param {Object} params - Query parameters
   * @returns {Promise} Customer list
   */
  async listCustomers(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/customer`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  /**
   * Get customer by ID
   * @param {string} customerId - Customer ID
   * @returns {Promise} Customer details
   */
  async getCustomer(customerId) {
    try {
      const response = await apiClient.get(`${API_BASE}/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  /**
   * Create new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise} Created customer
   */
  async createCustomer(customerData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customer`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Update customer
   * @param {string} customerId - Customer ID
   * @param {Object} customerData - Customer data to update
   * @returns {Promise} Updated customer
   */
  async updateCustomer(customerId, customerData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/customer/${customerId}`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  /**
   * Delete customer
   * @param {string} customerId - Customer ID
   * @returns {Promise} Deletion result
   */
  async deleteCustomer(customerId) {
    try {
      await apiClient.delete(`${API_BASE}/customer/${customerId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  // ============ HUB ENDPOINTS ============
  /**
   * Register hub for customer notifications
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

  // ============ CUSTOMER ANALYTICS & REPORTING ============
  /**
   * Get customer statistics
   * @param {Object} params - Query parameters
   * @returns {Promise} Customer statistics
   */
  async getCustomerStatistics(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/customer/statistics`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer statistics:', error);
      // Return mock data for development
      return {
        totalCustomers: 5678,
        activeCustomers: 4523,
        newCustomersThisMonth: 234,
        customersByStatus: {
          active: 4523,
          inactive: 890,
          suspended: 145,
          pending: 120
        },
        customersByType: {
          individual: 4890,
          business: 788
        },
        topCustomers: [
          { id: 'cust_1', name: 'John Doe', totalPurchases: 450000 },
          { id: 'cust_2', name: 'ABC Corp', totalPurchases: 890000 },
          { id: 'cust_3', name: 'Jane Smith', totalPurchases: 234000 }
        ],
        averageLifetimeValue: 125600,
        churnRate: 2.3,
        retentionRate: 97.7
      };
    }
  }

  /**
   * Search customers
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} Search results
   */
  async searchCustomers(searchParams) {
    try {
      const response = await apiClient.post(`${API_BASE}/customer/search`, searchParams);
      return response.data;
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  /**
   * Bulk update customers
   * @param {Array} customerIds - Array of customer IDs
   * @param {Object} updates - Update data
   * @returns {Promise} Bulk update result
   */
  async bulkUpdateCustomers(customerIds, updates) {
    try {
      const response = await apiClient.post(`${API_BASE}/customer/bulk`, {
        customerIds,
        updates
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating customers:', error);
      throw error;
    }
  }

  /**
   * Export customers to file
   * @param {Object} params - Export parameters
   * @returns {Promise} Export job details
   */
  async exportCustomers(params = {}) {
    try {
      const response = await apiClient.post(`${API_BASE}/customer/export`, params);
      return response.data;
    } catch (error) {
      console.error('Error exporting customers:', error);
      throw error;
    }
  }

  /**
   * Import customers from file
   * @param {FormData} formData - Form data containing file
   * @returns {Promise} Import job details
   */
  async importCustomers(formData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customer/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error importing customers:', error);
      throw error;
    }
  }

  /**
   * Get customer audit trail
   * @param {string} customerId - Customer ID
   * @returns {Promise} Customer audit trail
   */
  async getCustomerAuditTrail(customerId) {
    try {
      const response = await apiClient.get(`${API_BASE}/customer/${customerId}/audit`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer audit trail:', error);
      throw error;
    }
  }

  /**
   * Merge duplicate customers
   * @param {Object} mergeData - Merge parameters (primaryId, duplicateIds)
   * @returns {Promise} Merge result
   */
  async mergeCustomers(mergeData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customer/merge`, mergeData);
      return response.data;
    } catch (error) {
      console.error('Error merging customers:', error);
      throw error;
    }
  }

  /**
   * Validate customer data
   * @param {Object} customerData - Customer data to validate
   * @returns {Promise} Validation result
   */
  async validateCustomer(customerData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customer/validate`, customerData);
      return response.data;
    } catch (error) {
      console.error('Error validating customer:', error);
      throw error;
    }
  }

  /**
   * Get customer segments
   * @returns {Promise} Customer segments
   */
  async getCustomerSegments() {
    try {
      const response = await apiClient.get(`${API_BASE}/customer/segments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer segments:', error);
      // Return mock data for development
      return {
        segments: [
          { id: 'seg_1', name: 'VIP Customers', count: 234, criteria: 'totalPurchases > 500000' },
          { id: 'seg_2', name: 'New Customers', count: 567, criteria: 'createdDate < 30 days' },
          { id: 'seg_3', name: 'Inactive Customers', count: 890, criteria: 'lastPurchase > 90 days' },
          { id: 'seg_4', name: 'High Risk', count: 123, criteria: 'paymentIssues > 2' }
        ]
      };
    }
  }
}

export default new TMF629AdminService();
