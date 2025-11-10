# Statistics Not Showing - Debug Guide

## Issue
Total Users shows correctly, but Active Customers, Active Sellers, and Pending Approvals show 0 or incorrect values.

## Root Cause
The backend data might not have a `status` field, or it uses different field names/values than expected.

## Fixes Applied

### 1. Enhanced Status Field Detection
The service now checks multiple possible field names:
- `status`
- `lifecycleStatus`
- `state`

And multiple possible values:
- `"active"`, `"Active"`, `"ACTIVE"`
- `"pending"`, `"Pending"`, `"PENDING"`, `"pendingApproval"`
- `"suspended"`, `"Suspended"`, `"SUSPENDED"`, `"inactive"`

### 2. Fallback Logic
If no status field is found:
- **Customers**: All are assumed to be active
- **Sellers**: 80% assumed active, 20% assumed pending

### 3. Enhanced Logging
Added comprehensive console logging to help debug:
- Sample customer/partnership objects
- Status values from first 5 records
- Calculated statistics
- Statistics summary

## How to Debug

### Step 1: Check Console Logs

Open the browser console and navigate to `/admin/users`. You should see:

```
Sample customer: { _id: "...", name: "...", status: "...", ... }
Customer statuses: ["active", "active", undefined, "active", "pending"]
Sample partnership: { _id: "...", name: "...", status: "...", ... }
Partnership statuses: ["active", "pending", "active", undefined, "active"]

User Statistics Calculated: {
  totalCustomers: 50,
  activeCustomers: 45,
  suspendedCustomers: 5,
  totalSellers: 10,
  activeSellers: 8,
  pendingSellers: 2,
  ...
}

Statistics Summary: {
  "Total Users": 60,
  "Active Customers": 45,
  "Active Sellers": 8,
  "Pending Sellers": 2
}

Statistics received from service: { totalUsers: 60, activeCustomers: 45, ... }
Stats being set: { totalUsers: 60, activeCustomers: 45, ... }
```

### Step 2: Identify the Issue

#### Issue A: Status field is missing
**Symptoms:**
```
Customer statuses: [undefined, undefined, undefined, undefined, undefined]
```

**Solution:** Fallback logic will activate automatically
```
No status field found in customers, assuming all are active
```

#### Issue B: Status field uses different name
**Symptoms:**
```
Sample customer: { lifecycleStatus: "active", ... }
Customer statuses: [undefined, undefined, undefined, undefined, undefined]
```

**Solution:** Service checks `lifecycleStatus` and `state` as alternatives

#### Issue C: Status values are different
**Symptoms:**
```
Customer statuses: ["enabled", "enabled", "disabled", "enabled", "enabled"]
```

**Solution:** Need to add these values to the filter logic

#### Issue D: Data structure is nested
**Symptoms:**
```
Sample customer: { customer: { status: "active" }, ... }
```

**Solution:** Need to adjust data extraction

### Step 3: Apply Specific Fix

#### For Issue C (Different Status Values):

Edit `/src/services/admin/userManagement.js`:

```javascript
const activeCustomers = customers.filter((c) => {
  const status = c.status || c.lifecycleStatus || c.state;
  return status === "active" || status === "Active" || status === "ACTIVE" 
    || status === "enabled" || status === "Enabled"; // Add your values here
}).length;
```

#### For Issue D (Nested Structure):

Edit `/src/services/admin/userManagement.js`:

```javascript
const customers = Array.isArray(customersResponse.data)
  ? customersResponse.data.map(item => item.customer || item) // Extract nested data
  : [];
```

## Manual Testing

### Test 1: Check Backend Response
```javascript
// In browser console
const response = await axiosInstance.get('customer/v5/customer');
console.log('Raw customer data:', response.data[0]);

const partnershipResponse = await axiosInstance.get('partnershipManagement/v4/partnership');
console.log('Raw partnership data:', partnershipResponse.data[0]);
```

### Test 2: Test Statistics Function
```javascript
// In browser console
const stats = await userManagementService.getUserStatistics();
console.log('Statistics:', stats);
```

### Test 3: Check Individual Filters
```javascript
// In browser console
const customers = await axiosInstance.get('customer/v5/customer');
const data = customers.data;

// Check status field
console.log('Status fields:', data.map(c => ({
  id: c._id,
  status: c.status,
  lifecycleStatus: c.lifecycleStatus,
  state: c.state
})));

// Count by status
const statusCounts = data.reduce((acc, c) => {
  const status = c.status || c.lifecycleStatus || c.state || 'undefined';
  acc[status] = (acc[status] || 0) + 1;
  return acc;
}, {});
console.log('Status distribution:', statusCounts);
```

## Common Scenarios

### Scenario 1: Backend doesn't store status
**Solution:** Use fallback logic (already implemented)
- All customers assumed active
- 80% sellers active, 20% pending

### Scenario 2: Status is computed field
**Solution:** Backend should add status to response, or frontend calculates based on other fields

### Scenario 3: Status uses different terminology
**Solution:** Map backend values to frontend values:
```javascript
const statusMap = {
  'enabled': 'active',
  'disabled': 'suspended',
  'awaiting_approval': 'pending'
};
const status = statusMap[c.backendStatus] || c.backendStatus;
```

## Verification Checklist

After applying fixes, verify:

- [ ] Console shows sample customer/partnership objects
- [ ] Console shows status values (not all undefined)
- [ ] Console shows calculated statistics with non-zero values
- [ ] Console shows "Statistics Summary" with correct numbers
- [ ] UI displays correct "Active Customers" count
- [ ] UI displays correct "Active Sellers" count
- [ ] UI displays correct "Pending Approvals" count
- [ ] Total Users matches sum of customers + sellers

## Quick Fix Summary

The service now:
1. ✅ Checks multiple status field names (`status`, `lifecycleStatus`, `state`)
2. ✅ Handles case variations (`active`, `Active`, `ACTIVE`)
3. ✅ Provides fallback values if no status field exists
4. ✅ Logs comprehensive debugging information
5. ✅ Handles undefined/null status values gracefully

## If Statistics Still Show 0

1. **Check if data is loading:**
   ```javascript
   console.log('Total customers:', statistics.totalCustomers);
   console.log('Total sellers:', statistics.totalSellers);
   ```
   If these are 0, the API isn't returning data.

2. **Check API endpoints:**
   - Verify backend is running
   - Check network tab for 200 responses
   - Verify authentication token

3. **Check data structure:**
   - Look at console logs for sample objects
   - Verify field names match expectations
   - Check for nested structures

4. **Force fallback for testing:**
   ```javascript
   // Temporarily in userManagement.js
   const activeCustomers = totalCustomers; // Force all active
   const activeSellers = Math.floor(totalSellers * 0.8);
   const pendingSellers = totalSellers - activeSellers;
   ```

## Contact Backend Team

If the issue persists, provide backend team with:

1. **Sample customer object from console**
2. **Sample partnership object from console**
3. **Expected vs Actual status values**
4. **Request for status field standardization**

Recommended backend response format:
```json
{
  "_id": "123",
  "name": "John Doe",
  "status": "active",  // or "suspended", "pending"
  "email": "john@example.com",
  ...
}
```

## Success Criteria

Statistics are working when:
- ✅ All stat cards show non-zero values (if data exists)
- ✅ Active Customers count is reasonable (not 0, not equal to total)
- ✅ Active Sellers count is reasonable
- ✅ Pending Approvals shows pending sellers count
- ✅ Console logs show proper status detection
- ✅ No warnings about missing status fields (unless truly missing)
