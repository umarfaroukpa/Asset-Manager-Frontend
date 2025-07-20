import React, { useState, useEffect } from 'react';
import { User, Package, AlertCircle, Loader } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import Modal from '../common/Modal';
import Select from '../common/Select';

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

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const api = useApi();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState({
    assets: false,
    users: false,
    assigning: false
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableAssets();
      fetchUsers();
    }
  }, [isOpen]);

  const fetchAvailableAssets = async () => {
    setLoading(prev => ({ ...prev, assets: true }));
    setError(null);
    try {
      const response = await api.get('/assets', { params: { status: 'available' } });
      if (response.data?.success) {
        setAssets(response.data.data.assets || []);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError('Failed to load available assets');
    } finally {
      setLoading(prev => ({ ...prev, assets: false }));
    }
  };

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    setError(null);
    try {
      const response = await api.get('/users');
      if (response.data?.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset || !selectedUser) {
      setError('Please select both an asset and a user');
      return;
    }

    setLoading(prev => ({ ...prev, assigning: true }));
    setError(null);

    try {
      const response = await api.post(`/assets/${selectedAsset}/assign`, {
        userId: selectedUser,
        notes
      });

      if (response.data?.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error assigning asset:', error);
      setError(error.response?.data?.message || 'Failed to assign asset');
    } finally {
      setLoading(prev => ({ ...prev, assigning: false }));
    }
  };

  const resetForm = () => {
    setSelectedAsset('');
    setSelectedUser('');
    setNotes('');
    setError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="Assign Asset"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleAssign} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Asset
          </label>
          <Select
            value={selectedAsset}
            onChange={setSelectedAsset}
            options={assets.map(asset => ({
              value: asset._id,
              label: `${asset.assetTag} - ${asset.name} (${asset.category.name})`
            }))}
            placeholder="Choose an asset..."
            isLoading={loading.assets}
            icon={<Package className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign To
          </label>
          <Select
            value={selectedUser}
            onChange={setSelectedUser}
            options={users.map(user => ({
              value: user._id,
              label: `${user.name} - ${user.email} (${user.department})`
            }))}
            placeholder="Choose a user..."
            isLoading={loading.users}
            icon={<User className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any notes about this assignment..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            disabled={loading.assigning}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading.assigning || !selectedAsset || !selectedUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading.assigning ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign Asset'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignmentModal;