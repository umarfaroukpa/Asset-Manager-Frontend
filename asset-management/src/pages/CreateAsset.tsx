import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AssetForm from '../components/AssetForm';
import { AssetFormData } from '../types/Assets';
import { SelectOption } from '../types/Common';

const CreateAsset: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      // Fetch categories and locations we can refacture with your actual API calls
      const [categoriesResponse, locationsResponse] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/locations')
      ]);

      const categoriesData = await categoriesResponse.json();
      const locationsData = await locationsResponse.json();

      setCategories(categoriesData.map((cat: any) => ({
        value: cat.id || cat._id,
        label: cat.name
      })));

      setLocations(locationsData.map((loc: any) => ({
        value: loc.id || loc._id,
        label: loc.name
      })));
    } catch (error) {
      console.error('Error fetching form data:', error);
      // Set default options if API fails
      setCategories([
        { value: 'electronics', label: 'Electronics' },
        { value: 'furniture', label: 'Furniture' },
        { value: 'vehicles', label: 'Vehicles' },
        { value: 'machinery', label: 'Machinery' },
        { value: 'office-supplies', label: 'Office Supplies' }
      ]);

      setLocations([
        { value: 'headquarters', label: 'Headquarters' },
        { value: 'branch-office', label: 'Branch Office' },
        { value: 'warehouse', label: 'Warehouse' },
        { value: 'remote', label: 'Remote Location' }
      ]);
    }
  };

  const handleSubmit = async (formData: AssetFormData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create asset');
      }

      const result = await response.json();
      
      // Show success message reminding myself that will toast library next
      alert('Asset created successfully!');
      
      // Navigate to the asset details page or back to dashboard
      navigate(`/assets/${result.data._id}`);
    } catch (error) {
      console.error('Error creating asset:', error);
      alert('Failed to create asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Asset</h1>
          <p className="mt-2 text-gray-600">Add a new asset to your inventory</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <AssetForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            categories={categories}
            locations={locations}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateAsset;