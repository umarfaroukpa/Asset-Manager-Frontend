import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssets, getUsers, assignAsset, debugEndpoints, getUserProfile } from '../../services/api';
import { Asset } from '../../types/Assets';

interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
  role?: string;
}

const AssignAsset: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] =useState<User | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
    setFetchingData(true);
    await fetchCurrentUser(); 
    await Promise.all([fetchAvailableAssets(), fetchUsers()]);
    setFetchingData(false);
    };
    
    loadData();
  }, []); 

  const fetchCurrentUser = async () => {
    try {
      const response = await getUserProfile(); 
      if (response.success) {
        setCurrentUser(response.user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchAvailableAssets = async () => {
    try {
      const response = await getAssets({ status: 'available' });
      console.log('Assets data:', response);
      if (response.success) {
        setAssets(response.assets || []);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError('Failed to load available assets');
    }
  };

  const fetchUsers = async () => {
  try {
    // This to ensure currentUser is loaded
    if (!currentUser) {
      await fetchCurrentUser();
    }

    // Check if user has permission
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'manager') {
      setError('Your account (role: ' + (currentUser?.role || 'none') + ') doesn\'t have permission to view users. Please contact an administrator.');
      setUsers([]); // Clear any previous users
      return;
    }

    const response = await getUsers();
    if (response.success) {
      setUsers(response.users || []);
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    setError('Failed to load users. Please try again or contact support.');
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
      const response = await assignAsset(selectedAsset, selectedUser, notes);
      
      if (response.success) {
        // Success - redirect to assets page or show success message
        alert('Asset assigned successfully!');
        navigate('/assets');
      } else {
        throw new Error(response.message || 'Failed to assign asset');
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
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={debugEndpoints}
                className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Debug API
              </button>
              <button
                onClick={() => navigate('/assets')}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {fetchingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading data...</span>
            </div>
          ) : (
            <form onSubmit={handleAssign} className="space-y-6">
              {/* Assets and Users Count Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">
                    📦 {assets.length} available asset{assets.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-blue-700">
                    👥 {users.length} user{users.length !== 1 ? 's' : ''} found
                  </span>
                </div>
              </div>

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
                  disabled={assets.length === 0}
                >
                  <option value="">
                    {assets.length === 0 ? 'No available assets found' : 'Choose an asset...'}
                  </option>
                  {assets.map((asset) => (
                    <option key={asset.id || asset._id} value={asset.id || asset._id}>
                      {asset.serialNumber} - {asset.name} ({asset.category || 'No category'})
                    </option>
                  ))}
                </select>
                {assets.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    No assets available for assignment. Please add assets first.
                  </p>
                )}
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
                  disabled={users.length === 0}
                >
                  <option value="">
                    {users.length === 0 ? 'No users found' : 'Choose a user...'}
                  </option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.email} {user.department && `(${user.department})`}
                    </option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    No users available. Please add users first.
                  </p>
                )}
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
                disabled={loading || assets.length === 0 || users.length === 0}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Assigning...' : 'Assign Asset'}
              </button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignAsset;
