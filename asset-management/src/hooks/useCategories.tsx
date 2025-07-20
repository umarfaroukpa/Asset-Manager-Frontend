import { useState, useEffect, useCallback } from 'react';
import { Category, CategoryInput } from '../types/Category';
import { categoryService } from '../services/categoryService';

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCategory: (data: CategoryInput) => Promise<Category | null>;
  updateCategory: (id: string | number, data: CategoryInput) => Promise<Category | null>;
  deleteCategory: (id: string | number) => Promise<boolean>;
}

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CategoryInput): Promise<Category | null> => {
    try {
      setError(null);
      const newCategory = await categoryService.createCategory(data);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
      return null;
    }
  }, []);

  const updateCategory = useCallback(async (id: string | number, data: CategoryInput): Promise<Category | null> => {
    try {
      setError(null);
      const updatedCategory = await categoryService.updateCategory(id, data);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? updatedCategory : cat)
      );
      return updatedCategory;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update category');
      return null;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string | number): Promise<boolean> => {
    try {
      setError(null);
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete category');
      return false;
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
};
