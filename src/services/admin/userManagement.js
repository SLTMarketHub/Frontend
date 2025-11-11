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
import axios from 'axios';
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
// CUSTOMER ENRICHMENT FROM ORDERS & BILLING DATA
// ============================================================================

/**
 * Get customer order and billing statistics
 * @param {string} customerId - Customer ID
 * @returns {Object} Customer order stats
 */
export const getCustomerOrderStats = async (customerId, customerData = null) => {
  try {
    console.log(`Fetching order stats for customer ${customerId}...`);
    
    // Get the auth user ID from customer data if provided
    const authUserId = customerData?.engagedParty?.id || customerId;
    console.log(`Customer ID: ${customerId}, Auth User ID: ${authUserId}`);
    
    // Fetch all bills and orders from the APIs (same way as dashboard)
    const [billsResponse, ordersResponse] = await Promise.allSettled([
      axiosInstance.get("customerBill/v5/customerBill"),
      axiosInstance.get("productOrdering/v1/productOrder")
    ]);

    console.log(`Bills API response for ${customerId}:`, 
      billsResponse.status === 'fulfilled' ? billsResponse.value.data : billsResponse.reason);
    console.log(`Orders API response for ${customerId}:`, 
      ordersResponse.status === 'fulfilled' ? ordersResponse.value.data : ordersResponse.reason);

    const allBills = billsResponse.status === 'fulfilled' && Array.isArray(billsResponse.value.data) 
      ? billsResponse.value.data : [];
    const allOrders = ordersResponse.status === 'fulfilled' && Array.isArray(ordersResponse.value.data?.productOrder) 
      ? ordersResponse.value.data.productOrder : [];

    // Debug: Log the structure of bills and orders to understand how to filter
    if (allBills.length > 0) {
      console.log(`Sample bill structure:`, {
        fullBill: allBills[0],
        billKeys: Object.keys(allBills[0]),
        relatedParty: allBills[0].relatedParty,
        customer: allBills[0].customer,
        billingAccount: allBills[0].billingAccount
      });
    }
    
    if (allOrders.length > 0) {
      console.log(`Sample order structure:`, {
        fullOrder: allOrders[0],
        orderKeys: Object.keys(allOrders[0]),
        relatedParty: allOrders[0].relatedParty,
        customer: allOrders[0].customer,
        billingAccount: allOrders[0].billingAccount
      });
    }

    // Filter bills and orders for this specific customer using auth user ID
    const customerBills = allBills.filter(bill => {
      const billCustomerId = bill.relatedParty?.find(party => party.role === 'customer' || party.role === 'Customer')?.id;
      const altCustomerId = bill.customer?.id || bill.billingAccount?.relatedParty?.find(p => p.role === 'customer')?.id;
      
      console.log(`Bill filtering for ${customerId}:`, {
        billId: bill.id,
        billCustomerId,
        altCustomerId,
        authUserId,
        relatedParty: bill.relatedParty,
        matches: billCustomerId === customerId || billCustomerId === authUserId || altCustomerId === customerId || altCustomerId === authUserId
      });
      
      return billCustomerId === customerId || billCustomerId === authUserId || altCustomerId === customerId || altCustomerId === authUserId;
    });

    const customerOrders = allOrders.filter(order => {
      const orderCustomerId = order.relatedParty?.find(party => party.role === 'customer' || party.role === 'Customer')?.id;
      const altCustomerId = order.customer?.id || order.billingAccount?.relatedParty?.find(p => p.role === 'customer')?.id;
      
      console.log(`Order filtering for ${customerId}:`, {
        orderId: order.id,
        orderCustomerId,
        altCustomerId,
        authUserId,
        relatedParty: order.relatedParty,
        matches: orderCustomerId === customerId || orderCustomerId === authUserId || altCustomerId === customerId || altCustomerId === authUserId
      });
      
      return orderCustomerId === customerId || orderCustomerId === authUserId || altCustomerId === customerId || altCustomerId === authUserId;
    });

    console.log(`Found ${customerBills.length} bills and ${customerOrders.length} orders for customer ${customerId}`);
    
    if (customerBills.length > 0) {
      console.log(`Sample bill for ${customerId}:`, customerBills[0]);
    }
    if (customerOrders.length > 0) {
      console.log(`Sample order for ${customerId}:`, customerOrders[0]);
    }

    // Calculate total spent from settled bills
    const totalSpent = customerBills
      .filter(bill => bill.state === 'settled')
      .reduce((sum, bill) => {
        const amount = bill.taxIncludedAmount?.amount || 0;
        return sum + parseFloat(amount);
      }, 0);

    // Get last order date
    const lastOrderDate = customerOrders.length > 0 
      ? customerOrders.reduce((latest, order) => {
          const orderDate = new Date(order.orderDate || 0);
          return orderDate > new Date(latest) ? order.orderDate : latest;
        }, customerOrders[0].orderDate)
      : null;

    // Calculate average order value
    const averageOrderValue = totalSpent > 0 && customerOrders.length > 0 
      ? totalSpent / customerOrders.length 
      : 0;

    const result = {
      orders: customerOrders.length,
      spent: totalSpent,
      lastOrderDate,
      averageOrderValue,
      verified: customerBills.length > 0 // Customer is verified if they have billing history
    };

    console.log(`Order stats for customer ${customerId}:`, result);
    return result;
  } catch (error) {
    console.error(`Error fetching order stats for customer ${customerId}:`, error);
    return {
      orders: 0,
      spent: 0,
      lastOrderDate: null,
      averageOrderValue: 0,
      verified: false
    };
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

    const pendingCustomers = customers.filter((c) => {
      const status = c.status || c.lifecycleStatus || c.state;
      const isPending = (
        status === "pending" ||
        status === "Pending" ||
        status === "PENDING" ||
        status === "pendingapproval" ||
        status === "PendingApproval" ||
        status === "PENDINGAPPROVAL"
      );
      
      // Debug logging for pending customers
      if (isPending) {
        console.log(`Found pending customer:`, {
          id: c._id || c.id,
          name: c.name,
          status: status,
          createdDate: c.validFor?.startDateTime || c.createdDate
        });
      }
      
      return isPending;
    }).length;
    
    console.log(`DEBUG: Total customers: ${totalCustomers}, Pending customers: ${pendingCustomers}`);

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
      
      // Debug logging for all sellers
      console.log(`Seller ${p._id || p.id} status: "${status}"`);
      
      if (status === 'active') activeSellers++;
      else if (status === 'pending' || status === 'pendingapproval') {
        pendingSellers++;
        console.log(`Found pending seller:`, {
          id: p._id || p.id,
          name: p.name || p.organization?.tradingName,
          status: status
        });
      }
      else if (status === 'suspended' || status === 'inactive') suspendedSellers++;
    });
    
    console.log(`DEBUG: Total sellers: ${totalSellers}, Active: ${activeSellers}, Pending: ${pendingSellers}, Suspended: ${suspendedSellers}`);

    // Fallback if all are zero AND we don't have cached statuses
    if (activeSellers === 0 && pendingSellers === 0 && suspendedSellers === 0 && totalSellers > 0) {
      const hasStatusField = partnerships.some(
        (p) => p.status || p.lifecycleStatus || p.state
      );
      const hasCachedStatus = partnerships.some(p => getCachedStatus(p._id || p.id));
      
      if (!hasStatusField && !hasCachedStatus) {
        console.warn(
          "No status field found on partnerships and no cached statuses – defaulting to 80% active / 20% pending"
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
      pendingCustomers,
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
      "Pending Customers": pendingCustomers,
      "Pending Sellers": pendingSellers,
      "Total Pending (pendingUsers)": pendingCustomers + pendingSellers,
    });

    const finalStats = {
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
      pendingUsers: pendingCustomers + pendingSellers,
      pendingCustomers,
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
    
    console.log("FINAL STATISTICS BEING RETURNED:", finalStats);
    return finalStats;
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
      pendingUsers: 0,
      pendingCustomers: 0,
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

      const formattedCustomers = customers.map((c) => {
        const customerId = c._id || c.id;
        
        // Check for customer status with smart defaults
        let customerStatus = c.status || c.lifecycleStatus || c.state;
        
        // Check for status in characteristics if not found at top level
        if (!customerStatus && c.characteristic) {
          const statusChar = c.characteristic.find(ch => 
            ch.name === 'status' || ch.name === 'lifecycleStatus' || ch.name === 'state'
          );
          customerStatus = statusChar?.value;
        }
        
        // If still no status found, use smart defaults based on creation date
        if (!customerStatus) {
          const createdDate = new Date(c.validFor?.startDateTime || c.createdDate || 0);
          const now = new Date();
          const daysSinceCreated = (now - createdDate) / (1000 * 60 * 60 * 24);
          
          // If created recently (less than 7 days) and no status, assume pending
          // Otherwise, assume active (existing customers)
          if (daysSinceCreated < 7) {
            customerStatus = "pending";
            console.log(`Customer ${customerId} has no status field, defaulting to 'pending' (created ${daysSinceCreated.toFixed(1)} days ago)`);
          } else {
            customerStatus = "active";
            console.log(`Customer ${customerId} has no status field, defaulting to 'active' (created ${daysSinceCreated.toFixed(1)} days ago)`);
          }
        }
        
        // Normalize status values
        if (typeof customerStatus === 'string') {
          customerStatus = customerStatus.toLowerCase();
        }
        
        // Extract email with correct structure
        let email = "N/A";
        if (c.contactMedium && c.contactMedium.length > 0) {
          const contact = c.contactMedium[0];
          email = contact.emailAddress || "N/A";
        }
        
        // Extract phone with correct structure  
        let phone = "N/A";
        if (c.contactMedium && c.contactMedium.length > 0) {
          const contact = c.contactMedium[0];
          phone = contact.phoneNumber || "N/A";
        }
        
        // Extract address with correct structure
        let address = "N/A";
        if (c.address) {
          const addressParts = [
            c.address.street1,
            c.address.street2,
            c.address.city,
            c.address.state,
            c.address.postalCode
          ].filter(part => part && part.trim() !== "");
          
          address = addressParts.length > 0 ? addressParts.join(", ") : "N/A";
        }
        
        // Extract joined date with correct structure
        let joinedAt = new Date().toISOString();
        if (c.createdAt) {
          joinedAt = c.createdAt;
        } else if (c.validFor?.startDateTime) {
          joinedAt = c.validFor.startDateTime;
        } else if (c.createdDate) {
          joinedAt = c.createdDate;
        }
        
        // Debug: Log extracted contact information
        console.log(`DEBUG: Extracted customer data for ${customerId}:`, {
          email: email,
          phone: phone,
          address: address,
          joinedAt: joinedAt,
          hasContactMedium: !!c.contactMedium,
          hasAddress: !!c.address,
          hasCreatedAt: !!c.createdAt,
          hasCharacteristic: !!c.characteristic
        });
        
        return {
          id: customerId,
          _id: customerId,
          name: c.name || `${c.givenName || ""} ${c.familyName || ""}`.trim() || "Unknown",
          email: email,
          phone: phone,
          role: "customer",
          status: customerStatus,
          joinedAt: joinedAt,
          
          // Customer-specific fields
          orders: c.characteristic?.find((ch) => ch.name === "totalOrders")?.value || 0,
          spent: c.characteristic?.find((ch) => ch.name === "totalSpent")?.value || 0,
          address: address,
          verified: c.characteristic?.find((ch) => ch.name === "verified")?.value || false,
          
          // Additional details
          lastOrderDate: c.characteristic?.find((ch) => ch.name === "lastOrderDate")?.value,
          averageOrderValue: c.characteristic?.find((ch) => ch.name === "averageOrderValue")?.value || 0,
          
          // Raw data for detailed view
          rawData: c,
        };
      });

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
 * Enhanced customer data with order/billing information
 * @param {Array} customers - Array of customer objects from getAllUsers
 * @returns {Array} Customers with enhanced order/billing data
 */
export const getCustomersWithOrderData = async (customers = []) => {
  try {
    const customerIds = customers.filter(u => u.role === 'customer').map(u => u.id);
    
    if (customerIds.length === 0) {
      return customers;
    }

    console.log(`Fetching order data for ${customerIds.length} customers...`);
    
    // Fetch order stats for all customers with their raw data
    const orderStatsPromises = customers.filter(c => c.role === 'customer').map(customer => 
      getCustomerOrderStats(customer.id, customer.rawData)
    );
    const orderStatsResults = await Promise.allSettled(orderStatsPromises);

    // Create a map of customer ID to order stats
    const orderStatsMap = {};
    customers.filter(c => c.role === 'customer').forEach((customer, index) => {
      const result = orderStatsResults[index];
      if (result.status === 'fulfilled') {
        orderStatsMap[customer.id] = result.value;
      } else {
        console.warn(`Failed to fetch order stats for customer ${customer.id}:`, result.reason);
        orderStatsMap[customer.id] = {
          orders: 0,
          spent: 0,
          lastOrderDate: null,
          averageOrderValue: 0,
          verified: false
        };
      }
    });

    // Enhance customers with order data
    return customers.map(user => {
      if (user.role === 'customer' && orderStatsMap[user.id]) {
        const orderStats = orderStatsMap[user.id];
        return {
          ...user,
          orders: orderStats.orders,
          spent: orderStats.spent,
          lastOrderDate: orderStats.lastOrderDate,
          averageOrderValue: orderStats.averageOrderValue,
          verified: orderStats.verified,
          // Keep the original values as fallback
          _originalOrders: user.orders,
          _originalSpent: user.spent,
          _originalVerified: user.verified
        };
      }
      return user;
    });
  } catch (error) {
    console.error('Error enhancing customer data with order information:', error);
    return customers; // Return original data if enhancement fails
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
 * Approve a pending customer
 * @param {string} customerId - Customer ID
 * @param {string} reason - Approval reason
 * @returns {Object} Updated customer data
 */
export const approveCustomer = async (customerId, reason = "Admin approved customer account") => {
  try {
    console.log(`Approving customer: ${customerId}`);
    const result = await updateUserStatus(customerId, "customer", "active", reason);
    console.log(`Customer ${customerId} approved successfully`);
    return result;
  } catch (error) {
    console.error(`Error approving customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Reject a pending customer
 * @param {string} customerId - Customer ID
 * @param {string} reason - Rejection reason
 * @returns {Object} Updated customer data
 */
export const rejectCustomer = async (customerId, reason = "Admin rejected customer account") => {
  try {
    console.log(`Rejecting customer: ${customerId}`);
    const result = await updateUserStatus(customerId, "customer", "rejected", reason);
    console.log(`Customer ${customerId} rejected successfully`);
    return result;
  } catch (error) {
    console.error(`Error rejecting customer ${customerId}:`, error);
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
  getCustomersWithOrderData,
  getUserDetails,
  updateUserStatus,
  suspendUser,
  activateUser,
  approveSeller,
  rejectSeller,
  approveCustomer,
  rejectCustomer,
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
