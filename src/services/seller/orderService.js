import { api } from './api';

const BASE_PATH = "https://markethub-api-gateway.onrender.com/tmf-api/productOrdering/v1/productOrder";

export const fetchOrders = async (params = {}) => {
  const response = await api.get(BASE_PATH, { params });
  return response.data;
};

export const fetchOrderById = async (id) => {
  const response = await api.get(`${BASE_PATH}/${id}`);
  return response.data;
};

export const updateOrderById = async (id, payload) => {
  const response = await api.patch(`${BASE_PATH}/${id}`, payload);
  return response.data;
};

export default { fetchOrders, fetchOrderById, updateOrderById };


