# Environment Configuration Guide

This guide explains how to use the environment variables for connecting to TMF API backend services.

## Overview

The frontend application uses Vite environment variables to configure connections to all TM Forum (TMF) API services. All variables are prefixed with `VITE_` to make them accessible in the client-side code.

## File Structure

- **`.env`** - Main environment configuration file (not committed to git)
- **`.env.example`** - Template for environment variables (committed to git)
- **`src/config/env.config.js`** - JavaScript configuration helper to access env variables

## Environment Variables Structure

### Base Configuration

```env
VITE_BASE_URL=https://markethub-api-gateway.onrender.com
VITE_ENV=production
VITE_AUTH_SERVICE_URL=https://markethub-api-gateway.onrender.com/tmf-api/auth
```

### TMF Service Configuration Pattern

Each TMF service follows this pattern:

1. **API Group** - The base path for the API version
2. **Resources** - Individual resource endpoints
3. **Endpoints** - Full URLs constructed from base + group + resource

Example for TMF620 (Product Catalog):

```env
# API Group (base path)
VITE_API_GROUP_TMF620=tmf-api/productCatalog/v5

# Individual Resources
VITE_RESOURCE_TMF620_CATALOG=productCatalog
VITE_RESOURCE_TMF620_CATEGORY=category
VITE_RESOURCE_TMF620_OFFERING=productOffering

# Full Endpoints (auto-constructed)
VITE_ENDPOINT_TMF620_CATALOG=${VITE_BASE_URL}/${VITE_API_GROUP_TMF620}/${VITE_RESOURCE_TMF620_CATALOG}/
VITE_ENDPOINT_TMF620_CATEGORY=${VITE_BASE_URL}/${VITE_API_GROUP_TMF620}/${VITE_RESOURCE_TMF620_CATEGORY}/
```

## Supported TMF APIs

| TMF API | Version | Base Path |
|---------|---------|-----------|
| TMF620 - Product Catalog Management | v5 | `/tmf-api/productCatalog/v5` |
| TMF622 - Product Ordering | v1 | `/tmf-api/productOrdering/v1` |
| TMF629 - Customer | v5 | `/tmf-api/customer/v5` |
| TMF633 - Service Catalog | v4 | `/tmf-api/serviceCatalogManagement/v4` |
| TMF668 - Partnership Management | v4 | `/tmf-api/partnershipManagement/v4` |
| TMF678 - Customer Bill | v5 | `/tmf-api/customerBill/v5` |
| TMF681 - Communication Management | v4 | `/tmf-api/communicationManagement/v4` |

## Usage in Code

### Method 1: Using env.config.js (Recommended)

```javascript
import { TMF620_CONFIG, TMF629_CONFIG } from '@/config/env.config';

// Get specific resource endpoint
const catalogEndpoint = TMF620_CONFIG.getEndpoint('productCatalog');
// Returns: https://markethub-api-gateway.onrender.com/tmf-api/productCatalog/v5/productCatalog

// Access resource names
const categoryResource = TMF620_CONFIG.RESOURCES.CATEGORY; // 'category'

// Access full endpoint URLs
const customerEndpoint = TMF629_CONFIG.ENDPOINT;
```

### Method 2: Direct Access

```javascript
// Access environment variables directly
const baseUrl = import.meta.env.VITE_BASE_URL;
const tmf620Group = import.meta.env.VITE_API_GROUP_TMF620;
const catalogResource = import.meta.env.VITE_RESOURCE_TMF620_CATALOG;

// Build endpoint manually
const endpoint = `${baseUrl}/${tmf620Group}/${catalogResource}`;
```

### Method 3: In Service Files

The TMF services already use these configurations. Example:

```javascript
// src/services/tmf/productCatalogService.js
import { apiClient } from '../authService';

const PRODUCT_API = '/tmf-api/productCatalog/v5';

class ProductCatalogService {
  async listProducts(params = {}) {
    const response = await apiClient.get(`${PRODUCT_API}/productCatalog`, { params });
    return response.data;
  }
}
```

## Quick Reference

### TMF620 - Product Catalog Resources

```javascript
import { TMF620_CONFIG } from '@/config/env.config';

TMF620_CONFIG.RESOURCES.CATALOG        // 'productCatalog'
TMF620_CONFIG.RESOURCES.CATEGORY       // 'category'
TMF620_CONFIG.RESOURCES.OFFERING       // 'productOffering'
TMF620_CONFIG.RESOURCES.SPECIFICATION  // 'productSpecification'
TMF620_CONFIG.RESOURCES.PRICE          // 'productOfferingPrice'
TMF620_CONFIG.RESOURCES.IMPORT         // 'importJob'
TMF620_CONFIG.RESOURCES.EXPORT         // 'exportJob'
```

### TMF622 - Product Ordering Resources

```javascript
import { TMF622_CONFIG } from '@/config/env.config';

TMF622_CONFIG.RESOURCES.ORDER          // 'productOrder'
TMF622_CONFIG.RESOURCES.CANCEL_ORDER   // 'productOrder'
```

### Other TMF APIs

```javascript
import { 
  TMF629_CONFIG,  // Customer
  TMF633_CONFIG,  // Service Catalog
  TMF668_CONFIG,  // Partnership
  TMF678_CONFIG,  // Customer Bill
  TMF681_CONFIG   // Communication
} from '@/config/env.config';

// Each config has similar structure:
// - API_GROUP: base path
// - RESOURCE(S): resource names
// - ENDPOINT(S): full URLs
// - getEndpoint(): helper function
```

## Setup Instructions

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Update values if needed:**
   - For development, you might point to localhost
   - For production, ensure correct backend URL

3. **Development vs Production:**

   **Development:**
   ```env
   VITE_BASE_URL=http://localhost:3000
   VITE_ENV=development
   ```

   **Production:**
   ```env
   VITE_BASE_URL=https://markethub-api-gateway.onrender.com
   VITE_ENV=production
   ```

4. **Restart dev server after changes:**
   ```bash
   npm run dev
   ```

## Best Practices

1. ✅ **DO** use `env.config.js` for accessing environment variables
2. ✅ **DO** keep `.env` in `.gitignore`
3. ✅ **DO** commit `.env.example` with dummy/example values
4. ✅ **DO** document any new environment variables in this guide
5. ❌ **DON'T** hardcode API URLs in service files
6. ❌ **DON'T** commit sensitive data in `.env` to git
7. ❌ **DON'T** expose secret keys in client-side env variables

## Troubleshooting

### Variables not loading?

1. Ensure variable names start with `VITE_`
2. Restart the dev server after changing `.env`
3. Check for syntax errors in `.env` file

### Getting undefined values?

```javascript
// Add fallback values
const baseUrl = import.meta.env.VITE_BASE_URL || 'https://markethub-api-gateway.onrender.com';
```

### CORS errors?

- Verify the backend URL is correct
- Check that backend allows requests from your frontend domain
- Ensure authentication headers are properly set in `authService.js`

## Related Files

- `/src/services/authService.js` - Axios client with authentication
- `/src/services/tmf/*.js` - TMF API service implementations
- `/src/config/api.config.js` - Additional API configuration
- `/src/config/env.config.js` - Environment variable helpers

## Support

For issues or questions about environment configuration:
1. Check this guide
2. Review `.env.example` for correct format
3. Verify backend API is running and accessible
4. Check browser console for specific error messages
