export const COLORS = {
  primary: '#00A651',
  secondary: '#0066CC',
  dark: '#003D5C',
  light: '#E6F7EF',
  white: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

export const CHART_COLORS = {
  primary: '#00A651',
  secondary: '#0066CC',
  accent: '#F59E0B',
  success: '#10B981',
  purple: '#8B5CF6',
  pink: '#EC4899',
};

export const TIME_PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Updated API_ENDPOINTS to use actual TMF Forum APIs
export const API_ENDPOINTS = {
  // ========== ANALYTICS (Using TMF Forum APIs - WORKING) ==========
  // Analytics uses direct TMF API calls in the service files
  ANALYTICS_OVERVIEW: '/admin/analytics/overview', // Not used - direct TMF calls
  SALES_REPORTS: '/admin/analytics/sales', // Not used - direct TMF calls
  TOP_PRODUCTS: '/admin/analytics/top-products', // Not used - direct TMF calls
  TOP_CATEGORIES: '/admin/analytics/top-categories', // Not used - direct TMF calls
  
  // ========== SUPPORT (Using TMF681 Communication Management) ==========
  // Support tickets are mapped to TMF681 communicationMessage
  TICKETS: 'communicationManagement/v4/communicationMessage',
  TICKET_DETAIL: 'communicationManagement/v4/communicationMessage/:id',
  TICKET_NOTES: 'communicationManagement/v4/communicationMessage', // POST for replies
  TICKET_STATS: 'communicationManagement/v4/communicationMessage', // GET with filters
  CUSTOMER_TICKETS: 'communicationManagement/v4/communicationMessage', // Filter by sender
  TICKET_ASSIGNEES: '/admin/support/assignees', // Custom endpoint (if available)
  TICKET_CATEGORIES: '/admin/support/categories', // Custom endpoint (if available)
  
  // ========== SETTINGS (Custom Admin Endpoints - NOT YET IMPLEMENTED) ==========
  // These require custom backend endpoints to be created
  COMMISSION_RATES: '/admin/settings/commission',
  SHIPPING_RULES: '/admin/settings/shipping',
  TAX_RULES: '/admin/settings/tax',
  BANNERS: '/admin/settings/banners',
  BANNER_UPLOAD: '/admin/settings/banners/upload',
  EMAIL_TEMPLATES: '/admin/settings/email-templates',
  EMAIL_TEMPLATE_DETAIL: '/admin/settings/email-templates/:id',
  
  // ========== TMF FORUM DIRECT ENDPOINTS (Available) ==========
  // These are the actual working TMF Forum APIs
  TMF_CUSTOMER_BILL: 'customerBill/v5/customerBill',
  TMF_PRODUCT_ORDER: 'productOrdering/v1/productOrder',
  TMF_CUSTOMER: 'customer/v5/customer',
  TMF_PARTNERSHIP: 'partnershipManagement/v4/partnership',
  TMF_PRODUCT_OFFERING: 'productCatalog/v5/productOffering',
  TMF_PRODUCT_CATEGORY: 'productCatalog/v5/category',
  TMF_COMMUNICATION: 'communicationManagement/v4/communicationMessage',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// TMF681 Communication Message Category Types
export const TMF_MESSAGE_CATEGORIES = {
  SUPPORT_TICKET: 'support-ticket',
  SUPPORT_REPLY: 'support-reply',
  SUPPORT_INTERNAL: 'support-internal',
  SYSTEM_ALERT: 'system-alert',
  ACTIVITY_LOG: 'activity-log',
  PLATFORM_CONFIG: 'platform-config', // For storing settings (workaround)
};

// TMF681 Communication Message States mapped to Ticket Status
export const TMF_STATE_MAPPING = {
  // TMF State -> Ticket Status
  'pending': 'open',
  'inProgress': 'in_progress',
  'delivered': 'resolved',
  'closed': 'closed',
  'failed': 'open',
  'scheduled': 'open',
};

// Reverse mapping for updating TMF state from ticket status
export const TICKET_TO_TMF_STATE = {
  'open': 'pending',
  'in_progress': 'inProgress',
  'resolved': 'delivered',
  'closed': 'closed',
};

// TMF622 Product Order States
export const TMF_ORDER_STATES = {
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'inprogress',
  PENDING: 'pending',
  COMPLETED: 'completed',
  DELIVERED: 'delivered',
  SHIPPED: 'shipped',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
  FAILED: 'failed',
};

// Helper function to check if endpoint uses TMF API or custom endpoint
export const isTMFEndpoint = (endpoint) => {
  return endpoint.includes('communicationManagement') ||
         endpoint.includes('customerBill') ||
         endpoint.includes('productOrdering') ||
         endpoint.includes('customer/v5') ||
         endpoint.includes('partnershipManagement') ||
         endpoint.includes('productCatalog');
};

// Helper function to check if endpoint is available
export const isEndpointAvailable = (endpoint) => {
  // TMF endpoints are available
  if (isTMFEndpoint(endpoint)) return true;
  
  // Custom admin endpoints are NOT available yet
  if (endpoint.includes('/admin/settings') || 
      endpoint.includes('/admin/support/assignees') ||
      endpoint.includes('/admin/support/categories')) {
    return false;
  }
  
  return true;
};

export default {
  COLORS,
  CHART_COLORS,
  TIME_PERIODS,
  ORDER_STATUS,
  TICKET_STATUS,
  TICKET_PRIORITY,
  API_ENDPOINTS,
  PAGINATION,
  TMF_MESSAGE_CATEGORIES,
  TMF_STATE_MAPPING,
  TICKET_TO_TMF_STATE,
  TMF_ORDER_STATES,
  isTMFEndpoint,
  isEndpointAvailable,
};