import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentToken } from '../config/firebase.config';

interface Asset {
  _id: string;
  name: string;
  assetTag: string;
  status: string;
  category: {
    name: string;
  };
}

interface User {
  _id: string;
  name: string;
  email: string;
  department: string;
}

const AssignAsset: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAvailableAssets();
    fetchUsers();
  }, []);

  const fetchAvailableAssets = async () => {
    try {
      const token = await getCurrentToken();
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/assets?status=available`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch assets');

      const data = await response.json();
      if (data.success) {
        setAssets(data.data.assets);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError('Failed to load available assets');
    }
  };

  const fetchUsers = async () => {
    try {
      const token = await getCurrentToken();
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAsset || !selectedUser) {
      setError('Please select both an asset and a user');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getCurrentToken();
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/assets/${selectedAsset}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: selectedUser,
          notes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign asset');
      }

      const data = await response.json();
      if (data.success) {
        // Success - redirect to assets page or show success message
        alert('Asset assigned successfully!');
        navigate('/assets');
      }
    } catch (error) {
      console.error('Error assigning asset:', error);
      setError(error instanceof Error ? error.message : 'Failed to assign asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Assign Asset</h1>
            <button
              onClick={() => navigate('/assets')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleAssign} className="space-y-6">
            <div>
              <label htmlFor="asset" className="block text-sm font-medium text-gray-700 mb-2">
                Select Asset
              </label>
              <select
                id="asset"
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Choose an asset...</option>
                {assets.map((asset) => (
                  <option key={asset._id} value={asset._id}>
                    {asset.assetTag} - {asset.name} ({asset.category.name})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-2">
                Assign To
              </label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Choose a user...</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email} ({user.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Add any notes about this assignment..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/assets')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Assigning...' : 'Assign Asset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignAsset;
