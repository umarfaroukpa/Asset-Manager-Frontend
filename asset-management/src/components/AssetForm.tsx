import React, { useState, useEffect, ChangeEvent } from 'react';
import { Asset, AssetFormData } from '../types/Assets';
import Input from './common/Input';
import Button from './common/Button';

// Define the SelectOption interface
interface SelectOption {
  value: string;
  label: string;
}

interface AssetFormProps {
  asset?: Asset;
  onSubmit: (data: AssetFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  categories: SelectOption[];
  locations: SelectOption[];
}

const AssetForm: React.FC<AssetFormProps> = ({
  asset,
  onSubmit,
  onCancel,
  loading = false,
  categories,
  locations,
}) => {
  const [formData, setFormData] = useState<AssetFormData>({
    name: '',
    description: '',
    category: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: undefined,
    location: '',
    tags: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        description: asset.description || '',
        category: asset.category,
        serialNumber: asset.serialNumber || '',
        purchaseDate: asset.purchaseDate || '',
        purchasePrice: asset.purchasePrice,
        location: asset.location || '',
        tags: asset.tags || [],
      });
    }
  }, [asset]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Asset name is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.purchasePrice && formData.purchasePrice < 0) {
      newErrors.purchasePrice = 'Purchase price must be positive';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleInputChange = (field: keyof AssetFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
   <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Asset Name"
            required
            value={formData.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('name', e.target.value)
            }
            error={errors.name}
            placeholder="Enter asset name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        <div>
          <Input
            label="Serial Number"
            value={formData.serialNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('name', e.target.value)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">Select a location</option>
            {locations.map(loc => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Input
            label="Purchase Date"
            type="date"
            value={formData.purchaseDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('name', e.target.value)
            }
          />
        </div>

        <div>
          <Input
            label="Purchase Price"
            type="number"
            value={formData.purchasePrice?.toString() || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              handleInputChange('purchasePrice', e.target.value ? parseFloat(e.target.value) : undefined)
            }
            error={errors.purchasePrice}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter asset description"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Add a tag"
            />
            <Button
              type="button"
              onClick={addTag}
              variant="secondary"
              size="sm"
              disabled={!tagInput.trim()}
            >
              Add Tag
            </Button>
          </div>
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 text-blue-400 hover:text-blue-600 focus:outline-none"
                  >
                    <span className="sr-only">Remove tag</span>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          {asset ? 'Update Asset' : 'Create Asset'}
        </Button>
      </div>
    </form>
  );
};

export default AssetForm;