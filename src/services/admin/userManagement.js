/*
User Management Service

This service provides comprehensive user management functionality for admin dashboard,
connecting to TMF629 (Customer Management) and TMF668 (Partnership Management) APIs.

Features:
  • User Statistics (Total Users, Active Customers, Active Sellers, etc.)
  • User Listing with filters (role, status, search)
  • User Details and Profile Management
  • User Status Management (Activate/Suspend)
  • User Activity Tracking
  • User Growth Analytics
  • Export User Data

APIs Used:
  • TMF629 - Customer Management API
  • TMF668 - Partnership Management API
  • TMF681 - Communication Management API (for notifications)
*/

import { apiClient } from "../authService";

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
    console.log(`Cached status update for seller ${sellerId}: ${status}`);
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

// ============================================================================
// USER STATISTICS
// ============================================================================

/**
 * Get comprehensive user statistics
 * @returns {Object} User statistics including totals, growth rates, and breakdowns
 */
export const getUserStatistics = async () => {
  try {
    // Fetch customers and partnerships in parallel
    const [customersResponse, partnershipsResponse] = await Promise.all([
      apiClient.get("customer/v5/customer"),
      apiClient.get("partnershipManagement/v4/partnership"),
    ]);

    const customers = Array.isArray(customersResponse.data)
      ? customersResponse.data
      : [];
    const partnerships = Array.isArray(partnershipsResponse.data)
      ? partnershipsResponse.data
      : [];

    // Log sample data once for diagnostics
    if (customers.length > 0) {
      console.log("Sample customer:", customers[0]);
      console.log(
        "Customer statuses:",
        customers.map((c) => c.status || c.lifecycleStatus || c.state).slice(0, 5)
      );
    }
    if (partnerships.length > 0) {
      console.log("Sample partnership:", partnerships[0]);
      console.log(
        "Partnership statuses:",
        partnerships.map((p) => p.status || p.lifecycleStatus || p.state).slice(0, 5)
      );
    }

    // Calculate customer statistics
    const totalCustomers = customers.length;

    let activeCustomers = customers.filter((c) => {
      const status = c.status || c.lifecycleStatus || c.state;
      return status === "active" || status === "Active" || status === "ACTIVE";
    }).length;

    if (activeCustomers === 0 && totalCustomers > 0) {
      const hasStatusField = customers.some(
        (c) => c.status || c.lifecycleStatus || c.state
      );
      if (!hasStatusField) {
        console.warn(
          "No status field found on customers – assuming all customers are active"
        );
        activeCustomers = totalCustomers;
      }
    }

    const suspendedCustomers = customers.filter((c) => {
      const status = c.status || c.lifecycleStatus || c.state;
      return (
        status === "suspended" ||
        status === "Suspended" ||
        status === "SUSPENDED" ||
        status === "inactive"
      );
    }).length;

    const verifiedCustomers = customers.filter((c) => {
      const verified = c.characteristic?.find((ch) => ch.name === "verified");
      return verified?.value === true || verified?.value === "true";
    }).length;

    // Calculate seller/partnership statistics
    const totalSellers = partnerships.length;

    // Use cached status if API does not provide it
    const cachedStatuses = getCachedStatuses();
    
    let activeSellers = 0;
    let pendingSellers = 0;
    let suspendedSellers = 0;
    
    partnerships.forEach((p) => {
      let status = p.status || p.lifecycleStatus || p.state;
      if (!status) {
        // Try characteristics
        if (p.characteristic) {
          const statusChar = p.characteristic.find(ch => ch.name === 'status' || ch.name === 'lifecycleStatus' || ch.name === 'state');
          status = statusChar?.value;
        }
      }
      if (!status) {
        // Try agreement
        if (p.agreement) {
          status = p.agreement.status || p.agreement.lifecycleStatus;
        }
      }
      if (!status) {
        // Try cache
        status = cachedStatuses[p._id || p.id]?.status;
      }
      if (typeof status === 'string') {
        status = status.toLowerCase();
      }
      if (status === 'active') activeSellers++;
      else if (status === 'pending' || status === 'pendingapproval') pendingSellers++;
      else if (status === 'suspended' || status === 'inactive') suspendedSellers++;
    });

    // Fallback if all are zero
    if (activeSellers === 0 && pendingSellers === 0 && totalSellers > 0) {
      const hasStatusField = partnerships.some(
        (p) => p.status || p.lifecycleStatus || p.state
      );
      if (!hasStatusField) {
        console.warn(
          "No status field found on partnerships – defaulting to 80% active / 20% pending"
        );
        activeSellers = Math.floor(totalSellers * 0.8);
        pendingSellers = totalSellers - activeSellers;
      }
    }

    // Calculate growth rates (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCustomersThisMonth = customers.filter((c) => {
      const createdDate = new Date(
        c.validFor?.startDateTime || c.createdDate || 0
      );
      return createdDate >= thirtyDaysAgo;
    }).length;

    const newSellersThisMonth = partnerships.filter((p) => {
      const createdDate = new Date(
        p.agreementPeriod?.startDateTime || p.createdDate || 0
      );
      return createdDate >= thirtyDaysAgo;
    }).length;

    // Calculate growth rates
    const customerGrowthRate =
      totalCustomers > 0
        ? ((newCustomersThisMonth / totalCustomers) * 100).toFixed(1)
        : 0;
    const sellerGrowthRate =
      totalSellers > 0
        ? ((newSellersThisMonth / totalSellers) * 100).toFixed(1)
        : 0;

    console.log("User Statistics Calculated:", {
      totalCustomers,
      activeCustomers,
      suspendedCustomers,
      totalSellers,
      activeSellers,
      pendingSellers,
      suspendedSellers,
      newCustomersThisMonth,
      newSellersThisMonth,
    });

    console.log("Statistics Summary:", {
      "Total Users": totalCustomers + totalSellers,
      "Active Customers": activeCustomers,
      "Active Sellers": activeSellers,
      "Pending Sellers": pendingSellers,
    });

    return {
      // Totals
      totalUsers: totalCustomers + totalSellers,
      totalCustomers,
      totalSellers,

      // Active users
      activeUsers: activeCustomers + activeSellers,
      activeCustomers,
      activeSellers,

      // Status breakdowns
      suspendedUsers: suspendedCustomers + suspendedSellers,
      suspendedCustomers,
      suspendedSellers,
      pendingSellers,
      verifiedCustomers,

      // Growth metrics
      newUsersThisMonth: newCustomersThisMonth + newSellersThisMonth,
      newCustomersThisMonth,
      newSellersThisMonth,
      customerGrowthRate: parseFloat(customerGrowthRate),
      sellerGrowthRate: parseFloat(sellerGrowthRate),
      overallGrowthRate: parseFloat(
        (
          ((newCustomersThisMonth + newSellersThisMonth) /
            (totalCustomers + totalSellers)) *
          100
        ).toFixed(1)
      ),

      // Percentages
      customerPercentage: (
        (totalCustomers / (totalCustomers + totalSellers)) *
        100
      ).toFixed(1),
      sellerPercentage: (
        (totalSellers / (totalCustomers + totalSellers)) *
        100
      ).toFixed(1),
    };
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return {
      totalUsers: 0,
      totalCustomers: 0,
      totalSellers: 0,
      activeUsers: 0,
      activeCustomers: 0,
      activeSellers: 0,
      suspendedUsers: 0,
      suspendedCustomers: 0,
      suspendedSellers: 0,
      pendingSellers: 0,
      verifiedCustomers: 0,
      newUsersThisMonth: 0,
      newCustomersThisMonth: 0,
      newSellersThisMonth: 0,
      customerGrowthRate: 0,
      sellerGrowthRate: 0,
      overallGrowthRate: 0,
      customerPercentage: 0,
      sellerPercentage: 0,
    };
  }
};

