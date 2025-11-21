/*
Sellers Service - Admin Panel

Integrates with TMF668 Partnership Management API to manage seller approvals and partnerships.

Key Functions:
  • getAllSellers - Fetch all partnerships (sellers) with status filtering
  • getSellersStats - Get statistics for seller approvals (pending, approved, rejected)
  • getSeller - Get individual seller/partnership details
  • approveSeller - Approve a pending seller
  • rejectSeller - Reject a pending seller with reason
*/

import { axiosInstance } from "../axiosInstance";

// ============================================================================
// LOCAL STATUS CACHE (Fallback when API doesn't persist status properly)
// ============================================================================

const STATUS_CACHE_KEY = 'seller_status_cache';

/**
 * Get cached status updates for sellers
 */
const getCachedStatuses = () => {
  try {
    const cached = localStorage.getItem(STATUS_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (error) {
    console.error('Error reading status cache:', error);
    return {};
  }
};

/**
 * Cache a status update for a seller
 */
const cacheStatusUpdate = (sellerId, status, timestamp = new Date().toISOString()) => {
  try {
    const cache = getCachedStatuses();
    cache[sellerId] = { status, timestamp };
    localStorage.setItem(STATUS_CACHE_KEY, JSON.stringify(cache));
    console.log(`✅ Cached status update for seller ${sellerId}: ${status}`);
  } catch (error) {
    console.error('Error caching status update:', error);
  }
};

/**
 * Get cached status for a specific seller
 */
const getCachedStatus = (sellerId) => {
  const cache = getCachedStatuses();
  return cache[sellerId]?.status;
};

/**
 * Clear old cached statuses (older than 24 hours)
 */
const clearOldCache = () => {
  try {
    const cache = getCachedStatuses();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    Object.keys(cache).forEach(sellerId => {
      if (cache[sellerId].timestamp < oneDayAgo) {
        delete cache[sellerId];
      }
    });
    
    localStorage.setItem(STATUS_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
};


// Get date range helper - fetch all sellers from beginning of time
const getBroadDateRange = () => {
  return {
    startDate: "2020-01-01", // Cover all historical data
    endDate: new Date().toISOString().split("T")[0], // Up to today
  };
};

/**
 * Get all sellers/partnerships from the backend
 * @param {Object} filters - Optional filters (status, dateFrom, dateTo, etc.)
 * @returns {Promise} Sellers list with details
 */
export const getAllSellers = async (filters = {}) => {
  try {
    // Clear old cached statuses on each fetch
    clearOldCache();
    
    console.log("Fetching all sellers/partnerships...");

    // Build query params
    const params = new URLSearchParams();
    
    // Add status filter if provided
    if (filters.status) {
      params.append("status", filters.status);
    }

    const queryString = params.toString();
    const url = queryString 
      ? `partnershipManagement/v4/partnership?${queryString}`
      : `partnershipManagement/v4/partnership`;

    const response = await axiosInstance.get(url);

    // Handle response - partnerships come as direct array or wrapped
    const partnerships = Array.isArray(response.data) 
      ? response.data 
      : response.data.partnerships || [];

    console.log(`Found ${partnerships.length} sellers/partnerships`);

    // Transform partnerships to seller format expected by frontend
    const sellers = partnerships.map((partnership) => {
      const sellerId = partnership._id || partnership.id;
      
      // Check status from API first, then fall back to cache
      let status = partnership.status;
      const cachedStatus = getCachedStatus(sellerId);
      
      if (!status && cachedStatus) {
        console.log(`Using cached status for seller ${sellerId}: ${cachedStatus}`);
        status = cachedStatus;
      }
      
      return {
        id: sellerId, // Handle both _id and id from API
        name: partnership.name || "Unknown",
        email: partnership.contactMedium?.find(c => c.type === "Email")?.characteristic?.emailAddress || "N/A",
        status: cachedStatus || mapPartnershipStatus(status),
        storeName: partnership.tradingName || partnership.name || "N/A",
        phone: partnership.contactMedium?.find(c => c.type === "Phone")?.characteristic?.phoneNumber || "N/A",
        appliedAt: partnership.validFor?.startDateTime || partnership.createdDate || new Date().toISOString(),
        revenue: partnership.revenue || 0,
        totalOrders: partnership.totalOrders || 0,
        rating: partnership.rating || 0,
        productsListed: partnership.productsListed || 0,
        // Raw partnership data for reference
        _raw: partnership
      };
    });

    return sellers;
  } catch (error) {
    console.error("Error fetching sellers:", error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
};

/**
 * Map TMF partnership status to frontend status
 * @param {string} tmfStatus - TMF partnership status
 * @returns {string} Frontend status
 */
const mapPartnershipStatus = (tmfStatus) => {
  if (!tmfStatus) return "pending";
  
  const statusMap = {
    "active": "approved",
    "pending": "pending",
    "rejected": "rejected",
    "suspended": "rejected",
    "terminated": "rejected",
    "inactive": "rejected"
  };

  return statusMap[tmfStatus.toLowerCase()] || "pending";
};

/**
 * Get seller/partnership statistics
 * @returns {Promise} Statistics object with counts
 */
export const getSellersStats = async () => {
  try {
    console.log("Fetching seller statistics...");

    // Fetch all sellers and calculate stats
    const allSellers = await getAllSellers();

    const stats = {
      total: allSellers.length,
      pending: allSellers.filter(s => s.status === "pending").length,
      approved: allSellers.filter(s => s.status === "approved").length,
      rejected: allSellers.filter(s => s.status === "rejected").length,
    };

    console.log("Seller stats:", stats);
    return stats;
  } catch (error) {
    console.error("Error fetching seller statistics:", error);
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
  }
};

/**
 * Get individual seller/partnership by ID
 * @param {string} sellerId - Seller/partnership ID
 * @returns {Promise} Seller details
 */
export const getSeller = async (sellerId) => {
  try {
    console.log(`Fetching seller details for ID: ${sellerId}`);

    const response = await axiosInstance.get(
      `partnershipManagement/v4/partnership/${sellerId}`
    );

    const partnership = response.data;

    // Transform to seller format
    const seller = {
      id: partnership._id || partnership.id, // Handle both _id and id from API
      name: partnership.name || "Unknown",
      email: partnership.contactMedium?.find(c => c.type === "Email")?.characteristic?.emailAddress || "N/A",
      status: mapPartnershipStatus(partnership.status),
      storeName: partnership.tradingName || partnership.name || "N/A",
      phone: partnership.contactMedium?.find(c => c.type === "Phone")?.characteristic?.phoneNumber || "N/A",
      appliedAt: partnership.validFor?.startDateTime || partnership.createdDate || new Date().toISOString(),
      revenue: partnership.revenue || 0,
      totalOrders: partnership.totalOrders || 0,
      rating: partnership.rating || 0,
      productsListed: partnership.productsListed || 0,
      _raw: partnership
    };

    console.log("Seller details fetched:", seller);
    return seller;
  } catch (error) {
    console.error(`Error fetching seller ${sellerId}:`, error);
    throw error;
  }
};

/**
 * Approve a pending seller
 * @param {string} sellerId - Seller/partnership ID
 * @returns {Promise} Updated seller
 */
export const approveSeller = async (sellerId) => {
  try {
    console.log(`Approving seller ${sellerId}...`);

    // Update partnership status to 'active'
    const updateData = {
      status: "active"
    };

    const response = await axiosInstance.patch(
      `partnershipManagement/v4/partnership/${sellerId}`,
      updateData
    );

    // Cache the status update
    cacheStatusUpdate(sellerId, 'approved');

    console.log(`Seller ${sellerId} approved successfully`);
    return response.data;
  } catch (error) {
    console.error(`Error approving seller ${sellerId}:`, error);
    throw error;
  }
};

/**
 * Reject a pending seller
 * @param {string} sellerId - Seller/partnership ID
 * @param {string} reason - Reason for rejection
 * @returns {Promise} Updated seller
 */
export const rejectSeller = async (sellerId, reason = "") => {
  try {
    console.log(`Rejecting seller ${sellerId} with reason: ${reason}`);

    // Update partnership status to 'rejected'
    const updateData = {
      status: "rejected",
      statusReason: reason
    };

    const response = await axiosInstance.patch(
      `partnershipManagement/v4/partnership/${sellerId}`,
      updateData
    );

    // Cache the status update
    cacheStatusUpdate(sellerId, 'rejected');

    console.log(`Seller ${sellerId} rejected successfully`);
    return response.data;
  } catch (error) {
    console.error(`Error rejecting seller ${sellerId}:`, error);
    throw error;
  }
};
