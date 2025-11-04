import axios from 'axios';

const BASE_URL = 'https://markethub-api-gateway.onrender.com';
const AUTH_API_URL = `${BASE_URL}/tmf-api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Set to true if your backend requires cookies
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // Login user
  async login(credentials) {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/login`, credentials);
      const { token, refreshToken, user } = response.data;
      
      // Store tokens and user info
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error.message;
    }
  }

  // Register new user
  async register(userData) {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/register`, userData);
      const { token, refreshToken, user } = response.data;
      
      // Store tokens and user info
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || error.message;
    }
  }

  // Logout user
  async logout() {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await axios.post(`${AUTH_API_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      const response = await axios.post(`${AUTH_API_URL}/auth/refresh`, {
        refreshToken
      });
      
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Get auth token
  getToken() {
    return localStorage.getItem('authToken');
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await apiClient.patch(`${AUTH_API_URL}/auth/profile`, userData);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error.response?.data || error.message;
    }
  }

  // Change password
  async changePassword(passwords) {
    try {
      const response = await apiClient.post(`${AUTH_API_URL}/auth/change-password`, passwords);
      return response.data;
    } catch (error) {
      console.error('Password change error:', error);
      throw error.response?.data || error.message;
    }
  }

  // Request password reset
  async requestPasswordReset(email) {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error.response?.data || error.message;
    }
  }

  // Reset password with token
  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/reset-password`, {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error.response?.data || error.message;
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await axios.post(`${AUTH_API_URL}/auth/verify-email`, { token });
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error.response?.data || error.message;
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;

// Export the configured axios instance for use in other services
export { apiClient, BASE_URL, AUTH_API_URL };
