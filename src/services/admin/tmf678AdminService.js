// TMF678 Customer Bill Management Admin Service
import { apiClient } from '../authService';

const API_BASE = '/tmf-api/customerBill/v5';

class TMF678AdminService {
  // ============ BILL CYCLE ENDPOINTS ============
  /**
   * List all bill cycles
   * @param {Object} params - Query parameters
   * @returns {Promise} Bill cycle list
   */
  async listBillCycles(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/billCycle`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching bill cycles:', error);
      throw error;
    }
  }

  /**
   * Get bill cycle by ID
   * @param {string} cycleId - Bill cycle ID
   * @returns {Promise} Bill cycle details
   */
  async getBillCycle(cycleId) {
    try {
      const response = await apiClient.get(`${API_BASE}/billCycle/${cycleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill cycle:', error);
      throw error;
    }
  }

  // ============ CUSTOMER BILL ENDPOINTS ============
  /**
   * List all customer bills
   * @param {Object} params - Query parameters
   * @returns {Promise} Customer bill list
   */
  async listCustomerBills(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/customerBill`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer bills:', error);
      throw error;
    }
  }

  /**
   * Get customer bill by ID
   * @param {string} billId - Customer bill ID
   * @returns {Promise} Customer bill details
   */
  async getCustomerBill(billId) {
    try {
      const response = await apiClient.get(`${API_BASE}/customerBill/${billId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer bill:', error);
      throw error;
    }
  }

