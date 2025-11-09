// API Configuration
export const API_CONFIG = {
  BASE_URL: '', // Use relative path for Vite proxy
  
  // TM Forum API Endpoints
  ENDPOINTS: {
    // Authentication Service
    AUTH: '/tmf-api',
    
    // TMF620 Product Catalog API
    PRODUCT_CATALOG: '/tmf-api/productCatalog/v5',
    
    // TMF622 Product Ordering API
    PRODUCT_ORDERING: '/tmf-api/productOrdering/v1',
    
    // TMF629 Customer API
    CUSTOMER: '/tmf-api/customer/v5',
    
    // TMF633 Service Catalog Management API
    SERVICE_CATALOG: '/tmf-api/serviceCatalogManagement/v4',
    
    // TMF668 Partnership Management API
    PARTNERSHIP: '/tmf-api/partnershipManagement/v4',
    
    // TMF678 Customer Bill API
    CUSTOMER_BILL: '/tmf-api/customerBill/v5',
    
    // TMF681 Communication Management API
    COMMUNICATION: '/tmf-api/communicationManagement/v4'
  },
  
  // Request timeout (ms)
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
  }
};

// API Resource Paths
export const API_RESOURCES = {
  // Product Catalog Resources
  PRODUCT: {
    CATEGORY: '/category',
    CATALOG: '/productCatalog',
    OFFERING: '/productOffering',
    SPECIFICATION: '/productSpecification',
    OFFERING_PRICE: '/productOfferingPrice',
    IMPORT_JOB: '/importJob',
    EXPORT_JOB: '/exportJob',
    HUB: '/hub'
  },
  
  // Product Order Resources
  ORDER: {
    PRODUCT_ORDER: '/productOrder',
    CANCEL_ORDER: '/cancelProductOrder',
    HUB: '/hub'
  },
  
  // Customer Resources
  CUSTOMER: {
    CUSTOMER: '/customer',
    HUB: '/hub'
  },
  
  // Service Catalog Resources
  SERVICE: {
    CATALOG: '/serviceCatalog',
    CATEGORY: '/serviceCategory',
    CANDIDATE: '/serviceCandidate',
    SPECIFICATION: '/serviceSpecification',
    IMPORT_JOB: '/importJob',
    EXPORT_JOB: '/exportJob',
    HUB: '/hub'
  },
  
  // Partnership Resources
  PARTNERSHIP: {
    SPECIFICATION: '/partnershipSpecification',
    PARTNERSHIP: '/partnership',
    HUB: '/hub'
  },
  
  // Customer Bill Resources
  BILLING: {
    BILL_CYCLE: '/billCycle',
    CUSTOMER_BILL: '/customerBill',
    CUSTOMER_BILL_ON_DEMAND: '/customerBillOnDemand',
    APPLIED_RATE: '/appliedCustomerBillingRate'
  },
  
  // Communication Resources
  COMMUNICATION: {
    MESSAGE: '/communicationMessage',
    HUB: '/hub'
  }
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

// Response Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Default Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN: 'An unknown error occurred.'
};
