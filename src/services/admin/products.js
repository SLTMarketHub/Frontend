/*
Products Service - Admin Panel

Integrates with TMF620 Product Catalog API to manage product moderation and approval.

Key Functions:
  • getAllProducts - Fetch all product offerings with filtering
  • getProductsStats - Get product statistics (pending, approved, rejected)
  • getProduct - Get individual product details
  • approveProduct - Approve a pending product
  • rejectProduct - Reject a pending product with reason
  • bulkApproveProducts - Approve multiple products at once
  • bulkRejectProducts - Reject multiple products at once
  • getCategories - Fetch product categories
*/

import { axiosInstance } from "../axiosInstance";
import { PRODUCT_PLACEHOLDER } from "../../utils/imageUtils";


/**
 * Get all products/offerings from the backend
 * @param {Object} filters - Optional filters (status, category, etc.)
 * @returns {Promise} Products list with details
 */
export const getAllProducts = async (filters = {}) => {
  try {
    console.log("Fetching all products/offerings...");

    // Build query params
    const params = new URLSearchParams();
    
    // Add lifecycle status filter if provided
    if (filters.lifecycleStatus) {
      params.append("lifecycleStatus", filters.lifecycleStatus);
    }

    // Add category filter if provided
    if (filters.category) {
      params.append("category", filters.category);
    }

    const queryString = params.toString();
    const url = queryString 
      ? `productCatalog/v5/productOffering?${queryString}`
      : `productCatalog/v5/productOffering`;

    const response = await axiosInstance.get(url);

    // Handle response - products come in data.data array with pagination
    const data = response.data;
    const products = Array.isArray(data.data) 
      ? data.data 
      : (Array.isArray(data) ? data : []);

    console.log(`Found ${products.length} products`);

    // Transform products to format expected by frontend
    const transformedProducts = products.map((product) => {
      const price = product.productOfferingPrice?.[0]?.price?.value || product.price || 0;
      const category = product.category?.[0]?.name || "Uncategorized";
      
      return {
        id: product._id || product.id, // Handle both _id and id from API
        name: product.name || 'Unknown Product',
        seller: product.relatedParty?.find(p => p.role === "seller")?.name || "Unknown Seller",
        status: mapProductStatus(product.lifecycleStatus),
        category: category,
        price: price,
        submittedAt: product.lastUpdate || product.validFor?.startDateTime || new Date().toISOString(),
        image: product.attachment?.[0]?.url || PRODUCT_PLACEHOLDER,
        flagged: product.isFlagged || false,
        reports: product.reportCount || 0,
        lifecycleStatus: product.lifecycleStatus,
        // Raw product data for reference
        _raw: product
      };
    });

    return transformedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
};

/**
 * Map TMF product lifecycle status to frontend status
 * @param {string} lifecycleStatus - TMF lifecycle status
 * @returns {string} Frontend status
 */
const mapProductStatus = (lifecycleStatus) => {
  if (!lifecycleStatus) return "pending";
  
  const statusMap = {
    "Active": "approved",
    "Launched": "approved",
    "InDesign": "pending",
    "InTest": "pending",
    "Retired": "rejected",
    "Obsolete": "rejected",
    "Rejected": "rejected"
  };

  return statusMap[lifecycleStatus] || "pending";
};

/**
 * Get product statistics
 * @returns {Promise} Statistics object with counts
 */
export const getProductsStats = async () => {
  try {
    console.log("Fetching product statistics...");

    // Fetch all products and calculate stats
    const allProducts = await getAllProducts();

    const stats = {
      total: allProducts.length,
      pending: allProducts.filter(p => p.status === "pending").length,
      approved: allProducts.filter(p => p.status === "approved").length,
      rejected: allProducts.filter(p => p.status === "rejected").length,
      flagged: allProducts.filter(p => p.flagged).length,
    };

    console.log("Product stats:", stats);
    return stats;
  } catch (error) {
    console.error("Error fetching product statistics:", error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      flagged: 0,
    };
  }
};

/**
 * Get individual product by ID
 * @param {string} productId - Product offering ID
 * @returns {Promise} Product details
 */
export const getProduct = async (productId) => {
  try {
    console.log(`Fetching product details for ID: ${productId}`);

    const response = await axiosInstance.get(
      `productCatalog/v5/productOffering/${productId}`
    );

    const product = response.data;
    const price = product.productOfferingPrice?.[0]?.price?.value || product.price || 0;
    const category = product.category?.[0]?.name || "Uncategorized";

    // Transform to frontend format
    const transformedProduct = {
      id: product._id || product.id, // Handle both _id and id from API
      name: product.name || 'Unknown Product',
      seller: product.relatedParty?.find(p => p.role === "seller")?.name || "Unknown Seller",
      status: mapProductStatus(product.lifecycleStatus),
      category: category,
      price: price,
      submittedAt: product.lastUpdate || product.validFor?.startDateTime || new Date().toISOString(),
      image: product.attachment?.[0]?.url || PRODUCT_PLACEHOLDER,
      flagged: product.isFlagged || false,
      reports: product.reportCount || 0,
      lifecycleStatus: product.lifecycleStatus,
      _raw: product
    };

    console.log("Product details fetched:", transformedProduct);
    return transformedProduct;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error);
    throw error;
  }
};

