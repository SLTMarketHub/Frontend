/*
Orders Service - Admin Panel

Integrates with TMF622 Product Ordering and TMF678 Trouble Ticket APIs to manage orders.

Key Functions:
  • getAllOrders - Fetch all product orders
  • getOrdersStats - Get statistics for orders (pending, completed, cancelled, etc.)
  • getOrder - Get individual order details
  • updateOrderStatus - Update order status/state
  • processRefund - Process refund using trouble ticket API
  • resolveDispute - Resolve order dispute
*/

import { axiosInstance } from "../axiosInstance";

/**
 * Get all orders from the backend
 * @param {Object} filters - Optional filters (state, dateFrom, dateTo, etc.)
 * @returns {Promise} Orders list with details
 */
export const getAllOrders = async (filters = {}) => {
  try {
    console.log("Fetching all orders...");

    // Build query params
    const params = new URLSearchParams();
    
    // Add state filter if provided
    if (filters.state) {
      params.append("state", filters.state);
    }

    // Add date range filters if provided
    if (filters.dateFrom) {
      params.append("orderDate.ge", filters.dateFrom);
    }
    if (filters.dateTo) {
      params.append("orderDate.le", filters.dateTo);
    }

    const queryString = params.toString();
    const url = queryString 
      ? `productOrdering/v1/productOrder?${queryString}`
      : `productOrdering/v1/productOrder`;

    const response = await axiosInstance.get(url);

    // Handle response - orders come in data.productOrder array
    const data = response.data;
    const orders = Array.isArray(data.productOrder) 
      ? data.productOrder 
      : (Array.isArray(data) ? data : []);

    console.log(`Found ${orders.length} orders`);

    // Transform orders to format expected by frontend
    const transformedOrders = orders.map((order) => {
      const customer = order.relatedParty?.find(p => p.role === "customer");
      const seller = order.relatedParty?.find(p => p.role === "seller");
      
      // Calculate total amount from order items
      const amount = order.orderItem?.reduce((sum, item) => {
        const itemPrice = item.itemPrice?.[0]?.price?.value || 0;
        const quantity = item.quantity || 1;
        return sum + (itemPrice * quantity);
      }, 0) || 0;

      return {
        id: order._id || order.externalId || order.id, // Handle _id, externalId, or id
        customer: customer?.name || "Unknown Customer",
        seller: seller?.name || "Unknown Seller",
        date: order.orderDate || new Date().toISOString(),
        status: mapOrderStatus(order.state),
        amount: amount,
        state: order.state,
        itemCount: order.orderItem?.length || 0,
        // Raw order data for reference
        _raw: order
      };
    });

    return transformedOrders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    // Return empty array on error to prevent UI crashes
    return [];
  }
};

/**
 * Map TMF order state to frontend status
 * @param {string} state - TMF order state
 * @returns {string} Frontend status
 */
const mapOrderStatus = (state) => {
  if (!state) return "pending";
  
  const statusMap = {
    "acknowledged": "confirmed",
    "inProgress": "processing",
    "pending": "pending",
    "held": "pending",
    "cancelled": "cancelled",
    "completed": "delivered",
    "failed": "cancelled",
    "partial": "processing"
  };

  return statusMap[state] || "pending";
};

/**
 * Get order statistics
 * @returns {Promise} Statistics object with counts
 */
export const getOrdersStats = async () => {
  try {
    console.log("Fetching order statistics...");

    // Fetch all orders and calculate stats
    const allOrders = await getAllOrders();

    const stats = {
      total: allOrders.length,
      pending: allOrders.filter(o => o.status === "pending").length,
      confirmed: allOrders.filter(o => o.status === "confirmed").length,
      processing: allOrders.filter(o => o.status === "processing").length,
      delivered: allOrders.filter(o => o.status === "delivered").length,
      cancelled: allOrders.filter(o => o.status === "cancelled").length,
      totalRevenue: allOrders.reduce((sum, o) => sum + o.amount, 0),
    };

    console.log("Order stats:", stats);
    return stats;
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      processing: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
    };
  }
};

/**
 * Get individual order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise} Order details
 */
