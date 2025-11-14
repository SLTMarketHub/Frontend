import { axiosInstance } from './axiosInstance'; // ✅ FIXED - was using 'api'
import { API_ENDPOINTS } from '../utils/constants';

// Mock data for fallback when backend endpoints don't exist
const mockCommissionRates = {
  defaultRate: 5.0,
  categoryRates: [
    { category: 'Electronics', rate: 3.0 },
    { category: 'Clothing', rate: 8.0 },
    { category: 'Books', rate: 10.0 },
    { category: 'Home & Garden', rate: 6.0 },
  ],
  minimumCommission: 50,
  paymentCycle: 'monthly',
};

const mockShippingRules = {
  freeShippingThreshold: 5000,
  standardShippingFee: 300,
  expressShippingFee: 600,
  zones: [
    { name: 'Colombo District', fee: 200, expressAvailable: true },
    { name: 'Western Province', fee: 350, expressAvailable: true },
    { name: 'Other Provinces', fee: 500, expressAvailable: false },
  ],
};

const mockTaxRules = {
  vatEnabled: true,
  vatRate: 12.0,
  includeInPrice: false,
  invoiceFooterText: 'Tax Invoice - VAT Reg No: 123456789V',
};

const mockBanners = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get up to 50% off on summer collection',
    imageUrl: 'https://via.placeholder.com/800x400',
    linkUrl: '/collections/summer',
    position: 'homepage-hero',
    priority: 1,
    status: 'active',
    startDate: '2024-06-01',
    endDate: '2024-08-31',
  },
  {
    id: 2,
    title: 'New Arrivals',
    description: 'Check out the latest products',
    imageUrl: 'https://via.placeholder.com/800x400',
    linkUrl: '/collections/new',
    position: 'homepage-secondary',
    priority: 2,
    status: 'active',
  },
];

const mockEmailTemplates = [
  {
    id: 1,
    name: 'Order Confirmation',
    type: 'order',
    subject: 'Your Order #{orderNumber} is Confirmed',
    htmlBody: '<h1>Thank you for your order!</h1><p>Order #{orderNumber} for {customerName}</p>',
    textBody: 'Thank you for your order! Order #{orderNumber} for {customerName}',
    variables: ['{customerName}', '{orderNumber}', '{orderTotal}'],
    isActive: true,
  },
  {
    id: 2,
    name: 'Shipping Notification',
    type: 'shipping',
    subject: 'Your Order #{orderNumber} Has Been Shipped',
    htmlBody: '<h1>Your order is on the way!</h1><p>Tracking: {trackingNumber}</p>',
    textBody: 'Your order is on the way! Tracking: {trackingNumber}',
    variables: ['{customerName}', '{orderNumber}', '{trackingNumber}'],
    isActive: true,
  },
  {
    id: 3,
    name: 'Welcome Email',
    type: 'customer',
    subject: 'Welcome to SLT Markethub, {customerName}!',
    htmlBody: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
    textBody: 'Welcome! Thank you for joining us.',
    variables: ['{customerName}', '{email}'],
    isActive: true,
  },
];

// Commission Rates
export const getCommissionRates = async () => {
  try {
    console.log('Fetching commission rates from backend...');
    const response = await axiosInstance.get(API_ENDPOINTS.COMMISSION_RATES);
    console.log('✅ Commission rates loaded from backend');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available for commission rates, using mock data');
    // Return mock data as fallback
    return mockCommissionRates;
  }
};

export const updateCommissionRates = async (data) => {
  try {
    console.log('Updating commission rates...');
    const response = await axiosInstance.put(API_ENDPOINTS.COMMISSION_RATES, data);
    console.log('✅ Commission rates updated successfully');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available, simulating commission update');
    // Simulate success for development
    return data;
  }
};

// Shipping Rules
export const getShippingRules = async () => {
  try {
    console.log('Fetching shipping rules from backend...');
    const response = await axiosInstance.get(API_ENDPOINTS.SHIPPING_RULES);
    console.log('✅ Shipping rules loaded from backend');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available for shipping rules, using mock data');
    return mockShippingRules;
  }
};

export const updateShippingRules = async (data) => {
  try {
    console.log('Updating shipping rules...');
    const response = await axiosInstance.put(API_ENDPOINTS.SHIPPING_RULES, data);
    console.log('✅ Shipping rules updated successfully');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available, simulating shipping update');
    return data;
  }
};

// Tax Rules
export const getTaxRules = async () => {
  try {
    console.log('Fetching tax rules from backend...');
    const response = await axiosInstance.get(API_ENDPOINTS.TAX_RULES);
    console.log('✅ Tax rules loaded from backend');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available for tax rules, using mock data');
    return mockTaxRules;
  }
};

export const updateTaxRules = async (data) => {
  try {
    console.log('Updating tax rules...');
    const response = await axiosInstance.put(API_ENDPOINTS.TAX_RULES, data);
    console.log('✅ Tax rules updated successfully');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available, simulating tax update');
    return data;
  }
};

// Banners
export const getBanners = async () => {
  try {
    console.log('Fetching banners from backend...');
    const response = await axiosInstance.get(API_ENDPOINTS.BANNERS);
    console.log('✅ Banners loaded from backend');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available for banners, using mock data');
    return mockBanners;
  }
};

export const createBanner = async (data) => {
  try {
    console.log('Creating banner...');
    const response = await axiosInstance.post(API_ENDPOINTS.BANNERS, data);
    console.log('✅ Banner created successfully');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available, simulating banner creation');
    // Simulate new banner
    return {
      id: Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
};

export const updateBanner = async (id, data) => {
  try {
    console.log(`Updating banner ${id}...`);
    const response = await axiosInstance.put(`${API_ENDPOINTS.BANNERS}/${id}`, data);
    console.log('✅ Banner updated successfully');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available, simulating banner update');
    return {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }
};

export const deleteBanner = async (id) => {
  try {
    console.log(`Deleting banner ${id}...`);
    const response = await axiosInstance.delete(`${API_ENDPOINTS.BANNERS}/${id}`);
    console.log('✅ Banner deleted successfully');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available, simulating banner deletion');
    return { success: true };
  }
};

// Email Templates
export const getEmailTemplates = async () => {
  try {
    console.log('Fetching email templates from backend...');
    const response = await axiosInstance.get(API_ENDPOINTS.EMAIL_TEMPLATES);
    console.log('✅ Email templates loaded from backend');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available for email templates, using mock data');
    return mockEmailTemplates;
  }
};

export const updateEmailTemplate = async (id, data) => {
  try {
    console.log(`Updating email template ${id}...`);
    const response = await axiosInstance.put(`${API_ENDPOINTS.EMAIL_TEMPLATES}/${id}`, data);
    console.log('✅ Email template updated successfully');
    return response.data;
  } catch (error) {
    console.warn('⚠️ Backend not available, simulating email template update');
    return {
      id,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }
};

export default {
  getCommissionRates,
  updateCommissionRates,
  getShippingRules,
  updateShippingRules,
  getTaxRules,
  updateTaxRules,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getEmailTemplates,
  updateEmailTemplate,
};