/**
 * Approve a pending product
 * @param {string} productId - Product offering ID
 * @returns {Promise} Updated product
 */
export const approveProduct = async (productId) => {
  try {
    console.log(`Approving product ${productId}...`);

    // Update product lifecycle status to 'Active'
    const updateData = {
      lifecycleStatus: "Active"
    };

    const response = await axiosInstance.patch(
      `productCatalog/v5/productOffering/${productId}`,
      updateData
    );

    console.log(`Product ${productId} approved successfully`);
    return response.data;
  } catch (error) {
    console.error(`Error approving product ${productId}:`, error);
    throw error;
  }
};

/**
 * Reject a pending product
 * @param {string} productId - Product offering ID
 * @param {string} reason - Reason for rejection
 * @returns {Promise} Updated product
 */
export const rejectProduct = async (productId, reason = "") => {
  try {
    console.log(`Rejecting product ${productId} with reason: ${reason}`);

    // Update product lifecycle status to 'Rejected'
    const updateData = {
      lifecycleStatus: "Rejected",
      statusReason: reason
    };

    const response = await axiosInstance.patch(
      `productCatalog/v5/productOffering/${productId}`,
      updateData
    );

    console.log(`Product ${productId} rejected successfully`);
    return response.data;
  } catch (error) {
    console.error(`Error rejecting product ${productId}:`, error);
    throw error;
  }
};

/**
 * Bulk approve multiple products
 * @param {Array} productIds - Array of product IDs to approve
 * @returns {Promise} Results of bulk operation
 */
export const bulkApproveProducts = async (productIds) => {
  try {
    console.log(`Bulk approving ${productIds.length} products...`);

    // Update each product individually
    const updatePromises = productIds.map(id => 
      approveProduct(id).catch(error => {
        console.error(`Failed to approve product ${id}:`, error);
        return { id, error: true };
      })
    );

    const results = await Promise.allSettled(updatePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && !r.value?.error).length;
    const failed = results.length - successful;

    console.log(`Bulk approve completed: ${successful} successful, ${failed} failed`);

    return {
      success: successful,
      failed: failed,
      total: productIds.length,
      results: results
    };
  } catch (error) {
    console.error("Error bulk approving products:", error);
    throw error;
  }
};

/**
 * Bulk reject multiple products
 * @param {Array} productIds - Array of product IDs to reject
 * @param {string} reason - Reason for rejection
 * @returns {Promise} Results of bulk operation
 */
export const bulkRejectProducts = async (productIds, reason = "") => {
  try {
    console.log(`Bulk rejecting ${productIds.length} products...`);

    // Update each product individually
    const updatePromises = productIds.map(id => 
      rejectProduct(id, reason).catch(error => {
        console.error(`Failed to reject product ${id}:`, error);
        return { id, error: true };
      })
    );

    const results = await Promise.allSettled(updatePromises);
    
    const successful = results.filter(r => r.status === 'fulfilled' && !r.value?.error).length;
    const failed = results.length - successful;

    console.log(`Bulk reject completed: ${successful} successful, ${failed} failed`);

    return {
      success: successful,
      failed: failed,
      total: productIds.length,
      results: results
    };
  } catch (error) {
    console.error("Error bulk rejecting products:", error);
    throw error;
  }
};

/**
 * Get all product categories
 * @returns {Promise} Array of categories
 */
export const getCategories = async () => {
  try {
    console.log("Fetching product categories...");

    const response = await axiosInstance.get(
      "productCatalog/v5/category"
    );

    const categories = Array.isArray(response.data) 
      ? response.data 
      : (response.data.data || []);

    console.log(`Found ${categories.length} categories`);
    
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      parentId: cat.parentId,
      isRoot: cat.isRoot,
      _raw: cat
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Return default categories on error
    return [
      { id: "electronics", name: "Electronics" },
      { id: "fashion", name: "Fashion" },
      { id: "home", name: "Home & Living" },
      { id: "beauty", name: "Beauty & Health" }
    ];
  }
};
