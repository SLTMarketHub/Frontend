# User Management Service - Testing Guide

## Test Checklist

### 1. User Statistics ✓
- [ ] Total users count displays correctly
- [ ] Active customers count is accurate
- [ ] Active sellers count is accurate
- [ ] Pending approvals count is correct
- [ ] New users this month calculation works
- [ ] Growth rate percentage displays

**Test Command:**
```javascript
const stats = await userManagementService.getUserStatistics();
console.log('Statistics:', stats);
```

### 2. User Listing ✓
- [ ] All users load successfully
- [ ] Customer filter works
- [ ] Seller filter works
- [ ] Status filter (active/suspended/pending) works
- [ ] Search by name works
- [ ] Search by email works
- [ ] Search by phone works
- [ ] Pagination works (limit/offset)
- [ ] User IDs are properly mapped (_id and id fields)

**Test Command:**
```javascript
// Test all users
const allUsers = await userManagementService.getAllUsers();
console.log('All users:', allUsers.length);

// Test filtered
const customers = await userManagementService.getAllUsers({ role: 'customer' });
console.log('Customers:', customers.length);

// Test search
const searchResults = await userManagementService.getAllUsers({ search: 'john' });
console.log('Search results:', searchResults.length);
```

### 3. User Status Management ✓
- [ ] Suspend customer works
- [ ] Activate customer works
- [ ] Suspend seller works
- [ ] Activate seller works
- [ ] Status update reason is saved
- [ ] UI updates after status change
- [ ] Error handling for invalid IDs
- [ ] Success message displays

**Test Steps:**
1. Click on a user row
2. Click "Suspend" or "Activate" button
3. Confirm action in modal
4. Verify status changes in the table
5. Check console for any errors

### 4. User Details Modal ✓
- [ ] Modal opens when clicking user row
- [ ] Name displays correctly
- [ ] Email displays correctly
- [ ] Phone displays correctly
- [ ] Role badge shows correct color
- [ ] Status badge shows correct color
- [ ] Orders/Products count is accurate
- [ ] Spent/Revenue amount is correct
- [ ] Joined date is formatted properly
- [ ] Close button works
- [ ] Suspend/Activate button works from modal

### 5. Export Functionality ✓
- [ ] Export all users works
- [ ] Export selected users works
- [ ] CSV file downloads
- [ ] All fields are included in export
- [ ] Data is properly formatted
- [ ] Success message displays

**Test Steps:**
1. Click export button (if available)
2. Verify CSV file downloads
3. Open CSV and check data format

### 6. Search and Filters ✓
- [ ] Role filter dropdown works
- [ ] Status filter dropdown works
- [ ] Search input works
- [ ] Filters combine correctly
- [ ] Clear filters works
- [ ] URL search parameter works

### 7. Error Handling ✓
- [ ] Network errors show appropriate message
- [ ] Invalid user ID shows error
- [ ] API failures fall back to mock data
- [ ] Error messages are user-friendly
- [ ] Console logs detailed error info

### 8. Performance ✓
- [ ] Initial load is fast (< 2 seconds)
- [ ] Filtering is responsive
- [ ] Search is instant
- [ ] Status updates are quick
- [ ] No memory leaks
- [ ] No unnecessary re-renders

## Common Issues and Fixes

### Issue 1: "Cast to ObjectId failed for value 'undefined'"
**Cause:** User ID is undefined or not properly passed
**Fix:** 
- Check that user object has `id` or `_id` field
- Verify `selectedUser` is not null
- Use `selectedUser._id || selectedUser.id` to get proper ID

### Issue 2: Status update fails with 400 error
**Cause:** Backend expects different data structure
**Fix:**
- Check backend API documentation
- Verify request payload matches backend expectations
- Add proper error logging to see exact error message

### Issue 3: Users not loading
**Cause:** API endpoint might be down or returning different structure
**Fix:**
- Check network tab for API response
- Verify axiosInstance is configured correctly
- Check if backend is running
- Verify authentication token is valid

### Issue 4: Search not working
**Cause:** Backend might not support search parameter
**Fix:**
- Implement client-side filtering as fallback
- Check backend API documentation for search syntax
- Use different search parameter names

