import { Category, CategoryInput } from '../types/Category';
import { useApi } from '../hooks/useApi';

// Category Service using the useApi hook
export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const api = useApi();
      const response = await api.get<Category[]>('/categories');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Return fallback categories if API fails
      return [
        { id: '1', name: 'Electronics', description: 'Electronic devices and equipment' },
        { id: '2', name: 'Furniture', description: 'Office and home furniture' },
        { id: '3', name: 'Vehicles', description: 'Cars, trucks, and other vehicles' },
        { id: '4', name: 'Software', description: 'Software licenses and digital assets' }
      ];
    }
  },

  getCategory: async (id: string | number): Promise<Category> => {
    const api = useApi();
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data.data;
  },

  createCategory: async (categoryData: CategoryInput): Promise<Category> => {
    const api = useApi();
    const response = await api.post<Category>('/categories', categoryData);
    return response.data.data;
  },

  updateCategory: async (id: string | number, categoryData: CategoryInput): Promise<Category> => {
    const api = useApi();
    const response = await api.put<Category>(`/categories/${id}`, categoryData);
    return response.data.data;
  },

  deleteCategory: async (id: string | number): Promise<void> => {
    const api = useApi();
    await api.delete(`/categories/${id}`);
  },

  // Get categories with asset counts
  getCategoriesWithCounts: async (): Promise<(Category & { assetCount: number })[]> => {
    const api = useApi();
    const response = await api.get<(Category & { assetCount: number })[]>('/categories/with-counts');
    return response.data.data;
  }
};

// Hook for using category service in React components
export const useCategoryService = () => {
  return categoryService;
};
