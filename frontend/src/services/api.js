import axios from 'axios';

// Use proxy from vite.config.js or direct URL
const API_BASE_URL = import.meta.env.DEV 
  ? '/api'  // Uses Vite proxy in development
  : 'http://localhost:8080/api'; // Direct URL for production

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`, config.data);
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token attached to request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        console.log('🔒 Unauthorized - clearing tokens');
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
      } else if (status === 500) {
        const errorMessage = data?.message || data?.error || 'Internal server error';
        throw new Error(`Server Error (500): ${errorMessage}`);
      } else {
        const errorMessage = data?.message || error.message || 'Request failed';
        throw new Error(`${status} Error: ${errorMessage}`);
      }
    } else if (error.request) {
      console.error('🌐 Network Error - No response received');
      throw new Error('Network error: Cannot connect to server. Make sure your Spring Boot backend is running on port 8080.');
    } else {
      throw new Error(error.message || 'Unexpected error occurred');
    }
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => {
    console.log('🔐 Login attempt:', { email: credentials.email });
    return api.post('/auth/login', credentials);
  },
  register: (userData) => {
    console.log('📝 Registration attempt:', { email: userData.email, fullName: userData.fullName });
    return api.post('/auth/register', userData);
  },
  logout: () => api.post('/auth/logout'),
};

// Test connection
export const testConnection = () => {
  console.log('🔍 Testing backend connection...');
  return api.get('/health');
};

export default api;