// TMF Services Index
// Export all TM Forum API services from a single location

// TMF620 - Product Catalog Management API
export { default as productCatalogService } from './productCatalogService';

// TMF622 - Product Ordering Management API  
export { default as orderService } from './orderService';

// TMF629 - Customer Management API
export { default as customerService } from './customerService';

// TMF633 - Service Catalog Management API
export { default as serviceCatalogService } from './serviceCatalogService';

// TMF668 - Partnership Management API
export { default as partnerService } from './partnerService';

// TMF678 - Customer Bill API
export { default as customerBillService } from './customerBillService';

// TMF681 - Communication Management API
export { default as communicationService } from './communicationService';

// Export all services as a single object for convenience
const tmfServices = {
  productCatalog: productCatalogService,
  order: orderService,
  customer: customerService,
  serviceCatalog: serviceCatalogService,
  partner: partnerService,
  customerBill: customerBillService,
  communication: communicationService
};

export default tmfServices;
