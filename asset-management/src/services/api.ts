import axios, { AxiosInstance, AxiosError } from 'axios';
import { getCurrentToken } from '../config/firebase.config'; 
import { Asset } from '../types/Assets';

interface GetAssetsParams {
  search?: string;
  page?: number;
  status?: string;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface AssetsResponse {
  success: boolean;
  assets: Asset[];
  pagination: Pagination;
}
interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Create API client with dynamic base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


// apiClient.interceptors.request.use
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getCurrentToken(); // Use Firebase's current token
    console.log('🔑 Token being sent:', token ? 'Present' : 'Missing');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url || 'unknown');
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url || 'unknown',
      method: error.config?.method || 'unknown',
      data: error.response?.data
    });

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors consistently
const handleApiError = (error: any, operation: string) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    
    switch (status) {
      case 404:
        throw new Error(`${operation}: Endpoint not found. Please check if your backend server is running and the endpoint exists.`);
      case 401:
        throw new Error(`${operation}: Unauthorized. Please check your authentication.`);
      case 403:
        throw new Error(`${operation}: Forbidden. You don't have permission to access this resource.`);
      case 500:
        throw new Error(`${operation}: Internal server error. Please try again later.`);
      default:
        throw new Error(`${operation}: ${message || 'Unknown error occurred'}`);
    }
  } else if (error.request) {
    // Request made but no response received
    throw new Error(`${operation}: No response from server. Please check if your backend is running on the correct port.`);
  } else {
    // Something else happened
    throw new Error(`${operation}: ${error.message || 'Unknown error occurred'}`);
  }
};

// Asset-related API calls
export const getAssets = async (params?: GetAssetsParams): Promise<AssetsResponse> => {
  try {
    const response = await apiClient.get('/assets', {params} );

    // Transform backend response to frontend format
    const transformedAssets = (response.data.assets || []).map((asset: any) => ({
      id: asset._id || asset.id,
      name: asset.name,
      category: asset.category,
      status: asset.status,
      serialNumber: asset.serialNumber,
      purchaseDate: asset.purchaseDate,
      value: asset.purchasePrice || asset.value || 0,
      location: asset.location,
      assignedTo: asset.assignedTo,
      qrCode: asset.qrCode,
    }));
      
    // Normalize the response
    return {
      success: true,
      assets: transformedAssets,
      pagination: response.data.pagination || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: transformedAssets.length,
        pages: 1
      }
    };
  } catch (error) {
    console.error('Error fetching assets:', error);
    return {
      success: false,
      assets: [],
      pagination: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: 0,
        pages: 0
      }
    };
  }
};

export const getAssetById = async (id: string) => {
  try {
    const response = await apiClient.get(`/assets/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch asset details');
  }
};

export const createAsset = async (data: Partial<Asset>) => {
  try {
    const response = await apiClient.post('/assets', data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to create asset');
  }
};

export const updateAsset = async (id: string, data: Partial<Asset>) => {
  try {
    const response = await apiClient.put(`/assets/${id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update asset');
  }
};

export const assignAsset = async (id: string, userId: string) => {
  try {
    const response = await apiClient.post(`/assets/${id}/assign`, { userId });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to assign asset');
  }
};

export const returnAsset = async (id: string) => {
  try {
    const response = await apiClient.post(`/assets/${id}/return`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to return asset');
  }
};

export const exportToCSV = async () => {
  try {
    const response = await apiClient.get('/assets/export/csv', { responseType: 'blob' });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to export assets to CSV');
  }
};

// Organization-related API calls
export const getOrganization = async () => {
  try {
    console.log('🏢 Fetching organization data...');
    const response = await apiClient.get('/organizations');
    console.log('✅ Organization data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Organization fetch failed:', error);
    handleApiError(error, 'Failed to fetch organization');
  }
};

export const getOrganizationMembers = async () => {
  try {
    console.log('👥 Fetching organization members...');
    const response = await apiClient.get('/organizations/members');
    console.log('✅ Members data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Members fetch failed:', error);
    handleApiError(error, 'Failed to fetch organization members');
  }
};

// User-related API calls
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/users/me');
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch user profile');
  }
};

// Health check function to test API connectivity
export const healthCheck = async () => {
  try {
    console.log('🔍 Performing health check...');
    const response = await apiClient.get('/health');
    console.log('✅ Health check passed:', response.data);
    return response.data;
  } catch (error) {
    console.warn('⚠️ Health check failed:', error);
    return { status: 'error', message: 'API not accessible' };
  }
};

// Debug function to test endpoints
export const debugEndpoints = async () => {
  const endpoints = [
    '/health',
    '/organizations',
    '/organizations/members',
    '/assets'
  ];

  console.log('🔍 Testing API endpoints...');
  
  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get(endpoint);
      console.log(`✅ ${endpoint}: ${response.status}`);
    } catch (error: any) {
      console.log(`❌ ${endpoint}: ${error.response?.status || 'No response'}`);
    }
  }
};

export default apiClient;