import axios from "axios";

// Hardcoded production URL (ignores .env file)
const PRODUCTION_BASE_URL = "https://markethub-api-gateway.onrender.com/tmf-api/";

// Create axios instance with production URL
export const axiosInstance = axios.create({
    baseURL: PRODUCTION_BASE_URL,
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
            console.warn("⚠️ No authentication token found - API calls may fail");
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
            console.error(`❌ API Error [${error.response.status}]:`, error.response.data);
            
            // Handle specific error codes
            if (error.response.status === 401) {
                console.error("❌ Authentication failed - Please log in");
            } else if (error.response.status === 403) {
                console.error("❌ Access forbidden - Insufficient permissions");
            } else if (error.response.status === 404) {
                console.error("❌ Resource not found");
            }
        } else if (error.request) {
            console.error("❌ No response from server - Check network connection or backend status");
        } else {
            console.error("❌ Request error:", error.message);
        }
        
        return Promise.reject(error);
    }
);

// Log the base URL being used (for debugging)
console.log("🔗 API Base URL:", PRODUCTION_BASE_URL);