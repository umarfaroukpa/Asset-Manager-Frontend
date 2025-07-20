import React from 'react';
import { useForm } from 'react-hook-form';
import { AssetFormData } from '../../types/Assets';
import Input from '../common/Input';
import Button from '../common/Button';

interface BaseAssetFormProps {
  onSubmit: (data: AssetFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  defaultValues?: Partial<AssetFormData>;
  children?: React.ReactNode;
}

const BaseAssetForm: React.FC<BaseAssetFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  defaultValues = {},
  children
}) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm<AssetFormData>({
    defaultValues
  });

  const handleFormSubmit = async (data: AssetFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Asset Name"
            required
            {...register('name', {
              required: 'Asset name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            error={errors.name?.message}
            placeholder="Enter asset name"
          />
        </div>

        <div>
          <Input
            label="Category"
            required
            {...register('category', {
              required: 'Category is required',
              minLength: { value: 2, message: 'Category must be at least 2 characters' }
            })}
            error={errors.category?.message}
            placeholder="Enter category"
          />
        </div>

        <div>
          <Input
            label="Serial Number"
            {...register('serialNumber')}
            placeholder="Enter serial number"
          />
        </div>

        <div>
          <Input
            label="Purchase Date"
            type="date"
            {...register('purchaseDate')}
          />
        </div>

        <div>
          <Input
            label="Purchase Price"
            type="number"
            {...register('purchasePrice', {
              min: { value: 0, message: 'Must be positive' },
              valueAsNumber: true
            })}
            error={errors.purchasePrice?.message}
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Description"
            {...register('description')}
            placeholder="Enter description"
            as="textarea"
            rows={3}
          />
        </div>

        {/* Custom fields for specific asset types */}
        {children}
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
          {defaultValues ? 'Update Asset' : 'Create Asset'}
        </Button>
      </div>
    </form>
  );
};

export default BaseAssetForm;