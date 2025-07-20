// Category Type Definitions
export interface Category {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define the input type for creating/updating categories
export interface CategoryInput {
  name: string;
  description?: string;
}

// Extended category interface with asset count
export interface CategoryWithAssetCount extends Category {
  assetCount: number;
}

// Category status for filtering
export type CategoryStatus = 'active' | 'inactive';

// Category with additional metadata
export interface CategoryMetadata extends Category {
  status: CategoryStatus;
  assetCount: number;
  lastModified?: string;
  createdBy?: string;
}
