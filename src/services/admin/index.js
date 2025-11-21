// Admin TMF Services Index
// Export all TM Forum Admin API services from a single location

import tmf620AdminService from './tmf620AdminService';
import tmf622AdminService from './tmf622AdminService';
import tmf629AdminService from './tmf629AdminService';
import tmf633AdminService from './tmf633AdminService';
import tmf668AdminService from './tmf668AdminService';
import tmf678AdminService from './tmf678AdminService';
import tmf681AdminService from './tmf681AdminService';
import userManagementService from './userManagement';
import * as analyticsService from './annalytics';
import * as dashboardService from './dashboard';
import * as sellersService from './sellers';
import * as productsService from './products';
import * as ordersService from './orders';

// Re-export individual services for named imports
export {
  tmf620AdminService,
  tmf622AdminService,
  tmf629AdminService,
  tmf633AdminService,
  tmf668AdminService,
  tmf678AdminService,
  tmf681AdminService,
  userManagementService,
  analyticsService,
  dashboardService,
  sellersService,
  productsService,
  ordersService
};

// Export all admin services as a single object for convenience
const adminServices = {
  productCatalog: tmf620AdminService,
  productOrdering: tmf622AdminService,
  customer: tmf629AdminService,
  serviceCatalog: tmf633AdminService,
  partnership: tmf668AdminService,
  customerBill: tmf678AdminService,
  communication: tmf681AdminService,
  userManagement: userManagementService,
  analytics: analyticsService,
  dashboard: dashboardService,
  sellers: sellersService,
  products: productsService,
  orders: ordersService
};

export default adminServices;

// Usage examples:
// 
// Import individual services:
// import { tmf620AdminService, tmf622AdminService } from '@/services/admin';
//
// Import all services:
// import adminServices from '@/services/admin';
//
// Use services:
// const categories = await tmf620AdminService.listCategories();
// const orders = await adminServices.productOrdering.listProductOrders();
