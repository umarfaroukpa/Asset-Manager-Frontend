import React, { useState } from 'react';
import { QrCode, MapPin, Calendar, DollarSign, Tag, HardDrive, Camera, User, Info } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { AssetFormData } from '../../types/Assets';

interface PhysicalAssetFormProps {
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}

interface PhysicalFormData {
  name: string;
  description: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: string;
  location: string;
  category: string;
  assignedTo: string;
  notes: string;
  qrCode: null;
}

interface PhysicalFormError {
  name?: string;
  category?: string;
  purchasePrice?: string;
}

const PhysicalAssetForm: React.FC<PhysicalAssetFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<PhysicalFormData>({
    name: '',
    description: '',
    serialNumber: '',
    purchaseDate: '',
    purchasePrice: '',
    location: '',
    category: '',
    assignedTo: '',
    notes: '',
    qrCode: null
  });
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<PhysicalFormError>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): PhysicalFormError => {
    const newErrors: PhysicalFormError = {};
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name is required (min 2 chars)';
    }
    if (!formData.category || formData.category.length < 2) {
      newErrors.category = 'Category is required (min 2 chars)';
    }
    if (formData.purchasePrice && Number(formData.purchasePrice) < 0) {
      newErrors.purchasePrice = 'Must be positive';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    
    setLoading(true);
    try {
      // Convert string purchasePrice to number for AssetFormData
      const submitData: AssetFormData = {
        ...formData,
        purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : 0
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = (data: string) => {
    if (data) {
      setFormData(prev => ({ ...prev, serialNumber: data }));
      setShowQRScanner(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Asset Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          icon={<Tag className="w-5 h-5 text-gray-400" />}
          error={errors.name}
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
          <div className="relative">
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter or scan serial number"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <HardDrive className="h-5 w-5 text-gray-400" />
            </div>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowQRScanner(true)}
                className="p-1 text-gray-400 hover:text-indigo-600"
              >
                <QrCode className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          icon={<MapPin className="w-5 h-5 text-gray-400" />}
        />

        <Input
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          icon={<Tag className="w-5 h-5 text-gray-400" />}
          error={errors.category}
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
          label="Purchase Price"
          type="number"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={handleChange}
          icon={<DollarSign className="w-5 h-5 text-gray-400" />}
          error={errors.purchasePrice}
        />

        <Input
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          icon={<User className="w-5 h-5 text-gray-400" />}
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
            placeholder="Additional details about the asset"
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
          placeholder="Any special notes about this asset"
        />
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
          Save Asset
        </Button>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Scan QR Code</h3>
              <button
                onClick={() => setShowQRScanner(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-gray-200 h-64 rounded-md flex items-center justify-center">
              {/* Placeholder for QR Scanner */}
              <div className="text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">QR Scanner would appear here</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500">
                Point your camera at the QR code to scan it automatically
              </p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default PhysicalAssetForm;