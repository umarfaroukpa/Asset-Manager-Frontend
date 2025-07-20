import { useApi } from '../hooks/useApi';

// Define interfaces for type safety
export interface Asset {
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
  assetTag?: string;
  condition?: string;
  warranty?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssetFilters {
  category?: string;
  status?: string;
  assignedTo?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateAssetData {
  name: string;
  description?: string;
  category: string;
  serialNumber?: string;
  purchaseDate?: string;
  value?: number;
  location?: string;
  assetTag?: string;
  condition?: string;
  warranty?: string;
  notes?: string;
}

export interface UpdateAssetData extends Partial<CreateAssetData> {
  status?: Asset['status'];
}

export interface AssignAssetData {
  assignedTo: string;
  assignedDate?: string;
  notes?: string;
}

export interface ReturnAssetData {
  returnDate?: string;
  condition?: string;
  notes?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const assetService = {
  // Get all assets with filters
  getAssets: async (params: AssetFilters = {}): Promise<Asset[]> => {
    const api = useApi();
    const response = await api.get<Asset[]>('/assets', { params });
    return response.data.data;
  },

  // Get paginated assets
  getPaginatedAssets: async (params: AssetFilters = {}): Promise<PaginatedResponse<Asset>> => {
    const api = useApi();
    const response = await api.get<PaginatedResponse<Asset>>('/assets', { params });
    return response.data.data;
  },

  // Get single asset
  getAsset: async (id: string): Promise<Asset> => {
    const api = useApi();
    const response = await api.get<Asset>(`/assets/${id}`);
    return response.data.data;
  },

  // Create new asset
  createAsset: async (assetData: CreateAssetData): Promise<Asset> => {
    const api = useApi();
    const response = await api.post<Asset>('/assets', assetData);
    return response.data.data;
  },

  // Update asset
  updateAsset: async (id: string, assetData: UpdateAssetData): Promise<Asset> => {
    const api = useApi();
    const response = await api.put<Asset>(`/assets/${id}`, assetData);
    return response.data.data;
  },

  // Delete asset
  deleteAsset: async (id: string): Promise<void> => {
    const api = useApi();
    await api.delete(`/assets/${id}`);
  },

  // Assign asset
  assignAsset: async (id: string, assignData: AssignAssetData): Promise<Asset> => {
    const api = useApi();
    const response = await api.post<Asset>(`/assets/${id}/assign`, assignData);
    return response.data.data;
  },

  // Return asset (unassign)
  returnAsset: async (id: string, returnData: ReturnAssetData): Promise<Asset> => {
    const api = useApi();
    const response = await api.post<Asset>(`/assets/${id}/return`, returnData);
    return response.data.data;
  },

  // Get asset history
  getAssetHistory: async (id: string): Promise<any[]> => {
    const api = useApi();
    const response = await api.get<any[]>(`/assets/${id}/history`);
    return response.data.data;
  },

  // Search assets
  searchAssets: async (query: string, filters?: Partial<AssetFilters>): Promise<Asset[]> => {
    const api = useApi();
    const params = { search: query, ...filters };
    const response = await api.get<Asset[]>('/assets/search', { params });
    return response.data.data;
  },

  // Export assets
  exportAssets: async (format: 'csv' | 'xlsx' = 'csv'): Promise<void> => {
    const api = useApi();
    // For blob responses, we need to handle it differently
    const response = await api.get(`/assets/export/${format}`, {
      responseType: 'blob'
    });
        
    // response.data should be the blob directly when responseType is 'blob'
    const blob = response.data as unknown as Blob;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `assets-export.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Bulk operations
  bulkUpdateAssets: async (assetIds: string[], updateData: Partial<UpdateAssetData>): Promise<Asset[]> => {
    const api = useApi();
    const response = await api.put<Asset[]>('/assets/bulk-update', {
      assetIds,
      updateData
    });
    return response.data.data;
  },

  bulkDeleteAssets: async (assetIds: string[]): Promise<void> => {
    const api = useApi();
    await api.delete('/assets/bulk-delete', {
      data: { assetIds }
    });
  }
};

// Hook for using asset service in React components
export const useAssetService = () => {
  return assetService;
};