export const getOrder = async (orderId) => {
  try {
    console.log(`Fetching order details for ID: ${orderId}`);

    const response = await axiosInstance.get(
      `productOrdering/v1/productOrder/${orderId}`
    );

    const order = response.data;
    const customer = order.relatedParty?.find(p => p.role === "customer");
    const seller = order.relatedParty?.find(p => p.role === "seller");
    
    // Calculate total amount from order items
    const amount = order.orderItem?.reduce((sum, item) => {
      const itemPrice = item.itemPrice?.[0]?.price?.value || 0;
      const quantity = item.quantity || 1;
      return sum + (itemPrice * quantity);
    }, 0) || 0;

    // Transform to frontend format
    const transformedOrder = {
      id: order._id || order.externalId || order.id, // Handle _id, externalId, or id
      customer: customer?.name || "Unknown Customer",
      seller: seller?.name || "Unknown Seller",
      date: order.orderDate || new Date().toISOString(),
      status: mapOrderStatus(order.state),
      amount: amount,
      state: order.state,
      itemCount: order.orderItem?.length || 0,
      _raw: order
    };

    console.log("Order details fetched:", transformedOrder);
    return transformedOrder;
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Update order status/state
 * @param {string} orderId - Order ID
 * @param {string} newStatus - New status (pending, confirmed, processing, delivered, cancelled)
 * @returns {Promise} Updated order
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    console.log(`Updating order ${orderId} status to ${newStatus}...`);

    // Map frontend status to TMF state
    const stateMap = {
      "pending": "pending",
      "confirmed": "acknowledged",
      "processing": "inProgress",
      "delivered": "completed",
      "cancelled": "cancelled"
    };

    const tmfState = stateMap[newStatus] || newStatus;

    const updateData = {
      state: tmfState
    };

    const response = await axiosInstance.patch(
      `productOrdering/v1/productOrder/${orderId}`,
      updateData
    );

    console.log(`Order ${orderId} status updated successfully`);
    return response.data;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};

/**
 * Process refund for an order using trouble ticket API (TMF678)
 * @param {string} orderId - Order ID
 * @param {number} amount - Refund amount
 * @param {string} reason - Reason for refund
 * @returns {Promise} Trouble ticket for refund
 */
export const processRefund = async (orderId, amount, reason = "") => {
  try {
    console.log(`Processing refund for order ${orderId}, amount: ${amount}`);

    // Create a trouble ticket for the refund
    const troubleTicketData = {
      description: `Refund request for order ${orderId}`,
      severity: "medium",
      type: "refund",
      ticketType: "refund",
      status: "open",
      relatedObject: [
        {
          id: orderId,
          type: "ProductOrder",
          role: "refundOrder"
        }
      ],
      note: [
        {
          text: `Refund amount: ${amount}. Reason: ${reason}`,
          date: new Date().toISOString()
        }
      ]
    };

    const response = await axiosInstance.post(
      "customerBill/v5/troubleTicket",
      troubleTicketData
    );

    console.log(`Refund trouble ticket created for order ${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error processing refund for order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Resolve order dispute
 * @param {string} orderId - Order ID
 * @param {string} resolution - Resolution details
 * @returns {Promise} Updated order or trouble ticket
 */
export const resolveDispute = async (orderId, resolution) => {
  try {
    console.log(`Resolving dispute for order ${orderId}...`);

    // Create a trouble ticket for the dispute resolution
    const troubleTicketData = {
      description: `Dispute resolution for order ${orderId}`,
      severity: "high",
      type: "dispute",
      ticketType: "dispute",
      status: "resolved",
      relatedObject: [
        {
          id: orderId,
          type: "ProductOrder",
          role: "disputeOrder"
        }
      ],
      note: [
        {
          text: `Resolution: ${resolution}`,
          date: new Date().toISOString()
        }
      ]
    };

    const response = await axiosInstance.post(
      "customerBill/v5/troubleTicket",
      troubleTicketData
    );

    console.log(`Dispute resolved for order ${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error resolving dispute for order ${orderId}:`, error);
    throw error;
  }
};
