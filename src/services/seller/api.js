import axios from 'axios';

const baseURL = import.meta?.env?.VITE_API_BASE_URL || '/tmf-api';

export const api = axios.create({
  baseURL: '/tmf-api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const upload = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});


