import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AssetForm from '../components/assets/AssetForm';
import { Asset, AssetFormData } from '../types/assets';
import { SelectOption } from '../types/Common';

const EditAsset: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [locations, setLocations] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (id) {
      fetchAsset();
      fetchFormData();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      const response = await fetch(`/api/assets/${id}`);
      if (!response.ok) {
        throw new Error('Asset not found');
      }
      const data = await response.json();
      setAsset(data);
    } catch (error) {
      console.error('Error fetching asset:', error);
      alert('Asset not found');
      navigate('/');
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchFormData = async () => {
    try {
      // Fetch categories and locations - replace with your actual API calls
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
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update asset');
      }

      const result = await response.json();
      
      // Show success message (you can use a toast library here)
      alert('Asset updated successfully!');
      
      // Navigate to the asset details page
      navigate(`/assets/${result.data._id}`);
    } catch (error) {
      console.error('Error updating asset:', error);
      alert('Failed to update asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/assets/${id}`);
    } else {
      navigate('/');
    }
  };

  const handleDelete = async () => {
    if (!id || !asset) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${asset.name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete asset');
      }

      alert('Asset deleted successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error deleting asset:', error);
      alert('Failed to delete asset. Please try again.');
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Asset Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(`/assets/${id}`)}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← Back to Asset Details
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Asset</h1>
              <p className="mt-2 text-gray-600">Update asset information</p>
            </div>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
            >
              Delete Asset
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <AssetForm
            asset={asset}
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

export default EditAsset;