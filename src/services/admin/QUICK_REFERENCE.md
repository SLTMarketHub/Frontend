# Admin Services Quick Reference

## Import Services

```javascript
// Import all admin services
import { 
  userManagementService,
  analyticsService,
  dashboardService 
} from '@/services/admin';

// Or import individually
import userManagementService from '@/services/admin/userManagement';
import * as analyticsService from '@/services/admin/annalytics';
import * as dashboardService from '@/services/admin/dashboard';
```

## User Management Service

### Get Statistics
```javascript
const stats = await userManagementService.getUserStatistics();
// Returns: totalUsers, activeCustomers, activeSellers, growthRate, etc.
```

### Get Users
```javascript
// All users
const users = await userManagementService.getAllUsers();

// Filtered users
const customers = await userManagementService.getAllUsers({
  role: 'customer',
  status: 'active',
  search: 'john',
  limit: 50
});
```

### Update User Status
```javascript
// Suspend user
await userManagementService.suspendUser('user-id', 'customer', 'Reason');

// Activate user
await userManagementService.activateUser('user-id', 'seller', 'Reason');

// Custom status
await userManagementService.updateUserStatus('user-id', 'customer', 'suspended', 'Reason');
```

### Get User Details
```javascript
const user = await userManagementService.getUserDetails('user-id', 'customer');
```

### Get Growth Trend
```javascript
const trend = await userManagementService.getUserGrowthTrend('monthly');
// Options: 'weekly', 'monthly', 'yearly'
```

### Export Users
```javascript
const exportData = await userManagementService.getUsersForExport({
  role: 'all',
  status: 'active'
});
```

### Bulk Operations
```javascript
const results = await userManagementService.bulkUpdateUserStatus(
  [
    { id: 'user-1', role: 'customer' },
    { id: 'user-2', role: 'seller' }
  ],
  'suspended',
  'Bulk action'
);
```

## Analytics Service

### Get Overview
```javascript
const overview = await analyticsService.getAnalyticsOverview('monthly');
// Returns: totalRevenue, totalOrders, averageOrderValue, totalCustomers
```

### Get Sales Trend
```javascript
const trend = await analyticsService.getSalesTrend('monthly');
// Returns: Array of { date, revenue, orders }
```

### Get Top Products
```javascript
const products = await analyticsService.getTopProducts('monthly');
// Returns: Top 10 selling products
```

### Get Top Categories
```javascript
const categories = await analyticsService.getTopCategories('monthly');
// Returns: Top 8 categories by sales
```

### Get Revenue by Category
```javascript
const revenue = await analyticsService.getRevenueByCategory('monthly');
// Returns: Pie chart data
```

### Get Complete Analytics
```javascript
const data = await analyticsService.getAnalyticsData('monthly');
// Returns: overview, salesTrend, topProducts, topCategories, revenueByCategory
```

### Export Report
```javascript
const report = await analyticsService.getExportReport('monthly');
```

## Dashboard Service

### Get Metrics
```javascript
// Revenue
const revenue = await dashboardService.getTotalRevenue();

// Orders
const orders = await dashboardService.getTotalOrders();

// Customers
const customers = await dashboardService.getTotalCustomers();

// Sellers
const sellers = await dashboardService.getActiveSellers();

// Products
const products = await dashboardService.getTotalProducts();
```

### Get Trends
```javascript
// Revenue trend
const revenueTrend = await dashboardService.getRevenueTrend('2025-03-01', '2025-03-31');

// Orders trend
const ordersTrend = await dashboardService.getOrdersTrend('2025-03-01', '2025-03-31');
```

### Get Charts Data
```javascript
// Revenue by category
const categoryRevenue = await dashboardService.getRevenueByCategory();

// Top selling products
const topProducts = await dashboardService.getTopSellingProducts('2025-03-01');

// Platform performance
const performance = await dashboardService.getPlatformPerformance();
```

### Get Activity
```javascript
// System alerts
const alerts = await dashboardService.getSystemAlerts();

// Recent orders
const recentOrders = await dashboardService.getRecentOrders();

// Recent activity
const activity = await dashboardService.getRecentActivity();

// Low stock
const lowStock = await dashboardService.getLowStockAlert();
```

## Common Patterns

### Error Handling
```javascript
try {
  const data = await userManagementService.getAllUsers();
  // Handle success
} catch (error) {
  console.error('Error:', error);
  // Handle error
}
```

### Loading States
```javascript
const [loading, setLoading] = useState(true);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await userManagementService.getAllUsers();
    setData(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Parallel Requests
```javascript
const [users, stats, trend] = await Promise.all([
  userManagementService.getAllUsers(),
  userManagementService.getUserStatistics(),
  userManagementService.getUserGrowthTrend('monthly')
]);
```

### Filtering
```javascript
const filters = {
  role: roleFilter === 'all' ? undefined : roleFilter,
  status: statusFilter === 'all' ? undefined : statusFilter,
  search: searchTerm || undefined,
  limit: 50,
  offset: page * 50
};

const users = await userManagementService.getAllUsers(filters);
```

## Backend URLs

All services connect to:
```
Base URL: https://markethub-api-gateway.onrender.com

TMF629: /customer/v5/customer
TMF668: /partnershipManagement/v4/partnership
TMF622: /productOrdering/v1/productOrder
TMF620: /productCatalog/v5/productOffering
TMF678: /customerBill/v5/customerBill
TMF681: /communicationManagement/v4/communicationMessage
```

## Tips

1. **Always use filters** - Apply filters at service level for better performance
2. **Handle errors** - All services return default values on error
3. **Use pagination** - Set appropriate limit/offset for large datasets
4. **Cache statistics** - Stats don't change frequently, consider caching
5. **Parallel requests** - Use Promise.all for independent requests
6. **Provide reasons** - Always include reason when updating user status
7. **Check console** - Services log detailed information for debugging
