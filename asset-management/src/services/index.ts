// Service exports for easy importing
export { categoryService, useCategoryService } from './categoryService';
export { assetService, useAssetService } from './assetService';

// Type exports
export type { Category, CategoryInput, CategoryWithAssetCount, CategoryStatus, CategoryMetadata } from '../types/Category';
export type { 
  Asset, 
  AssetFilters, 
  CreateAssetData, 
  UpdateAssetData, 
  AssignAssetData, 
  ReturnAssetData 
} from './assetService';
