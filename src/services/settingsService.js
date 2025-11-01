import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const getCommissionRates = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.COMMISSION_RATES);
    return response.data;
  } catch (error) {
    console.error('Error fetching commission rates:', error);
    throw error;
  }
};

export const updateCommissionRates = async (data) => {
  try {
    const response = await api.put(API_ENDPOINTS.COMMISSION_RATES, data);
    return response.data;
  } catch (error) {
    console.error('Error updating commission rates:', error);
    throw error;
  }
};

export const getShippingRules = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.SHIPPING_RULES);
    return response.data;
  } catch (error) {
    console.error('Error fetching shipping rules:', error);
    throw error;
  }
};

export const updateShippingRules = async (data) => {
  try {
    const response = await api.put(API_ENDPOINTS.SHIPPING_RULES, data);
    return response.data;
  } catch (error) {
    console.error('Error updating shipping rules:', error);
    throw error;
  }
};

export const getTaxRules = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.TAX_RULES);
    return response.data;
  } catch (error) {
    console.error('Error fetching tax rules:', error);
    throw error;
  }
};

export const updateTaxRules = async (data) => {
  try {
    const response = await api.put(API_ENDPOINTS.TAX_RULES, data);
    return response.data;
  } catch (error) {
    console.error('Error updating tax rules:', error);
    throw error;
  }
};

export const getBanners = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.BANNERS);
    return response.data;
  } catch (error) {
    console.error('Error fetching banners:', error);
    throw error;
  }
};

export const createBanner = async (data) => {
  try {
    const response = await api.post(API_ENDPOINTS.BANNERS, data);
    return response.data;
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

export const updateBanner = async (id, data) => {
  try {
    const response = await api.put(`${API_ENDPOINTS.BANNERS}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
};

export const deleteBanner = async (id) => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.BANNERS}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
};

export const getEmailTemplates = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.EMAIL_TEMPLATES);
    return response.data;
  } catch (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
};

export const updateEmailTemplate = async (id, data) => {
  try {
    const response = await api.put(`${API_ENDPOINTS.EMAIL_TEMPLATES}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating email template:', error);
    throw error;
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