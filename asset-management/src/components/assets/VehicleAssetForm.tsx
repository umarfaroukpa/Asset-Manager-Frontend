import React, { useState } from 'react';
import {  Car, Calendar, DollarSign, Tag, User, Info, MapPin, Gauge, Shield, FileText, Fuel, Settings } from 'lucide-react';
import { AssetFormData } from '../../types/Assets';
import Input from '../common/Input';
import Button from '../common/Button';

interface VehicleAssetFormProp {
    onSubmit: (data: AssetFormData) => void;
    onCancel: () => void;
}

interface VehicleFormData {
    name: string;
    description: string;
    make: string;
    model: string;
    year: string;
    vin: string;
    licensePlate: string;
    purchaseDate: string;
    purchasePrice: string;
    category: string;
    assignedTo: string;
    notes: string;
    location: string;
    currentMileage: string;
    fuelType: string;
    color: string;
    registrationExpiry: string;
    insuranceExpiry: string;
    lastServiceDate: string;
    nextServiceDue: string;
    condition: string;
}

interface VehicleFormErrors {
    name?: string;
    make?: string;
    model?: string;
    year?: string;
    purchasePrice?: string;
    currentMileage?: string;
    vin?: string;
    registrationExpiry?: string;
    nextServiceDue?: string;
}

