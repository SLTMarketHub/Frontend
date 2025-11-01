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

export const API_ENDPOINTS = {
  ANALYTICS_OVERVIEW: '/admin/analytics/overview',
  SALES_REPORTS: '/admin/analytics/sales',
  TOP_PRODUCTS: '/admin/analytics/top-products',
  TOP_CATEGORIES: '/admin/analytics/top-categories',
  COMMISSION_RATES: '/admin/settings/commission',
  SHIPPING_RULES: '/admin/settings/shipping',
  TAX_RULES: '/admin/settings/tax',
  BANNERS: '/admin/settings/banners',
  EMAIL_TEMPLATES: '/admin/settings/email-templates',
  TICKETS: '/admin/support/tickets',
  TICKET_DETAIL: '/admin/support/tickets/:id',
  TICKET_NOTES: '/admin/support/tickets/:id/notes',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
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
};