import { useState, useEffect, useCallback } from 'react';
import { Asset, AssetFilters, CreateAssetData, UpdateAssetData, AssignAssetData, ReturnAssetData } from '../services/assetService';
import { assetService } from '../services/assetService';

interface UseAssetsReturn {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  filters: AssetFilters;
  setFilters: (filters: AssetFilters) => void;
  refetch: () => Promise<void>;
  createAsset: (data: CreateAssetData) => Promise<Asset | null>;
  updateAsset: (id: string, data: UpdateAssetData) => Promise<Asset | null>;
  deleteAsset: (id: string) => Promise<boolean>;
  assignAsset: (id: string, data: AssignAssetData) => Promise<Asset | null>;
  returnAsset: (id: string, data: ReturnAssetData) => Promise<Asset | null>;
  searchAssets: (query: string) => Promise<void>;
}

export const useAssets = (initialFilters: AssetFilters = {}): UseAssetsReturn => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AssetFilters>(initialFilters);

  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getAssets(filters);
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch assets');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createAsset = useCallback(async (data: CreateAssetData): Promise<Asset | null> => {
    try {
      setError(null);
      const newAsset = await assetService.createAsset(data);
      setAssets(prev => [...prev, newAsset]);
      return newAsset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create asset');
      return null;
    }
  }, []);

  const updateAsset = useCallback(async (id: string, data: UpdateAssetData): Promise<Asset | null> => {
    try {
      setError(null);
      const updatedAsset = await assetService.updateAsset(id, data);
      setAssets(prev => 
        prev.map(asset => asset.id === id ? updatedAsset : asset)
      );
      return updatedAsset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update asset');
      return null;
    }
  }, []);

  const deleteAsset = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await assetService.deleteAsset(id);
      setAssets(prev => prev.filter(asset => asset.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete asset');
      return false;
    }
  }, []);

  const assignAsset = useCallback(async (id: string, data: AssignAssetData): Promise<Asset | null> => {
    try {
      setError(null);
      const updatedAsset = await assetService.assignAsset(id, data);
      setAssets(prev => 
        prev.map(asset => asset.id === id ? updatedAsset : asset)
      );
      return updatedAsset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign asset');
      return null;
    }
  }, []);

  const returnAsset = useCallback(async (id: string, data: ReturnAssetData): Promise<Asset | null> => {
    try {
      setError(null);
      const updatedAsset = await assetService.returnAsset(id, data);
      setAssets(prev => 
        prev.map(asset => asset.id === id ? updatedAsset : asset)
      );
      return updatedAsset;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to return asset');
      return null;
    }
  }, []);

  const searchAssets = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.searchAssets(query, filters);
      setAssets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search assets');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return {
    assets,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchAssets,
    createAsset,
    updateAsset,
    deleteAsset,
    assignAsset,
    returnAsset,
    searchAssets
  };
};

// Hook for getting a single asset
export const useAsset = (id: string) => {
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAsset = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getAsset(id);
      setAsset(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch asset');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAsset();
  }, [fetchAsset]);

  return {
    asset,
    loading,
    error,
    refetch: fetchAsset
  };
};
