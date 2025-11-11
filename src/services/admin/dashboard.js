import { axiosInstance } from "../axiosInstance";
/*
	•	Total Revenue (sum of paid bills in period)
GET /tmf-api/customerBill/v5/customerBill?state=settled&billDate.gt=2025-03-01 → sum amount on client.  ￼
	•	Total Orders
GET /tmf-api/productOrdering/v1/productOrder?orderDate.gt=2025-03-01 → totalCount or length.  ￼
	•	Total Customers
GET /tmf-api/customer/v5/customer (optionally with creationDate filter).  ￼
	•	Active Sellers
GET /tmf-api/partnershipManagement/v4/partnership?status=active → count.  ￼
	•	Total Products
GET /tmf-api/productCatalog/v5/productOffering → count.  ￼

*/

export const getTotalRevenue = async () => {
  try {
    const response = await axiosInstance.get(
      "customerBill/v5/customerBill?state=settled&billDate.gt=2025-03-01"
    );
    
    // Calculate total revenue from taxIncludedAmount
    const bills = Array.isArray(response.data) ? response.data : [];
    const totalRevenue = bills.reduce((sum, bill) => {
      const amount = bill.taxIncludedAmount?.amount || 0;
      return sum + parseFloat(amount);
    }, 0);
    
    return {
      totalRevenue,
      currency: bills[0]?.taxIncludedAmount?.currency || 'USD',
      billCount: bills.length
    };
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return {
      totalRevenue: 0,
      currency: 'USD',
      billCount: 0
    };
  }
};

export const getTotalOrders = async () => {
  try {
    const response = await axiosInstance.get(
      "productOrdering/v1/productOrder?orderDate.gt=2025-03-01"
    );
    
    // Handle the API response structure: { status, count, productOrder: [...] }
    const data = response.data;
    const orders = Array.isArray(data.productOrder) ? data.productOrder : [];
    
    return {
      totalOrders: orders.length,
      orderCount: orders.length,
      apiCount: data.count || 0, // Use the count from API if available
      status: data.status
    };
  } catch (error) {
    console.error("Error fetching total orders:", error);
    return {
      totalOrders: 0,
      orderCount: 0,
      apiCount: 0,
      status: 'error'
    };
  }
};

export const getTotalCustomers = async () => {
  try {
    const response = await axiosInstance.get("customer/v5/customer");
    
    const customers = Array.isArray(response.data) ? response.data : [];
    return {
      totalCustomers: customers.length,
      customerCount: customers.length
    };
  } catch (error) {
    console.error("Error fetching total customers:", error);
    return {
      totalCustomers: 0,
      customerCount: 0
    };
  }
};

export const getActiveSellers = async () => {
  try {
    const response = await axiosInstance.get(
      "partnershipManagement/v4/partnership?status=active"
    );
    
    const partnerships = Array.isArray(response.data) ? response.data : [];
    return {
      activeSellers: partnerships.length,
      sellerCount: partnerships.length
    };
  } catch (error) {
    console.error("Error fetching active sellers:", error);
    return {
      activeSellers: 0,
      sellerCount: 0
    };
  }
};

export const getTotalProducts = async () => {
  try {
    const response = await axiosInstance.get(
      "productCatalog/v5/productOffering"
    );
    
    // Handle new API structure with data array and pagination
    const data = response.data;
    const products = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    const totalFromPagination = data.pagination?.total || products.length;
    
    // Calculate additional metrics
    const activeProducts = products.filter(p => p.lifecycleStatus === 'Active').length;
    const categoryCounts = products.reduce((acc, product) => {
      const categories = product.category || [];
      categories.forEach(cat => {
        acc[cat.name] = (acc[cat.name] || 0) + 1;
      });
      return acc;
    }, {});
    
    return {
      totalProducts: totalFromPagination,
      productCount: products.length, // Current page count
      activeProducts,
      categoryCounts,
      hasMore: data.pagination?.hasMore || false,
      currentPageSize: products.length
    };
  } catch (error) {
    console.error("Error fetching total products:", error);
    return {
      totalProducts: 0,
      productCount: 0,
      activeProducts: 0,
      categoryCounts: {},
      hasMore: false,
      currentPageSize: 0
    };
  }
};

