// TMF633 Service Catalog Management Admin Service
import { apiClient } from '../authService';

const API_BASE = '/tmf-api/serviceCatalogManagement/v4';

class TMF633AdminService {
  // ============ SERVICE CATALOG ENDPOINTS ============
  /**
   * List all service catalogs
   * @param {Object} params - Query parameters
   * @returns {Promise} Service catalog list
   */
  async listServiceCatalogs(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/serviceCatalog`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching service catalogs:', error);
      throw error;
    }
  }

  /**
   * Get service catalog by ID
   * @param {string} catalogId - Service catalog ID
   * @returns {Promise} Service catalog details
   */
  async getServiceCatalog(catalogId) {
    try {
      const response = await apiClient.get(`${API_BASE}/serviceCatalog/${catalogId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service catalog:', error);
      throw error;
    }
  }

  /**
   * Create new service catalog
   * @param {Object} catalogData - Service catalog data
   * @returns {Promise} Created service catalog
   */
  async createServiceCatalog(catalogData) {
    try {
      const response = await apiClient.post(`${API_BASE}/serviceCatalog`, catalogData);
      return response.data;
    } catch (error) {
      console.error('Error creating service catalog:', error);
      throw error;
    }
  }

  /**
   * Update service catalog
   * @param {string} catalogId - Service catalog ID
   * @param {Object} catalogData - Service catalog data to update
   * @returns {Promise} Updated service catalog
   */
  async updateServiceCatalog(catalogId, catalogData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/serviceCatalog/${catalogId}`, catalogData);
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
      await apiClient.delete(`${API_BASE}/serviceCatalog/${catalogId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting service catalog:', error);
      throw error;
    }
  }

  // ============ SERVICE CATEGORY ENDPOINTS ============
  /**
   * List all service categories
   * @param {Object} params - Query parameters
   * @returns {Promise} Service category list
   */
  async listServiceCategories(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/serviceCategory`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching service categories:', error);
      throw error;
    }
  }

  /**
   * Get service category by ID
   * @param {string} categoryId - Service category ID
   * @returns {Promise} Service category details
   */
  async getServiceCategory(categoryId) {
    try {
      const response = await apiClient.get(`${API_BASE}/serviceCategory/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service category:', error);
      throw error;
    }
  }

  /**
   * Create new service category
   * @param {Object} categoryData - Service category data
   * @returns {Promise} Created service category
   */
  async createServiceCategory(categoryData) {
    try {
      const response = await apiClient.post(`${API_BASE}/serviceCategory`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating service category:', error);
      throw error;
    }
  }

  /**
   * Update service category
   * @param {string} categoryId - Service category ID
   * @param {Object} categoryData - Service category data to update
   * @returns {Promise} Updated service category
   */
  async updateServiceCategory(categoryId, categoryData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/serviceCategory/${categoryId}`, categoryData);
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
      await apiClient.delete(`${API_BASE}/serviceCategory/${categoryId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting service category:', error);
      throw error;
    }
  }

  // ============ SERVICE CANDIDATE ENDPOINTS ============
  /**
   * List all service candidates
   * @param {Object} params - Query parameters
   * @returns {Promise} Service candidate list
   */
  async listServiceCandidates(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/serviceCandidate`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching service candidates:', error);
      throw error;
    }
  }

  /**
   * Get service candidate by ID
   * @param {string} candidateId - Service candidate ID
   * @returns {Promise} Service candidate details
   */
  async getServiceCandidate(candidateId) {
    try {
      const response = await apiClient.get(`${API_BASE}/serviceCandidate/${candidateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service candidate:', error);
      throw error;
    }
  }

  /**
   * Create new service candidate
   * @param {Object} candidateData - Service candidate data
   * @returns {Promise} Created service candidate
   */
  async createServiceCandidate(candidateData) {
    try {
      const response = await apiClient.post(`${API_BASE}/serviceCandidate`, candidateData);
      return response.data;
    } catch (error) {
      console.error('Error creating service candidate:', error);
      throw error;
    }
  }

  /**
   * Update service candidate
   * @param {string} candidateId - Service candidate ID
   * @param {Object} candidateData - Service candidate data to update
   * @returns {Promise} Updated service candidate
   */
  async updateServiceCandidate(candidateId, candidateData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/serviceCandidate/${candidateId}`, candidateData);
      return response.data;
    } catch (error) {
      console.error('Error updating service candidate:', error);
      throw error;
    }
  }

  /**
   * Delete service candidate
   * @param {string} candidateId - Service candidate ID
   * @returns {Promise} Deletion result
   */
  async deleteServiceCandidate(candidateId) {
    try {
      await apiClient.delete(`${API_BASE}/serviceCandidate/${candidateId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting service candidate:', error);
      throw error;
    }
  }

  // ============ SERVICE SPECIFICATION ENDPOINTS ============
  /**
   * List all service specifications
   * @param {Object} params - Query parameters
   * @returns {Promise} Service specification list
   */
  async listServiceSpecifications(params = {}) {
    try {
      const response = await apiClient.get(`${API_BASE}/serviceSpecification`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching service specifications:', error);
      throw error;
    }
  }

  /**
   * Get service specification by ID
   * @param {string} specId - Service specification ID
   * @returns {Promise} Service specification details
   */
  async getServiceSpecification(specId) {
    try {
      const response = await apiClient.get(`${API_BASE}/serviceSpecification/${specId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service specification:', error);
      throw error;
    }
  }

  /**
   * Create new service specification
   * @param {Object} specData - Service specification data
   * @returns {Promise} Created service specification
   */
  async createServiceSpecification(specData) {
    try {
      const response = await apiClient.post(`${API_BASE}/serviceSpecification`, specData);
      return response.data;
    } catch (error) {
      console.error('Error creating service specification:', error);
      throw error;
    }
  }

  /**
   * Update service specification
   * @param {string} specId - Service specification ID
   * @param {Object} specData - Service specification data to update
   * @returns {Promise} Updated service specification
   */
  async updateServiceSpecification(specId, specData) {
    try {
      const response = await apiClient.patch(`${API_BASE}/serviceSpecification/${specId}`, specData);
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
      await apiClient.delete(`${API_BASE}/serviceSpecification/${specId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting service specification:', error);
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

  // ============ HUB ENDPOINTS ============
  /**
   * Register hub for service catalog notifications
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

export default new TMF633AdminService();
