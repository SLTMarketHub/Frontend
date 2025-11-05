// TMF620 Product Catalog Management Admin Service
import { apiClient } from '../authService';

const API_BASE = '/tmf-api/productCatalog/v5';

class TMF620AdminService {
  // ============ CATEGORY ENDPOINTS ============
  /**
   * List all categories
   * @param {Object} params - Query parameters
   * @returns {Promise} Category list
   */
  async listCategories(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/category`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get category by ID
   * @param {string} categoryId - Category ID
   * @returns {Promise} Category details
   */
  async getCategory(categoryId) {
    try {
      const response = await apiClient.get(`${API_BASE}/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  }

  /**
   * Create new category
   * @param {Object} categoryData - Category data
   * @returns {Promise} Created category
   */
  async createCategory(categoryData) {
    try {
      const response = await apiClient.post(`${API_BASE}/category`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  }

  /**
   * Update category
   * @param {string} categoryId - Category ID
   * @param {Object} categoryData - Category data to update
   * @returns {Promise} Updated category
   */
  async updateCategory(categoryId, categoryData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/category/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  }

  /**
   * Delete category
   * @param {string} categoryId - Category ID
   * @returns {Promise} Deletion result
   */
  async deleteCategory(categoryId) {
    try {
      await apiClient.delete(`${API_BASE}/category/${categoryId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }

  // ============ IMPORT JOB ENDPOINTS ============
  /**
   * List all import jobs
   * @param {Object} params - Query parameters
   * @returns {Promise} Import job list
   */
  async listImportJobs(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/importJob`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching import jobs:', error);
      throw error;
    }
  }

  /**
   * Get import job by ID
   * @param {string} jobId - Import job ID
   * @returns {Promise} Import job details
   */
  async getImportJob(jobId) {
    try {
      const response = await apiClient.get(`${API_BASE}/importJob/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching import job:', error);
      throw error;
    }
  }

  /**
   * Create new import job
   * @param {Object} jobData - Import job data
   * @returns {Promise} Created import job
   */
  async createImportJob(jobData) {
    try {
      const response = await apiClient.post(`${API_BASE}/importJob`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating import job:', error);
      throw error;
    }
  }

  /**
   * Delete import job
   * @param {string} jobId - Import job ID
   * @returns {Promise} Deletion result
   */
  async deleteImportJob(jobId) {
    try {
      await apiClient.delete(`${API_BASE}/importJob/${jobId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting import job:', error);
      throw error;
    }
  }

  // ============ EXPORT JOB ENDPOINTS ============
  /**
   * List all export jobs
   * @param {Object} params - Query parameters
   * @returns {Promise} Export job list
   */
  async listExportJobs(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/exportJob`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching export jobs:', error);
      throw error;
    }
  }

  /**
   * Get export job by ID
   * @param {string} jobId - Export job ID
   * @returns {Promise} Export job details
   */
  async getExportJob(jobId) {
    try {
      const response = await apiClient.get(`${API_BASE}/exportJob/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching export job:', error);
      throw error;
    }
  }

  /**
   * Create new export job
   * @param {Object} jobData - Export job data
   * @returns {Promise} Created export job
   */
  async createExportJob(jobData) {
    try {
      const response = await apiClient.post(`${API_BASE}/exportJob`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating export job:', error);
      throw error;
    }
  }

  /**
   * Delete export job
   * @param {string} jobId - Export job ID
   * @returns {Promise} Deletion result
   */
  async deleteExportJob(jobId) {
    try {
      await apiClient.delete(`${API_BASE}/exportJob/${jobId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting export job:', error);
      throw error;
    }
  }

  // ============ PRODUCT CATALOG ENDPOINTS ============
  /**
   * List all product catalogs
   * @param {Object} params - Query parameters
   * @returns {Promise} Product catalog list
   */
  async listProductCatalogs(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/productCatalog`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching product catalogs:', error);
      throw error;
    }
  }

  /**
   * Get product catalog by ID
   * @param {string} catalogId - Product catalog ID
   * @returns {Promise} Product catalog details
   */
  async getProductCatalog(catalogId) {
    try {
      const response = await apiClient.get(`${API_BASE}/productCatalog/${catalogId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product catalog:', error);
      throw error;
    }
  }

  /**
   * Create new product catalog
   * @param {Object} catalogData - Product catalog data
   * @returns {Promise} Created product catalog
   */
  async createProductCatalog(catalogData) {
    try {
      const response = await apiClient.post(`${API_BASE}/productCatalog`, catalogData);
      return response.data;
    } catch (error) {
      console.error('Error creating product catalog:', error);
      throw error;
    }
  }

  /**
   * Update product catalog
   * @param {string} catalogId - Product catalog ID
   * @param {Object} catalogData - Product catalog data to update
   * @returns {Promise} Updated product catalog
   */
  async updateProductCatalog(catalogId, catalogData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/productCatalog/${catalogId}`, catalogData);
      return response.data;
    } catch (error) {
      console.error('Error updating product catalog:', error);
      throw error;
    }
  }

  /**
   * Delete product catalog
   * @param {string} catalogId - Product catalog ID
   * @returns {Promise} Deletion result
   */
  async deleteProductCatalog(catalogId) {
    try {
      await apiClient.delete(`${API_BASE}/productCatalog/${catalogId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting product catalog:', error);
      throw error;
    }
  }

  // ============ PRODUCT OFFERING ENDPOINTS ============
  /**
   * List all product offerings
   * @param {Object} params - Query parameters
   * @returns {Promise} Product offering list
   */
  async listProductOfferings(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/productOffering`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching product offerings:', error);
      throw error;
    }
  }

  /**
   * Get product offering by ID
   * @param {string} offeringId - Product offering ID
   * @returns {Promise} Product offering details
   */
  async getProductOffering(offeringId) {
    try {
      const response = await apiClient.get(`${API_BASE}/productOffering/${offeringId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product offering:', error);
      throw error;
    }
  }

  /**
   * Create new product offering
   * @param {Object} offeringData - Product offering data
   * @returns {Promise} Created product offering
   */
  async createProductOffering(offeringData) {
    try {
      const response = await apiClient.post(`${API_BASE}/productOffering`, offeringData);
      return response.data;
    } catch (error) {
      console.error('Error creating product offering:', error);
      throw error;
    }
  }

  /**
   * Update product offering
   * @param {string} offeringId - Product offering ID
   * @param {Object} offeringData - Product offering data to update
   * @returns {Promise} Updated product offering
   */
  async updateProductOffering(offeringId, offeringData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/productOffering/${offeringId}`, offeringData);
      return response.data;
    } catch (error) {
      console.error('Error updating product offering:', error);
      throw error;
    }
  }

  /**
   * Delete product offering
   * @param {string} offeringId - Product offering ID
   * @returns {Promise} Deletion result
   */
  async deleteProductOffering(offeringId) {
    try {
      await apiClient.delete(`${API_BASE}/productOffering/${offeringId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting product offering:', error);
      throw error;
    }
  }

  // ============ PRODUCT SPECIFICATION ENDPOINTS ============
  /**
   * List all product specifications
   * @param {Object} params - Query parameters
   * @returns {Promise} Product specification list
   */
  async listProductSpecifications(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/productSpecification`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching product specifications:', error);
      throw error;
    }
  }

  /**
   * Get product specification by ID
   * @param {string} specId - Product specification ID
   * @returns {Promise} Product specification details
   */
  async getProductSpecification(specId) {
    try {
      const response = await apiClient.get(`${API_BASE}/productSpecification/${specId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product specification:', error);
      throw error;
    }
  }

  /**
   * Create new product specification
   * @param {Object} specData - Product specification data
   * @returns {Promise} Created product specification
   */
  async createProductSpecification(specData) {
    try {
      const response = await apiClient.post(`${API_BASE}/productSpecification`, specData);
      return response.data;
    } catch (error) {
      console.error('Error creating product specification:', error);
      throw error;
    }
  }

  /**
   * Update product specification
   * @param {string} specId - Product specification ID
   * @param {Object} specData - Product specification data to update
   * @returns {Promise} Updated product specification
   */
  async updateProductSpecification(specId, specData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/productSpecification/${specId}`, specData);
      return response.data;
    } catch (error) {
      console.error('Error updating product specification:', error);
      throw error;
    }
  }

  /**
   * Delete product specification
   * @param {string} specId - Product specification ID
   * @returns {Promise} Deletion result
   */
  async deleteProductSpecification(specId) {
    try {
      await apiClient.delete(`${API_BASE}/productSpecification/${specId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting product specification:', error);
      throw error;
    }
  }

  // ============ PRODUCT OFFERING PRICE ENDPOINTS ============
  /**
   * List all product offering prices
   * @param {Object} params - Query parameters
   * @returns {Promise} Product offering price list
   */
  async listProductOfferingPrices(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/productOfferingPrice`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching product offering prices:', error);
      throw error;
    }
  }

  /**
   * Get product offering price by ID
   * @param {string} priceId - Product offering price ID
   * @returns {Promise} Product offering price details
   */
  async getProductOfferingPrice(priceId) {
    try {
      const response = await apiClient.get(`${API_BASE}/productOfferingPrice/${priceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product offering price:', error);
      throw error;
    }
  }

  /**
   * Create new product offering price
   * @param {Object} priceData - Product offering price data
   * @returns {Promise} Created product offering price
   */
  async createProductOfferingPrice(priceData) {
    try {
      const response = await apiClient.post(`${API_BASE}/productOfferingPrice`, priceData);
      return response.data;
    } catch (error) {
      console.error('Error creating product offering price:', error);
      throw error;
    }
  }

  /**
   * Update product offering price
   * @param {string} priceId - Product offering price ID
   * @param {Object} priceData - Product offering price data to update
   * @returns {Promise} Updated product offering price
   */
  async updateProductOfferingPrice(priceId, priceData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/productOfferingPrice/${priceId}`, priceData);
      return response.data;
    } catch (error) {
      console.error('Error updating product offering price:', error);
      throw error;
    }
  }

  /**
   * Delete product offering price
   * @param {string} priceId - Product offering price ID
   * @returns {Promise} Deletion result
   */
  async deleteProductOfferingPrice(priceId) {
    try {
      await apiClient.delete(`${API_BASE}/productOfferingPrice/${priceId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting product offering price:', error);
      throw error;
    }
  }

  // ============ BULK OPERATIONS ============
  /**
   * Bulk update product offerings
   * @param {Array} productIds - Array of product IDs
   * @param {Object} updates - Update data to apply to all products
   * @returns {Promise} Bulk update result
   */
  async bulkUpdateProducts(productIds, updates) {
    try {
      // Update each product individually
      const updatePromises = productIds.map(id => 
        this.updateProductOffering(id, updates)
      );
      const results = await Promise.allSettled(updatePromises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      return {
        success: successful,
        failed: failed,
        total: productIds.length,
        results: results
      };
    } catch (error) {
      console.error('Error bulk updating products:', error);
      throw error;
    }
  }

  /**
   * Get product statistics
   * @returns {Promise} Product statistics
   */
  async getProductStats() {
    try {
      const response = await apiClient.get(`${API_BASE}/productOffering/statistics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      // Return mock data for development
      return {
        totalProducts: 2456,
        activeProducts: 2234,
        pendingApproval: 45,
        rejectedProducts: 12,
        flaggedProducts: 8,
        topCategory: 'Electronics',
        averagePrice: 45600
      };
    }
  }

  // ============ HUB ENDPOINTS ============
  /**
   * Register hub for notifications
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
}

export default new TMF620AdminService();
