import axios from "axios";

// Create axios instance using environment variable
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL, // Uses VITE_BASE_URL from .env
    timeout: 30000, // 30 second timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// Add authentication interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Try different token key names (adjust based on your login implementation)
        const token = localStorage.getItem("token") || 
                     localStorage.getItem("authToken") ||
                     localStorage.getItem("accessToken") ||
                     localStorage.getItem("auth_token");
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No authentication token found - API calls may fail");
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Log errors for debugging
        if (error.response) {
            console.error(`API Error [${error.response.status}]:`, error.response.data);
            
            // Handle specific error codes
            if (error.response.status === 401) {
                console.error("❌ Authentication failed - Please log in");
                // Optionally redirect to login
                // window.location.href = '/login';
            } else if (error.response.status === 403) {
                console.error("❌ Access forbidden - Insufficient permissions");
            } else if (error.response.status === 404) {
                console.error("❌ Resource not found");
            }
        } else if (error.request) {
            console.error("❌ No response from server - Check network connection");
        } else {
            console.error("❌ Request error:", error.message);
        }
        
        return Promise.reject(error);
    }
);