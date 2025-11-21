# Backend Issues Requiring Fixes

This document outlines issues that require backend API fixes, along with temporary frontend workarounds that have been implemented.

---

## 1. Seller Status Not Persisting (CRITICAL)

### Issue
When admin approves/rejects a seller via PATCH request to `partnershipManagement/v4/partnership/{id}`, the API returns success (200) but the status change is **not persisted to the database**. When the page refreshes and fetches sellers again, the old status (usually "pending") is returned.

### Current Behavior
```javascript
// Frontend sends:
PATCH /partnershipManagement/v4/partnership/{sellerId}
{
  "status": "active"  // or "rejected"
}

// API responds: 200 OK
// But when fetching again:
GET /partnershipManagement/v4/partnership/{sellerId}
// Returns: { "status": "pending" } ❌ Old status, not saved!
```

### Root Cause
The backend TMF668 Partnership Management API is not updating the `status` field in the MongoDB Partnership document when receiving PATCH requests.

### Backend Fix Required
Update the Partnership PATCH endpoint to:
1. Accept `status` field in request body
2. Update the Partnership document in MongoDB with the new status
3. Return the updated Partnership with the new status

```javascript
// In backend Partnership controller/service:
async updatePartnership(id, updateData) {
  // Ensure status is updated in the database
  const updated = await Partnership.findByIdAndUpdate(
    id,
    { 
      status: updateData.status,
      statusReason: updateData.statusReason,
      updatedAt: new Date()
    },
    { new: true } // Return updated document
  );
  return updated;
}
```

### Temporary Frontend Workaround
Implemented localStorage caching in `src/services/admin/sellers.js`:
- Caches status updates locally when approve/reject succeeds
- Reads from cache when displaying sellers
- Cache expires after 24 hours

**This is NOT a proper solution** - it only works on one browser/device and doesn't sync across admins.

**Files Modified**: 
- `src/services/admin/sellers.js` (added cacheStatusUpdate, getCachedStatus, clearOldCache)

---

## 2. Placeholder Images Failing to Load

### Issue
Products and Analytics pages show errors:
```
Failed to load resource: https://via.placeholder.com/50
```

This happens because `via.placeholder.com` cannot be reached (DNS/network issue).

### Frontend Fix
Replace all `via.placeholder.com` URLs with:
- Data URIs for simple colored rectangles
- OR a local placeholder image in `/public/assets/`
- OR remove image placeholders entirely and use colored initials/icons

### Locations to Fix
Search codebase for `via.placeholder.com` and replace with alternative.

---

## 3. Product Status Not Persisting (Similar Issue)

### Potential Issue
Similar to sellers, product approval/rejection might not persist if the backend TMF620 Product Catalog API doesn't properly update `lifecycleStatus`.

### Verification Needed
Test if product moderation (approve/reject) persists after page refresh.

### Backend Fix If Needed
Update ProductOffering PATCH endpoint to persist `lifecycleStatus` changes.

---

## Summary

| Issue | Severity | Backend Fix Required | Frontend Workaround |
|-------|----------|---------------------|---------------------|
| Seller status not persisting | 🔴 Critical | Yes - Update Partnership PATCH endpoint | localStorage cache (temporary) |
| Placeholder images failing | 🟡 Medium | No (external service) | Replace URLs with local assets |
| Product status not persisting | 🟡 Medium | Yes (if confirmed) | Can implement similar cache |

---

## Recommended Action Plan

1. **Immediate**: Keep frontend localStorage workaround for sellers
2. **Short-term**: Fix backend Partnership PATCH endpoint to persist status
3. **Short-term**: Replace placeholder image URLs
4. **Medium-term**: Test and fix product status persistence if needed
5. **Long-term**: Remove localStorage cache once backend is fixed
