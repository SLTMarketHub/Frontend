import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const getAnalyticsOverview = async (period = 'monthly') => {
  try {
    const response = await api.get(API_ENDPOINTS.ANALYTICS_OVERVIEW, {
      params: { period },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    throw error;
  }
};

export const getSalesReports = async (params = {}) => {
  try {
    const response = await api.get(API_ENDPOINTS.SALES_REPORTS, {
      params: {
        period: params.period || 'monthly',
        startDate: params.startDate,
        endDate: params.endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales reports:', error);
    throw error;
  }
};

export const getTopProducts = async (limit = 10, period = 'monthly') => {
  try {
    const response = await api.get(API_ENDPOINTS.TOP_PRODUCTS, {
      params: { limit, period },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

export const getTopCategories = async (limit = 10, period = 'monthly') => {
  try {
    const response = await api.get(API_ENDPOINTS.TOP_CATEGORIES, {
      params: { limit, period },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top categories:', error);
    throw error;
  }
};

export default {
  getAnalyticsOverview,
  getSalesReports,
  getTopProducts,
  getTopCategories,
};