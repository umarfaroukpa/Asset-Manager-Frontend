import axios, { AxiosInstance, AxiosError } from 'axios';
import { getCurrentToken, onAuthStateChange } from '../config/firebase.config'; 
import { Asset } from '../types/Assets';
import { NotificationResponse, Notification as AppNotification } from '../types/notification.types';
import { logAPI, logError, logAuth } from '../utils/logger';

// Global type declarations
declare global {
  interface Window {
    jsPDF?: any;
    XLSX?: any;
  }
}

declare module 'axios' {
  interface InternalAxiosRequestConfig<D = any> {
    _retry?: boolean;
  }
}

// Interface for API response items that can have various structures
interface ApiResponseItem {
  _id?: string;
  id?: string;
  value?: string;
  name?: string;
  label?: string;
  [key: string]: any; // Allow additional properties
}

// FilterOption type for dropdown/select options
interface FilterOption {
  value: string;
  label: string;
  [key: string]: any; // Allow additional properties
}

// Generic API response type
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  pagination?: Pagination;
}

// Specific interfaces for different endpoints
interface CategoryResponse extends ApiResponseItem {
  categoryId?: string;
  categoryName?: string;
}

interface LocationResponse extends ApiResponseItem {
  locationId?: string;
  locationName?: string;
}

interface DepartmentResponse extends ApiResponseItem {
  departmentId?: string;
  departmentName?: string;
}

interface DepartmentApiResponse {
  success: boolean;
  message?: string;
  data?: {
    departments?: DepartmentResponse[];
  } | DepartmentResponse[]; // Allow both nested and direct array
  departments?: DepartmentResponse[]; // Allow top-level departments
  error?: string;
  pagination?: Pagination;
}

// Enhanced interfaces for reports
interface ReportFilters {
  groupBy?: 'category' | 'status' | 'location';
  status?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  format?: 'json' | 'csv' | 'pdf';
  action?: string;
  userId?: string;
  assetId?: string;
  page?: number;
  limit?: number;
}

interface AssetReportData {
  success: boolean;
  data: {
    summary: {
      totalAssets: number;
      totalValue: number;
      averageValue: number;
      statusBreakdown: string[];
    };
    groupedData: Array<{
      _id: string;
      categoryName?: string;
      count: number;
      totalValue: number;
      assets: Array<{
        _id: string;
        name: string;
        status?: string;
        currentValue: number;
        category?: string;
      }>;
    }>;
    groupBy: string;
    filters: ReportFilters;
  };
}

interface MaintenanceReportData {
  success: boolean;
  data: {
    summary: {
      total: number;
      overdue: number;
      upcoming: number;
      scheduled: number;
    };
    overdue: any[];
    upcoming: any[];
    scheduled: any[];
  };
}

interface AuditReportData {
  success: boolean;
  data: {
    auditLogs: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    summary: {
      totalEvents: number;
      actionBreakdown: Array<{
        _id: string;
        count: number;
      }>;
    };
  };
}

interface UtilizationReportData {
  success: boolean;
  data: {
    totalAssets: number;
    utilization: Array<{
      status: string;
      count: number;
      totalValue: number;
      percentage: string;
    }>;
  };
}

interface ExportReportData {
  success: boolean;
  data: any[];
  exportInfo: {
    type: string;
    format: string;
    count: number;
    exportedAt: string;
  };
}

// Existing interfaces and setup code...
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
  retry?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface CategoryApiResponse {
  success: boolean;
  message?: string;
  count?: number;
  data?: {
    categories?: CategoryResponse[];
  };
  error?: string;
}

// Function to transform API responses to FilterOption format
const transformToFilterOption = (
  item: ApiResponseItem | CategoryResponse | LocationResponse | DepartmentResponse,
  fallbackLabel = 'Unknown'
): FilterOption => {
  return {
    value: item._id || item.id || item.value || '',
    label: item.name || item.label || item.categoryName || item.locationName || item.departmentName || fallbackLabel,
    ...item // Spread all other properties
  };
};

// Token management
let currentToken: string | null = null;
let tokenRefreshPromise: Promise<string | null> | null = null;

// Listen for auth state changes to update token
onAuthStateChange((user) => {
  if (!user) {
    currentToken = null;
    console.log('🔑 User signed out, clearing token');
  } else {
    console.log('🔑 User signed in, will refresh token on next request');
    currentToken = null; // Force refresh on next request
  }
});

