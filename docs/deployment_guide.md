# Production Deployment Guide

## Prerequisites

### ✅ Environment Configuration
- [ ] Create `.env.production` file with:
  ```
  VITE_BASE_URL=https://markethub-api-gateway.onrender.com/tmf-api/
  ```
- [ ] Verify `.env` is in `.gitignore`
- [ ] Ensure authentication tokens are managed securely

### ✅ Backend Requirements
- [ ] Backend API is running on Render
- [ ] All TMF endpoints are accessible
- [ ] **CRITICAL**: Fix Partnership PATCH endpoint to persist status changes
  - See `backend_issues.md` for details

## Build & Verification

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Production Build
```bash
npm run build
```

Expected output:
- Build completes without errors
- Bundle size is reasonable (check dist/ folder)
- No console warnings about missing dependencies

### Step 3: Preview Production Build Locally
```bash
npm run preview
```

Test all admin routes:
- `/admin/dashboard`
- `/admin/sellers`
- `/admin/products`
- `/admin/orders`
- `/admin/settings`
- `/admin/support`
- `/admin/analytics`
- `/admin/users`

## Known Issues & Workarounds

### 1. Seller Status Persistence (CRITICAL)
**Issue**: Seller approve/reject doesn't persist after refresh  
**Workaround**: localStorage cache implemented in `sellers.js`  
**Backend Fix Required**: Update Partnership PATCH endpoint  
**Impact**: Workaround functions but should be removed after backend fix

### 2. Product/Order Status Persistence
**Status**: Not yet tested under production load  
**Action**: Monitor and implement similar cache if needed

## Deployment Steps

### Option 1: Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Option 2: Deploy to Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod
```

### Option 3: Deploy to GitHub Pages
```bash
# Update vite.config.js with base path
# Build and deploy to gh-pages branch
npm run build
npm run deploy  # If you have a deploy script
```

## Post-Deployment Validation

### Critical Features to Test
- [ ] Admin login/authentication works
- [ ] Dashboard loads with live data
- [ ] Seller approval (test with cache workaround)
- [ ] Product moderation (approve/reject)
- [ ] Order management (status updates, refunds)
- [ ] Settings save correctly (via TMF681)
- [ ] Support tickets load and update
- [ ] Analytics charts populate
- [ ] User management functions

### Performance Checks
- [ ] Initial page load < 3 seconds
- [ ] API responses < 2 seconds
- [ ] No console errors on any admin page
- [ ] Mobile responsive design works

### Security Checks
- [ ] API tokens not exposed in console/network tab
- [ ] Admin routes protected (require authentication)
- [ ] CORS configured correctly on backend
- [ ] No sensitive data in localStorage except status cache

## Rollback Plan

If critical issues occur:
1. Revert to previous deployment
2. Check backend API status on Render
3. Review browser console for errors
4. Check network tab for failed API calls

## Monitoring & Maintenance

### Post-Launch Monitoring
- Monitor browser console for errors
- Track API response times
- Watch for status persistence issues
- Monitor localStorage cache size

### Regular Maintenance
- Clear old status cache (automatic after 24h)
- Update dependencies monthly
- Review and remove localStorage workaround once backend is fixed

## GitHub Preparation

### Before Pushing
- [ ] Remove all sensitive keys from code
- [ ] Update README.md with:
  - Setup instructions
  - Environment variables needed
  - Build commands
  - Known issues link
- [ ] Add `.env.example` file
- [ ] Create `.github/workflows` for CI/CD (optional)

### Recommended .gitignore
```
node_modules/
dist/
.env
.env.local
.env.production
.DS_Store
*.log
```

## Environment Variables Guide

Create `.env.production`:
```
VITE_BASE_URL=https://markethub-api-gateway.onrender.com/tmf-api/
```

For development, use `.env`:
```
VITE_BASE_URL=http://localhost:8080/tmf-api/
# OR
VITE_BASE_URL=https://markethub-api-gateway.onrender.com/tmf-api/
```

## Final Checklist

- [x] All placeholder images replaced with data URIs
- [x] localStorage cache implemented for seller status
- [x] Settings service uses TMF681
- [x] Support service uses TMF681
- [x] All services use `axiosInstance` with `.env` variable
- [x] Error handling in place
- [x] Loading states implemented
- [x] No TODO/FIXME comments
- [ ] Backend Partnership PATCH fixed (backend team action)
- [ ] Production build tested
- [ ] Deployed and validated
- [ ] Pushed to GitHub

---

## Quick Deploy Commands

```bash
# 1. Install
npm install

# 2. Build
npm run build

# 3. Test locally
npm run preview

# 4. Deploy (choose one)
vercel                    # Vercel
netlify deploy --prod     # Netlify
npm run deploy            # GitHub Pages (if configured)
```

## Support Contacts

If issues arise:
1. Check `backend_issues.md` for known problems
2. Review `walkthrough.md` for implementation details
3. Contact backend team for TMF API issues
