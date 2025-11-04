// TMF678 - Customer Bill API
import { apiClient, BASE_URL } from '../authService';

class CustomerBillService {
  /**
   * Get all bill cycles
   * @param {Object} params - Query parameters
   * @returns {Promise} Bill cycles list
   */
  async getBillCycles(params = {}) {
    try {
      const response = await apiClient.get('/tmf-api/customerBill/v5/billCycle', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching bill cycles:', error);
      return this.getMockBillCycles();
    }
  }

  /**
   * Get specific bill cycle
   * @param {string} billCycleId - Bill cycle ID
   * @returns {Promise} Bill cycle details
   */
  async getBillCycle(billCycleId) {
    try {
      const response = await apiClient.get(`/tmf-api/customerBill/v5/billCycle/${billCycleId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bill cycle:', error);
      throw error;
    }
  }

  /**
   * Get all customer bills
   * @param {Object} params - Query parameters
   * @returns {Promise} Customer bills list
   */
  async getCustomerBills(params = {}) {
    try {
      const response = await apiClient.get('/tmf-api/customerBill/v5/customerBill', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching customer bills:', error);
      return this.getMockCustomerBills();
    }
  }

  /**
   * Get specific customer bill
   * @param {string} billId - Bill ID
   * @returns {Promise} Bill details
   */
  async getCustomerBill(billId) {
    try {
      const response = await apiClient.get(`/tmf-api/customerBill/v5/customerBill/${billId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer bill:', error);
      throw error;
    }
  }

  /**
   * Create new customer bill
   * @param {Object} billData - Bill data
   * @returns {Promise} Created bill
   */
  async createCustomerBill(billData) {
    try {
      const response = await apiClient.post('/tmf-api/customerBill/v5/customerBill', billData);
      return response.data;
    } catch (error) {
      console.error('Error creating customer bill:', error);
      throw error;
    }
  }

  /**
   * Get customer bills on demand
   * @param {Object} params - Query parameters
   * @returns {Promise} On-demand bills list
   */
  async getCustomerBillsOnDemand(params = {}) {
    try {
      const response = await apiClient.get('/tmf-api/customerBill/v5/customerBillOnDemand', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching on-demand bills:', error);
      return this.getMockOnDemandBills();
    }
  }

  /**
   * Get specific on-demand bill
   * @param {string} onDemandBillId - On-demand bill ID
   * @returns {Promise} On-demand bill details
   */
  async getCustomerBillOnDemand(onDemandBillId) {
    try {
      const response = await apiClient.get(`/tmf-api/customerBill/v5/customerBillOnDemand/${onDemandBillId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching on-demand bill:', error);
      throw error;
    }
  }

  /**
   * Create on-demand bill
   * @param {Object} onDemandBillData - On-demand bill data
   * @returns {Promise} Created on-demand bill
   */
  async createCustomerBillOnDemand(onDemandBillData) {
    try {
      const response = await apiClient.post('/tmf-api/customerBill/v5/customerBillOnDemand', onDemandBillData);
      return response.data;
    } catch (error) {
      console.error('Error creating on-demand bill:', error);
      throw error;
    }
  }

  /**
   * Get applied customer billing rate
   * @param {string} rateId - Billing rate ID
   * @returns {Promise} Billing rate details
   */
  async getAppliedCustomerBillingRate(rateId) {
    try {
      const response = await apiClient.get(`/tmf-api/customerBill/v5/appliedCustomerBillingRate/${rateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching billing rate:', error);
      throw error;
    }
  }

  /**
   * Get billing statistics for a customer
   * @param {string} customerId - Customer ID
   * @param {Object} params - Query parameters (period, etc.)
   * @returns {Promise} Billing statistics
   */
  async getCustomerBillingStats(customerId, params = {}) {
    try {
      const response = await apiClient.get(`/tmf-api/customerBill/v5/customerBill/statistics/${customerId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching billing statistics:', error);
      return this.getMockBillingStats();
    }
  }

  /**
   * Generate bill PDF
   * @param {string} billId - Bill ID
   * @returns {Promise} PDF download URL
   */
  async generateBillPDF(billId) {
    try {
      const response = await apiClient.get(`/tmf-api/customerBill/v5/customerBill/${billId}/pdf`, {
        responseType: 'blob'
      });
      
      // Create blob URL for download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      return url;
    } catch (error) {
      console.error('Error generating bill PDF:', error);
      throw error;
    }
  }

  /**
   * Send bill to customer
   * @param {string} billId - Bill ID
   * @param {Object} sendOptions - Sending options (email, method, etc.)
   * @returns {Promise} Send result
   */
  async sendBillToCustomer(billId, sendOptions) {
    try {
      const response = await apiClient.post(`/tmf-api/customerBill/v5/customerBill/${billId}/send`, sendOptions);
      return response.data;
    } catch (error) {
      console.error('Error sending bill:', error);
      throw error;
    }
  }

  /**
   * Mark bill as paid
   * @param {string} billId - Bill ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise} Updated bill
   */
  async markBillAsPaid(billId, paymentData) {
    try {
      const response = await apiClient.patch(`/tmf-api/customerBill/v5/customerBill/${billId}`, {
        billPaymentStatus: 'paid',
        paymentMethod: paymentData.method,
        paymentDate: paymentData.date || new Date().toISOString(),
        paymentAmount: paymentData.amount,
        paymentReference: paymentData.reference
      });
      return response.data;
    } catch (error) {
      console.error('Error marking bill as paid:', error);
      throw error;
    }
  }

  // Mock data methods for development
  getMockBillCycles() {
    return {
      items: [
        {
          id: 'bc_1',
          name: 'Monthly Billing - January 2025',
          billCycleType: 'monthly',
          startDate: '2025-01-01T00:00:00Z',
          endDate: '2025-01-31T23:59:59Z',
          status: 'completed',
          totalBills: 234,
          totalAmount: 450000.00
        },
        {
          id: 'bc_2',
          name: 'Monthly Billing - February 2025',
          billCycleType: 'monthly',
          startDate: '2025-02-01T00:00:00Z',
          endDate: '2025-02-28T23:59:59Z',
          status: 'completed',
          totalBills: 256,
          totalAmount: 489000.00
        },
        {
          id: 'bc_3',
          name: 'Monthly Billing - March 2025',
          billCycleType: 'monthly',
          startDate: '2025-03-01T00:00:00Z',
          endDate: '2025-03-31T23:59:59Z',
          status: 'in_progress',
          totalBills: 189,
          totalAmount: 367000.00
        }
      ],
      totalCount: 3
    };
  }

  getMockCustomerBills() {
    return {
      items: [
        {
          id: 'bill_1',
          billNo: 'INV-2025-0234',
          customer: {
            id: 'cust_123',
            name: 'John Doe',
            email: 'john.doe@example.com'
          },
          billDate: '2025-03-01T00:00:00Z',
          dueDate: '2025-03-15T23:59:59Z',
          billPeriod: {
            startDate: '2025-02-01T00:00:00Z',
            endDate: '2025-02-28T23:59:59Z'
          },
          amountDue: 5600.00,
          taxAmount: 800.00,
          totalAmount: 6400.00,
          billPaymentStatus: 'unpaid',
          currency: 'LKR'
        },
        {
          id: 'bill_2',
          billNo: 'INV-2025-0235',
          customer: {
            id: 'cust_124',
            name: 'Jane Smith',
            email: 'jane.smith@example.com'
          },
          billDate: '2025-03-01T00:00:00Z',
          dueDate: '2025-03-15T23:59:59Z',
          billPeriod: {
            startDate: '2025-02-01T00:00:00Z',
            endDate: '2025-02-28T23:59:59Z'
          },
          amountDue: 12300.00,
          taxAmount: 1750.00,
          totalAmount: 14050.00,
          billPaymentStatus: 'paid',
          paymentDate: '2025-03-05T10:30:00Z',
          currency: 'LKR'
        },
        {
          id: 'bill_3',
          billNo: 'INV-2025-0236',
          customer: {
            id: 'cust_125',
            name: 'ABC Company',
            email: 'billing@abccompany.com'
          },
          billDate: '2025-03-01T00:00:00Z',
          dueDate: '2025-03-15T23:59:59Z',
          billPeriod: {
            startDate: '2025-02-01T00:00:00Z',
            endDate: '2025-02-28T23:59:59Z'
          },
          amountDue: 45000.00,
          taxAmount: 6400.00,
          totalAmount: 51400.00,
          billPaymentStatus: 'overdue',
          currency: 'LKR'
        }
      ],
      totalCount: 3
    };
  }

  getMockOnDemandBills() {
    return {
      items: [
        {
          id: 'odb_1',
          requestDate: '2025-03-18T14:30:00Z',
          customer: {
            id: 'cust_126',
            name: 'David Wilson'
          },
          reason: 'Customer request for tax purposes',
          status: 'completed',
          generatedBillId: 'bill_special_1'
        },
        {
          id: 'odb_2',
          requestDate: '2025-03-17T10:15:00Z',
          customer: {
            id: 'cust_127',
            name: 'Sarah Johnson'
          },
          reason: 'Account reconciliation',
          status: 'processing'
        }
      ],
      totalCount: 2
    };
  }

  getMockBillingStats() {
    return {
      customerId: 'cust_123',
      period: 'last_12_months',
      totalBilled: 156000.00,
      totalPaid: 145000.00,
      outstandingAmount: 11000.00,
      averageMonthlyBill: 13000.00,
      paymentHistory: {
        onTime: 10,
        late: 1,
        pending: 1
      },
      monthlyTrend: [
        { month: 'Jan', amount: 12500 },
        { month: 'Feb', amount: 13200 },
        { month: 'Mar', amount: 11800 },
        { month: 'Apr', amount: 14500 },
        { month: 'May', amount: 13000 },
        { month: 'Jun', amount: 12700 }
      ]
    };
  }
}

export default new CustomerBillService();
