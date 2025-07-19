import { useState, useEffect } from 'react';
import { getAssets } from '../services/api';
import { Asset } from '../types/assets';

export const useAssets = (initialParams?: { search?: string; page?: number; status?: string }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const data = await getAssets(params);
        setAssets(data.assets);
      } catch (err) {
        setError('Failed to fetch assets');
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [params]);

  return { assets, loading, error, setParams };
};