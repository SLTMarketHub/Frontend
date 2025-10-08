// TMF620 Product Catalog Management API Service
import { apiClient } from '../authService';

const PRODUCT_API = '/tmf-api/productCatalog/v5';

class ProductCatalogService {
  /**
   * List all products with filtering and pagination
   * @param {Object} params - Query parameters
   * @returns {Promise} Product list response
   */
  async listProducts(params = {}) {
    const {
      limit = 20,
      offset = 0,
      category,
      status,
      sellerId,
      searchTerm,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      priceMin,
      priceMax
    } = params;

    const queryParams = new URLSearchParams({
      limit,
      offset,
      ...(category && { 'category': category }),
      ...(status && { 'lifecycleStatus': status }),
      ...(sellerId && { 'relatedParty.id': sellerId }),
      ...(searchTerm && { 'name': searchTerm }),
      ...(priceMin && { 'productOfferingPrice.price.value.gte': priceMin }),
      ...(priceMax && { 'productOfferingPrice.price.value.lte': priceMax }),
      'sort': `${sortOrder === 'asc' ? '+' : '-'}${sortBy}`
    });

    try {
      const response = await apiClient.get(`${PRODUCT_API}/productCatalog`, { params });
      return {
        items: response.data,
        total: response.data.length
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return this.getMockProducts(params);
    }
  }

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise} Product details
   */
  async getProduct(productId) {
    try {
      const response = await api.get(`/productCatalogManagement/v4/productOffering/${productId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return this.getMockProduct(productId);
    }
  }

  /**
   * Create new product offering
   * @param {Object} productData - Product data
   * @returns {Promise} Created product
   */
  async createProduct(productData) {
    try {
      const response = await api.post('/productCatalogManagement/v4/productOffering', {
        name: productData.name,
        description: productData.description,
        lifecycleStatus: 'pending',
        category: [
          {
            id: productData.categoryId,
            name: productData.categoryName,
            '@baseType': 'Category',
            '@type': 'Category'
          }
        ],
        productOfferingPrice: [
          {
            name: 'Regular Price',
            priceType: 'recurring',
            price: {
              value: productData.price,
              unit: 'LKR'
            },
            validFor: {
              startDateTime: new Date().toISOString()
            }
          }
        ],
        productSpecification: {
          id: productData.specificationId,
          name: productData.name,
          '@type': 'ProductSpecification'
        },
        relatedParty: [
          {
            id: productData.sellerId,
            name: productData.sellerName,
            role: 'seller',
            '@type': 'Organization'
          }
        ],
        attachment: productData.images?.map(img => ({
          id: img.id,
          href: img.url,
          description: img.description,
          mimeType: img.mimeType || 'image/jpeg',
          '@type': 'Attachment'
        }))
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update product
   * @param {string} productId - Product ID
   * @param {Object} updates - Update data
   * @returns {Promise} Updated product
   */
  async updateProduct(productId, updates) {
    try {
      const response = await api.patch(`/productCatalogManagement/v4/productOffering/${productId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Approve or reject product
   * @param {string} productId - Product ID
   * @param {string} status - New status (active/rejected)
   * @param {string} reason - Reason for rejection (optional)
   * @returns {Promise} Updated product
   */
  async moderateProduct(productId, status, reason) {
    try {
      const updates = {
        lifecycleStatus: status
      };
      
      if (reason) {
        updates.note = [{
          text: reason,
          date: new Date().toISOString(),
          author: 'Admin'
        }];
      }

      return await this.updateProduct(productId, updates);
    } catch (error) {
      console.error('Error moderating product:', error);
      throw error;
    }
  }

  /**
   * Bulk update products
   * @param {Array} productIds - Array of product IDs
   * @param {Object} updates - Update data
   * @returns {Promise} Update results
   */
  async bulkUpdateProducts(productIds, updates) {
    try {
      const response = await api.post('/productCatalogManagement/v4/productOffering/bulk', {
        productIds,
        updates
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating products:', error);
      // Simulate bulk update for development
      return {
        success: productIds.length,
        failed: 0,
        results: productIds.map(id => ({ id, status: 'success' }))
      };
    }
  }

  /**
   * Delete product
   * @param {string} productId - Product ID
   * @returns {Promise} Deletion result
   */
  async deleteProduct(productId) {
    try {
      await api.delete(`/productCatalogManagement/v4/productOffering/${productId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Get product categories
   * @returns {Promise} Categories list
   */
  async getCategories() {
    try {
      const response = await api.get('/productCatalogManagement/v4/category');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [
        { id: '1', name: 'Electronics', count: 342 },
        { id: '2', name: 'Fashion', count: 567 },
        { id: '3', name: 'Home & Garden', count: 234 },
        { id: '4', name: 'Sports & Outdoors', count: 189 },
        { id: '5', name: 'Books & Media', count: 456 },
        { id: '6', name: 'Toys & Games', count: 123 },
        { id: '7', name: 'Health & Beauty', count: 289 },
        { id: '8', name: 'Automotive', count: 98 }
      ];
    }
  }

  /**
   * Get product statistics
   * @returns {Promise} Product statistics
   */
  async getProductStats() {
    try {
      const response = await api.get('/productCatalogManagement/v4/productOffering/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching product stats:', error);
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

  /**
   * Get reported/flagged products
   * @returns {Promise} Flagged products list
   */
  async getFlaggedProducts() {
    try {
      const response = await api.get('/productCatalogManagement/v4/productOffering?lifecycleStatus=flagged');
      return response.data;
    } catch (error) {
      console.error('Error fetching flagged products:', error);
      return this.getMockFlaggedProducts();
    }
  }

  // Mock data methods for development
  getMockProducts(params) {
    const mockProducts = [
      {
        id: '1',
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Latest flagship smartphone with AI features',
        price: 285000,
        category: 'Electronics',
        seller: 'Tech Store LK',
        sellerId: 'seller_1',
        status: 'active',
        stock: 45,
        images: ['/api/images/product1.jpg'],
        rating: 4.8,
        reviews: 234,
        createdAt: '2025-03-01T10:00:00Z'
      },
      {
        id: '2',
        name: 'Apple MacBook Pro 14"',
        description: 'M3 Pro chip, 18GB RAM, 512GB SSD',
        price: 567000,
        category: 'Electronics',
        seller: 'Electronics Pro',
        sellerId: 'seller_2',
        status: 'active',
        stock: 12,
        images: ['/api/images/product2.jpg'],
        rating: 4.9,
        reviews: 156,
        createdAt: '2025-03-02T11:00:00Z'
      },
      {
        id: '3',
        name: 'Nike Air Max 270',
        description: 'Comfortable running shoes',
        price: 28500,
        category: 'Fashion',
        seller: 'Fashion Hub',
        sellerId: 'seller_3',
        status: 'pending',
        stock: 67,
        images: ['/api/images/product3.jpg'],
        rating: 4.5,
        reviews: 89,
        createdAt: '2025-03-15T14:00:00Z'
      },
      {
        id: '4',
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-cancelling headphones',
        price: 87500,
        category: 'Electronics',
        seller: 'Tech Store LK',
        sellerId: 'seller_1',
        status: 'flagged',
        stock: 15,
        images: ['/api/images/product4.jpg'],
        rating: 4.7,
        reviews: 412,
        createdAt: '2025-03-10T09:00:00Z',
        flagReason: 'Counterfeit concerns reported'
      }
    ];

    // Apply filters
    let filtered = [...mockProducts];
    if (params.status) {
      filtered = filtered.filter(p => p.status === params.status);
    }
    if (params.category) {
      filtered = filtered.filter(p => p.category === params.category);
    }
    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term)
      );
    }

    return {
      items: filtered,
      totalCount: filtered.length,
      limit: params.limit || 20,
      offset: params.offset || 0
    };
  }

  getMockProduct(productId) {
    return {
      id: productId,
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Latest flagship smartphone with AI features. 256GB storage, 12GB RAM, Snapdragon 8 Gen 3 processor.',
      price: 285000,
      category: 'Electronics',
      seller: 'Tech Store LK',
      sellerId: 'seller_1',
      status: 'active',
      stock: 45,
      images: [
        { id: '1', url: '/api/images/product1.jpg', primary: true },
        { id: '2', url: '/api/images/product1-2.jpg', primary: false },
        { id: '3', url: '/api/images/product1-3.jpg', primary: false }
      ],
      rating: 4.8,
      reviews: 234,
      specifications: {
        brand: 'Samsung',
        model: 'Galaxy S24 Ultra',
        color: 'Titanium Gray',
        storage: '256GB',
        ram: '12GB',
        processor: 'Snapdragon 8 Gen 3'
      },
      createdAt: '2025-03-01T10:00:00Z',
      updatedAt: '2025-03-15T14:30:00Z'
    };
  }

  getMockFlaggedProducts() {
    return {
      items: [
        {
          id: '4',
          name: 'Sony WH-1000XM5',
          seller: 'Tech Store LK',
          status: 'flagged',
          flagReason: 'Counterfeit concerns reported',
          reportCount: 3,
          reportedAt: '2025-03-16T10:00:00Z'
        },
        {
          id: '8',
          name: 'iPhone 15 Pro Max',
          seller: 'Mobile World',
          status: 'flagged',
          flagReason: 'Price too low - possible scam',
          reportCount: 5,
          reportedAt: '2025-03-17T11:30:00Z'
        }
      ],
      totalCount: 2
    };
  }
}

export default new ProductCatalogService();
