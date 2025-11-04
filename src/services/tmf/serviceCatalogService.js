// TMF633 - Service Catalog Management API
import { apiClient, BASE_URL } from '../authService';

class ServiceCatalogService {
  /**
   * Get all service catalogs
   * @param {Object} params - Query parameters
   * @returns {Promise} Service catalogs list
   */
  async getServiceCatalogs(params = {}) {
    try {
      const response = await apiClient.get('/tmf-api/serviceCatalogManagement/v4/serviceCatalog', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching service catalogs:', error);
      return this.getMockServiceCatalogs();
    }
  }

  /**
   * Get specific service catalog
   * @param {string} catalogId - Service catalog ID
   * @returns {Promise} Service catalog details
   */
  async getServiceCatalog(catalogId) {
    try {
      const response = await apiClient.get(`/tmf-api/serviceCatalogManagement/v4/serviceCatalog/${catalogId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service catalog:', error);
      throw error;
    }
  }

  /**
   * Create new service catalog
   * @param {Object} catalogData - Service catalog data
   * @returns {Promise} Created catalog
   */
  async createServiceCatalog(catalogData) {
    try {
      const response = await apiClient.post('/tmf-api/serviceCatalogManagement/v4/serviceCatalog', catalogData);
      return response.data;
    } catch (error) {
      console.error('Error creating service catalog:', error);
      throw error;
    }
  }

  /**
   * Update service catalog
   * @param {string} catalogId - Service catalog ID
   * @param {Object} catalogData - Updated catalog data
   * @returns {Promise} Updated catalog
   */
  async updateServiceCatalog(catalogId, catalogData) {
    try {
      const response = await apiClient.patch(`/tmf-api/serviceCatalogManagement/v4/serviceCatalog/${catalogId}`, catalogData);
      return response.data;
    } catch (error) {
      console.error('Error updating service catalog:', error);
      throw error;
    }
  }

  /**
   * Delete service catalog
   * @param {string} catalogId - Service catalog ID
   * @returns {Promise} Deletion result
   */
  async deleteServiceCatalog(catalogId) {
    try {
      await apiClient.delete(`/tmf-api/serviceCatalogManagement/v4/serviceCatalog/${catalogId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting service catalog:', error);
      throw error;
    }
  }

  /**
   * Get all service categories
   * @param {Object} params - Query parameters
   * @returns {Promise} Service categories list
   */
  async getServiceCategories(params = {}) {
    try {
      const response = await apiClient.get('/tmf-api/serviceCatalogManagement/v4/serviceCategory', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching service categories:', error);
      return this.getMockServiceCategories();
    }
  }

  /**
   * Get specific service category
   * @param {string} categoryId - Service category ID
   * @returns {Promise} Service category details
   */
  async getServiceCategory(categoryId) {
    try {
      const response = await apiClient.get(`/tmf-api/serviceCatalogManagement/v4/serviceCategory/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service category:', error);
      throw error;
    }
  }

  /**
   * Create new service category
   * @param {Object} categoryData - Service category data
   * @returns {Promise} Created category
   */
  async createServiceCategory(categoryData) {
    try {
      const response = await apiClient.post('/tmf-api/serviceCatalogManagement/v4/serviceCategory', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating service category:', error);
      throw error;
    }
  }

  /**
   * Update service category
   * @param {string} categoryId - Service category ID
   * @param {Object} categoryData - Updated category data
   * @returns {Promise} Updated category
   */
  async updateServiceCategory(categoryId, categoryData) {
    try {
      const response = await apiClient.patch(`/tmf-api/serviceCatalogManagement/v4/serviceCategory/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating service category:', error);
      throw error;
    }
  }

  /**
   * Delete service category
   * @param {string} categoryId - Service category ID
   * @returns {Promise} Deletion result
   */
  async deleteServiceCategory(categoryId) {
    try {
      await apiClient.delete(`/tmf-api/serviceCatalogManagement/v4/serviceCategory/${categoryId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting service category:', error);
      throw error;
    }
  }

  /**
   * Get all service specifications
   * @param {Object} params - Query parameters
   * @returns {Promise} Service specifications list
   */
  async getServiceSpecifications(params = {}) {
    try {
      const response = await apiClient.get('/tmf-api/serviceCatalogManagement/v4/serviceSpecification', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching service specifications:', error);
      return this.getMockServiceSpecifications();
    }
  }

  /**
   * Get specific service specification
   * @param {string} specId - Service specification ID
   * @returns {Promise} Service specification details
   */
  async getServiceSpecification(specId) {
    try {
      const response = await apiClient.get(`/tmf-api/serviceCatalogManagement/v4/serviceSpecification/${specId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service specification:', error);
      throw error;
    }
  }

  /**
   * Create new service specification
   * @param {Object} specData - Service specification data
   * @returns {Promise} Created specification
   */
  async createServiceSpecification(specData) {
    try {
      const response = await apiClient.post('/tmf-api/serviceCatalogManagement/v4/serviceSpecification', specData);
      return response.data;
    } catch (error) {
      console.error('Error creating service specification:', error);
      throw error;
    }
  }

  /**
   * Update service specification
   * @param {string} specId - Service specification ID
   * @param {Object} specData - Updated specification data
   * @returns {Promise} Updated specification
   */
  async updateServiceSpecification(specId, specData) {
    try {
      const response = await apiClient.patch(`/tmf-api/serviceCatalogManagement/v4/serviceSpecification/${specId}`, specData);
      return response.data;
    } catch (error) {
      console.error('Error updating service specification:', error);
      throw error;
    }
  }

  /**
   * Delete service specification
   * @param {string} specId - Service specification ID
   * @returns {Promise} Deletion result
   */
  async deleteServiceSpecification(specId) {
    try {
      await apiClient.delete(`/tmf-api/serviceCatalogManagement/v4/serviceSpecification/${specId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting service specification:', error);
      throw error;
    }
  }

  /**
   * Search services across catalogs
   * @param {Object} searchParams - Search parameters
   * @returns {Promise} Search results
   */
  async searchServices(searchParams) {
    try {
      const response = await apiClient.get('/tmf-api/serviceCatalogManagement/v4/service/search', { 
        params: searchParams 
      });
      return response.data;
    } catch (error) {
      console.error('Error searching services:', error);
      return this.getMockSearchResults();
    }
  }

  /**
   * Get service dependencies
   * @param {string} serviceId - Service ID
   * @returns {Promise} Service dependencies
   */
  async getServiceDependencies(serviceId) {
    try {
      const response = await apiClient.get(`/tmf-api/serviceCatalogManagement/v4/service/${serviceId}/dependencies`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service dependencies:', error);
      return { dependencies: [], dependents: [] };
    }
  }

  // Mock data methods for development
  getMockServiceCatalogs() {
    return {
      items: [
        {
          id: 'cat_1',
          name: 'Business Services Catalog',
          description: 'Catalog of all business services',
          version: '1.0',
          lifecycleStatus: 'active',
          lastUpdate: '2025-03-15T10:00:00Z',
          category: ['business', 'enterprise'],
          serviceCount: 45
        },
        {
          id: 'cat_2',
          name: 'Consumer Services Catalog',
          description: 'Services for individual consumers',
          version: '2.1',
          lifecycleStatus: 'active',
          lastUpdate: '2025-03-10T14:30:00Z',
          category: ['consumer', 'retail'],
          serviceCount: 78
        },
        {
          id: 'cat_3',
          name: 'IoT Services Catalog',
          description: 'Internet of Things service offerings',
          version: '1.5',
          lifecycleStatus: 'active',
          lastUpdate: '2025-03-18T09:15:00Z',
          category: ['iot', 'technical'],
          serviceCount: 23
        }
      ],
      totalCount: 3
    };
  }

  getMockServiceCategories() {
    return {
      items: [
        {
          id: 'scat_1',
          name: 'Communication Services',
          description: 'Voice, data, and messaging services',
          parentId: null,
          isRoot: true,
          lifecycleStatus: 'active',
          serviceCount: 34
        },
        {
          id: 'scat_2',
          name: 'Cloud Services',
          description: 'Cloud computing and storage services',
          parentId: null,
          isRoot: true,
          lifecycleStatus: 'active',
          serviceCount: 28
        },
        {
          id: 'scat_3',
          name: 'Security Services',
          description: 'Security and protection services',
          parentId: null,
          isRoot: true,
          lifecycleStatus: 'active',
          serviceCount: 19
        },
        {
          id: 'scat_4',
          name: 'Voice Services',
          description: 'Traditional and VoIP voice services',
          parentId: 'scat_1',
          isRoot: false,
          lifecycleStatus: 'active',
          serviceCount: 12
        },
        {
          id: 'scat_5',
          name: 'Data Services',
          description: 'Internet and data connectivity',
          parentId: 'scat_1',
          isRoot: false,
          lifecycleStatus: 'active',
          serviceCount: 15
        }
      ],
      totalCount: 5
    };
  }

  getMockServiceSpecifications() {
    return {
      items: [
        {
          id: 'spec_1',
          name: 'Enterprise Internet Service',
          description: 'High-speed internet service for businesses',
          version: '3.0',
          lifecycleStatus: 'active',
          serviceType: 'connectivity',
          characteristics: [
            { name: 'bandwidth', valueType: 'string', value: '100-1000 Mbps' },
            { name: 'sla', valueType: 'string', value: '99.9%' },
            { name: 'support', valueType: 'string', value: '24/7' }
          ]
        },
        {
          id: 'spec_2',
          name: 'Cloud Storage Service',
          description: 'Secure cloud storage solution',
          version: '2.5',
          lifecycleStatus: 'active',
          serviceType: 'storage',
          characteristics: [
            { name: 'storageCapacity', valueType: 'string', value: '100GB-10TB' },
            { name: 'encryption', valueType: 'string', value: 'AES-256' },
            { name: 'backup', valueType: 'string', value: 'Daily automated' }
          ]
        },
        {
          id: 'spec_3',
          name: 'VoIP Business Phone',
          description: 'Voice over IP phone service for businesses',
          version: '4.1',
          lifecycleStatus: 'active',
          serviceType: 'voice',
          characteristics: [
            { name: 'lines', valueType: 'string', value: '1-100' },
            { name: 'features', valueType: 'array', value: ['call forwarding', 'voicemail', 'conference'] },
            { name: 'quality', valueType: 'string', value: 'HD Voice' }
          ]
        }
      ],
      totalCount: 3
    };
  }

  getMockSearchResults() {
    return {
      results: [
        {
          id: 'srv_1',
          name: 'Business Fiber 500',
          type: 'connectivity',
          catalog: 'Business Services',
          category: 'Data Services',
          price: 'Rs. 25,000/month',
          rating: 4.5
        },
        {
          id: 'srv_2',
          name: 'Cloud Backup Pro',
          type: 'storage',
          catalog: 'Business Services',
          category: 'Cloud Services',
          price: 'Rs. 5,000/month',
          rating: 4.8
        },
        {
          id: 'srv_3',
          name: 'SecureNet Firewall',
          type: 'security',
          catalog: 'Business Services',
          category: 'Security Services',
          price: 'Rs. 15,000/month',
          rating: 4.6
        }
      ],
      totalResults: 3,
      facets: {
        catalogs: [
          { name: 'Business Services', count: 3 }
        ],
        categories: [
          { name: 'Data Services', count: 1 },
          { name: 'Cloud Services', count: 1 },
          { name: 'Security Services', count: 1 }
        ],
        priceRanges: [
          { range: '0-10000', count: 1 },
          { range: '10000-20000', count: 1 },
          { range: '20000+', count: 1 }
        ]
      }
    };
  }
}

export default new ServiceCatalogService();