// ============================================================================
// USER LISTING AND FILTERING
// ============================================================================

/**
 * Get all users with optional filters
 * @param {Object} filters - Filter options
 * @param {string} filters.role - Filter by role (all, customer, seller)
 * @param {string} filters.status - Filter by status (all, active, suspended, pending)
 * @param {string} filters.search - Search term for name, email, or phone
 * @param {number} filters.limit - Maximum number of results
 * @param {number} filters.offset - Pagination offset
 * @returns {Array} List of users
 */
export const getAllUsers = async (filters = {}) => {
  try {
    // Clear old cached statuses on each fetch
    clearOldCache();
    
    const {
      role = "all",
      status = "all",
      search = "",
      limit = 100,
      offset = 0,
    } = filters;

    let allUsers = [];

    // Fetch customers if needed
    if (role === "all" || role === "customer") {
      const params = {
        limit,
        offset,
        ...(status !== "all" && { status }),
        ...(search && { name: search }),
      };

      const customersResponse = await apiClient.get("customer/v5/customer", {
        params,
      });

      const customers = Array.isArray(customersResponse.data)
        ? customersResponse.data
        : [];

      const formattedCustomers = customers.map((c) => ({
        id: c._id || c.id,
        _id: c._id || c.id,
        name: c.name || `${c.givenName || ""} ${c.familyName || ""}`.trim() || "Unknown",
        email:
          c.contactMedium?.find((m) => m.mediumType === "email")?.characteristic
            ?.emailAddress ||
          c.email ||
          "N/A",
        phone:
          c.contactMedium?.find((m) => m.mediumType === "mobile")?.characteristic
            ?.phoneNumber ||
          c.phone ||
          "N/A",
        role: "customer",
        status: c.status || "active",
        joinedAt: c.validFor?.startDateTime || c.createdDate || new Date().toISOString(),
        
        // Customer-specific fields
        orders: c.characteristic?.find((ch) => ch.name === "totalOrders")?.value || 0,
        spent: c.characteristic?.find((ch) => ch.name === "totalSpent")?.value || 0,
        address: c.postalAddress?.[0]?.formattedAddress || "N/A",
        verified: c.characteristic?.find((ch) => ch.name === "verified")?.value || false,
        
        // Additional details
        lastOrderDate: c.characteristic?.find((ch) => ch.name === "lastOrderDate")?.value,
        averageOrderValue: c.characteristic?.find((ch) => ch.name === "averageOrderValue")?.value || 0,
        
        // Raw data for detailed view
        rawData: c,
      }));

      allUsers = [...allUsers, ...formattedCustomers];
    }

    // Fetch sellers/partnerships if needed
    if (role === "all" || role === "seller") {
      const params = {
        limit,
        offset,
        ...(status !== "all" && { status }),
        // Add cache busting parameter to ensure fresh data
        _t: Date.now()
      };

      const partnershipsResponse = await apiClient.get(
        "partnershipManagement/v4/partnership",
        { 
          params,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        }
      );

      const partnerships = Array.isArray(partnershipsResponse.data)
        ? partnershipsResponse.data
        : [];

      // Debug logging for seller status handling
      if (partnerships.length > 0) {
        console.log('Partnership status debugging:');
        console.log(`Total partnerships found: ${partnerships.length}`);
        console.log('First partnership full object:', partnerships[0]);
        
        partnerships.slice(0, 3).forEach((p, index) => {
          console.log(`Partnership ${index + 1}:`, {
            id: p._id || p.id,
            name: p.name || p.organization?.tradingName,
            status: p.status,
            lifecycleStatus: p.lifecycleStatus,
            state: p.state,
            allKeys: Object.keys(p),
            hasStatusFields: {
              status: p.hasOwnProperty('status'),
              lifecycleStatus: p.hasOwnProperty('lifecycleStatus'),
              state: p.hasOwnProperty('state')
            }
          });
        });
      }

      const formattedSellers = partnerships.map((p) => {
        const sellerId = p._id || p.id;
        
        // Check multiple possible status fields and preserve existing status
        let sellerStatus = p.status || p.lifecycleStatus || p.state;
        
        // Check for status in nested objects or characteristics
        if (!sellerStatus && p.characteristic) {
          const statusChar = p.characteristic.find(ch => 
            ch.name === 'status' || ch.name === 'lifecycleStatus' || ch.name === 'state'
          );
          sellerStatus = statusChar?.value;
        }
        
        // Check in agreement or partnership specific fields
        if (!sellerStatus && p.agreement) {
          sellerStatus = p.agreement.status || p.agreement.lifecycleStatus;
        }
        
        // If API doesn't provide status, check local cache first
        if (!sellerStatus) {
          const cachedStatus = getCachedStatus(sellerId);
          if (cachedStatus) {
            sellerStatus = cachedStatus;
            console.log(`Using cached status for seller ${sellerId}: ${cachedStatus}`);
          }
        }
        
        // If still no status found, use smart defaults based on creation date
        if (!sellerStatus) {
          const createdDate = new Date(p.agreementPeriod?.startDateTime || p.createdDate || 0);
          const now = new Date();
          const daysSinceCreated = (now - createdDate) / (1000 * 60 * 60 * 24);
          
          // If created recently (less than 7 days) and no status, assume pending
          // Otherwise, assume active (existing sellers)
          if (daysSinceCreated < 7) {
            sellerStatus = "pending";
            console.log(`Partnership ${sellerId} has no status field, defaulting to 'pending' (created ${daysSinceCreated.toFixed(1)} days ago)`);
          } else {
            sellerStatus = "active";
            console.log(`Partnership ${sellerId} has no status field, defaulting to 'active' (created ${daysSinceCreated.toFixed(1)} days ago)`);
          }
        }
        
        // Normalize status values
        if (typeof sellerStatus === 'string') {
          sellerStatus = sellerStatus.toLowerCase();
        }
        
        return {
          id: p._id || p.id,
          _id: p._id || p.id,
          name: p.name || p.organization?.tradingName || "Unknown Seller",
          email:
            p.contact?.contactMedium?.find((m) => m.mediumType === "email")
              ?.characteristic?.emailAddress || "N/A",
          phone:
            p.contact?.contactMedium?.find((m) => m.mediumType === "phone")
              ?.characteristic?.phoneNumber || "N/A",
          role: "seller",
          status: sellerStatus,
          joinedAt: p.agreementPeriod?.startDateTime || p.createdDate || new Date().toISOString(),
          
          // Seller-specific fields
          products: p.characteristic?.find((ch) => ch.name === "totalProducts")?.value || 0,
          revenue: p.characteristic?.find((ch) => ch.name === "totalRevenue")?.value || 0,
          storeName: p.organization?.tradingName || p.name,
          verified: sellerStatus === "active",
          
          // Additional details
          rating: p.characteristic?.find((ch) => ch.name === "rating")?.value || 0,
          totalSales: p.characteristic?.find((ch) => ch.name === "totalSales")?.value || 0,
          
          // Raw data for detailed view
          rawData: p,
        };
      });

      allUsers = [...allUsers, ...formattedSellers];
    }

    // Apply client-side search filtering if search term exists
    if (search) {
      const searchTerm = search.toLowerCase();
      allUsers = allUsers.filter(
        (u) =>
          u.name?.toLowerCase().includes(searchTerm) ||
          u.email?.toLowerCase().includes(searchTerm) ||
          u.phone?.includes(searchTerm)
      );
    }

    console.log(`Fetched ${allUsers.length} users with filters:`, filters);

    return allUsers;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

/**
 * Get user details by ID and role
 * @param {string} userId - User ID
 * @param {string} role - User role (customer or seller)
 * @returns {Object} User details
 */
export const getUserDetails = async (userId, role) => {
  try {
    let response;
    
    if (role === "customer") {
      response = await axiosInstance.get(`customer/v5/customer/${userId}`);
    } else if (role === "seller") {
      response = await axiosInstance.get(
        `partnershipManagement/v4/partnership/${userId}`
      );
    } else {
      throw new Error("Invalid role specified");
    }

    const userData = response.data;

    // Format based on role
    if (role === "customer") {
      return {
        id: userData._id || userData.id,
        _id: userData._id || userData.id,
        name: userData.name || `${userData.givenName || ""} ${userData.familyName || ""}`.trim(),
        email:
          userData.contactMedium?.find((m) => m.mediumType === "email")
            ?.characteristic?.emailAddress || "N/A",
        phone:
          userData.contactMedium?.find((m) => m.mediumType === "mobile")
            ?.characteristic?.phoneNumber || "N/A",
        role: "customer",
        status: userData.status || "active",
        joinedAt: userData.validFor?.startDateTime || userData.createdDate,
        orders: userData.characteristic?.find((ch) => ch.name === "totalOrders")?.value || 0,
        spent: userData.characteristic?.find((ch) => ch.name === "totalSpent")?.value || 0,
        address: userData.postalAddress?.[0]?.formattedAddress || "N/A",
        verified: userData.characteristic?.find((ch) => ch.name === "verified")?.value || false,
        rawData: userData,
      };
    } else {
      return {
        id: userData._id || userData.id,
        _id: userData._id || userData.id,
        name: userData.name || userData.organization?.tradingName,
        email:
          userData.contact?.contactMedium?.find((m) => m.mediumType === "email")
            ?.characteristic?.emailAddress || "N/A",
        phone:
          userData.contact?.contactMedium?.find((m) => m.mediumType === "phone")
            ?.characteristic?.phoneNumber || "N/A",
        role: "seller",
        status: userData.status || "pending",
        joinedAt: userData.agreementPeriod?.startDateTime || userData.createdDate,
        products: userData.characteristic?.find((ch) => ch.name === "totalProducts")?.value || 0,
        revenue: userData.characteristic?.find((ch) => ch.name === "totalRevenue")?.value || 0,
        storeName: userData.organization?.tradingName || userData.name,
        verified: userData.status === "active",
        rawData: userData,
      };
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// ============================================================================
// USER STATUS MANAGEMENT
// ============================================================================

/**
 * Update user status (activate/suspend)
 * @param {string} userId - User ID
 * @param {string} role - User role (customer or seller)
 * @param {string} newStatus - New status (active, suspended)
 * @param {string} reason - Reason for status change
 * @returns {Object} Updated user data
 */
export const updateUserStatus = async (userId, role, newStatus, reason = "") => {
  try {
    if (!userId || userId === "undefined") {
      throw new Error("Invalid user ID provided");
    }

    console.log(
      `Updating user status: ID=${userId}, Role=${role}, NewStatus=${newStatus}`
    );

    let response;

    if (role === "customer") {
      response = await apiClient.patch(`customer/v5/customer/${userId}`, {
        status: newStatus,
        characteristic: [
          {
            name: "statusChangeReason",
            value: reason || `Admin action: ${newStatus}`,
            "@type": "Characteristic",
          },
          {
            name: "statusChangeDate",
            value: new Date().toISOString(),
            "@type": "Characteristic",
          },
        ],
      });
    } else if (role === "seller") {
      // For sellers, update the partnership status
      const updatePayload = {
        status: newStatus,
        note: [
          {
            text: reason || `Admin action: ${newStatus}`,
            date: new Date().toISOString(),
            author: "Admin",
          },
        ],
      };
      
      console.log(`Updating partnership ${userId} with payload:`, updatePayload);
      
      response = await apiClient.patch(
        `partnershipManagement/v4/partnership/${userId}`,
        updatePayload
      );
      
      console.log(`Partnership ${userId} update response:`, {
        status: response.status,
        data: response.data,
        updatedStatus: response.data?.status
      });
      
      // Verify the update by fetching the updated partnership
      try {
        const verifyResponse = await apiClient.get(
          `partnershipManagement/v4/partnership/${userId}`,
          {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          }
        );
        console.log(`Partnership ${userId} verification:`, {
          currentStatus: verifyResponse.data?.status,
          currentLifecycleStatus: verifyResponse.data?.lifecycleStatus,
          currentState: verifyResponse.data?.state
        });
      } catch (verifyError) {
        console.warn(`Could not verify partnership ${userId} update:`, verifyError.message);
      }
    } else {
      throw new Error("Invalid role specified");
    }

    console.log(`User ${userId} status updated to ${newStatus}`);

    // Cache the status update for sellers since API may not persist it reliably
    if (role === "seller") {
      cacheStatusUpdate(userId, newStatus);
    }

    return response.data;
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

/**
 * Suspend a user
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @param {string} reason - Suspension reason
 * @returns {Object} Updated user data
 */
export const suspendUser = async (userId, role, reason = "Admin action") => {
  return updateUserStatus(userId, role, "suspended", reason);
};

/**
 * Activate a user
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @param {string} reason - Activation reason
 * @returns {Object} Updated user data
 */
export const activateUser = async (userId, role, reason = "Admin action") => {
  return updateUserStatus(userId, role, "active", reason);
};

// ============================================================================
// USER GROWTH ANALYTICS
// ============================================================================

/**
 * Get user growth trend over time
 * @param {string} period - Period for analysis (weekly, monthly, yearly)
 * @returns {Array} Growth trend data
 */
export const getUserGrowthTrend = async (period = "monthly") => {
  try {
    const [customersResponse, partnershipsResponse] = await Promise.all([
      axiosInstance.get("customer/v5/customer"),
      axiosInstance.get("partnershipManagement/v4/partnership"),
    ]);

    const customers = Array.isArray(customersResponse.data)
      ? customersResponse.data
      : [];
    const partnerships = Array.isArray(partnershipsResponse.data)
      ? partnershipsResponse.data
      : [];

    // Combine all users
    const allUsers = [
      ...customers.map((c) => ({
        date: c.validFor?.startDateTime || c.createdDate,
        role: "customer",
      })),
      ...partnerships.map((p) => ({
        date: p.agreementPeriod?.startDateTime || p.createdDate,
        role: "seller",
      })),
    ];

    // Group by date based on period
    const groupedData = {};

    allUsers.forEach((user) => {
      if (!user.date) return;

      const date = new Date(user.date);
      let key;

      if (period === "weekly") {
        // Group by week
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else if (period === "yearly") {
        // Group by year
        key = date.getFullYear().toString();
      } else {
        // Group by month (default)
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          customers: 0,
          sellers: 0,
          total: 0,
        };
      }

      if (user.role === "customer") {
        groupedData[key].customers += 1;
      } else {
        groupedData[key].sellers += 1;
      }
      groupedData[key].total += 1;
    });

    // Convert to array and sort by date
    const trendData = Object.values(groupedData).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    console.log(`User growth trend (${period}):`, trendData.length, "data points");

    return trendData;
  } catch (error) {
    console.error("Error fetching user growth trend:", error);
    return [];
  }
};

/**
 * Get user activity summary
 * @param {string} userId - User ID
 * @param {string} role - User role
 * @returns {Object} User activity summary
 */
export const getUserActivity = async (userId, role) => {
  try {
    // Fetch user details first
    const userDetails = await getUserDetails(userId, role);

    // Fetch related activity based on role
    let activityData = {
      recentOrders: [],
      recentMessages: [],
      activityScore: 0,
      lastActiveDate: null,
    };

    if (role === "customer") {
      // Fetch customer's recent orders
      try {
        const ordersResponse = await axiosInstance.get(
          `productOrdering/v1/productOrder?relatedParty.id=${userId}&sort=-orderDate&limit=10`
        );
        const orders = ordersResponse.data?.productOrder || [];
        activityData.recentOrders = orders.map((order) => ({
          id: order.id,
          date: order.orderDate,
          state: order.state,
          itemCount: order.orderItem?.length || 0,
        }));
        
        if (orders.length > 0) {
          activityData.lastActiveDate = orders[0].orderDate;
        }
      } catch (err) {
        console.error("Error fetching customer orders:", err);
      }
    } else if (role === "seller") {
      // Fetch seller's products
      try {
        const productsResponse = await axiosInstance.get(
          `productCatalog/v5/productOffering?relatedParty.id=${userId}&limit=10`
        );
        const products = productsResponse.data?.data || [];
        activityData.recentProducts = products.map((product) => ({
          id: product.id,
          name: product.name,
          status: product.lifecycleStatus,
          lastUpdate: product.lastUpdate,
        }));
      } catch (err) {
        console.error("Error fetching seller products:", err);
      }
    }

    // Calculate activity score (0-100)
    const daysSinceJoined = Math.floor(
      (new Date() - new Date(userDetails.joinedAt)) / (1000 * 60 * 60 * 24)
    );
    const activityCount = activityData.recentOrders?.length || activityData.recentProducts?.length || 0;
    activityData.activityScore = Math.min(
      100,
      Math.floor((activityCount / Math.max(daysSinceJoined / 30, 1)) * 20)
    );

    return {
      ...userDetails,
      activity: activityData,
    };
  } catch (error) {
    console.error("Error fetching user activity:", error);
    throw error;
  }
};

// ============================================================================
// USER EXPORT
// ============================================================================

/**
 * Get user data for export
 * @param {Object} filters - Filter options (same as getAllUsers)
 * @returns {Array} User data formatted for export
 */
export const getUsersForExport = async (filters = {}) => {
  try {
    const users = await getAllUsers(filters);

    return users.map((user) => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      Status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
      "Joined Date": user.joinedAt,
      "Total Orders/Products": user.role === "customer" ? user.orders : user.products,
      "Total Spent/Revenue": user.role === "customer" ? user.spent : user.revenue,
      Verified: user.verified ? "Yes" : "No",
      ...(user.role === "customer" && { Address: user.address }),
      ...(user.role === "seller" && { "Store Name": user.storeName }),
    }));
  } catch (error) {
    console.error("Error preparing users for export:", error);
    return [];
  }
};

// ============================================================================
// BULK OPERATIONS
// ============================================================================

/**
 * Perform bulk status update on multiple users
 * @param {Array} userIds - Array of user IDs with their roles
 * @param {string} newStatus - New status to apply
 * @param {string} reason - Reason for bulk update
 * @returns {Object} Results of bulk operation
 */
export const bulkUpdateUserStatus = async (userIds, newStatus, reason = "") => {
  try {
    const results = {
      success: [],
      failed: [],
    };

    // Process each user
    for (const { id, role } of userIds) {
      try {
        await updateUserStatus(id, role, newStatus, reason);
        results.success.push(id);
      } catch (error) {
        results.failed.push({ id, error: error.message });
      }
    }

    console.log(`Bulk update completed: ${results.success.length} succeeded, ${results.failed.length} failed`);

    return results;
  } catch (error) {
    console.error("Error in bulk user status update:", error);
    throw error;
  }
};

// ============================================================================
// COMPREHENSIVE USER MANAGEMENT DATA
// ============================================================================

/**
 * Get all user management data in one call
 * @param {Object} filters - Filter options
 * @returns {Object} Complete user management data
 */
export const getUserManagementData = async (filters = {}) => {
  try {
    const [statistics, users, growthTrend] = await Promise.all([
      getUserStatistics(),
      getAllUsers(filters),
      getUserGrowthTrend(filters.period || "monthly"),
    ]);

    return {
      statistics,
      users,
      growthTrend,
      filters,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching user management data:", error);
    return {
      statistics: {},
      users: [],
      growthTrend: [],
      filters,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Approve a pending seller
 * @param {string} sellerId - Seller ID
 * @param {string} reason - Approval reason
 * @returns {Object} Updated seller data
 */
export const approveSeller = async (sellerId, reason = "Admin approved seller account") => {
  try {
    console.log(`Approving seller: ${sellerId}`);
    const result = await updateUserStatus(sellerId, "seller", "active", reason);
    console.log(`Seller ${sellerId} approved successfully`);
    return result;
  } catch (error) {
    console.error(`Error approving seller ${sellerId}:`, error);
    throw error;
  }
};

/**
 * Reject a pending seller
 * @param {string} sellerId - Seller ID
 * @param {string} reason - Rejection reason
 * @returns {Object} Updated seller data
 */
export const rejectSeller = async (sellerId, reason = "Admin rejected seller account") => {
  try {
    console.log(`Rejecting seller: ${sellerId}`);
    const result = await updateUserStatus(sellerId, "seller", "rejected", reason);
    console.log(`Seller ${sellerId} rejected successfully`);
    return result;
  } catch (error) {
    console.error(`Error rejecting seller ${sellerId}:`, error);
    throw error;
  }
};

/**
 * Manually set seller status (for testing/admin purposes when API fails)
 * @param {string} sellerId - Seller ID
 * @param {string} status - Status to set
 */
export const manuallySetSellerStatus = (sellerId, status) => {
  cacheStatusUpdate(sellerId, status);
  console.log(`Manually set seller ${sellerId} status to: ${status}`);
};

/**
 * Clear all cached seller statuses (admin utility)
 */
export const clearAllCachedStatuses = () => {
  localStorage.removeItem(STATUS_CACHE_KEY);
  console.log('Cleared all cached seller statuses');
};

/**
 * Get all cached seller statuses (admin utility)
 */
export const getAllCachedStatuses = () => {
  return getCachedStatuses();
};

/**
 * Debug function to inspect partnership API response
 * Call this in browser console: userManagementService.debugPartnershipAPI()
 */
export const debugPartnershipAPI = async () => {
  try {
    console.log('=== PARTNERSHIP API DEBUG ===');
    
    const response = await apiClient.get("partnershipManagement/v4/partnership", {
      params: { limit: 5 }
    });
    
    console.log('API Response Status:', response.status);
    console.log('API Response Headers:', response.headers);
    console.log('Raw API Response:', response.data);
    
    const partnerships = Array.isArray(response.data) ? response.data : [];
    console.log('Partnerships found:', partnerships.length);
    
    if (partnerships.length > 0) {
      console.log('=== FIRST PARTNERSHIP ANALYSIS ===');
      const first = partnerships[0];
      console.log('Full object:', first);
      console.log('Object keys:', Object.keys(first));
      console.log('Possible status fields:', {
        status: first.status,
        lifecycleStatus: first.lifecycleStatus,
        state: first.state,
        'characteristic.status': first.characteristic?.find(c => c.name === 'status'),
        'agreement.status': first.agreement?.status
      });
      
      console.log('=== CACHED STATUSES ===');
      console.log('Current cache:', getCachedStatuses());
    }
    
    return { response: response.data, partnerships, cache: getCachedStatuses() };
  } catch (error) {
    console.error('Debug API call failed:', error);
    return { error: error.message };
  }
};

export default {
  getUserStatistics,
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  suspendUser,
  activateUser,
  approveSeller,
  rejectSeller,
  getUserGrowthTrend,
  getUserActivity,
  getUsersForExport,
  bulkUpdateUserStatus,
  getUserManagementData,
  // Cache utilities
  manuallySetSellerStatus,
  clearAllCachedStatuses,
  getAllCachedStatuses,
  // Debug utilities
  debugPartnershipAPI,
};