// Helper function to get fresh token with caching and retry logic
const getFreshToken = async (): Promise<string | null> => {
  // If there's already a token refresh in progress, wait for it
  if (tokenRefreshPromise) {
    console.log('🔑 Token refresh already in progress, waiting...');
    return await tokenRefreshPromise;
  }

  // Start a new token refresh
  tokenRefreshPromise = (async () => {
    try {
      console.log('🔑 Refreshing Firebase token...');
      const token = await getCurrentToken();
      
      if (token) {
        currentToken = token;
        console.log('✅ Firebase token refreshed successfully');
        return token;
      } else {
        console.warn('⚠️ No Firebase token available');
        currentToken = null;
        return null;
      }
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      currentToken = null;
      return null;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return await tokenRefreshPromise;
};

//base URL configuration
const getBaseURL = () => {
  // Check environment first
  const isDevelopment = import.meta.env.MODE === 'development' || 
                       window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';
  
  if (isDevelopment) {
    return 'http://localhost:5000/api';
  }
  
  // fallback to production 
  return import.meta.env.VITE_API_URL || 'https://asset-manager-backend-2.onrender.com/api';
};

// Add debug logging
const baseURL = getBaseURL();
console.log('🌍 Environment Mode:', import.meta.env.MODE);
console.log('🌍 Window Location:', window.location.hostname);
console.log('🌍 VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🌍 Final Base URL:', baseURL);

// Then create the axios instance with this base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Then create the axios instance with this base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  withCredentials: true, // Add this for cookies if needed
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor with improved token handling
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Log the full URL being constructed
      const fullUrl = `${config.baseURL}${config.url}`;
      console.log('🔧 Constructing URL:', fullUrl);
      
      // Get fresh token (will use cached if available and valid)
      const token = await getFreshToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token attached to request:', config.url);
      } else {
        console.warn('⚠️ No token available for request:', config.url);
      }

      // Log request details for debugging
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullUrl: fullUrl,
        hasToken: !!token,
        baseURL: config.baseURL
      });

      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('❌ Request interceptor setup error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
      hasData: !!response.data
    });
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    console.error('❌ API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      message: error.message,
      fullUrl: `${error.config?.baseURL}${error.config?.url}`
    });

    // Handle 401 errors with token refresh retry
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('🔄 401 error detected, attempting token refresh...');
      
      try {
        // Clear current token and get a fresh one
        currentToken = null;
        const newToken = await getFreshToken();
        
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('🔄 Retrying request with new token...');
          return apiClient(originalRequest);
        } else {
          console.error('❌ Token refresh failed, redirecting to login');
          window.location.href = '/login';
        }
      } catch (refreshError) {
        console.error('❌ Token refresh error:', refreshError);
        window.location.href = '/login';
      }
    }

    // Handle other auth errors
    if (error.response?.status === 401) {
      console.error('❌ Authentication failed, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle API errors consistently
const handleApiError = (error: any, operation: string) => {
  console.error(`❌ ${operation}:`, error);

  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.response.statusText;
    
    switch (status) {
      case 404:
        throw new Error(`${operation}: API endpoint not found. Please check if your backend server is running and the endpoint exists.`);
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
    throw new Error(`${operation}: No response from server. Please check if your backend is running on ${apiClient.defaults.baseURL}`);
  } else {
    throw new Error(`${operation}: ${error.message || 'Unknown error occurred'}`);
  }
};

// Asset-related API calls
export const getAssets = async (params?: GetAssetsParams): Promise<AssetsResponse> => {
  try {
    console.log('📋 Fetching assets with params:', params);
    const response = await apiClient.get('/assets', { params });

    console.log('✅ Assets response:', response.data);

    const assetsData = response.data.data?.assets || response.data.assets || response.data || [];
    const paginationData = response.data.data?.pagination || response.data.pagination;

    const transformedAssets = assetsData.map((asset: any) => ({
      id: asset._id || asset.id,
      name: asset.name || 'Unknown Asset',
      category: asset.category || 'Uncategorized',
      status: asset.status || 'unknown',
      serialNumber: asset.serialNumber || '',
      purchaseDate: asset.purchaseDate,
      value: asset.purchasePrice || asset.value || 0,
      location: asset.location || '',
      assignedTo: asset.assignedTo,
      qrCode: asset.qrCode,
    }));
      
    return {
      success: true,
      assets: transformedAssets,
      pagination: paginationData || {
        page: params?.page || 1,
        limit: params?.limit || 10,
        total: transformedAssets.length,
        pages: Math.ceil(transformedAssets.length / (params?.limit || 10))
      }
    };
  } catch (error) {
    console.error('❌ Error fetching assets:', error);
    handleApiError(error, 'Failed to fetch assets');
    
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
    console.log('📋 Fetching asset by ID:', id);
    const response = await apiClient.get(`/assets/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch asset details');
  }
};

export const createAsset = async (data: Partial<Asset>) => {
  try {
    console.log('📋 Creating new asset:', data);
    const response = await apiClient.post('/assets', data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to create asset');
  }
};

export const updateAsset = async (id: string, data: Partial<Asset>) => {
  try {
    console.log('📋 Updating asset:', id, data);
    const response = await apiClient.put(`/assets/${id}`, data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to update asset');
  }
};

export const assignAsset = async (id: string, userId: string, notes?: string) => {
  try {
    console.log('📋 Assigning asset:', { id, userId, notes });
    const response = await apiClient.post(`/assets/${id}/assign`, { 
      userId,
      notes 
    });
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to assign asset');
  }
};

export const returnAsset = async (id: string) => {
  try {
    console.log('📋 Returning asset:', id);
    const response = await apiClient.post(`/assets/${id}/return`);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to return asset');
  }
};

export const exportToCSV = async () => {
  try {
    console.log('📋 Exporting assets to CSV...');
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
    console.log('👤 Fetching user profile...');
    const response = await apiClient.get('/users/me');
    console.log('Raw user profile response:', response)
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch user profile');
  }
};

export const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    console.log('✅ Users data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Users fetch failed:', error);
    handleApiError(error, 'Failed to fetch users');
  }
};

// Dashboard stats API call
export const getDashboardStats = async () => {
  try {
    console.log('📊 Fetching dashboard stats...');
    const response = await apiClient.get('/dashboard/stats');
    console.log('✅ Dashboard stats received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Dashboard stats fetch failed:', error);
    handleApiError(error, 'Failed to fetch dashboard stats');
  }
};

// Get asset reports with filters and groupings
export const getAssetReports = async (filters: ReportFilters = {}): Promise<AssetReportData> => {
  try {
    console.log('📊 Fetching asset reports with filters:', filters);
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/reports/assets?${queryParams.toString()}`);
    console.log('✅ Asset reports received:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch asset reports');
    throw error;
  }
};

// Get maintenance reports
export const getMaintenanceReports = async (filters: ReportFilters = {}): Promise<MaintenanceReportData> => {
  try {
    console.log('🔧 Fetching maintenance reports with filters:', filters);
    
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/reports/maintenance?${queryParams.toString()}`);
    console.log('✅ Maintenance reports received:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch maintenance reports');
    throw error;
  }
};

// Get audit trail reports (Admin/Manager only)
export const getAuditReports = async (filters: ReportFilters = {}): Promise<AuditReportData> => {
  try {
    console.log('🔍 Fetching audit reports with filters:', filters);
    
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/reports/audit?${queryParams.toString()}`);
    console.log('✅ Audit reports received:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch audit reports');
    throw error;
  }
};

// Get asset utilization reports
export const getUtilizationReports = async (filters: ReportFilters = {}): Promise<UtilizationReportData> => {
  try {
    console.log('📈 Fetching utilization reports with filters:', filters);
    
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClient.get(`/reports/utilization?${queryParams.toString()}`);
    console.log('✅ Utilization reports received:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to fetch utilization reports');
    throw error;
  }
};

// Export reports in various formats
export const exportReports = async (type: string = 'assets', format: string = 'json'): Promise<ExportReportData> => {
  try {
    console.log('📤 Exporting reports:', { type, format });
    
    const queryParams = new URLSearchParams({ type, format });
    const response = await apiClient.get(`/reports/export?${queryParams.toString()}`);
    
    console.log('✅ Report export completed:', response.data);
    return response.data;
  } catch (error) {
    handleApiError(error, 'Failed to export reports');
    throw error;
  }
};

// Helper function to get available filter options from backend
export const getReportFilters = async () => {
  try {
    console.log('📋 Fetching report filter options...');
    
    // These endpoints should exist in your backend or you can create them
    const [categories, locations, departments] = await Promise.all([
      apiClient.get('/categories').catch(() => ({ data: [] })),
      apiClient.get('/locations').catch(() => ({ data: [] })),
      apiClient.get('/departments').catch(() => ({ data: [] }))
    ]);

    const filterOptions = {
      categories: categories.data?.data || categories.data || [],
      locations: locations.data?.data || locations.data || [],
      departments: departments.data?.data || departments.data || []
    };

    console.log('✅ Report filter options received:', filterOptions);
    return filterOptions;
  } catch (error) {
    console.error('❌ Failed to fetch report filters:', error);
    // Return empty arrays as fallback
    return {
      categories: [],
      locations: [],
      departments: []
    };
  }
};



// Updated reportAPI object for frontend compatibility
export const reportAPI = {
  // Get all assets with filters (updated to match backend)
  getAssets: async (filters: Record<string, any> = {}): Promise<any[]> => {
    try {
      const response = await getAssets(filters as GetAssetsParams);
      return response.assets;
    } catch (error) {
      console.error('Error in reportAPI.getAssets:', error);
      throw error;
    }
  },

  getCategories: async (): Promise<FilterOption[]> => {
  try {
    console.log('📋 Fetching categories from API...');
    const response = await apiClient.get<CategoryApiResponse>('/categories');
    
    console.log('📊 Raw categories response:', response.data);
    
    // Handle demo/placeholder endpoint
    if (response.data?.message?.includes('Demo')) {
      console.log('ℹ️ Categories endpoint is a demo/placeholder - returning empty array');
      return [];
    }
    
    // Extract categories from response
    let categories: CategoryResponse[] = [];
    if (response.data?.data?.categories && Array.isArray(response.data.data.categories)) {
      categories = response.data.data.categories;
    } else if (response.data?.data && Array.isArray(response.data.data)) {
      categories = response.data.data as CategoryResponse[];
    } else {
      console.log('ℹ️ Categories response structure:', {
        type: typeof response.data,
        hasData: 'data' in (response.data || {}),
        hasCategories: 'categories' in (response.data?.data || {}),
        keys: Object.keys(response.data?.data || {}),
      });
    }
    
    console.log('🔧 Processing categories array:', categories);
    
    // Transform to expected format with validation
    const transformedCategories = categories
      .map((cat: CategoryResponse) => transformToFilterOption(cat, 'Unknown Category'))
      .filter((option: FilterOption) => option.value && option.label);
    
    console.log('✅ Transformed categories:', transformedCategories);
    return transformedCategories;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response?.status === 404) {
      console.log('ℹ️ Categories endpoint not found (/categories) - returning empty array');
      return [];
    } else if (axiosError.response?.status === 403) {
      console.warn('⚠️ No permission to access categories - returning empty array');
      return [];
    } else if (axiosError.response?.status === 500) {
      console.error('❌ Server error when fetching categories:', axiosError.response.data);
      return [];
    }
    
    console.error('❌ Failed to fetch categories:', error);
    
    if (axiosError.response) {
      console.error('Error response data:', axiosError.response.data);
      console.error('Error status:', axiosError.response.status);
    }
    
    return [];
  }
},


getLocations: async (): Promise<FilterOption[]> => {
  try {
    console.log('📍 Fetching locations from API...');
    const response = await apiClient.get<ApiResponse<LocationResponse[]>>('/locations');
    
    console.log('📊 Raw locations response:', response.data);
    
    // Handle demo/placeholder endpoint
    if (response.data?.message?.includes('Demo')) {
      console.log('ℹ️ Locations endpoint is a demo/placeholder - returning empty array');
      return [];
    }
    
    // Extract locations from response
    let locations: LocationResponse[] = [];
    if (response.data?.data && Array.isArray(response.data.data)) {
      locations = response.data.data;
    } else if (Array.isArray(response.data)) {
      locations = response.data as LocationResponse[];
    } else {
      console.log('ℹ️ Locations response structure:', {
        type: typeof response.data,
        hasData: 'data' in (response.data || {}),
        keys: Object.keys(response.data || {}),
      });
    }
    
    console.log('🔧 Processing locations array:', locations);
    
    // Transform to expected format with validation
    const transformedLocations = locations
      .map((loc: LocationResponse) => transformToFilterOption(loc, 'Unknown Location'))
      .filter((option: FilterOption) => option.value && option.label);
    
    console.log('✅ Transformed locations:', transformedLocations);
    return transformedLocations;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response?.status === 404) {
      console.log('ℹ️ Locations endpoint not found (/locations) - returning empty array');
      return [];
    } else if (axiosError.response?.status === 403) {
      console.warn('⚠️ No permission to access locations - returning empty array');
      return [];
    } else if (axiosError.response?.status === 500) {
      console.error('❌ Server error when fetching locations:', axiosError.response.data);
      return [];
    }
    
    console.error('❌ Failed to fetch locations:', error);
    
    if (axiosError.response) {
      console.error('Error response data:', axiosError.response.data);
      console.error('Error status:', axiosError.response.status);
    }
    
    return [];
  }
},

  // Get maintenance records - you may need to create this endpoint in backend
  getMaintenanceRecords: async (assetIds?: string[]): Promise<any[]> => {
    try {
      console.log('🔧 Fetching maintenance records for assets:', assetIds);
      
      const queryParams = new URLSearchParams();
      if (assetIds && assetIds.length > 0) {
        assetIds.forEach(id => queryParams.append('assetIds[]', id));
      }

      const response = await apiClient.get(`/maintenance?${queryParams.toString()}`);
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch maintenance records:', error);
      return []; // Return empty array as fallback
    }
  },

  // Get asset categories
  getDepartments: async (): Promise<FilterOption[]> => {
  try {
    console.log('🏢 Fetching departments from API...');
    const response = await apiClient.get<DepartmentApiResponse>('/departmental');
    
    console.log('📊 Raw departments response:', response.data);
    
    // Check for demo/placeholder endpoint
    if (response.data?.message === 'Demo endpoint for departmental') {
      console.log('ℹ️ Departments endpoint is a demo/placeholder - returning empty array');
      return [];
    }
    
    // Extract departments from possible response structures
    let departments: DepartmentResponse[] = [];
    
    if (Array.isArray(response.data?.data)) {
      // Case: data is directly an array
      departments = response.data.data;
    } else if (response.data?.data?.departments) {
      // Case: data contains a departments array
      departments = response.data.data.departments;
    } else if (response.data?.departments) {
      // Case: departments is at the root
      departments = response.data.departments;
    } else {
      console.log('ℹ️ No departments found in response, returning empty array');
    }
    
    console.log('🔧 Processing departments array:', departments);
    
    // Transform to expected format with validation
    const transformedDepartments = departments
      .map((dept: DepartmentResponse) => transformToFilterOption(dept, 'Unknown Department'))
      .filter((option: FilterOption) => option.value && option.label);
    
    console.log('✅ Transformed departments:', transformedDepartments);
    return transformedDepartments;
    
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response?.status === 404) {
      console.log('ℹ️ Departments endpoint not found (/departmental) - returning empty array');
      return [];
    } else if (axiosError.response?.status === 403) {
      console.warn('⚠️ No permission to access departments - returning empty array');
      return [];
    } else if (axiosError.response?.status === 500) {
      console.error('❌ Server error when fetching departments:', axiosError.response.data);
      return [];
    }
    
    console.error('❌ Failed to fetch departments:', error);
    
    if (axiosError.response) {
      console.error('Error response data:', axiosError.response.data);
      console.error('Error status:', axiosError.response.status);
    }
    
    return [];
  }
},

  // Generate depreciation analysis
  getDepreciationAnalysis: async (filters: Record<string, any> = {}): Promise<any[]> => {
    try {
      // You may need to create this endpoint in your backend
      const response = await apiClient.get('/reports/depreciation', { params: filters });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch depreciation analysis:', error);
      return [];
    }
  },

  // Get utilization metrics (using existing endpoint)
  getUtilizationAnalysis: async (filters: Record<string, any> = {}): Promise<any> => {
    try {
      const response = await getUtilizationReports(filters);
      return {
        chartData: response.data.utilization.map(item => ({
          name: item.status,
          value: item.count,
          percentage: item.percentage
        })),
        details: response.data.utilization
      };
    } catch (error) {
      console.error('❌ Failed to fetch utilization analysis:', error);
      return { chartData: [], details: [] };
    }
  },

  // Get compliance data - you may need to create this endpoint
  getComplianceData: async (filters: Record<string, any> = {}): Promise<any[]> => {
    try {
      const response = await apiClient.get('/reports/compliance', { params: filters });
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch compliance data:', error);
      return [];
    }
  },

  // Saved reports functionality - you may need to create these endpoints
  getSavedReports: async (): Promise<any[]> => {
    try {
      const response = await apiClient.get('/reports/saved');
      return response.data?.data || response.data || [];
    } catch (error) {
      console.error('❌ Failed to fetch saved reports:', error);
      return [];
    }
  },

  getSavedReport: async (reportId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/reports/saved/${reportId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Failed to fetch saved report:', error);
      throw error;
    }
  },

  saveReport: async (report: any): Promise<any> => {
    try {
      const response = await apiClient.post('/reports/saved', report);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Failed to save report:', error);
      throw error;
    }
  },

  updateReport: async (reportId: string, updates: any): Promise<any> => {
    try {
      const response = await apiClient.put(`/reports/saved/${reportId}`, updates);
      return response.data?.data || response.data;
    } catch (error) {
      console.error('❌ Failed to update report:', error);
      throw error;
    }
  },

  deleteReport: async (reportId: string): Promise<void> => {
    try {
      await apiClient.delete(`/reports/saved/${reportId}`);
    } catch (error) {
      console.error('❌ Failed to delete report:', error);
      throw error;
    }
  }
};

