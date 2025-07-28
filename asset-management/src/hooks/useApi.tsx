import { useState, useCallback, useContext, createContext } from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Types for API responses
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

interface ApiState {
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn {
  // HTTP Methods
  get: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<ApiResponse<T>>>;
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<ApiResponse<T>>>;
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<ApiResponse<T>>>;
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => Promise<AxiosResponse<ApiResponse<T>>>;
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<AxiosResponse<ApiResponse<T>>>;
  
  // State
  loading: boolean;
  error: ApiError | null;
  
  // Utilities
  clearError: () => void;
  setBaseURL: (url: string) => void;
  setAuthToken: (token: string | null) => void;
}

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  console.log('🔗 API Base URL:', baseURL);
  
  const instance = axios.create({
    baseURL,
    timeout: 30000, // 30 second timeout
    headers: {
      'Content-Type': 'application/json',
    },
    // This can be set to true if backend uses cookies for authentication
    withCredentials: false, 
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log requests in development
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          baseURL: config.baseURL,
          data: config.data
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for global error handling
  instance.interceptors.response.use(
    (response) => {
      // Log responses in development
      if (import.meta.env.VITE_DEBUG_MODE === 'true') {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
      }
      
      return response;
    },
    (error: AxiosError) => {
      // Enhanced error logging
      console.error('❌ API Error:', {
        status: error.response?.status,
        message: error.message,
        url: error.config?.url,
        data: error.response?.data
      });
      
      // Handle common errors
      if (error.response?.status === 401) {
        // Unauthorized - clear tokens and redirect to login
        console.warn('🔒 Unauthorized access - redirecting to login');
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      if (error.response?.status === 403) {
        // Forbidden - insufficient permissions
        console.error('🚫 Access forbidden - insufficient permissions');
      }
      
      if (error.response && error.response.status >= 500) {
        // Server errors
        console.error('🔥 Server error:', error.response.data);
      }
      
      if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        console.error('🌐 Network error - check if backend is running');
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Custom hook for API calls
export const useApi = (): UseApiReturn => {
  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null,
  });

  // Create axios instance (could be moved to context for global management)
  const apiInstance = createApiInstance();

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: ApiError | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  const handleApiCall = useCallback(async <T = any>(
    apiCall: () => Promise<AxiosResponse<ApiResponse<T>>>
  ): Promise<AxiosResponse<ApiResponse<T>>> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall();
      return response;
    } catch (error) {
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: 500
      };

      if (axios.isAxiosError(error)) {
        apiError.status = error.response?.status;
        apiError.message = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Network error occurred';
        apiError.code = error.code;
      } else if (error instanceof Error) {
        apiError.message = error.message;
      }

      setError(apiError);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // HTTP Methods
  const get = useCallback(<T = any>(url: string, config?: AxiosRequestConfig) => {
    return handleApiCall(() => apiInstance.get<ApiResponse<T>>(url, config));
  }, [handleApiCall, apiInstance]);

  const post = useCallback(<T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return handleApiCall(() => apiInstance.post<ApiResponse<T>>(url, data, config));
  }, [handleApiCall, apiInstance]);

  const put = useCallback(<T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return handleApiCall(() => apiInstance.put<ApiResponse<T>>(url, data, config));
  }, [handleApiCall, apiInstance]);

  const patch = useCallback(<T = any>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return handleApiCall(() => apiInstance.patch<ApiResponse<T>>(url, data, config));
  }, [handleApiCall, apiInstance]);

  const deleteMethod = useCallback(<T = any>(url: string, config?: AxiosRequestConfig) => {
    return handleApiCall(() => apiInstance.delete<ApiResponse<T>>(url, config));
  }, [handleApiCall, apiInstance]);

  // Utility methods
  const setBaseURL = useCallback((url: string) => {
    apiInstance.defaults.baseURL = url;
  }, [apiInstance]);

  const setAuthToken = useCallback((token: string | null) => {
    if (token) {
      apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('authToken', token);
    } else {
      delete apiInstance.defaults.headers.common['Authorization'];
      localStorage.removeItem('authToken');
    }
  }, [apiInstance]);

  return {
    // HTTP Methods
    get,
    post,
    put,
    patch,
    delete: deleteMethod,
    
    // State
    loading: state.loading,
    error: state.error,
    
    // Utilities
    clearError,
    setBaseURL,
    setAuthToken,
  };
};

// Context for global API management (optional)
interface ApiContextType {
  baseURL: string;
  setBaseURL: (url: string) => void;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [baseURL, setBaseURL] = useState(import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('authToken') || localStorage.getItem('token')
  );

  const handleSetAuthToken = (token: string | null) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
    }
  };

  return (
    <ApiContext.Provider value={{
      baseURL,
      setBaseURL,
      authToken,
      setAuthToken: handleSetAuthToken
    }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
};

// Utility functions for common API patterns
export const createApiHook = <T = any>(endpoint: string) => {
  return () => {
    const api = useApi();
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (params?: any) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(endpoint, { params });
        setData(response.data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }, [api, endpoint]);

    return {
      data,
      loading,
      error,
      fetchData,
      refetch: fetchData
    };
  };
};

// Export default hook
export default useApi;
