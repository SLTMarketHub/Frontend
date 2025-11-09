/**
 * Environment Configuration
 * Central access point for all environment variables
 */

// Common Configuration
export const ENV_CONFIG = {
  BASE_URL: import.meta.env.VITE_BASE_URL || '', // Use relative path for Vite proxy
  ENV: import.meta.env.VITE_ENV || 'production',
  AUTH_SERVICE_URL: import.meta.env.VITE_AUTH_SERVICE_URL || '/tmf-api/auth',
};

// TMF620 - Product Catalog Management
export const TMF620_CONFIG = {
  API_GROUP: import.meta.env.VITE_API_GROUP_TMF620 || 'tmf-api/productCatalog/v5',
  RESOURCES: {
    CATALOG: import.meta.env.VITE_RESOURCE_TMF620_CATALOG || 'productCatalog',
    CATEGORY: import.meta.env.VITE_RESOURCE_TMF620_CATEGORY || 'category',
    OFFERING: import.meta.env.VITE_RESOURCE_TMF620_OFFERING || 'productOffering',
    SPECIFICATION: import.meta.env.VITE_RESOURCE_TMF620_SPECIFICATION || 'productSpecification',
    PRICE: import.meta.env.VITE_RESOURCE_TMF620_PRICE || 'productOfferingPrice',
    IMPORT: import.meta.env.VITE_RESOURCE_TMF620_IMPORT || 'importJob',
    EXPORT: import.meta.env.VITE_RESOURCE_TMF620_EXPORT || 'exportJob',
  },
  ENDPOINTS: {
    CATALOG: import.meta.env.VITE_ENDPOINT_TMF620_CATALOG,
    CATEGORY: import.meta.env.VITE_ENDPOINT_TMF620_CATEGORY,
    OFFERING: import.meta.env.VITE_ENDPOINT_TMF620_OFFERING,
    SPECIFICATION: import.meta.env.VITE_ENDPOINT_TMF620_SPECIFICATION,
    PRICE: import.meta.env.VITE_ENDPOINT_TMF620_PRICE,
    IMPORT: import.meta.env.VITE_ENDPOINT_TMF620_IMPORT,
    EXPORT: import.meta.env.VITE_ENDPOINT_TMF620_EXPORT,
  },
  // Helper function to build full endpoint URL
  getEndpoint: (resource) => {
    const baseUrl = ENV_CONFIG.BASE_URL;
    const apiGroup = TMF620_CONFIG.API_GROUP;
    return `${baseUrl}/${apiGroup}/${resource}`;
  }
};

// TMF622 - Product Ordering
export const TMF622_CONFIG = {
  API_GROUP: import.meta.env.VITE_API_GROUP_TMF622 || 'tmf-api/productOrdering/v1',
  RESOURCES: {
    ORDER: import.meta.env.VITE_RESOURCE_TMF622_ORDER || 'productOrder',
    CANCEL_ORDER: import.meta.env.VITE_RESOURCE_TMF622_CANCELORDER || 'productOrder',
  },
  ENDPOINTS: {
    ORDER: import.meta.env.VITE_ENDPOINT_TMF622_ORDER,
    CANCEL_ORDER: import.meta.env.VITE_ENDPOINT_TMF622_CANCELORDER,
  },
  getEndpoint: (resource) => {
    const baseUrl = ENV_CONFIG.BASE_URL;
    const apiGroup = TMF622_CONFIG.API_GROUP;
    return `${baseUrl}/${apiGroup}/${resource}`;
  }
};

// TMF629 - Customer
export const TMF629_CONFIG = {
  API_GROUP: import.meta.env.VITE_API_GROUP_TMF629 || 'tmf-api/customer/v5',
  RESOURCE: import.meta.env.VITE_RESOURCE_TMF629 || 'customer',
  ENDPOINT: import.meta.env.VITE_ENDPOINT_TMF629,
  getEndpoint: (resource = TMF629_CONFIG.RESOURCE) => {
    const baseUrl = ENV_CONFIG.BASE_URL;
    const apiGroup = TMF629_CONFIG.API_GROUP;
    return `${baseUrl}/${apiGroup}/${resource}`;
  }
};

// TMF633 - Service Catalog
export const TMF633_CONFIG = {
  API_GROUP: import.meta.env.VITE_API_GROUP_TMF633 || 'tmf-api/serviceCatalogManagement/v4',
  RESOURCE: import.meta.env.VITE_RESOURCE_TMF633 || 'serviceCatalog',
  ENDPOINT: import.meta.env.VITE_ENDPOINT_TMF633,
  getEndpoint: (resource = TMF633_CONFIG.RESOURCE) => {
    const baseUrl = ENV_CONFIG.BASE_URL;
    const apiGroup = TMF633_CONFIG.API_GROUP;
    return `${baseUrl}/${apiGroup}/${resource}`;
  }
};

// TMF668 - Partnership Management
export const TMF668_CONFIG = {
  API_GROUP: import.meta.env.VITE_API_GROUP_TMF668 || 'tmf-api/partnershipManagement/v4',
  RESOURCE: import.meta.env.VITE_RESOURCE_TMF668 || 'partnership',
  ENDPOINT: import.meta.env.VITE_ENDPOINT_TMF668,
  getEndpoint: (resource = TMF668_CONFIG.RESOURCE) => {
    const baseUrl = ENV_CONFIG.BASE_URL;
    const apiGroup = TMF668_CONFIG.API_GROUP;
    return `${baseUrl}/${apiGroup}/${resource}`;
  }
};

// TMF678 - Customer Bill
export const TMF678_CONFIG = {
  API_GROUP: import.meta.env.VITE_API_GROUP_TMF678 || 'tmf-api/customerBill/v5',
  RESOURCE: import.meta.env.VITE_RESOURCE_TMF678 || 'customerBill',
  ENDPOINT: import.meta.env.VITE_ENDPOINT_TMF678,
  getEndpoint: (resource = TMF678_CONFIG.RESOURCE) => {
    const baseUrl = ENV_CONFIG.BASE_URL;
    const apiGroup = TMF678_CONFIG.API_GROUP;
    return `${baseUrl}/${apiGroup}/${resource}`;
  }
};

// TMF681 - Communication Management
export const TMF681_CONFIG = {
  API_GROUP: import.meta.env.VITE_API_GROUP_TMF681 || 'tmf-api/communicationManagement/v4',
  RESOURCE: import.meta.env.VITE_RESOURCE_TMF681 || 'communicationMessage',
  ENDPOINT: import.meta.env.VITE_ENDPOINT_TMF681,
  getEndpoint: (resource = TMF681_CONFIG.RESOURCE) => {
    const baseUrl = ENV_CONFIG.BASE_URL;
    const apiGroup = TMF681_CONFIG.API_GROUP;
    return `${baseUrl}/${apiGroup}/${resource}`;
  }
};

// Legacy Compatibility
export const LEGACY_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://markethub-api-gateway.onrender.com',
  TMF_API_PREFIX: import.meta.env.VITE_TMF_API_PREFIX || '/tmf-api',
  API_URL: import.meta.env.VITE_API_URL || 'https://markethub-api-gateway.onrender.com/tmf-api',
};

// Export all configurations
export default {
  ENV: ENV_CONFIG,
  TMF620: TMF620_CONFIG,
  TMF622: TMF622_CONFIG,
  TMF629: TMF629_CONFIG,
  TMF633: TMF633_CONFIG,
  TMF668: TMF668_CONFIG,
  TMF678: TMF678_CONFIG,
  TMF681: TMF681_CONFIG,
  LEGACY: LEGACY_CONFIG,
};
