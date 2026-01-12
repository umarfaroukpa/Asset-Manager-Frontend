
const config = {
  production: {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'https://asset-manager-backend-2.onrender.com',
  }
};

export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = config[environment as keyof typeof config].API_BASE_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    CHANGE_PASSWORD: '/users/change-password',
    ME: '/users/me', // Added this since you're using it
  },
  
  // Assets
  ASSETS: {
    BASE: '/assets',
    CREATE: '/assets',
    UPDATE: (id: string) => `/assets/${id}`,
    DELETE: (id: string) => `/assets/${id}`,
    ASSIGN: (id: string) => `/assets/${id}/assign`,
    UNASSIGN: (id: string) => `/assets/${id}/unassign`,
    HISTORY: (id: string) => `/assets/${id}/history`,
    SEARCH: '/assets/search',
    CATEGORIES: '/assets/categories',
  },
  
  // Organizations
  ORGANIZATIONS: {
    BASE: '/organizations',
    SETTINGS: '/organizations/settings',
    MEMBERS: '/organizations/members',
    INVITE: '/organizations/invite',
  },
  
  // Reports
  REPORTS: {
    GENERATE: '/reports/generate',
    EXPORT: '/reports/export',
    TEMPLATES: '/reports/templates',
  },
  
  // Payments
  PAYMENTS: {
    VERIFY: '/payments/verify',
    WEBHOOK: '/payments/webhook',
    SUBSCRIPTION: '/payments/subscription',
  },
  
  // File Uploads
  UPLOADS: {
    BASE: '/uploads',
    AVATAR: '/uploads/avatar',
    ASSET_IMAGE: '/uploads/asset-image',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Insufficient permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT: 'Request timeout. Please try again.',
} as const;

// Request/Response Types
export interface ApiRequest<T = any> {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: T;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Utility Functions
export const getErrorMessage = (error: any): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
};

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('Network Error') ||
         !error?.response;
};

export const isAuthError = (error: any): boolean => {
  return error?.response?.status === HTTP_STATUS.UNAUTHORIZED;
};

export const isValidationError = (error: any): boolean => {
  return error?.response?.status === HTTP_STATUS.BAD_REQUEST ||
         error?.response?.status === HTTP_STATUS.UNPROCESSABLE_ENTITY;
};

// Helper function to build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

// Helper function to format API URL
export const formatApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  let url = endpoint;
  
  if (params) {
    const queryString = buildQueryString(params);
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
};