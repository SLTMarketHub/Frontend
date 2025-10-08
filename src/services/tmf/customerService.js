// TMF629 Customer API Service
import { apiClient } from '../authService';
import { mockCustomers } from '../../utils/mockData';

const CUSTOMER_API = '/tmf-api/customer/v5';

class CustomerService {
  // List all customers
  async listCustomers(params = {}) {
    try {
      const response = await apiClient.get(`${CUSTOMER_API}/customer`, { params });
      return {
        items: response.data,
        total: response.data.length
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Fallback to mock data if API fails
      let customers = [...mockCustomers];
      
      // Apply filters
      if (params.status) {
        customers = customers.filter(c => c.status === params.status);
      }
      if (params.role) {
        customers = customers.filter(c => c.role === params.role);
      }
      if (params.searchTerm) {
        const term = params.searchTerm.toLowerCase();
        customers = customers.filter(c => 
          c.name?.toLowerCase().includes(term) || 
          c.email?.toLowerCase().includes(term)
        );
      }
      
      return {
        items: customers,
        total: customers.length
      };
    }
  }

  /**
   * Get customer by ID
   * @param {string} customerId - Customer ID
   * @returns {Promise} Customer details
   */
  async getCustomer(customerId) {
    try {
      const response = await apiClient.get(`${CUSTOMER_API}/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      // Fallback to mock data
      const customer = mockCustomers.find(c => c.id === customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }
      return customer;
    }
  }

  /**
   * Update customer
   * @param {string} customerId - Customer ID
   * @param {Object} updates - Update data
   * @returns {Promise} Updated customer
   */
  async updateCustomer(customerId, updates) {
    try {
      const response = await apiClient.patch(`${CUSTOMER_API}/customer/${customerId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      // Fallback
      return {
        ...updates,
        id: customerId,
        updatedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Suspend/Activate customer account
   * @param {string} customerId - Customer ID
   * @param {string} status - New status
   * @returns {Promise} Updated customer
   */
  async updateCustomerStatus(customerId, status) {
    return this.updateCustomer(customerId, { status });
  }

  /**
   * Get customer statistics
   * @returns {Promise} Customer statistics
   */
  async getCustomerStats() {
    try {
      const response = await apiClient.get(`${CUSTOMER_API}/customer/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer stats:', error);
      return {
        totalCustomers: 1248,
        activeCustomers: 1156,
        suspendedCustomers: 92,
        newThisMonth: 87,
        growth: 12.5
      };
    }
  }

  /**
   * Get customer activity history
   * @param {string} customerId - Customer ID
   * @returns {Promise} Activity history
   */
  async getCustomerActivity(customerId) {
    try {
      const response = await apiClient.get(`${CUSTOMER_API}/customer/${customerId}/activity`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer activity:', error);
      return [];
    }
  }

  // Mock data methods for development
  getMockCustomer(customerId) {
    return {
      id: customerId,
      name: 'Kamal Perera',
      email: 'kamal.p@email.com',
      phone: '+94771234567',
      status: 'active',
      role: 'customer',
      totalOrders: 24,
      totalSpent: 345000,
      joinedDate: '2024-01-15',
      lastActivity: '2025-03-18T10:30:00Z',
      address: {
        street: '123 Galle Road',
        city: 'Colombo',
        postalCode: '00300',
        country: 'Sri Lanka'
      },
      preferences: {
        newsletter: true,
        smsNotifications: false,
        language: 'en'
      }
    };
  }
}

export default new CustomerService();
