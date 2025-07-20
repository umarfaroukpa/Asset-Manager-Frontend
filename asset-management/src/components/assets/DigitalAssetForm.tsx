import React, { useState } from 'react';
import { Monitor, Key, Calendar, DollarSign, Tag, User, Info, Globe, Shield, Download } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { AssetFormData } from '../../types/Assets';

interface DigitalAssetFormProps {
    onSubmit: (data: AssetFormData) => void;
    onCancel: () => void;
}

interface FormData {
    name: string;
    description: string;
    licenseKey: string;
    purchaseDate: string;
    purchasePrice: string;
    category: string;
    assignedTo: string;
    notes: string;
    platform: string;
    subscriptionEnd: string;
    downloadUrl: string;
    vendor: string;
    version: string;
    maxUsers: string;
    renewalRequired: boolean;
}

interface FormErrors {
    name?: string;
    category?: string;
    purchasePrice?: string;
    maxUsers?: string;
    subscriptionEnd?: string;
}

const DigitalAssetForm: React.FC<DigitalAssetFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    licenseKey: '',
    purchaseDate: '',
    purchasePrice: '',
    category: '',
    assignedTo: '',
    notes: '',
    platform: '',
    subscriptionEnd: '',
    downloadUrl: '',
    vendor: '',
    version: '',
    maxUsers: '',
    renewalRequired: false
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name is required (min 2 chars)';
    }
    if (!formData.category || formData.category.length < 2) {
      newErrors.category = 'Category is required (min 2 chars)';
    }
    if (formData.purchasePrice && Number(formData.purchasePrice) < 0) {
      newErrors.purchasePrice = 'Must be positive';
    }
    if (formData.maxUsers && Number(formData.maxUsers) < 1) {
      newErrors.maxUsers = 'Must be at least 1';
    }
    if (formData.subscriptionEnd && formData.purchaseDate) {
      const purchase = new Date(formData.purchaseDate);
      const subscription = new Date(formData.subscriptionEnd);
      if (subscription <= purchase) {
        newErrors.subscriptionEnd = 'Subscription end must be after purchase date';
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    
    setLoading(true);
    try {
      const digitalAssetData = {
        ...formData,
        type: 'digital' as const,
        maxUsers: formData.maxUsers ? Number(formData.maxUsers) : undefined,
        purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : undefined
      } as AssetFormData;
      await onSubmit(digitalAssetData);
    } catch (error) {
      console.error('Error submitting digital asset form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Software/License Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          icon={<Monitor className="w-5 h-5 text-gray-400" />}
          error={errors.name}
          placeholder="e.g., Microsoft Office 365"
        />
        
        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          icon={<Tag className="w-5 h-5 text-gray-400" />}
          error={errors.category}
          placeholder="e.g., Software License, Domain, SaaS"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">License Key</label>
          <div className="relative">
            <input
              type="password"
              name="licenseKey"
              value={formData.licenseKey}
              onChange={handleChange}
              className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter license key or activation code"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">License key will be encrypted for security</p>
        </div>

        <Input
          label="Platform/Vendor"
          name="platform"
          value={formData.platform}
          onChange={handleChange}
          icon={<Globe className="w-5 h-5 text-gray-400" />}
          placeholder="e.g., Microsoft, Adobe, AWS"
        />

        <Input
          label="Purchase Date"
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
        />

        <Input
          label="Subscription End Date"
          type="date"
          name="subscriptionEnd"
          value={formData.subscriptionEnd}
          onChange={handleChange}
          icon={<Calendar className="w-5 h-5 text-gray-400" />}
          error={errors.subscriptionEnd}
        />

        <Input
          label="Purchase Price"
          type="number"
          step="0.01"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={handleChange}
          icon={<DollarSign className="w-5 h-5 text-gray-400" />}
          error={errors.purchasePrice}
          placeholder="0.00"
        />

        <Input
          label="Max Users/Licenses"
          type="number"
          name="maxUsers"
          value={formData.maxUsers}
          onChange={handleChange}
          icon={<User className="w-5 h-5 text-gray-400" />}
          error={errors.maxUsers}
          placeholder="Number of allowed users"
        />

        <Input
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          icon={<User className="w-5 h-5 text-gray-400" />}
          placeholder="User or department"
        />

        <Input
          label="Version"
          name="version"
          value={formData.version}
          onChange={handleChange}
          icon={<Shield className="w-5 h-5 text-gray-400" />}
          placeholder="e.g., 2024, v1.5.2"
        />

        <Input
          label="Vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          icon={<Globe className="w-5 h-5 text-gray-400" />}
          placeholder="Software vendor/publisher"
        />

        <Input
          label="Download URL"
          name="downloadUrl"
          value={formData.downloadUrl}
          onChange={handleChange}
          icon={<Download className="w-5 h-5 text-gray-400" />}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <div className="relative">
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Software features, usage details, etc."
          />
          <div className="absolute top-3 left-3">
            <Info className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          className="block w-full py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Installation notes, support contacts, renewal reminders"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex items-center">
          <input
            id="renewalRequired"
            name="renewalRequired"
            type="checkbox"
            checked={formData.renewalRequired}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="renewalRequired" className="ml-2 block text-sm text-gray-900">
            Renewal required
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Check if this license requires periodic renewal
        </p>
      </div>

      <div className="flex justify-end space-x-3">
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
          Save Digital Asset
        </Button>
      </div>
    </form>
  );
};

export default DigitalAssetForm;