const VehicleAssetForm: React.FC<VehicleAssetFormProp> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<VehicleFormData>({
    name: '',
    description: '',
    make: '',
    model: '',
    year: '',
    vin: '',
    licensePlate: '',
    purchaseDate: '',
    purchasePrice: '',
    category: 'Vehicle',
    assignedTo: '',
    notes: '',
    location: '',
    currentMileage: '',
    fuelType: '',
    color: '',
    registrationExpiry: '',
    insuranceExpiry: '',
    lastServiceDate: '',
    nextServiceDue: '',
    condition: 'good'
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<VehicleFormErrors>({});

  const fuelTypes = [
    'Gasoline',
    'Diesel',
    'Electric',
    'Hybrid',
    'CNG',
    'LPG',
    'Other'
  ];

  const conditions = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
    { value: 'needs_repair', label: 'Needs Repair' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = (): VehicleFormErrors => {
    const newErrors: VehicleFormErrors = {};
    const currentYear = new Date().getFullYear();
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Vehicle name is required (min 2 chars)';
    }
    if (!formData.make || formData.make.length < 2) {
      newErrors.make = 'Make is required';
    }
    if (!formData.model || formData.model.length < 2) {
      newErrors.model = 'Model is required';
    }
    if (formData.year && (Number(formData.year) < 1900 || Number(formData.year) > currentYear + 1)) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }
    if (formData.purchasePrice && Number(formData.purchasePrice) < 0) {
      newErrors.purchasePrice = 'Must be positive';
    }
    if (formData.currentMileage && Number(formData.currentMileage) < 0) {
      newErrors.currentMileage = 'Mileage must be positive';
    }
    if (formData.vin && formData.vin.length !== 17) {
      newErrors.vin = 'VIN must be exactly 17 characters';
    }
    
    // Date validations
    if (formData.registrationExpiry && formData.purchaseDate) {
      const purchase = new Date(formData.purchaseDate);
      const registration = new Date(formData.registrationExpiry);
      if (registration <= purchase) {
        newErrors.registrationExpiry = 'Registration expiry must be after purchase date';
      }
    }
    
    if (formData.lastServiceDate && formData.nextServiceDue) {
      const lastService = new Date(formData.lastServiceDate);
      const nextService = new Date(formData.nextServiceDue);
      if (nextService <= lastService) {
        newErrors.nextServiceDue = 'Next service must be after last service';
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
      const vehicleAssetData = {
        ...formData,
        type: 'vehicle' as const,
        year: formData.year ? Number(formData.year) : undefined,
        currentMileage: formData.currentMileage ? Number(formData.currentMileage) : undefined,
        purchasePrice: formData.purchasePrice ? Number(formData.purchasePrice) : undefined,
        vin: formData.vin?.toUpperCase()
      } as AssetFormData;
      
      await onSubmit(vehicleAssetData);
    } catch (error) {
      console.error('Error submitting vehicle asset form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Vehicle Information */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Vehicle Name/Identifier"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            icon={<Car className="w-5 h-5 text-gray-400" />}
            error={errors.name}
            placeholder="e.g., Company Car #1, CEO Vehicle"
          />
          
          <Input
            label="Make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            required
            icon={<Tag className="w-5 h-5 text-gray-400" />}
            error={errors.make}
            placeholder="e.g., Toyota, Ford, BMW"
          />

          <Input
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            required
            icon={<Tag className="w-5 h-5 text-gray-400" />}
            error={errors.model}
            placeholder="e.g., Camry, F-150, X5"
          />

          <Input
            label="Year"
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            icon={<Calendar className="w-5 h-5 text-gray-400" />}
            error={errors.year}
            placeholder="2024"
          />

          <Input
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            icon={<Tag className="w-5 h-5 text-gray-400" />}
            placeholder="e.g., White, Black, Silver"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
            <div className="relative">
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select fuel type</option>
                {fuelTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Fuel className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Identification & Legal */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-md font-medium text-gray-900 mb-4">Identification & Legal</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">VIN</label>
            <div className="relative">
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                maxLength={17}
                className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                placeholder="17-character VIN"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {errors.vin && <p className="mt-1 text-xs text-red-600">{errors.vin}</p>}
          </div>

          <Input
            label="License Plate"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            icon={<FileText className="w-5 h-5 text-gray-400" />}
            placeholder="ABC-1234"
          />

          <Input
            label="Registration Expiry"
            type="date"
            name="registrationExpiry"
            value={formData.registrationExpiry}
            onChange={handleChange}
            icon={<Calendar className="w-5 h-5 text-gray-400" />}
            error={errors.registrationExpiry}
          />

          <Input
            label="Insurance Expiry"
            type="date"
            name="insuranceExpiry"
            value={formData.insuranceExpiry}
            onChange={handleChange}
            icon={<Shield className="w-5 h-5 text-gray-400" />}
          />
        </div>
      </div>

      {/* Financial & Assignment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          step="0.01"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={handleChange}
          icon={<DollarSign className="w-5 h-5 text-gray-400" />}
          error={errors.purchasePrice}
          placeholder="0.00"
        />

        <Input
          label="Current Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          icon={<MapPin className="w-5 h-5 text-gray-400" />}
          placeholder="Parking location, garage, etc."
        />

        <Input
          label="Assigned To"
          name="assignedTo"
          value={formData.assignedTo}
          onChange={handleChange}
          icon={<User className="w-5 h-5 text-gray-400" />}
          placeholder="Driver or department"
        />

        <Input
          label="Current Mileage"
          type="number"
          name="currentMileage"
          value={formData.currentMileage}
          onChange={handleChange}
          icon={<Gauge className="w-5 h-5 text-gray-400" />}
          error={errors.currentMileage}
          placeholder="Odometer reading"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <div className="relative">
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Settings className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance */}
      <div className="bg-gray-50 p-4 rounded-md">
        <h4 className="text-md font-medium text-gray-900 mb-4">Maintenance</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Last Service Date"
            type="date"
            name="lastServiceDate"
            value={formData.lastServiceDate}
            onChange={handleChange}
            icon={<Settings className="w-5 h-5 text-gray-400" />}
          />

          <Input
            label="Next Service Due"
            type="date"
            name="nextServiceDue"
            value={formData.nextServiceDue}
            onChange={handleChange}
            icon={<Calendar className="w-5 h-5 text-gray-400" />}
            error={errors.nextServiceDue}
          />
        </div>
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
            placeholder="Vehicle features, special equipment, etc."
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
          placeholder="Maintenance history, issues, special instructions"
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
          Save Vehicle
        </Button>
      </div>
    </form>
  );
};

export default VehicleAssetForm;