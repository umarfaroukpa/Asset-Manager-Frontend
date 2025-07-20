import api from './api';

// Define the Category interface
interface Category {
  id: string | number;
  name: string;
  description?: string;
  
}

// Define the input type for creating/updating categories
interface CategoryInput {
  name: string;
  description?: string;
  // Add other properties that can be sent when creating/updating
}

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  createCategory: async (categoryData: CategoryInput): Promise<Category> => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id: string | number, categoryData: CategoryInput): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id: string | number): Promise<void> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
};

import api from './api';

// Define interfaces for type safety
interface Asset {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: 'available' | 'assigned' | 'maintenance' | 'retired';
  serialNumber?: string;
  purchaseDate?: string;
  value?: number;
  assignedTo?: string;
  location?: string;
  // Add other asset properties as needed
}

interface AssetFilters {
  category?: string;
  status?: string;
  assignedTo?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface CreateAssetData {
  name: string;
  description?: string;
  category: string;
  serialNumber?: string;
  purchaseDate?: string;
  value?: number;
  location?: string;
}

interface UpdateAssetData extends Partial<CreateAssetData> {
  status?: Asset['status'];
}

interface AssignAssetData {
  assignedTo: string;
  assignedDate?: string;
  notes?: string;
}

interface ReturnAssetData {
  returnDate?: string;
  condition?: string;
  notes?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export const assetService = {
  // Get all assets with filters
  getAssets: async (params: AssetFilters = {}): Promise<Asset[]> => {
    const response = await api.get<ApiResponse<Asset[]>>('/assets', { params });
    return response.data.data;
  },

  // Get single asset
  getAsset: async (id: string): Promise<Asset> => {
    const response = await api.get<ApiResponse<Asset>>(`/assets/${id}`);
    return response.data.data;
  },

  // Create new asset
  createAsset: async (assetData: CreateAssetData): Promise<Asset> => {
    const response = await api.post<ApiResponse<Asset>>('/assets', assetData);
    return response.data.data;
  },

  // Update asset
  updateAsset: async (id: string, assetData: UpdateAssetData): Promise<Asset> => {
    const response = await api.put<ApiResponse<Asset>>(`/assets/${id}`, assetData);
    return response.data.data;
  },

  // Delete asset
  deleteAsset: async (id: string): Promise<void> => {
    await api.delete(`/assets/${id}`);
  },

  // Assign asset
  assignAsset: async (id: string, assignData: AssignAssetData): Promise<Asset> => {
    const response = await api.post<ApiResponse<Asset>>(`/assets/${id}/assign`, assignData);
    return response.data.data;
  },

  // Return asset
  returnAsset: async (id: string, returnData: ReturnAssetData): Promise<Asset> => {
    const response = await api.post<ApiResponse<Asset>>(`/assets/${id}/return`, returnData);
    return response.data.data;
  },

  // Export assets
  exportAssets: async (): Promise<void> => {
    const response = await api.get('/assets/export/csv', {
      responseType: 'blob'
    });
        
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'assets-export.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
};