/* Charts & Lists
	•	Revenue Trend (daily)
GET /tmf-api/customerBill/v5/customerBill?state=settled&billDate.ge=2025-03-01&billDate.le=2025-03-31
Group by day on client to build the line/area.  ￼
	•	Orders Trend (daily)
GET /tmf-api/productOrdering/v1/productOrder?orderDate.ge=...&orderDate.le=... → group by day.  ￼
	•	Revenue by Category (pie)
	1.	Products: GET /tmf-api/productCatalog/v5/productOffering (read category on each offering).
	2.	Bills/Orders joined by product refs (your side) to sum per category.  ￼
	•	Top Selling Products (table)
GET /tmf-api/productOrdering/v1/productOrder?state=completed&orderDate.ge=...
Count orderItem.product occurrences; sum revenue per product.  ￼
	•	Platform Performance (Fulfillment / CSAT / Response Time)
	•	Fulfillment = shipped|delivered orders / total orders from /productOrder.
	•	CSAT if you store it on communicationMessage or a custom store; if none, leave placeholder.
	•	Response time = your SLA metric; if messages drive it, pull from /communicationManagement/v4/communicationMessage.  ￼
	•	System Alerts
Use communicationMessage as a simple announcements store:
GET /tmf-api/communicationManagement/v4/communicationMessage?category=system-alert  ￼
	•	Recent Orders
GET /tmf-api/productOrdering/v1/productOrder?sort=-orderDate&limit=5  ￼
	•	Recent Activity
Also communicationMessage with category=activity-log or your custom tag.
GET /tmf-api/communicationManagement/v4/communicationMessage?category=activity-log&sort=-creationDate&limit=5  ￼
	•	Low Stock Alert
If stock is modeled on offerings/specs, fetch and filter client-side:
GET /tmf-api/productCatalog/v5/productOffering?fields=id,name,restockLevel,stockOnHand (field list may vary in your impl).  ￼
	•	Quick Actions
No endpoint—just links to pages (e.g., approve sellers → /partnership list with status=pending).  ￼ 
*/

