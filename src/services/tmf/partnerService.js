// TMF641 - Partner Management (Seller Management)
import { apiClient, BASE_URL } from '../authService';

class PartnerManagementService {
  /**
   * List all sellers/partners with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} Seller list response
   */
  async listSellers(params = {}) {
    const {
      limit = 20,
      offset = 0,
      status,
      category,
      searchTerm,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      performanceLevel
    } = params;

    const queryParams = new URLSearchParams({
      limit,
      offset,
      ...(status && { 'lifecycleStatus': status }),
      ...(category && { 'businessType': category }),
      ...(searchTerm && { 'name': searchTerm }),
      ...(performanceLevel && { 'characteristic.name': 'performanceLevel', 'characteristic.value': performanceLevel }),
      'sort': `${sortOrder === 'asc' ? '+' : '-'}${sortBy}`
    });

    try {
      const response = await apiClient.get(`/tmf-api/partnershipManagement/v4/organization?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sellers:', error);
      return this.getMockSellers(params);
    }
  }

  /**
   * Get seller by ID with detailed information
   * @param {string} sellerId - Seller ID
   * @returns {Promise} Seller details
   */
  async getSeller(sellerId) {
    try {
      const response = await apiClient.get(`/tmf-api/partnershipManagement/v4/organization/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller:', error);
      return this.getMockSeller(sellerId);
    }
  }

  /**
   * Get seller performance metrics
   * @param {string} sellerId - Seller ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Performance metrics
   */
  async getSellerPerformance(sellerId, params = {}) {
    const { period = 'month' } = params;
    
    try {
      const response = await apiClient.get(`/tmf-api/partnershipManagement/v4/organization/${sellerId}/performance?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller performance:', error);
      return this.getMockSellerPerformance(sellerId);
    }
  }

  /**
   * Approve seller registration
   * @param {string} sellerId - Seller ID
   * @param {Object} approvalData - Approval details
   * @returns {Promise} Updated seller
   */
  async approveSeller(sellerId, approvalData = {}) {
    try {
      const response = await apiClient.patch(`/tmf-api/partnershipManagement/v4/organization/${sellerId}`, {
        lifecycleStatus: 'active',
        approvedDate: new Date().toISOString(),
        approvedBy: 'admin',
        commissionRate: approvalData.commissionRate || 10,
        characteristic: [
          {
            name: 'approvalNotes',
            value: approvalData.notes
          }
        ]
      });
      return response.data;
    } catch (error) {
      console.error('Error approving seller:', error);
      throw error;
    }
  }

  /**
   * Reject seller registration
   * @param {string} sellerId - Seller ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} Updated seller
   */
  async rejectSeller(sellerId, reason) {
    try {
      const response = await apiClient.patch(`/tmf-api/partnershipManagement/v4/organization/${sellerId}`, {
        lifecycleStatus: 'rejected',
        rejectedDate: new Date().toISOString(),
        rejectedBy: 'admin',
        characteristic: [
          {
            name: 'rejectionReason',
            value: reason
          }
        ]
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting seller:', error);
      throw error;
    }
  }

  /**
   * Update seller commission rate
   * @param {string} sellerId - Seller ID
   * @param {number} commissionRate - New commission rate
   * @returns {Promise} Updated seller
   */
  async updateCommissionRate(sellerId, commissionRate) {
    try {
      const response = await apiClient.patch(`/tmf-api/partnershipManagement/v4/organization/${sellerId}`, {
        characteristic: [
          {
            name: 'commissionRate',
            value: commissionRate
          }
        ]
      });
      return response.data;
    } catch (error) {
      console.error('Error updating commission rate:', error);
      throw error;
    }
  }

  /**
   * Suspend or reactivate seller
   * @param {string} sellerId - Seller ID
   * @param {string} action - 'suspend' or 'reactivate'
   * @param {string} reason - Reason for action
   * @returns {Promise} Updated seller
   */
  async updateSellerStatus(sellerId, action, reason) {
    try {
      const status = action === 'suspend' ? 'suspended' : 'active';
      const response = await apiClient.patch(`/tmf-api/partnershipManagement/v4/organization/${sellerId}`, {
        lifecycleStatus: status,
        statusChangeDate: new Date().toISOString(),
        characteristic: [
          {
            name: 'statusChangeReason',
            value: reason
          }
        ]
      });
      return response.data;
    } catch (error) {
      console.error('Error updating seller status:', error);
      throw error;
    }
  }

  /**
   * Get seller statistics
   * @returns {Promise} Seller statistics
   */
  async getSellerStats() {
    try {
      const response = await apiClient.get('/tmf-api/partnershipManagement/v4/organization/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching seller stats:', error);
      return {
        totalSellers: 324,
        activeSellers: 298,
        pendingApproval: 18,
        suspendedSellers: 8,
        topPerformers: 45,
        averageRating: 4.3,
        totalRevenue: 458750000,
        totalCommission: 45875000
      };
    }
  }

  /**
   * Get seller documents
   * @param {string} sellerId - Seller ID
   * @returns {Promise} Document list
   */
  async getSellerDocuments(sellerId) {
    try {
      const response = await apiClient.get(`/tmf-api/partnershipManagement/v4/organization/${sellerId}/attachments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller documents:', error);
      return [
        {
          id: 'doc_1',
          name: 'Business Registration',
          type: 'pdf',
          status: 'verified',
          uploadedAt: '2025-03-01T10:00:00Z'
        },
        {
          id: 'doc_2',
          name: 'Tax Certificate',
          type: 'pdf',
          status: 'verified',
          uploadedAt: '2025-03-01T10:05:00Z'
        },
        {
          id: 'doc_3',
          name: 'Bank Details',
          type: 'pdf',
          status: 'pending',
          uploadedAt: '2025-03-15T14:30:00Z'
        }
      ];
    }
  }

  // Mock data methods for development
  getMockSellers(params) {
    const mockSellers = [
      {
        id: 'seller_1',
        name: 'Tech Store LK',
        email: 'contact@techstore.lk',
        phone: '+94112345678',
        category: 'Electronics',
        status: 'active',
        rating: 4.8,
        products: 156,
        orders: 1234,
        revenue: 8750000,
        commission: 875000,
        joinedDate: '2023-11-20',
        performanceLevel: 'excellent'
      },
      {
        id: 'seller_2',
        name: 'Fashion Hub',
        email: 'info@fashionhub.lk',
        phone: '+94113456789',
        category: 'Fashion',
        status: 'active',
        rating: 4.5,
        products: 289,
        orders: 2145,
        revenue: 12500000,
        commission: 1250000,
        joinedDate: '2023-09-05',
        performanceLevel: 'good'
      },
      {
        id: 'seller_3',
        name: 'Electronics Pro',
        email: 'sales@electronicspro.lk',
        phone: '+94114567890',
        category: 'Electronics',
        status: 'pending',
        rating: 0,
        products: 0,
        orders: 0,
        revenue: 0,
        commission: 0,
        joinedDate: '2025-03-15',
        documents: 'complete'
      },
      {
        id: 'seller_4',
        name: 'Home Essentials',
        email: 'info@homeessentials.lk',
        phone: '+94115678901',
        category: 'Home & Garden',
        status: 'active',
        rating: 4.2,
        products: 198,
        orders: 876,
        revenue: 6750000,
        commission: 675000,
        joinedDate: '2024-01-08',
        performanceLevel: 'average'
      },
      {
        id: 'seller_5',
        name: 'Books & More',
        email: 'contact@booksmore.lk',
        phone: '+94116789012',
        category: 'Books',
        status: 'suspended',
        rating: 3.8,
        products: 456,
        orders: 234,
        revenue: 2340000,
        commission: 234000,
        joinedDate: '2024-02-15',
        suspendReason: 'Policy violations'
      }
    ];

    // Apply filters
    let filtered = [...mockSellers];
    if (params.status) {
      filtered = filtered.filter(s => s.status === params.status);
    }
    if (params.category) {
      filtered = filtered.filter(s => s.category === params.category);
    }
    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(term) || 
        s.email.toLowerCase().includes(term)
      );
    }

    return {
      items: filtered,
      totalCount: filtered.length,
      limit: params.limit || 20,
      offset: params.offset || 0
    };
  }