export const getNotifications = async (page: number = 1, limit: number = 20): Promise<AppNotification[]> => {
  try {
    console.log(`📢 Fetching notifications (page: ${page}, limit: ${limit})...`);
    const response = await apiClient.get<NotificationResponse>('/notifications', {
      params: { page, limit },
    });

    console.log('📢 Notifications response:', response.data);

    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch notifications');
    }
  } catch (error: any) {
    console.error('❌ Error fetching notifications:', error);
    if (error.response?.status === 404) {
      console.log('ℹ️ Notifications endpoint not found, returning empty array');
      return [];
    }
    throw new Error(error.message || 'Failed to fetch notifications');
  }
};

// making API call for paystack backend logic
export const initiatePayment = async (amount: number, email: string): Promise<any> => {
  try {
    console.log('💳 Initiating payment with Paystack:', { amount, email });
    const response = await apiClient.get(`'/payments', { amount, email }`);
    return response.data;
  } catch (error) {
    console.error('❌ Error initiating payment:', error);
    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to initiate payment');
    } else {
      throw new Error('Failed to initiate payment');
    }
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
    '/dashboard/stats',
    '/users',
    '/users/me',
    '/organizations',
    '/organizations/members',
    '/assets',
    '/reports/assets',
    '/reports/maintenance',
    '/reports/utilization'
  ];

  console.log('🔍 Testing API endpoints...');
  console.log('🔧 Base URL:', apiClient.defaults.baseURL);
  
  for (const endpoint of endpoints) {
    try {
      const response = await apiClient.get(endpoint);
      console.log(`✅ ${endpoint}: ${response.status} - ${response.statusText}`);
    } catch (error: any) {
      const status = error.response?.status || 'No response';
      const message = error.response?.data?.message || error.message;
      console.log(`❌ ${endpoint}: ${status} - ${message}`);
    }
  }
};

// Test authentication specifically
export const testAuth = async () => {
  try {
    console.log('🔐 Testing authentication...');
    const token = await getFreshToken();
    
    if (!token) {
      console.error('❌ No token available for auth test');
      return { success: false, message: 'No authentication token' };
    }

    console.log('🔐 Token available, testing with /users/me endpoint...');
    const response = await apiClient.get('/users/me');
    
    console.log('✅ Authentication test passed:', response.data);
    return { success: true, data: response.data };
    
  } catch (error: any) {
    console.error('❌ Authentication test failed:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'API endpoint not found',
      status: error.response?.status || 404
    };
  }
};

export default apiClient;