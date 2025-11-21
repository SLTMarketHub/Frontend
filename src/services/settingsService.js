import { axiosInstance } from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';
import { BANNER_PLACEHOLDER } from '../utils/imageUtils';

// Helper to get setting by type
const getSetting = async (settingType) => {
  try {
    console.log(`Fetching ${settingType} settings from backend...`);
    const response = await axiosInstance.get('communicationManagement/v4/communicationMessage', {
      params: {
        category: 'platform-config',
        subject: settingType,
        limit: 1,
        sort: '-sendTime' // Get latest
      }
    });
    
    if (response.data && response.data.length > 0) {
      const content = response.data[0].content;
      return JSON.parse(content);
    }
    return null;
  } catch (error) {
    console.warn(`Failed to fetch ${settingType} settings:`, error);
    return null;
  }
};

// Helper to save setting
const saveSetting = async (settingType, data) => {
  try {
    console.log(`Saving ${settingType} settings to backend...`);
    // First check if one exists to update, or just create new one (log style)
    // For settings, we usually want the latest state. 
    // We'll create a new message with the new state.
    
    const response = await axiosInstance.post('communicationManagement/v4/communicationMessage', {
      subject: settingType,
      content: JSON.stringify(data),
      messageType: 'Configuration',
      state: 'active',
      category: 'platform-config',
      sendTime: new Date().toISOString(),
      sender: {
        name: 'Admin System',
        '@referredType': 'System'
      },
      characteristic: [
        {
          name: 'settingType',
          value: settingType
        }
      ]
    });
    
    console.log(`✅ ${settingType} settings saved successfully`);
    return data;
  } catch (error) {
    console.error(`Error saving ${settingType} settings:`, error);
    throw error;
  }
};

// Default Mock Data (Fallback)
const defaultCommissionRates = {
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

const defaultShippingRules = {
  freeShippingThreshold: 5000,
  standardShippingFee: 300,
  expressShippingFee: 600,
  zones: [
    { name: 'Colombo District', fee: 200, expressAvailable: true },
    { name: 'Western Province', fee: 350, expressAvailable: true },
    { name: 'Other Provinces', fee: 500, expressAvailable: false },
  ],
};

const defaultTaxRules = {
  vatEnabled: true,
  vatRate: 12.0,
  includeInPrice: false,
  invoiceFooterText: 'Tax Invoice - VAT Reg No: 123456789V',
};

const defaultBanners = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get up to 50% off on summer collection',
    imageUrl: BANNER_PLACEHOLDER,
    position: 'homepage-hero',
    priority: 1,
    status: 'active',
  },
];

const defaultEmailTemplates = [
  {
    id: 1,
    name: 'Order Confirmation',
    type: 'order',
    subject: 'Your Order #{orderNumber} is Confirmed',
    variables: ['{customerName}', '{orderNumber}', '{orderTotal}'],
    isActive: true,
  },
];

// Commission Rates
export const getCommissionRates = async () => {
  const data = await getSetting('commission-rates');
  return data || defaultCommissionRates;
};

export const updateCommissionRates = async (data) => {
  return await saveSetting('commission-rates', data);
};

// Shipping Rules
export const getShippingRules = async () => {
  const data = await getSetting('shipping-rules');
  return data || defaultShippingRules;
};

export const updateShippingRules = async (data) => {
  return await saveSetting('shipping-rules', data);
};

// Tax Rules
export const getTaxRules = async () => {
  const data = await getSetting('tax-rules');
  return data || defaultTaxRules;
};

export const updateTaxRules = async (data) => {
  return await saveSetting('tax-rules', data);
};

// Banners
export const getBanners = async () => {
  const data = await getSetting('banners');
  return data || defaultBanners;
};

export const createBanner = async (data) => {
  const currentBanners = await getBanners();
  const newBanner = { ...data, id: Date.now() };
  const updatedBanners = [...currentBanners, newBanner];
  await saveSetting('banners', updatedBanners);
  return newBanner;
};

export const updateBanner = async (id, data) => {
  const currentBanners = await getBanners();
  const updatedBanners = currentBanners.map(b => b.id === id ? { ...b, ...data } : b);
  await saveSetting('banners', updatedBanners);
  return { ...data, id };
};

export const deleteBanner = async (id) => {
  const currentBanners = await getBanners();
  const updatedBanners = currentBanners.filter(b => b.id !== id);
  await saveSetting('banners', updatedBanners);
  return { success: true };
};

// Email Templates
export const getEmailTemplates = async () => {
  const data = await getSetting('email-templates');
  return data || defaultEmailTemplates;
};

export const updateEmailTemplate = async (id, data) => {
  const currentTemplates = await getEmailTemplates();
  const updatedTemplates = currentTemplates.map(t => t.id === id ? { ...t, ...data } : t);
  await saveSetting('email-templates', updatedTemplates);
  return { ...data, id };
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