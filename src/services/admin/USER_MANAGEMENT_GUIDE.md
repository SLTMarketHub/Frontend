# User Management Service Guide

## Overview

The User Management Service (`userManagement.js`) provides comprehensive user management functionality for the admin dashboard. It connects to TMF629 (Customer Management) and TMF668 (Partnership Management) APIs to manage both customers and sellers.

## Features

### 1. User Statistics
- Total users (customers + sellers)
- Active/suspended/pending user counts
- Growth rates and trends
- User role distribution

### 2. User Listing & Filtering
- Fetch all users with role filters (customer, seller, all)
- Status filtering (active, suspended, pending)
- Search by name, email, or phone
- Pagination support

### 3. User Details
- Comprehensive user profile information
- Role-specific data (orders for customers, products for sellers)
- Activity tracking and scoring

### 4. User Status Management
- Activate/suspend users
- Update user status with reasons
- Bulk status updates

### 5. Analytics
- User growth trends (weekly, monthly, yearly)
- User activity analysis
- Registration patterns

### 6. Export
- Export user data to CSV/PDF
- Filtered exports
- Custom data formatting

## API Endpoints Used

### TMF629 - Customer Management API
```
GET  /customer/v5/customer              - List customers
GET  /customer/v5/customer/{id}         - Get customer details
PATCH /customer/v5/customer/{id}        - Update customer
```

### TMF668 - Partnership Management API
```
GET  /partnershipManagement/v4/partnership        - List partnerships
GET  /partnershipManagement/v4/partnership/{id}   - Get partnership details
PATCH /partnershipManagement/v4/partnership/{id}  - Update partnership
```

### TMF622 - Product Ordering API (for activity)
```
GET  /productOrdering/v1/productOrder   - Get customer orders
```

### TMF620 - Product Catalog API (for activity)
```
GET  /productCatalog/v5/productOffering - Get seller products
```

## Usage Examples

### Import the Service

```javascript
// Import specific functions
import { 
  getUserStatistics, 
  getAllUsers, 
  updateUserStatus 
} from '@/services/admin/userManagement';

// Or import the entire service
import userManagementService from '@/services/admin/userManagement';
```

### Get User Statistics

```javascript
const stats = await getUserStatistics();

console.log(stats);
// {
//   totalUsers: 2745,
//   totalCustomers: 2456,
//   totalSellers: 289,
//   activeUsers: 2179,
//   activeCustomers: 1890,
//   activeSellers: 289,
//   suspendedUsers: 54,
//   pendingSellers: 12,
//   newUsersThisMonth: 234,
//   customerGrowthRate: 15.3,
//   sellerGrowthRate: 8.7,
//   overallGrowthRate: 14.2
// }
```

### Get All Users with Filters

```javascript
// Get all active customers
const customers = await getAllUsers({
  role: 'customer',
  status: 'active',
  limit: 50,
  offset: 0
});

// Search for users
const searchResults = await getAllUsers({
  search: 'john@example.com',
  role: 'all'
});

// Get pending sellers
const pendingSellers = await getAllUsers({
  role: 'seller',
  status: 'pending'
});
```

### Get User Details

```javascript
// Get customer details
const customer = await getUserDetails('customer-123', 'customer');

// Get seller details
const seller = await getUserDetails('seller-456', 'seller');

console.log(customer);
// {
//   id: 'customer-123',
//   name: 'John Doe',
//   email: 'john@example.com',
//   phone: '+94771234567',
//   role: 'customer',
//   status: 'active',
//   orders: 15,
//   spent: 450000,
//   verified: true,
//   joinedAt: '2025-01-15T10:30:00Z',
//   rawData: { ... }
// }
```

### Update User Status

```javascript
// Suspend a user
await updateUserStatus(
  'customer-123',
  'customer',
  'suspended',
  'Violation of terms of service'
);

// Activate a user
await updateUserStatus(
  'seller-456',
  'seller',
  'active',
  'Documents verified'
);

// Or use convenience methods
await suspendUser('customer-123', 'customer', 'Policy violation');
await activateUser('seller-456', 'seller', 'Approved by admin');
```

### Get User Growth Trend

```javascript
// Monthly growth trend
const monthlyGrowth = await getUserGrowthTrend('monthly');

// Weekly growth trend
const weeklyGrowth = await getUserGrowthTrend('weekly');

console.log(monthlyGrowth);
// [
//   { date: '2025-01', customers: 145, sellers: 23, total: 168 },
//   { date: '2025-02', customers: 189, sellers: 31, total: 220 },
//   { date: '2025-03', customers: 234, sellers: 28, total: 262 }
// ]
```

### Get User Activity

```javascript
const activity = await getUserActivity('customer-123', 'customer');

console.log(activity);
// {
//   id: 'customer-123',
//   name: 'John Doe',
//   ... (user details)
//   activity: {
//     recentOrders: [
//       { id: 'order-1', date: '2025-03-15', state: 'completed', itemCount: 3 },
//       { id: 'order-2', date: '2025-03-10', state: 'delivered', itemCount: 1 }
//     ],
//     activityScore: 85,
//     lastActiveDate: '2025-03-15T14:30:00Z'
//   }
// }
```

