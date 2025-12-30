import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getIdToken } from './auth';

// Base URL from environment variable
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://moods-backend-ka6h625uva-uc.a.run.app/api/v1';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add Authorization header
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get Firebase ID Token
      const token = await getIdToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // If getting token fails, continue without it
      // The request will fail with 401 if auth is required
      console.warn('Failed to get auth token:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized - Token might be expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token (force refresh)
        const newToken = await getIdToken(true);
        
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          // Retry the original request with new token
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Token refresh failed - user needs to login again
        // This will be handled by the AuthContext
        console.error('Token refresh failed:', refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      const networkError = new Error('Network error - please check your internet connection');
      return Promise.reject(networkError);
    }

    // Handle other HTTP errors
    const status = error.response.status;
    const errorData = error.response.data as any;
    const errorMessage = errorData?.detail || errorData?.message || `API Error: ${error.response.statusText}`;

    // Create a more descriptive error
    const apiError = new Error(errorMessage);
    (apiError as any).status = status;
    (apiError as any).data = errorData;

    return Promise.reject(apiError);
  }
);

export default apiClient;