  getMockSeller(sellerId) {
    return {
      id: sellerId,
      name: 'Tech Store LK',
      email: 'contact@techstore.lk',
      phone: '+94112345678',
      website: 'www.techstore.lk',
      category: 'Electronics',
      status: 'active',
      rating: 4.8,
      totalReviews: 234,
      products: 156,
      activeProducts: 145,
      orders: 1234,
      completedOrders: 1189,
      revenue: 8750000,
      commission: 875000,
      commissionRate: 10,
      joinedDate: '2023-11-20',
      performanceLevel: 'excellent',
      businessDetails: {
        registrationNumber: 'PV 12345',
        taxId: 'TAX123456789',
        bankAccount: '****1234',
        bankName: 'Commercial Bank'
      },
      address: {
        street: '456 Main Street',
        city: 'Colombo',
        postalCode: '00700',
        country: 'Sri Lanka'
      },
      metrics: {
        responseTime: '2.5 hours',
        fulfillmentRate: '98.5%',
        returnRate: '1.2%',
        customerSatisfaction: '94%'
      }
    };
  }

  getMockSellerPerformance(sellerId) {
    return {
      sellerId,
      period: 'month',
      sales: {
        total: 8750000,
        growth: 12.5,
        orders: 234,
        averageOrderValue: 37393
      },
      products: {
        total: 156,
        active: 145,
        outOfStock: 8,
        flagged: 3
      },
      customers: {
        total: 189,
        returning: 67,
        satisfaction: 4.8
      },
      performance: {
        responseTime: 2.5,
        fulfillmentRate: 98.5,
        onTimeDelivery: 96.8,
        returnRate: 1.2
      },
      dailySales: [
        { date: '2025-03-12', sales: 285000 },
        { date: '2025-03-13', sales: 312000 },
        { date: '2025-03-14', sales: 267000 },
        { date: '2025-03-15', sales: 398000 },
        { date: '2025-03-16', sales: 256000 },
        { date: '2025-03-17', sales: 345000 },
        { date: '2025-03-18', sales: 287000 }
      ],
      topProducts: [
        { name: 'Samsung Galaxy S24', sales: 45, revenue: 4275000 },
        { name: 'Apple AirPods Pro', sales: 67, revenue: 1675000 },
        { name: 'Dell XPS 13', sales: 23, revenue: 2760000 }
      ]
    };
  }
}

export default new PartnerManagementService();