### Export Users

```javascript
// Export all users
const exportData = await getUsersForExport();

// Export with filters
const filteredExport = await getUsersForExport({
  role: 'customer',
  status: 'active'
});

// Use with CSV export utility
import { exportToCSV } from '@/utils/exportUtils';
exportToCSV(exportData, 'users_export');
```

### Bulk Operations

```javascript
// Suspend multiple users
const results = await bulkUpdateUserStatus(
  [
    { id: 'customer-1', role: 'customer' },
    { id: 'customer-2', role: 'customer' },
    { id: 'seller-1', role: 'seller' }
  ],
  'suspended',
  'Bulk suspension for policy violations'
);

console.log(results);
// {
//   success: ['customer-1', 'customer-2'],
//   failed: [{ id: 'seller-1', error: 'Not found' }]
// }
```

### Get Complete User Management Data

```javascript
// Get everything in one call
const data = await getUserManagementData({
  role: 'all',
  status: 'active',
  period: 'monthly'
});

console.log(data);
// {
//   statistics: { ... },
//   users: [ ... ],
//   growthTrend: [ ... ],
//   filters: { ... },
//   timestamp: '2025-03-15T10:30:00Z'
// }
```

## Integration with Users.jsx Page

The Users.jsx admin page has been updated to use the User Management Service:

### Before (Old Approach)
```javascript
// Multiple service calls with complex data transformation
const customerResponse = await tmf629AdminService.listCustomers(params);
const partnershipResponse = await tmf668AdminService.listPartnerships(params);
// ... complex mapping and filtering logic
```

### After (New Approach)
```javascript
// Single service call with clean interface
const filters = {
  role: roleFilter,
  status: userFilter !== 'all' ? userFilter : undefined,
  search: searchTerm
};

const [users, statistics] = await Promise.all([
  userManagementService.getAllUsers(filters),
  userManagementService.getUserStatistics()
]);
```

## Data Structure

### User Object Structure

```javascript
{
  // Common fields
  id: string,
  name: string,
  email: string,
  phone: string,
  role: 'customer' | 'seller',
  status: 'active' | 'suspended' | 'pending',
  joinedAt: string (ISO date),
  verified: boolean,
  
  // Customer-specific fields
  orders: number,           // Total orders placed
  spent: number,            // Total amount spent
  address: string,          // Postal address
  lastOrderDate: string,    // Last order date
  averageOrderValue: number,
  
  // Seller-specific fields
  products: number,         // Total products listed
  revenue: number,          // Total revenue earned
  storeName: string,        // Store/business name
  rating: number,           // Seller rating
  totalSales: number,       // Total sales count
  
  // Raw data from API
  rawData: object          // Original API response
}
```

### Statistics Object Structure

```javascript
{
  // Totals
  totalUsers: number,
  totalCustomers: number,
  totalSellers: number,
  
  // Active users
  activeUsers: number,
  activeCustomers: number,
  activeSellers: number,
  
  // Status breakdowns
  suspendedUsers: number,
  suspendedCustomers: number,
  suspendedSellers: number,
  pendingSellers: number,
  verifiedCustomers: number,
  
  // Growth metrics
  newUsersThisMonth: number,
  newCustomersThisMonth: number,
  newSellersThisMonth: number,
  customerGrowthRate: number,    // Percentage
  sellerGrowthRate: number,      // Percentage
  overallGrowthRate: number,     // Percentage
  
  // Percentages
  customerPercentage: string,    // "89.5"
  sellerPercentage: string       // "10.5"
}
```

## Error Handling

All functions include comprehensive error handling:

```javascript
try {
  const users = await getAllUsers({ role: 'customer' });
  // Handle success
} catch (error) {
  console.error('Error fetching users:', error);
  // Handle error - service returns empty arrays/default values
}
```

The service gracefully handles:
- Network errors
- API failures
- Invalid parameters
- Missing data

## Best Practices

1. **Use Filters Wisely**: Apply filters at the service level rather than client-side for better performance
2. **Pagination**: Always use limit/offset for large datasets
3. **Error Handling**: Always wrap service calls in try-catch blocks
4. **Status Updates**: Provide meaningful reasons when updating user status
5. **Bulk Operations**: Use bulk methods for multiple user updates to improve performance
6. **Caching**: Consider caching statistics data as it doesn't change frequently

## Performance Considerations

- Statistics are calculated on-demand; consider caching for frequently accessed data
- User listing supports pagination to handle large datasets
- Bulk operations process users sequentially to avoid overwhelming the API
- Growth trend calculations are optimized for different time periods

## Future Enhancements

Potential improvements:
- Real-time user activity monitoring
- Advanced search with multiple criteria
- User segmentation and tagging
- Automated user lifecycle management
- Integration with notification system for user events
- User behavior analytics
- Custom user attributes and metadata

## Support

For issues or questions:
1. Check the console logs for detailed error messages
2. Verify API endpoint availability
3. Ensure proper authentication tokens
4. Review the TMF API documentation for data structure changes