  /**
   * Create new customer bill
   * @param {Object} billData - Customer bill data
   * @returns {Promise} Created customer bill
   */
  async createCustomerBill(billData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill`, billData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer bill:', error);
      throw error;
    }
  }

  // ============ CUSTOMER BILL ON DEMAND ENDPOINTS ============
  /**
   * List all customer bills on demand
   * @param {Object} params - Query parameters
   * @returns {Promise} Customer bill on demand list
   */
  async listCustomerBillsOnDemand(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/customerBillOnDemand`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer bills on demand:', error);
      throw error;
    }
  }

  /**
   * Get customer bill on demand by ID
   * @param {string} billOnDemandId - Customer bill on demand ID
   * @returns {Promise} Customer bill on demand details
   */
  async getCustomerBillOnDemand(billOnDemandId) {
    try {
      const response = await apiClient.get(`${API_BASE}/customerBillOnDemand/${billOnDemandId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer bill on demand:', error);
      throw error;
    }
  }

  /**
   * Create customer bill on demand
   * @param {Object} billOnDemandData - Customer bill on demand data
   * @returns {Promise} Created customer bill on demand
   */
  async createCustomerBillOnDemand(billOnDemandData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBillOnDemand`, billOnDemandData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer bill on demand:', error);
      throw error;
    }
  }

  // ============ APPLIED CUSTOMER BILLING RATE ENDPOINTS ============
  /**
   * Get applied customer billing rate by ID
   * @param {string} rateId - Applied customer billing rate ID
   * @returns {Promise} Applied customer billing rate details
   */
  async getAppliedCustomerBillingRate(rateId) {
    try {
      const response = await apiClient.get(`${API_BASE}/appliedCustomerBillingRate/${rateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applied customer billing rate:', error);
      throw error;
    }
  }

  // ============ BILLING ANALYTICS & REPORTING ============
  /**
   * Get billing statistics
   * @param {Object} params - Query parameters (dateFrom, dateTo, etc.)
   * @returns {Promise} Billing statistics
   */
  async getBillingStatistics(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/customerBill/statistics`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching billing statistics:', error);
      // Return mock data for development
      return {
        totalBills: 3456,
        totalRevenue: 89234567,
        pendingPayments: 456789,
        overduePayments: 234567,
        averageBillAmount: 25826,
        billsByStatus: {
          paid: 2890,
          pending: 345,
          overdue: 123,
          cancelled: 98
        },
        billsByCycle: {
          monthly: 2345,
          quarterly: 789,
          annual: 322
        },
        paymentMethods: {
          creditCard: 1567,
          bankTransfer: 890,
          digitalWallet: 567,
          cash: 432
        },
        topDebtors: [
          { id: 'cust_1', name: 'ABC Corporation', amount: 456789, daysOverdue: 45 },
          { id: 'cust_2', name: 'XYZ Ltd', amount: 234567, daysOverdue: 30 },
          { id: 'cust_3', name: 'Tech Solutions', amount: 123456, daysOverdue: 15 }
        ],
        collectionRate: 94.5,
        averageDaysToPay: 12
      };
    }
  }

  /**
   * Search customer bills
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} Search results
   */
  async searchCustomerBills(searchParams) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill/search`, searchParams);
      return response.data;
    } catch (error) {
      console.error('Error searching customer bills:', error);
      throw error;
    }
  }

  /**
   * Bulk update bills
   * @param {Array} billIds - Array of bill IDs
   * @param {Object} updates - Update data
   * @returns {Promise} Bulk update result
   */
  async bulkUpdateBills(billIds, updates) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill/bulk`, {
        billIds,
        updates
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating bills:', error);
      throw error;
    }
  }

  /**
   * Export bills to file
   * @param {Object} params - Export parameters
   * @returns {Promise} Export job details
   */
  async exportBills(params = {}) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill/export`, params);
      return response.data;
    } catch (error) {
      console.error('Error exporting bills:', error);
      throw error;
    }
  }

  /**
   * Generate billing report
   * @param {Object} reportParams - Report parameters
   * @returns {Promise} Report data
   */
  async generateBillingReport(reportParams) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill/report`, reportParams);
      return response.data;
    } catch (error) {
      console.error('Error generating billing report:', error);
      throw error;
    }
  }

  /**
   * Get payment history for a customer
   * @param {string} customerId - Customer ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Payment history
   */
  async getCustomerPaymentHistory(customerId, params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/customer/${customerId}/paymentHistory`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  /**
   * Apply discount to bill
   * @param {string} billId - Bill ID
   * @param {Object} discountData - Discount details
   * @returns {Promise} Updated bill
   */
  async applyDiscount(billId, discountData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill/${billId}/discount`, discountData);
      return response.data;
    } catch (error) {
      console.error('Error applying discount:', error);
      throw error;
    }
  }

  /**
   * Send payment reminder
   * @param {string} billId - Bill ID
   * @param {Object} reminderData - Reminder details
   * @returns {Promise} Reminder result
   */
  async sendPaymentReminder(billId, reminderData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill/${billId}/reminder`, reminderData);
      return response.data;
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      throw error;
    }
  }

  /**
   * Mark bill as paid
   * @param {string} billId - Bill ID
   * @param {Object} paymentData - Payment details
   * @returns {Promise} Updated bill
   */
  async markBillAsPaid(billId, paymentData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill/${billId}/payment`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      throw error;
    }
  }

  /**
   * Cancel bill
   * @param {string} billId - Bill ID
   * @param {Object} cancellationData - Cancellation reason and details
   * @returns {Promise} Cancelled bill
   */
  async cancelBill(billId, cancellationData) {
    try {
      const response = await apiClient.post(`${API_BASE}/customerBill/${billId}/cancel`, cancellationData);
      return response.data;
    } catch (error) {
      console.error('Error cancelling bill:', error);
      throw error;
    }
  }

  /**
   * Get billing cycle configuration
   * @returns {Promise} Billing cycle configuration
   */
  async getBillingCycleConfig() {
    try {
      const response = await apiClient.get(`${API_BASE}/billCycle/config`);
      return response.data;
    } catch (error) {
      console.error('Error fetching billing cycle config:', error);
      // Return mock data for development
      return {
        cycles: [
          { id: 'monthly', name: 'Monthly', dayOfMonth: 1, enabled: true },
          { id: 'quarterly', name: 'Quarterly', months: [1, 4, 7, 10], dayOfMonth: 1, enabled: true },
          { id: 'annual', name: 'Annual', month: 1, dayOfMonth: 1, enabled: true }
        ],
        defaultCycle: 'monthly',
        gracePeriodDays: 7,
        lateFeePercentage: 2.5
      };
    }
  }

  /**
   * Update billing cycle configuration
   * @param {Object} configData - Configuration data
   * @returns {Promise} Updated configuration
   */
  async updateBillingCycleConfig(configData) {
    try {
      const response = await apiClient.put(`${API_BASE}/billCycle/config`, configData);
      return response.data;
    } catch (error) {
      console.error('Error updating billing cycle config:', error);
      throw error;
    }
  }
}

export default new TMF678AdminService();
