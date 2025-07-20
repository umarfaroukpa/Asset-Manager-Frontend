import axios, { AxiosInstance } from 'axios';
import { Asset } from '../types/Assets';

// Create API client with dynamic base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api', 
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('token has been sent', token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getAssets = async (params?: { search?: string; page?: number; status?: string }) => {
  const response = await apiClient.get('/assets', { params });
  return response.data;
};

export const getAssetById = async (id: string) => {
  const response = await apiClient.get(`/assets/${id}`);
  return response.data;
};

export const createAsset = async (data: Partial<Asset>) => {
  const response = await apiClient.post('/assets', data);
  return response.data;
};

export const updateAsset = async (id: string, data: Partial<Asset>) => {
  const response = await apiClient.put(`/assets/${id}`, data);
  return response.data;
};

export const assignAsset = async (id: string, userId: string) => {
  const response = await apiClient.post(`/assets/${id}/assign`, { userId });
  return response.data;
};

export const returnAsset = async (id: string) => {
  const response = await apiClient.post(`/assets/${id}/return`);
  return response.data;
};

export const exportToCSV = async () => {
  const response = await apiClient.get('/assets/export/csv', { responseType: 'blob' });
  return response.data;
};

// This will export the API client for direct use if needed
export default apiClient;