### Issue 5: Statistics showing 0
**Cause:** Data calculation might be failing
**Fix:**
- Check console for calculation errors
- Verify data structure from backend
- Add fallback values

## Manual Testing Steps

### Test 1: Basic User Listing
1. Navigate to /admin/users
2. Verify users load in table
3. Check that all columns display data
4. Verify pagination controls appear

### Test 2: Filter by Role
1. Select "Customers" from role filter
2. Verify only customers appear
3. Select "Sellers" from role filter
4. Verify only sellers appear
5. Select "All Roles"
6. Verify all users appear

### Test 3: Filter by Status
1. Select "Active" from status filter
2. Verify only active users appear
3. Select "Suspended" from status filter
4. Verify only suspended users appear
5. Select "All Status"
6. Verify all users appear

### Test 4: Search Functionality
1. Type a name in search box
2. Verify filtered results appear
3. Type an email in search box
4. Verify filtered results appear
5. Clear search box
6. Verify all users appear

### Test 5: Suspend User
1. Find an active user
2. Click "Suspend" button
3. Verify confirmation modal appears
4. Click "Suspend" in modal
5. Verify success message appears
6. Verify user status changes to "Suspended"
7. Verify button changes to "Activate"

### Test 6: Activate User
1. Find a suspended user
2. Click "Activate" button
3. Verify confirmation modal appears
4. Click "Activate" in modal
5. Verify success message appears
6. Verify user status changes to "Active"
7. Verify button changes to "Suspend"

### Test 7: View User Details
1. Click on any user row
2. Verify modal opens
3. Check all user information displays
4. Click "Close" button
5. Verify modal closes

### Test 8: Suspend from Modal
1. Click on any user row
2. In modal, click "Suspend Account"
3. Verify confirmation modal appears
4. Confirm action
5. Verify both modals close
6. Verify user status updated in table

## Automated Testing (Future)

```javascript
describe('User Management Service', () => {
  test('getUserStatistics returns valid data', async () => {
    const stats = await userManagementService.getUserStatistics();
    expect(stats).toHaveProperty('totalUsers');
    expect(stats).toHaveProperty('activeCustomers');
    expect(stats).toHaveProperty('activeSellers');
  });

  test('getAllUsers returns array', async () => {
    const users = await userManagementService.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
  });

  test('updateUserStatus works', async () => {
    const result = await userManagementService.updateUserStatus(
      'test-id',
      'customer',
      'suspended',
      'Test reason'
    );
    expect(result).toBeDefined();
  });
});
```

## Browser Console Tests

Open browser console and run:

```javascript
// Test 1: Get statistics
const stats = await userManagementService.getUserStatistics();
console.log('Stats:', stats);

// Test 2: Get all users
const users = await userManagementService.getAllUsers();
console.log('Users:', users.length, users[0]);

// Test 3: Get customers only
const customers = await userManagementService.getAllUsers({ role: 'customer' });
console.log('Customers:', customers.length);

// Test 4: Search users
const searchResults = await userManagementService.getAllUsers({ search: 'john' });
console.log('Search results:', searchResults.length);

// Test 5: Get user details (replace with actual ID)
const user = await userManagementService.getUserDetails('user-id', 'customer');
console.log('User details:', user);
```

## Debugging Tips

1. **Check Network Tab**
   - Look for failed requests
   - Verify request/response payloads
   - Check status codes

2. **Check Console**
   - Look for error messages
   - Check logged data structures
   - Verify IDs are not undefined

3. **Check Redux/State**
   - Verify user data in state
   - Check if state updates properly
   - Look for stale data

4. **Check Backend**
   - Verify backend is running
   - Check backend logs
   - Test API endpoints directly with Postman

5. **Check Authentication**
   - Verify token is valid
   - Check if token is being sent in headers
   - Test with fresh login

## Success Criteria

All functionality is considered working when:
- ✓ Users load without errors
- ✓ Statistics display correctly
- ✓ Filters work as expected
- ✓ Search returns accurate results
- ✓ Status updates succeed
- ✓ Modals open and close properly
- ✓ Export functionality works
- ✓ No console errors
- ✓ UI is responsive
- ✓ Error messages are helpful
