import axios from 'axios';

const baseURL = import.meta?.env?.VITE_API_BASE_URL || '/tmf-api';

export const api = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Simple retry/backoff for rate-limited or transient errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    const status = error?.response?.status;
    const shouldRetry = status === 429 || status === 503 || status === 502;

    if (!shouldRetry) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;
    const maxRetries = 3;
    if (config.__retryCount >= maxRetries) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;

    // Honor Retry-After header if present
    const retryAfterHeader = error?.response?.headers?.['retry-after'];
    const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : null;
    const backoffMs = retryAfterMs ?? Math.min(1000 * 2 ** (config.__retryCount - 1), 8000);

    await new Promise((resolve) => setTimeout(resolve, backoffMs));
    return api(config);
  }
);

export const upload = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