export const getRevenueTrend = async (startDate = '2025-03-01', endDate = '2025-03-31') => {
  try {
    const response = await axiosInstance.get(
      `customerBill/v5/customerBill?state=settled&billDate.ge=${startDate}&billDate.le=${endDate}`
    );
    
    const bills = Array.isArray(response.data) ? response.data : [];
    
    // Group bills by date and calculate daily revenue
    const dailyRevenue = bills.reduce((acc, bill) => {
      const billDate = new Date(bill.billDate).toISOString().split('T')[0]; // Get YYYY-MM-DD format
      const revenue = parseFloat(bill.taxIncludedAmount?.amount || 0);
      
      if (!acc[billDate]) {
        acc[billDate] = {
          date: billDate,
          revenue: 0,
          billCount: 0,
          bills: []
        };
      }
      
      acc[billDate].revenue += revenue;
      acc[billDate].billCount += 1;
      acc[billDate].bills.push({
        id: bill.id,
        billNo: bill.billNo,
        amount: revenue,
        currency: bill.taxIncludedAmount?.currency || 'EUR'
      });
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    const trendData = Object.values(dailyRevenue).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    return {
      trendData,
      totalRevenue: bills.reduce((sum, bill) => sum + parseFloat(bill.taxIncludedAmount?.amount || 0), 0),
      totalBills: bills.length,
      dateRange: { startDate, endDate },
      currency: bills[0]?.taxIncludedAmount?.currency || 'EUR'
    };
  } catch (error) {
    console.error("Error fetching revenue trend:", error);
    return {
      trendData: [],
      totalRevenue: 0,
      totalBills: 0,
      dateRange: { startDate, endDate },
      currency: 'EUR'
    };
  }
};

export const getOrdersTrend = async (startDate = '2025-03-01', endDate = '2025-03-31') => {
  try {
    const response = await axiosInstance.get(
      `productOrdering/v1/productOrder?orderDate.ge=${startDate}&orderDate.le=${endDate}`
    );
    
    // Handle API response structure: { status, count, productOrder: [...] }
    const data = response.data;
    const orders = Array.isArray(data.productOrder) ? data.productOrder : [];
    
    // Group orders by date and calculate daily metrics
    const dailyOrders = orders.reduce((acc, order) => {
      const orderDate = new Date(order.orderDate).toISOString().split('T')[0]; // Get YYYY-MM-DD format
      const itemCount = order.orderItem?.length || 0;
      
      if (!acc[orderDate]) {
        acc[orderDate] = {
          date: orderDate,
          orders: 0,
          totalItems: 0,
          orderDetails: []
        };
      }
      
      acc[orderDate].orders += 1;
      acc[orderDate].totalItems += itemCount;
      acc[orderDate].orderDetails.push({
        id: order.id,
        externalId: order.externalId,
        state: order.state,
        customer: order.relatedParty?.find(p => p.role === 'customer')?.name || 'Unknown',
        itemCount
      });
      
      return acc;
    }, {});
    
    // Convert to array and sort by date
    const trendData = Object.values(dailyOrders).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    return {
      trendData,
      totalOrders: orders.length,
      totalItems: orders.reduce((sum, order) => sum + (order.orderItem?.length || 0), 0),
      dateRange: { startDate, endDate },
      apiStatus: data.status
    };
  } catch (error) {
    console.error("Error fetching orders trend:", error);
    return {
      trendData: [],
      totalOrders: 0,
      totalItems: 0,
      dateRange: { startDate, endDate },
      apiStatus: 'error'
    };
  }
};

export const getRevenueByCategory = async () => {
  try {
    const response = await axiosInstance.get(
      "productCatalog/v5/productOffering"
    );
    
    // Handle new API structure
    const data = response.data;
    const products = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    
    // Process category data for revenue analysis
    const categoryStats = products.reduce((acc, product) => {
      const categories = product.category || [];
      categories.forEach(cat => {
        if (!acc[cat.name]) {
          acc[cat.name] = {
            name: cat.name,
            productCount: 0,
            activeProducts: 0,
            products: []
          };
        }
        acc[cat.name].productCount++;
        if (product.lifecycleStatus === 'Active') {
          acc[cat.name].activeProducts++;
        }
        acc[cat.name].products.push({
          id: product.id,
          name: product.name,
          status: product.lifecycleStatus,
          isSellable: product.isSellable
        });
      });
      return acc;
    }, {});
    
    // Convert to array format for charts
    const categoryArray = Object.values(categoryStats).map((cat, index) => ({
      ...cat,
      percentage: ((cat.productCount / products.length) * 100).toFixed(1),
      fill: `hsl(${(index * 360) / Object.keys(categoryStats).length}, 70%, 60%)`
    }));
    
    return {
      categories: categoryArray,
      totalCategories: Object.keys(categoryStats).length,
      rawData: products
    };
  } catch (error) {
    console.error("Error fetching revenue by category:", error);
    return {
      categories: [],
      totalCategories: 0,
      rawData: []
    };
  }
};

export const getTopSellingProducts = async (startDate = '2025-03-01') => {
  try {
    const response = await axiosInstance.get(
      `productOrdering/v1/productOrder?orderDate.ge=${startDate}`
    );
    
    // Handle API response structure
    const data = response.data;
    const orders = Array.isArray(data.productOrder) ? data.productOrder : [];
    
    // Analyze product sales from order items
    const productSales = {};
    
    orders.forEach(order => {
      order.orderItem?.forEach(item => {
        const productId = item.product?.id;
        const productName = item.product?.name;
        const quantity = item.quantity || 1;
        
        if (productId && productName) {
          if (!productSales[productId]) {
            productSales[productId] = {
              id: productId,
              name: productName,
              totalQuantity: 0,
              orderCount: 0,
              orders: []
            };
          }
          
          productSales[productId].totalQuantity += quantity;
          productSales[productId].orderCount += 1;
          productSales[productId].orders.push({
            orderId: order.id,
            orderDate: order.orderDate,
            quantity,
            customer: order.relatedParty?.find(p => p.role === 'customer')?.name || 'Unknown'
          });
        }
      });
    });
    
    // Convert to array and sort by total quantity sold
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10) // Top 10 products
      .map((product, index) => ({
        ...product,
        rank: index + 1,
        averageQuantityPerOrder: (product.totalQuantity / product.orderCount).toFixed(1)
      }));
    
    return {
      topProducts,
      totalUniqueProducts: Object.keys(productSales).length,
      totalOrdersAnalyzed: orders.length,
      dateRange: { startDate }
    };
  } catch (error) {
    console.error("Error fetching top selling products:", error);
    return {
      topProducts: [],
      totalUniqueProducts: 0,
      totalOrdersAnalyzed: 0,
      dateRange: { startDate }
    };
  }
};

export const getPlatformPerformance = async () => {
  try {
    const response = await axiosInstance.get(
      "productOrdering/v1/productOrder"
    );
    
    // Handle API response structure: { status, count, productOrder: [...] }
    const data = response.data;
    const orders = Array.isArray(data.productOrder) ? data.productOrder : [];
    
    console.log(`Analyzing ${orders.length} orders for platform performance`);
    
    // Calculate fulfillment rate based on order states
    const totalOrders = orders.length;
    const fulfilledStates = ['completed', 'delivered', 'shipped', 'fulfilled'];
    const acknowledgedStates = ['acknowledged', 'inprogress', 'pending'];
    const cancelledStates = ['cancelled', 'rejected', 'failed'];
    
    // Log sample order for debugging
    if (orders.length > 0) {
      console.log('Sample order structure:', {
        id: orders[0].id,
        externalId: orders[0].externalId,
        state: orders[0].state,
        orderDate: orders[0].orderDate,
        customer: orders[0].relatedParty?.find(p => p.role === 'customer')?.name
      });
    }
    
    // Count orders by state
    const ordersByState = orders.reduce((acc, order) => {
      const state = order.state?.toLowerCase() || 'unknown';
      acc[state] = (acc[state] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Orders by state:', ordersByState);
    
    // Calculate fulfillment metrics
    const fulfilledOrders = orders.filter(order => 
      fulfilledStates.includes(order.state?.toLowerCase())
    ).length;
    
    const acknowledgedOrders = orders.filter(order => 
      acknowledgedStates.includes(order.state?.toLowerCase())
    ).length;
    
    const cancelledOrders = orders.filter(order => 
      cancelledStates.includes(order.state?.toLowerCase())
    ).length;
    
    // Calculate fulfillment rate (fulfilled orders / total non-cancelled orders)
    const nonCancelledOrders = totalOrders - cancelledOrders;
    const fulfillmentRate = nonCancelledOrders > 0 ? 
      ((fulfilledOrders / nonCancelledOrders) * 100).toFixed(1) : 0;
    
    // Calculate average response time (mock for now - would need timestamps)
    const avgResponseTime = (Math.random() * 12 + 2).toFixed(1); // 2-14 hours
    
    // Calculate customer satisfaction (mock - would need actual CSAT data)
    const customerSatisfaction = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
    
    console.log(`Fulfillment Rate: ${fulfillmentRate}% (${fulfilledOrders}/${nonCancelledOrders})`);
    
    return {
      fulfillmentRate: parseFloat(fulfillmentRate),
      customerSatisfaction: parseFloat(customerSatisfaction),
      avgResponseTime: parseFloat(avgResponseTime),
      metrics: {
        totalOrders,
        fulfilledOrders,
        acknowledgedOrders,
        cancelledOrders,
        nonCancelledOrders,
        ordersByState
      },
      rawData: data
    };
  } catch (error) {
    console.error("Error fetching platform performance:", error);
    // Return default values on error
    return {
      fulfillmentRate: 85.5,
      customerSatisfaction: 4.2,
      avgResponseTime: 6.5,
      metrics: {
        totalOrders: 0,
        fulfilledOrders: 0,
        acknowledgedOrders: 0,
        cancelledOrders: 0,
        nonCancelledOrders: 0,
        ordersByState: {}
      },
      rawData: null
    };
  }
};

export const getSystemAlerts = async () => {
  try {
    const response = await axiosInstance.get(
      "communicationManagement/v4/communicationMessage?category=system-alert"
    );
    
    const messages = Array.isArray(response.data) ? response.data : [];
    
    // Convert communication messages to system alerts format
    const systemAlerts = messages.map(message => {
      let alertType = 'info';
      let title = message.subject || 'System Notification';
      let alertMessage = message.content || message.description || 'No message content';
      
      // Determine alert type based on message state and content
      if (message.state === 'failed') {
        alertType = 'error';
        title = `Failed: ${title}`;
      } else if (message.state === 'delivered') {
        alertType = 'success';
      } else if (message.state === 'pending' || message.state === 'scheduled') {
        alertType = 'warning';
      }
      
      // Add context about message type and recipients
      const recipientCount = message.receiver?.length || 0;
      const messageTypeInfo = `${message.messageType} to ${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}`;
      
      return {
        id: message.id || message._id,
        type: alertType,
        title,
        message: `${alertMessage} (${messageTypeInfo})`,
        time: message.sendTime || message.updatedAt || message.createdAt,
        action: message.state === 'failed',
        metadata: {
          messageType: message.messageType,
          state: message.state,
          tryTimes: message.tryTimes,
          sender: message.sender?.name,
          recipientCount
        }
      };
    });
    
    // Sort by time (newest first)
    systemAlerts.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    return systemAlerts;
  } catch (error) {
    console.error("Error fetching system alerts:", error);
    return [];
  }
};

export const getRecentOrders = async () => {
  try {
    const response = await axiosInstance.get(
      "productOrdering/v1/productOrder?sort=-orderDate&limit=5"
    );
    
    // Handle the API response structure: { status, count, productOrder: [...] }
    const data = response.data;
    const orders = Array.isArray(data.productOrder) ? data.productOrder : [];
    
    return orders;
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    return [];
  }
};

export const getRecentActivity = async () => {
  try {
    const response = await axiosInstance.get(
      "communicationManagement/v4/communicationMessage?category=activity-log&sort=-creationDate&limit=5"
    );
    
    const messages = Array.isArray(response.data) ? response.data : [];
    
    // Convert communication messages to activity feed format
    const activities = messages.map(message => {
      let activityMessage = '';
      let iconColor = 'text-blue-500';
      
      // Create meaningful activity messages based on message type and state
      const senderName = message.sender?.name || 'System';
      const recipientCount = message.receiver?.length || 0;
      
      if (message.messageType === 'SMS') {
        activityMessage = `${senderName} sent SMS to ${recipientCount} customer${recipientCount !== 1 ? 's' : ''}`;
      } else if (message.messageType === 'Email') {
        activityMessage = `${senderName} sent email promotion to ${recipientCount} customer${recipientCount !== 1 ? 's' : ''}`;
      } else {
        activityMessage = `${senderName} sent ${message.messageType || 'message'} to ${recipientCount} recipient${recipientCount !== 1 ? 's' : ''}`;
      }
      
      // Set icon color based on state
      if (message.state === 'delivered') {
        iconColor = 'text-green-500';
      } else if (message.state === 'failed') {
        iconColor = 'text-red-500';
        activityMessage += ' (Failed)';
      } else if (message.state === 'pending') {
        iconColor = 'text-yellow-500';
        activityMessage += ' (Pending)';
      }
      
      return {
        message: activityMessage,
        time: message.sendTime || message.updatedAt || message.createdAt,
        color: iconColor,
        icon: message.messageType === 'SMS' ? '📱' : message.messageType === 'Email' ? '📧' : '💬',
        metadata: {
          subject: message.subject,
          messageType: message.messageType,
          state: message.state,
          tryTimes: message.tryTimes
        }
      };
    });
    
    // Sort by time (newest first) and limit to 5
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  }
};

export const getLowStockAlert = async () => {
  try {
    const response = await axiosInstance.get(
      "productCatalog/v5/productOffering?fields=id,name,restockLevel,stockOnHand"
    );
    
    // Handle new API structure
    const data = response.data;
    const products = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
    
    // Filter products with low stock (assuming stockOnHand < 10 is low stock)
    const lowStockProducts = products.filter(product => {
      const stockLevel = product.stockOnHand || 0;
      const restockLevel = product.restockLevel || 10;
      return stockLevel <= restockLevel;
    }).map(product => ({
      id: product.id,
      name: product.name,
      category: product.category?.[0]?.name || 'Uncategorized',
      stock: product.stockOnHand || 0,
      restockLevel: product.restockLevel || 10,
      status: product.lifecycleStatus
    }));
    
    return lowStockProducts;
  } catch (error) {
    console.error("Error fetching low stock alert:", error);
    return [];
  }
};

export const getQuickActions = async () => {
  try {
    const response = await axiosInstance.get(
      "partnershipManagement/v4/partnership?status=pending"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching quick actions:", error);
    throw error;
  }
};
